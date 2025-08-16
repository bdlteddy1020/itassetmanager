const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const t = new Task(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getTasks = async (req, res) => {
  const list = await Task.find().sort({createdAt:-1}).populate('relatedHardwareId');
  res.json(list);
};

exports.updateTask = async (req, res) => {
  try {
    const t = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
};
