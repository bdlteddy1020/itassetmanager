const express = require('express');
const { listBugs, createBug, updateBug, deleteBug } = require('../controllers/bugController');

const router = express.Router();

router.get('/', listBugs);
router.post('/', createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

module.exports = router;
