const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  reportedBy: { type: String, required: true },
  status: { type: String, enum: ['open', 'in progress', 'resolved'], default: 'open' },
  dateReported: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Support', supportSchema);
