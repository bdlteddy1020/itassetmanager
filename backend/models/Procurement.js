// models/Procurement.js
const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  department: String,
  requester: String,
  justification: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Ordered', 'Delivered'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  approvedBy: String,
  orderedAt: Date,
  deliveredAt: Date,
  linkedHardwareId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hardware' }
});

const Procurement = mongoose.model('Procurement', procurementSchema);

module.exports = Procurement; // CommonJS export
