const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/hardwareController');

router.post('/', ctrl.createHardware);
router.get('/', ctrl.getHardware);
router.put('/:id/assign', ctrl.assignHardware);
router.put('/:id/decommission', ctrl.decommissionHardware);

module.exports = router;
