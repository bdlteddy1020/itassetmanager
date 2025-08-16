const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/procurementController');

// CRUD
router.post('/', ctrl.createProcurement);
router.get('/', ctrl.getProcurements);
router.get('/:id', ctrl.getProcurementById);
router.delete('/:id', ctrl.deleteProcurement);

// Status updates
router.put('/:id/approve', ctrl.approveProcurement);
router.post('/:id/order', ctrl.chargeToOrder);       
router.put('/:id/deliver', ctrl.markDelivered);    

module.exports = router;
