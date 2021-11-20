const mongoose = require('mongoose');

const logger = require('../log');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error(err));