const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
};

module.exports = cors(corsOptions);
