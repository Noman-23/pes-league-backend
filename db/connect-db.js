const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const URL = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
  console.log(URL, DB_NAME);
  try {
    await mongoose
      .connect(URL, {
        dbName: DB_NAME,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
  } catch (error) {
    throw new Error('Failed to connect to the database', error.message);
  }
};

module.exports = { connectDB };
