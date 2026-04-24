import mongoose from 'mongoose';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import Candidate from './models/Candidate.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ES';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

const esClient = new Client({ node: ELASTICSEARCH_URL });

async function indexData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const candidates = await Candidate.find({});
    console.log(`🔍 Found ${candidates.length} candidates in MongoDB`);

    // Create index if not exists
    const exists = await esClient.indices.exists({ index: 'candidates' });
    if (exists) {
      await esClient.indices.delete({ index: 'candidates' });
      console.log('🗑️ Deleted existing index');
    }

    await esClient.indices.create({
      index: 'candidates',
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            email: { type: 'keyword' },
            role: { type: 'text' },
            skills: { type: 'text' },
            location: { type: 'text' },
            status: { type: 'keyword' },
            experience: { type: 'integer' },
            appliedDate: { type: 'date' }
          }
        }
      }
    });
    console.log('🏗️ Created candidates index');

    const operations = candidates.flatMap(doc => [
      { index: { _index: 'candidates', _id: doc._id.toString() } },
      {
        name: doc.name,
        email: doc.email,
        role: doc.role,
        skills: doc.skills,
        location: doc.location,
        status: doc.status,
        experience: doc.experience,
        appliedDate: doc.appliedDate
      }
    ]);

    if (operations.length > 0) {
      const bulkResponse = await esClient.bulk({ refresh: true, body: operations });
      if (bulkResponse.errors) {
        console.error('❌ Bulk index errors');
      } else {
        console.log(`🚀 Successfully indexed ${candidates.length} candidates into Elasticsearch`);
      }
    } else {
      console.log('⚠️ No candidates to index');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Indexing failed:', err);
    process.exit(1);
  }
}

indexData();
