import Hardware from '../models/Hardware.js';
import Procurement from '../models/Procurement.js';
import mongoose from 'mongoose';




export const listHardware = async (req, res) => {
  try {
    const hardware = await Hardware.find();
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHardware = async (req, res) => {
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
    // Create hardware record
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

    // Update procurement status
    if (procurementId) {
      await Procurement.findByIdAndUpdate(procurementId, { status: 'Registered' });
    }

    res.status(201).json({ message: 'Hardware registered successfully', hardware });
  } catch (err) {
  console.error('Create hardware error:', err);

  // Send full error message to frontend
  res.status(500).json({
    error: err.message || 'Unknown server error',
    stack: err.stack,
    name: err.name
  });
}

};

export const assignHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Hardware.findByIdAndUpdate(id, { ...req.body, status: 'assigned' }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const decommissionHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Hardware.findByIdAndUpdate(id, { status: 'decommissioned' }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteHardware = async (req, res) => {
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
    console.error('Delete error:', error); // Add this for debugging
    res.status(500).json({ message: error.message });
  }
};

export const updateHardware = async (req, res) => {
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

export const getHardwareById = async (req, res) => {
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
