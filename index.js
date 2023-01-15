require("dotenv").config();

// INTERNAL IMPORT
const app = require("./src/configs/app");

// CONSTANT
const { PORT, NODE_ENV } = process.env;

function incomingMessage() {
  console.log(
    `
##############################################
  🛡️  HTTPS Server listening on port: ${PORT} 🛡️
##############################################
  `
  );
}

if (NODE_ENV === "development") {
  const https = require("https");
  const fs = require("fs");

  const options = {
    key: fs.readFileSync("./certs/localhost-key.pem"),
    cert: fs.readFileSync("./certs/localhost.pem"),
  };

  const server = https.createServer(options, app());
  server.listen(PORT, incomingMessage);
} else {
  app().listen(PORT, incomingMessage);
}
