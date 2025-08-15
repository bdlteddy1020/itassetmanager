import mongoose from 'mongoose';

const procurementSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  department: { type: String, required: true },
  requestedBy: { type: String, required: true },
  justification: { type: String, required: true },
  approved: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Ordered', 'Delivered'], default: 'Pending' },
  
});

export default mongoose.model('Procurement', procurementSchema);
