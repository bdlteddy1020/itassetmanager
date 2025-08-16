const SupportTicket = require('../models/SupportTicket');

exports.createTicket = async (req, res) => {
  try {
    const t = new SupportTicket(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getTickets = async (req, res) => {
  const list = await SupportTicket.find().sort({createdAt:-1}).populate('hardwareId');
  res.json(list);
};

exports.updateTicket = async (req, res) => {
  try {
    const t = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
