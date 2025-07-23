const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      set: (value) => value.toLowerCase(),
    },
    played: {
      type: Number,
      required: false,
      default: 0,
    },
    win: {
      type: Number,
      required: false,
      default: 0,
    },
    lose: {
      type: Number,
      required: false,
      default: 0,
    },
    draw: {
      type: Number,
      required: false,
      default: 0,
    },
    scored: {
      type: Number,
      required: false,
      default: 0,
    },
    concede: {
      type: Number,
      required: false,
      default: 0,
    },
    goal_diff: {
      type: Number,
      required: false,
      default: 0,
    },
    points: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Teams = mongoose.model('Teams', teamSchema);
module.exports = Teams;
