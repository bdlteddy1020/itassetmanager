const mongoose = require('mongoose');

const hardwareSchema = new mongoose.Schema({
  procurementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Procurement' },
  assetTag: { type: String, unique: true, required: true },
  model: String,
  serial: String,
  purchaseDate: Date,
  warrantyExpiry: Date,
  status: { type: String, enum: ['InStock','Assigned','Decommissioned'], default: 'InStock' },
  assignedTo: String, // user name or id
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
