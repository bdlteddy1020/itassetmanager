import mongoose from 'mongoose';

const procurementSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
<<<<<<< HEAD
  quantity: { type: Number, required: true },
  department: { type: String, required: true },
  requestedBy: { type: String, required: true },
  justification: { type: String, required: true },
  approved: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Ordered', 'Delivered'], default: 'Pending' },
  
=======
  quantity: { type: Number, default: 1 },
  department: String,
  requester: String,
  justification: String,
  status: { type: String, enum: ['Pending','Approved','Ordered','Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  approvedBy: String,
  orderedAt: Date,
  deliveredAt: Date,
  linkedHardwareId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hardware' }
>>>>>>> temp-save
});

export default mongoose.model('Procurement', procurementSchema);
