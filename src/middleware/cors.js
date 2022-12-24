const cors = require("cors");

const corsOptions = {
  origin: [process.env.LOCAL_GUEST, process.env.CLOUD_GUEST],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
};

module.exports = cors(corsOptions);
