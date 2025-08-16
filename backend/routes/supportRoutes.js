const express = require('express');
const { createTicket, getTickets, updateTicket } = require('../controllers/supportController');

const router = express.Router();

router.post('/', createTicket);
router.get('/', getTickets);
router.put('/:id', updateTicket);

module.exports = router;
