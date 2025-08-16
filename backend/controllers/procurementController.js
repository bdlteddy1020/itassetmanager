const Procurement = require('../models/Procurement');
const Hardware = require('../models/Hardware');

exports.createProcurement = async (req, res) => {
  try {
    const p = new Procurement(req.body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProcurements = async (req, res) => {
  const list = await Procurement.find().sort({ createdAt: -1 });
  res.json(list);
};

exports.approveProcurement = async (req, res) => {
  try {
    const p = await Procurement.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy: req.body.approvedBy,
        approvedAt: req.body.approvedAt || new Date()
      },
      { new: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.chargeToOrder = async (req, res) => {
  try {
    const p = await Procurement.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Ordered',
        orderedBy: req.body.orderedBy,
        orderedAt: req.body.orderedAt || new Date()
      },
      { new: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const p = await Procurement.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Delivered',
        deliveredBy: req.body.deliveredBy,
        deliveredAt: req.body.deliveredAt || new Date()
      },
      { new: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found' });

    // If hardware creation is requested
    if (req.body.createHardware && Array.isArray(req.body.hardwareItems)) {
      const created = [];
      for (const h of req.body.hardwareItems) {
        const hw = new Hardware({ ...h, procurementId: p._id });
        await hw.save();
        created.push(hw);
      }
      p.linkedHardwareId = created[0]?._id || p.linkedHardwareId;
      await p.save();
      return res.json({ procurement: p, createdHardware: created });
    }

    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProcurement = async (req, res) => {
  try {
    const deleted = await Procurement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Procurement not found' });
    }
    res.json({ status: 'ok', message: 'Procurement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProcurementById = async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id);
    if (!procurement) return res.status(404).json({ error: 'Not found' });
    res.json(procurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
