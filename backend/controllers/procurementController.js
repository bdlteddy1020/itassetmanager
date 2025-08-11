const Procurement = require('../models/Procurement');
const Hardware = require('../models/Hardware');

exports.createProcurement = async (req, res) => {
  try {
    const p = new Procurement(req.body);
    await p.save();
    res.status(201).json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getProcurements = async (req, res) => {
  const list = await Procurement.find().sort({createdAt:-1});
  res.json(list);
};

exports.approveProcurement = async (req, res) => {
  try {
    const p = await Procurement.findByIdAndUpdate(req.params.id, { status: 'Approved', approvedBy: req.body.approvedBy, orderedAt: req.body.orderedAt }, { new: true });
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.markDelivered = async (req, res) => {
  try {
    const p = await Procurement.findByIdAndUpdate(req.params.id, { status: 'Delivered', deliveredAt: new Date() }, { new: true });

    // Optionally create hardware record(s) based on procurement
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
  } catch (err) { res.status(400).json({ error: err.message }); }
};
