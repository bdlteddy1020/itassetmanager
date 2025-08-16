const SupportTicket = require('../models/SupportTicket');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const t = new SupportTicket(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tickets
const getTickets = async (req, res) => {
  try {
    const list = await SupportTicket.find()
      .sort({ createdAt: -1 })
      .populate('hardwareId');
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a ticket by ID
const updateTicket = async (req, res) => {
  try {
    const t = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicket
};
