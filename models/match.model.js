const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    leagueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: true,
    },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
      required: true,
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
      required: true,
    },
    homeScore: {
      type: Number,
      default: 0,
    },
    awayScore: {
      type: Number,
      default: 0,
    },
    played: {
      type: Boolean,
      default: false,
    },
    week: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
