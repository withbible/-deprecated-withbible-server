const mongoose = require('mongoose');

const logger = require('../log');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URL,
)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error(err));