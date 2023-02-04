const cors = require("cors");

module.exports = cors({
  origin: [
    process.env.LOCAL_HTTP_GUEST,
    process.env.LOCAL_HTTPS_GUEST,
    process.env.CLOUD_GUEST,
  ],
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
});
