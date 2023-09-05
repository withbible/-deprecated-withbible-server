const Sentry = require("@sentry/node");
const { Integrations } = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");

// INTERNAL IMPORT
const logger = require("../configs/logger");
const BaseThirdPartyConfig = require("./base");
const { MAX_RETRY_ATTEMPTS, EXIT_CODE } = require("../constants");
const { sleep, getBackOff } = require("../../utils");

// CONSTANT
const sentryConfig = {
  dsn: process.env.SENTRY_DSN_KEY,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === "production",
};

// MAIN
function Monitoring() {
  BaseThirdPartyConfig.call(this);
}

Monitoring.prototype = Object.create(BaseThirdPartyConfig.prototype);
Monitoring.prototype.constructor = Monitoring;

Monitoring.prototype.init = async function (app) {
  try {
    await Sentry.init({
      ...sentryConfig,
      ...{
        integrations: [
          new Integrations.Http({ tracing: true }),
          new Integrations.Express({ app }),
          new ProfilingIntegration(),
        ],
      },
    });

    logger.info("Sentry connected");
  } catch (err) {
    await this.retry();
  }
};

Monitoring.prototype.retry = async function (attempts = 1) {
  try {
    Sentry.captureMessage("Check connection");
  } catch (err) {
    if (attempts > MAX_RETRY_ATTEMPTS) {
      logger.error(
        `Unable to connect to Sentry in ${attempts} attempts, exiting`
      );
      process.exit(EXIT_CODE.APP_DEFINE_EXIT);
    }

    const backoff = getBackOff(attempts);
    logger.warn(`Unable to connect to Sentry, trying again in ${backoff}ms`);

    await sleep(backoff);
    return this.retry(attempts + 1);
  }
};

module.exports = new Monitoring();
