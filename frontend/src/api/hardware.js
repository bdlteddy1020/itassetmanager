const express = require('express');
const router = express.Router();
const Hardware = require('../models/Hardware');
const Procurement = require('../models/Procurement');

router.post('/', async (req, res) => {
  const {
    assetTag,
    name,
    model,
    serial,
    purchaseDate,
    warrantyExpiry,
    registeredBy,
    procurementId,
    assignedTo,
    status = 'available',
    location
  } = req.body;

  try {
    // Create hardware record
    const hardware = new Hardware({
      assetTag,
      name,
      model,
      serial,
      assignedTo: assignedTo || null,
      status: 'available',
      location: location || null,
      purchaseDate,
      warrantyExpiry,
      registeredBy,
      procurementId
    });

    await hardware.save();

    // Update procurement status
    if (procurementId) {
      await Procurement.findByIdAndUpdate(procurementId, { status: 'Registered' });
    }

    res.status(201).json({ message: 'Hardware registered successfully', hardware });
  } catch (err) {
    console.error('Hardware registration error:', err);
    res.status(500).json({ error: 'Failed to register hardware' });
  }
});

module.exports = router;
