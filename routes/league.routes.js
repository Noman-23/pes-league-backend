const express = require('express');
const { createLeague, getAllLeagues } = require('../controllers/league.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create', authenticate, createLeague);
router.get('/', getAllLeagues);

module.exports = router;
