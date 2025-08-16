import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' }
});

export default mongoose.model('Bug', bugSchema);
