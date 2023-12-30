const serverless = require("serverless-http");
const app = require("./src/infrastructure-layer/configs/app");

module.exports.handler = serverless(app);
