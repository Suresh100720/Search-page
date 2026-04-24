import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String },
  experience: { type: Number },
  skills: [{ type: String }],
  location: { type: String },
  status: { type: String, default: 'Applied' },
  appliedDate: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
