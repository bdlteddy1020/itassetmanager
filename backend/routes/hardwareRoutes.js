// routes/hardwareRoutes.js
const express = require('express');
const {
  listHardware,
  createHardware,
  assignHardware,
  decommissionHardware,
  deleteHardware,
  updateHardware,
  getHardwareById
} = require('../controllers/hardwareController');

const router = express.Router();

// CRUD routes
router.get('/', listHardware);
router.post('/', createHardware);
router.get('/:id', getHardwareById);
router.put('/:id', updateHardware);
router.delete('/:id', deleteHardware);

// Status-specific routes
router.put('/:id/assign', assignHardware);
router.put('/:id/decommission', decommissionHardware);

module.exports = router;
