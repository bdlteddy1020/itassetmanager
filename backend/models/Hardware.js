const mongoose = require('mongoose');

const hardwareSchema = new mongoose.Schema({
  procurementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Procurement' },
  assetTag: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  model: String,
  serial: String,
  purchaseDate: Date,
  warrantyExpiry: Date,
  status: { type: String, enum: ['Available','Assigned','Decommissioned'], default: 'Available' },
  AssignedStatus: String,
  assignedTo: String,
  registeredBy: { type: String, required: true },
  department: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  assignmentHistory: [
    {
      assignedTo: String,
      department: String,
      location: String,
      assignedAt: Date
    }
  ]
});

module.exports = mongoose.model('Hardware', hardwareSchema);
