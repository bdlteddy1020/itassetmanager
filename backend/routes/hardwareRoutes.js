import express from 'express';
import { listHardware, createHardware, assignHardware, decommissionHardware, deleteHardware, updateHardware, getHardwareById } from '../controllers/hardwareController.js';

const router = express.Router();

router.get('/', listHardware);
router.post('/', createHardware);
router.put('/:id/assign', assignHardware);
router.put('/:id/decommission', decommissionHardware);
router.delete('/:id', deleteHardware);
router.put('/:id', updateHardware);
router.get('/:id', getHardwareById);


export default router;
