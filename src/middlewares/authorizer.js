const cors = require("cors");

module.exports = cors({
  origin: [
    process.env.LOCAL_HTTPS_GUEST,
    process.env.CLOUD_GUEST_CLOUDTYPE,
    process.env.CLOUD_GUEST_SWYG,
  ],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});
