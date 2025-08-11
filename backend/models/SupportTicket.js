const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  hardwareId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hardware', required: true },
  raisedBy: String,
  issue: String,
  severity: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  status: { type: String, enum: ['Open','In Progress','Resolved','Closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  resolutionNotes: String
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
