const mongoose = require('mongoose');
require('dotenv').config();

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));