const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  severity: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  status: { type: String, enum: ['Open','In Progress','Resolved','Closed'], default: 'Open' },
  relatedHardwareId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hardware' }, // optional
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  comments: [{ author: String, comment: String, createdAt: Date }]
});

module.exports = mongoose.model('Task', taskSchema);
