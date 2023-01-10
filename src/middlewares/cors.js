const cors = require("cors");

// INTERNAL IMPORT
const { LOCAL_GUEST, CLOUD_GUEST } = process.env;

module.exports = cors({
  origin: [LOCAL_GUEST, CLOUD_GUEST],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
});
