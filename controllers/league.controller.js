const League = require('../models/league.model');
const Team = require('../models/team.model');
const Match = require('../models/match.model');
const { generateRoundRobinSchedule } = require('../utils/schedule-genrator');

const createLeague = async (req, res) => {
  try {
    const { name, teams } = req.body;

    if (!name || !teams || teams.length < 3) {
      return res.status(400).json({ message: 'League name and at least 3 teams are required' });
    }

    // Step 1: Create Teams
    const teamDocs = await Promise.all(teams.map((name) => Team.create({ name })));
    const teamIds = teamDocs.map((t) => t._id);

    // Step 2: Create League
    const league = await League.create({ name, teamIds });

    // Step 3: Generate Round-Robin Schedule with Week Numbers
    const schedule = generateRoundRobinSchedule(teamIds);
    const matchDocs = schedule.map(({ homeTeam, awayTeam, week }) => ({
      leagueId: league._id,
      homeTeam,
      awayTeam,
      week,
    }));

    await Match.insertMany(matchDocs);

    res.status(201).json({
      message: 'League created with matches scheduled',
      totalMatches: matchDocs.length,
      totalWeeks: Math.max(...schedule.map((m) => m.week)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllLeagues = async (req, res) => {
  try {
    const leagues = await League.find()
      .populate({
        path: 'teamIds',
        select: 'name played win lose draw scored concede goal_diff points',
      })
      .sort({ createdAt: -1 });

    // 🔁 Sort teams inside each league
    const sortedLeagues = leagues.map((league) => {
      const sortedTeams = [...league.teamIds].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
        return b.scored - a.scored;
      });

      return {
        ...league.toObject(),
        teamIds: sortedTeams,
      };
    });

    res.status(200).json({ leagues: sortedLeagues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLeague, getAllLeagues };
