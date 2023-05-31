const axios = require("axios");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const BaseThirdPartyConfig = require("./base");

// CONSTANT
const fileName = path.basename(__filename, ".js");

// MAIN
function FirebaseMessagingAdmin() {
  BaseThirdPartyConfig.call(this);

  this.retry = () => {
    /**
     * @link https://firebase.google.com/docs/reference/admin/error-handling#automatic-retries
     * The SDK will retry each of the above errors up to 5 times (the original attempt + 4 retries) with exponential backoff.
     */
  };

  const getSDKConfigRemote = async () => {
    const REPO_URL = `https://api.github.com/repos/WithBible/withbible-server-etc/contents/keys/${process.env.FCM_ADMIN_SDK}.json`;
    const headers = {
      Authorization: `Bearer ${process.env.GHP_SERVER_ETC_ACCESS_TOKEN}`,
      Accept: "application/vnd.github+json",
    };

    const response = await axios.get(REPO_URL, {
      headers,
    });
    const decoded = Buffer.from(response.data.content, "base64");

    return JSON.parse(decoded);
  };

  return {
    async init() {
      try {
        const admin = require("firebase-admin");
        const sdkConfig = await getSDKConfigRemote();

        admin.initializeApp({
          credential: admin.credential.cert(sdkConfig),
        });

        this.messaging = admin.messaging();

        logger.info("Firebase Cloud Messaging connected");
      } catch (err) {
        logger.error(`[${fileName}]_${err.message}`);
      }
    },

    get() {
      return this.messaging;
    },
  };
}

FirebaseMessagingAdmin.prototype = Object.create(BaseThirdPartyConfig.prototype);
FirebaseMessagingAdmin.prototype.constructor = FirebaseMessagingAdmin;

module.exports = new FirebaseMessagingAdmin();
