import express from 'express';
import { listBugs, createBug, updateBug, deleteBug } from '../controllers/bugController.js';

const router = express.Router();

router.get('/', listBugs);
router.post('/', createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

export default router;
