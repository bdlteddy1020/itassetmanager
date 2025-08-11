const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supportController');

router.post('/', ctrl.createTicket);
router.get('/', ctrl.getTickets);
router.put('/:id', ctrl.updateTicket);

module.exports = router;
