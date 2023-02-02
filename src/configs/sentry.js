const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

module.exports = function (app) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_KEY,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
};
