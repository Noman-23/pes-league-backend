const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'public'],
      default: 'public',
    },
  },
  { timestamps: true }
);

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
