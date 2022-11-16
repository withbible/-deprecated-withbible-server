require('dotenv').config();

const app = require('./config/app');
const { PORT } = process.env;

app().listen(PORT, () => console.log(
  `
##############################################
  🛡️  Server listening on port: ${PORT} 🛡️
##############################################
  `
));

/**
 * +++ Deployment
 * Deployment platform DETA needs index.js in front of project
 * and app need to be module.exports
 */
module.exports = app;