const Sentry = require("@sentry/node");
const { Integrations } = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");

const monitoring = (app) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_KEY,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [
      new Integrations.Http({ tracing: true }),
      new Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    enabled: process.env.NODE_ENV === "production",
  });
};

module.exports = monitoring;
