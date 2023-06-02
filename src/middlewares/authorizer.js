const cors = require("cors");

module.exports = cors({
  origin: [process.env.LOCAL_GUEST, process.env.CLOUD_GUEST],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});
