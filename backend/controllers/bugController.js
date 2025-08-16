const Bug = require('../models/Bug');

const listBugs = async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBug = async (req, res) => {
  try {
    const bug = new Bug(req.body);
    const saved = await bug.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBug = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Bug.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBug = async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listBugs,
  createBug,
  updateBug,
  deleteBug
};
