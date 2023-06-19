const fs = require("fs");

module.exports = () => {
  return {
    key: fs.readFileSync("./etc/certs/localhost-key.pem"),
    cert: fs.readFileSync("./etc/certs/localhost.pem"),
  };
};
