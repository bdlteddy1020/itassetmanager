// routes/procurementRoutes.js
const express = require('express');
const {
  createProcurement,
  getProcurements,
  getProcurementById,
  deleteProcurement,
  approveProcurement,
  chargeToOrder,
  markDelivered
} = require('../controllers/procurementController');

const router = express.Router();

// CRUD
router.post('/', createProcurement);
router.get('/', getProcurements);
router.get('/:id', getProcurementById);
router.delete('/:id', deleteProcurement);

// Status updates
router.put('/:id/approve', approveProcurement);
router.post('/:id/order', chargeToOrder);       
router.put('/:id/deliver', markDelivered);    

module.exports = router;
