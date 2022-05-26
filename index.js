const app = require('./src/app');

/**
 * Deployment platform DETA needs index.js in front of project
 * and app need to be module.exports
 */
module.exports = app;