const Match = require('../models/match.model');
const League = require('../models/league.model');

const updateLeagueStatus = async (leagueId) => {
  try {
    const [totalMatches, playedMatches] = await Promise.all([
      Match.countDocuments({ leagueId }),
      Match.countDocuments({ leagueId, played: true }),
    ]);

    const league = await League.findById(leagueId);
    if (!league) return;

    if (playedMatches === 0 && league.status !== 'upcoming') {
      league.status = 'upcoming';
    } else if (playedMatches > 0 && playedMatches < totalMatches && league.status !== 'ongoing') {
      league.status = 'ongoing';
    } else if (playedMatches === totalMatches && league.status !== 'completed') {
      league.status = 'completed';
    }

    await league.save();
  } catch (err) {
    console.error('Error updating league status:', err.message);
  }
};

module.exports = { updateLeagueStatus };
