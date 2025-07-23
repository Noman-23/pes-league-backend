const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      set: (value) => value.toLowerCase(),
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    teamIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

const League = mongoose.model('League', leagueSchema);
module.exports = League;
