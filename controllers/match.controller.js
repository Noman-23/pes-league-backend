const Match = require('../models/match.model');
const Team = require('../models/team.model');
const League = require('../models/league.model');
const mongoose = require('mongoose');

// 1️⃣ Get All Matches for a League
const getAllMatchesByLeague = async (req, res) => {
  try {
    const leagueId = req.params.leagueId;

    const matches = await Match.aggregate([
      {
        $match: {
          leagueId: new mongoose.Types.ObjectId(leagueId),
        },
      },
      // Join with homeTeam
      {
        $lookup: {
          from: 'teams',
          localField: 'homeTeam',
          foreignField: '_id',
          as: 'homeTeam',
        },
      },
      { $unwind: '$homeTeam' },

      // Join with awayTeam
      {
        $lookup: {
          from: 'teams',
          localField: 'awayTeam',
          foreignField: '_id',
          as: 'awayTeam',
        },
      },
      { $unwind: '$awayTeam' },

      // Group by week
      {
        $group: {
          _id: '$week',
          matches: {
            $push: {
              _id: '$_id',
              homeTeam: '$homeTeam.name',
              awayTeam: '$awayTeam.name',
              homeScore: '$homeScore',
              awayScore: '$awayScore',
              played: '$played',
            },
          },
        },
      },
      { $sort: { _id: 1 } }, // sort by week number ascending
    ]);

    res.status(200).json({ weeks: matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️⃣ Submit Match Result and Update Points Table
const updateMatchResult = async (req, res) => {
  const { homeScore, awayScore } = req.body;
  const { matchId } = req.params;

  try {
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (match.played) {
      return res.status(400).json({ message: 'Match already played' });
    }

    // Update match score
    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.played = true;
    await match.save();

    const [homeTeam, awayTeam] = await Promise.all([
      Team.findById(match.homeTeam),
      Team.findById(match.awayTeam),
    ]);

    // Update stats
    homeTeam.played += 1;
    awayTeam.played += 1;

    homeTeam.scored += homeScore;
    homeTeam.concede += awayScore;
    awayTeam.scored += awayScore;
    awayTeam.concede += homeScore;

    homeTeam.goal_diff = homeTeam.scored - homeTeam.concede;
    awayTeam.goal_diff = awayTeam.scored - awayTeam.concede;

    if (homeScore > awayScore) {
      homeTeam.win += 1;
      awayTeam.lose += 1;
      homeTeam.points += 3;
    } else if (awayScore > homeScore) {
      awayTeam.win += 1;
      homeTeam.lose += 1;
      awayTeam.points += 3;
    } else {
      homeTeam.draw += 1;
      awayTeam.draw += 1;
      homeTeam.points += 1;
      awayTeam.points += 1;
    }

    await Promise.all([homeTeam.save(), awayTeam.save()]);

    await updateLeagueStatusIfNeeded(match.leagueId);
    res.status(200).json({ message: 'Match result updated and points table refreshed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3️⃣ Get Points Table
const getPointsTable = async (req, res) => {
  try {
    const league = await League.findById(req.params.leagueId).populate('teamIds');
    if (!league) return res.status(404).json({ message: 'League not found' });

    // Sort by points DESC then goal_diff DESC
    const sorted = league.teamIds.sort((a, b) => {
      if (b.points === a.points) {
        if (b.goal_diff === a.goal_diff) {
          return b.scored - a.scored;
        }
        return b.goal_diff - a.goal_diff;
      }
      return b.points - a.points;
    });

    res.status(200).json({ table: sorted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllMatchesByLeague,
  updateMatchResult,
  getPointsTable,
};
