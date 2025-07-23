const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '90d',
    });
    const userDetails = {
      id: user?._id,
      name: user?.username,
      role: user?.role,
    };
    const data = { data: { message: 'Login successful', token, user: userDetails } };
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existing = await Users.findOne({ username });
    if (existing) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Username already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Users.create({
      username,
      password: hashedPassword,
      role,
    });

    if (result?._id) {
      res.status(201).json({
        status: 'SUCCESS',
        message: 'User created successfully',
      });
    } else {
      res.status(500).json({
        status: 'FAILED',
        message: 'Failed to create user',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: error.message,
    });
  }
};

module.exports = { createUser, loginUser };
