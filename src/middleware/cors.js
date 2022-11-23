const cors = require('cors');

const corsOptions = {
  origin: true,
  credentials: true
};

module.exports = cors(corsOptions);