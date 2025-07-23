const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db/connect-db');

// ROUTERS
const userRouter = require('./routes/user.routes');
const leagueRouter = require('./routes/league.routes');
const matchRouter = require('./routes/match.routes');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Mounting Routes with Prefix
app.use('/api/users', userRouter);
app.use('/api/league', leagueRouter);
app.use('/api/matches', matchRouter);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
