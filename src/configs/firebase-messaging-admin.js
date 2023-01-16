const admin = require("firebase-admin");
const axios = require("axios");

// INTERNAL IMPORT
const { logger } = require("./logger");

// CONSTANT
const REPO_URL = `https://api.github.com/repos/WithBible/withbible-server-etc/contents/keys/${process.env.FCM_ADMIN_SDK}.json`;

// MAIN
(async function () {
  try {
    const response = await axios.get(REPO_URL, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    const decoded = Buffer.from(response.data.content, "base64");

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(decoded)),
    });
  } catch (err) {
    logger.warn(err.message);
  }
})();

module.exports = admin;
