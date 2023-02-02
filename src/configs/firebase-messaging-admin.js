const admin = require("firebase-admin");
const axios = require("axios");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("./logger");

// CONSTANT
const fileName = path.basename(__filename, ".js");
const REPO_URL = `https://api.github.com/repos/WithBible/withbible-server-etc/contents/keys/${process.env.FCM_ADMIN_SDK}.json`;

// MAIN
(async function () {
  try {
    const response = await axios.get(REPO_URL, {
      headers: {
        Authorization: `Bearer ${process.env.GHP_SERVER_ETC_ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    const decoded = Buffer.from(response.data.content, "base64");
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(decoded)),
    });

    logger.info("Firebase Cloud Messaging connected");
  } catch (err) {
    logger.error(`[${fileName}]_${err.message}`);
  }
})();

module.exports = admin;
