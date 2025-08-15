import Procurement from '../models/Procurement.js';

export const listProcurements = async (req, res) => {
  try {
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
};



export const approveProcurement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Procurement.findByIdAndUpdate(id, {  approved: true,  status: 'Ordered'}, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deliverProcurement = async (req, res) => {
  try {
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
  }
};


