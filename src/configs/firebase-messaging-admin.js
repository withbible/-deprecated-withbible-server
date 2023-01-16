const admin = require("firebase-admin");

// INTERNAL IMPORT
// eslint-disable-next-line import/no-dynamic-require
const serviceAccount = require(`../../keys/${process.env.FCM_ADMIN_SDK}.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
