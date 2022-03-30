// import packages
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const logger = require('./helpers/logger');
const connectDabase = require('./config/database');
const errorHandler = require('./helpers/error');

// import router
const movieRouter = require('./routes/movie.route');
const authRouter = require('./routes/auth.route');
const ticketRouter = require('./routes/ticket.router');
const seatRouter = require('./routes/seat.route');
const cinemaRouter = require('./routes/cinema.route');

// process config
const app = express();
dotenv.config();
connectDabase();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ticket', ticketRouter);
app.use('/api/v1/seat', seatRouter);
app.use('/api/v1/cinema', cinemaRouter);

app.use(errorHandler);

// constant variable
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server is start on port ${PORT}`);
});

server.on('unhandledRejection', (err, promise) => {
  logger.error(err.message);
  server.close(() => process.exit(1));
});
