const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(
  'mongodb+srv://Brave:dms!15096@pusherpoll.yj9ql.mongodb.net/test',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));