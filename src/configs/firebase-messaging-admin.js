const path = require("path");
const logger = require("./logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");

async function getSDKConfigRemote() {
  const axios = require("axios");
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
}

// eslint-disable-next-line consistent-return
const messagingPromise = (async () => {
  try {
    const admin = require("firebase-admin");
    const sdkConfig = await getSDKConfigRemote();

    admin.initializeApp({
      credential: admin.credential.cert(sdkConfig),
    });

    logger.info("Firebase Cloud Messaging connected");

    return admin.messaging();
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
})();

module.exports = messagingPromise;
