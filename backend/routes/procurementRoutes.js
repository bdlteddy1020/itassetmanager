const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/procurementController');

router.post('/', ctrl.createProcurement);
router.get('/', ctrl.getProcurements);
router.put('/:id/approve', ctrl.approveProcurement);
router.put('/:id/deliver', ctrl.markDelivered);

module.exports = router;
