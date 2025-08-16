import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  reportedBy: { type: String, required: true },
  status: { type: String, enum: ['open', 'in progress', 'resolved'], default: 'open' },
  dateReported: { type: Date, default: Date.now }
});

export default mongoose.model('Support', supportSchema);
