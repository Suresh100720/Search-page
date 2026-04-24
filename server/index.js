import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';
import Candidate from './models/Candidate.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ES';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

// --- ELASTICSEARCH CLIENT ---
let esClient;
try {
  esClient = new Client({
    node: ELASTICSEARCH_URL,
    maxRetries: 1,
    requestTimeout: 1000,
  });
  console.log('🔍 Elasticsearch client initialized');
} catch (err) {
  console.warn('⚠️ Elasticsearch initialization failed. Search will fallback to MongoDB.');
}

// --- MOCK DATABASE MODE ---
let useMock = false;
let mockCandidates = [];

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2000,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    useMock = false;
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed. Entering MOCK DATABASE MODE (Data will not persist).');
    useMock = true;
  });

// Database Connection Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: useMock ? 'mock_mode' : 'connected',
    database: MONGODB_URI,
    candidates_count: useMock ? mockCandidates.length : 'N/A'
  });
});

// Advanced Search with Elasticsearch
app.post('/api/search', async (req, res) => {
  const { query } = req.body;

  try {
    // If query is empty, return all candidates (fallback to MongoDB for now)
    if (!query) {
      const candidates = await Candidate.find({}).sort({ appliedDate: -1 });
      return res.json({ hits: candidates });
    }

    if (!esClient) throw new Error('ES client not initialized');

    const response = await esClient.search({
      index: 'candidates',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'skills', 'role', 'email'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    res.json({
      hits: response.hits.hits.map(hit => ({
        ...hit._source,
        _id: hit._id // Map ES id to _id for consistency
      }))
    });
  } catch (err) {
    // Fallback to MongoDB regex search if ES fails
    if (query) {
      console.log('🔄 Falling back to MongoDB Search...');
    }
    const filter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } }
      ]
    };
    const candidates = await Candidate.find(filter).sort({ appliedDate: -1 });
    res.json({ hits: candidates });
  }
});

// Search and Filter Candidates (Original GET endpoint)
app.get('/api/candidates', async (req, res) => {
  try {
    const { query, skills, role, location, sort, status } = req.query;

    if (useMock) {
      let filtered = [...mockCandidates];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      }
      if (role) filtered = filtered.filter(c => c.role === role);
      if (location) filtered = filtered.filter(c => c.location === location);
      if (status) filtered = filtered.filter(c => c.status === status);
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        filtered = filtered.filter(c => skillsArray.every(s => c.skills.includes(s)));
      }

      // Sort mock data
      if (sort) {
        switch (sort) {
          case 'a-z': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
          case 'z-a': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
          case 'new': filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)); break;
          case 'old': filtered.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate)); break;
        }
      }

      return res.json(filtered);
    }

    let filter = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } }
      ];
    }
    if (skills) {
      const skillsArray = Array.isArray(skills) ? (skills.length > 0 ? skills : null) : [skills];
      if (skillsArray) filter.skills = { $all: skillsArray };
    }
    if (role) filter.role = role;
    if (location) filter.location = location;
    if (status) filter.status = status;

    let sortOption = { appliedDate: -1 };
    if (sort) {
      switch (sort) {
        case 'new': sortOption = { appliedDate: -1 }; break;
        case 'old': sortOption = { appliedDate: 1 }; break;
        case 'a-z': sortOption = { name: 1 }; break;
        case 'z-a': sortOption = { name: -1 }; break;
        case 'created': sortOption = { _id: 1 }; break;
        case 'updated': sortOption = { updatedAt: -1 }; break;
      }
    }

    const candidates = await Candidate.find(filter).sort(sortOption);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Facet Counts
app.get('/api/candidates/facets', async (req, res) => {
  try {
    if (useMock) {
      const getCounts = (field) => {
        const counts = {};
        mockCandidates.forEach(c => {
          const val = c[field];
          if (Array.isArray(val)) {
            val.forEach(v => counts[v] = (counts[v] || 0) + 1);
          } else if (val) {
            counts[val] = (counts[val] || 0) + 1;
          }
        });
        return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
      };
      return res.json({
        skills: getCounts('skills'),
        roles: getCounts('role'),
        locations: getCounts('location'),
        statuses: getCounts('status')
      });
    }

    const skillsFacet = await Candidate.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const rolesFacet = await Candidate.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const locationsFacet = await Candidate.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusesFacet = await Candidate.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      skills: skillsFacet,
      roles: rolesFacet,
      locations: locationsFacet,
      statuses: statusesFacet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Candidate
app.post('/api/candidates', async (req, res) => {
  try {
    if (useMock) {
      const newCandidate = {
        ...req.body,
        _id: Math.random().toString(36).substr(2, 9),
        appliedDate: new Date().toISOString()
      };
      mockCandidates.push(newCandidate);
      return res.status(201).json(newCandidate);
    }
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Candidate
app.put('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMock) {
      const index = mockCandidates.findIndex(c => c._id === id);
      if (index !== -1) {
        mockCandidates[index] = { ...mockCandidates[index], ...req.body, updatedAt: new Date().toISOString() };
        return res.json(mockCandidates[index]);
      }
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Candidate
app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMock) {
      mockCandidates = mockCandidates.filter(c => c._id !== id);
      return res.json({ message: 'Candidate deleted' });
    }
    await Candidate.findByIdAndDelete(id);
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk Delete Candidates
app.post('/api/candidates/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (useMock) {
      mockCandidates = mockCandidates.filter(c => !ids.includes(c._id));
      return res.json({ message: 'Candidates deleted' });
    }
    await Candidate.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Candidates deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
