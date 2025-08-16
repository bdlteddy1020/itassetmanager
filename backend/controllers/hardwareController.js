// controllers/hardwareController.js
const Hardware = require('../models/Hardware');
const Procurement = require('../models/Procurement');
const mongoose = require('mongoose');

exports.listHardware = async (req, res) => {
  try {
    const hardware = await Hardware.find();
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createHardware = async (req, res) => {
  const {
    assetTag,
    name,
    model,
    serial,
    purchaseDate,
    warrantyExpiry,
    assignedTo,
    department,
    registeredBy,
    procurementId
  } = req.body;

  try {
    const hardware = new Hardware({
      assetTag,
      name,
      model,
      serial,
      purchaseDate,
      warrantyExpiry,
      assignedTo,
      department,
      registeredBy,
      procurementId,
      status: 'Available'
    });

    await hardware.save();

    if (procurementId) {
      await Procurement.findByIdAndUpdate(procurementId, { status: 'Registered' });
    }

    res.status(201).json({ message: 'Hardware registered successfully', hardware });
  } catch (err) {
    console.error('Create hardware error:', err);
    res.status(500).json({
      error: err.message || 'Unknown server error',
      stack: err.stack,
      name: err.name
    });
  }
};

exports.assignHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Hardware.findByIdAndUpdate(id, { ...req.body, status: 'assigned' }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.decommissionHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Hardware.findByIdAndUpdate(id, { status: 'decommissioned' }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHardware = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid hardware ID format' });
  }

  try {
    const deleted = await Hardware.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Hardware not found' });
    }
    res.json({ message: 'Hardware deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateHardware = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid hardware ID format' });
  }

  try {
    const updated = await Hardware.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Hardware not found' });
    }
    res.json({ message: 'Hardware updated successfully', hardware: updated });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getHardwareById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid hardware ID format' });
  }

  try {
    const hardware = await Hardware.findById(id);
    if (!hardware) {
      return res.status(404).json({ message: 'Hardware not found' });
    }
    res.json(hardware);
  } catch (error) {
    console.error('Get hardware by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};
