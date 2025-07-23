const express = require('express');
const {
  getAllMatchesByLeague,
  updateMatchResult,
  getPointsTable,
} = require('../controllers/match.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// 1. Get all matches of a league
router.get('/league/:leagueId', getAllMatchesByLeague);

// 2. Post match result (admin only)
router.post('/:matchId/result', authenticate, updateMatchResult);

// 3. Get points table for a league
router.get('/league/:leagueId/points', getPointsTable);

module.exports = router;
