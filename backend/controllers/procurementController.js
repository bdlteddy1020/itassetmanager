import Procurement from '../models/Procurement.js';

export const listProcurements = async (req, res) => {
  try {
<<<<<<< HEAD
    const procurements = await Procurement.find();
    res.json(procurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProcurement = async (req, res) => {
  try {
    console.log('📦 Creating procurement with:', req.body);
    const procurement = new Procurement(req.body);
    const saved = await procurement.save();
    console.log('✅ Saved procurement:', saved);

    res.status(201).json({
      message: 'Procurement created successfully',
      procurement: saved
    });
  } catch (error) {
    console.error('❌ Error saving procurement:', error);
    res.status(500).json({ message: error.message });
  }
=======
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
>>>>>>> temp-save
};



export const approveProcurement = async (req, res) => {
  try {
<<<<<<< HEAD
    const { id } = req.params;
    const updated = await Procurement.findByIdAndUpdate(id, {  approved: true,  status: 'Ordered'}, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
=======
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
>>>>>>> temp-save
  }
};

export const deliverProcurement = async (req, res) => {
  try {
<<<<<<< HEAD
    const { id } = req.params;
    const updated = await Procurement.findByIdAndUpdate(id, { delivered: true, status: 'Delivered' }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProcurementById = async (req, res) => {
  try {
    const { id } = req.params;
    const procurement = await Procurement.findById(id);
    if (!procurement) {
      return res.status(404).json({ message: 'Procurement not found' });
    }
    res.json(procurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProcurement = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🧹 Attempting to delete procurement:', id); 

    const deleted = await Procurement.findByIdAndDelete(id);
    if (!deleted) {
      console.warn('⚠️ Procurement not found:', id);
      return res.status(404).json({ message: 'Procurement not found' });
    }

    console.log('✅ Procurement deleted:', deleted);
    res.json({ message: 'Procurement deleted' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ message: error.message });
=======
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
>>>>>>> temp-save
  }
};


