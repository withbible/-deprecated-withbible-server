function getSSLConfigLocal() {
  const fs = require("fs");

  return {
    key: fs.readFileSync("./etc/certs/localhost-key.pem"),
    cert: fs.readFileSync("./etc/certs/localhost.pem"),
  };
}

async function getSSLConfigRemote() {
  const axios = require("axios");
  const REPO_URL =
    "https://api.github.com/repos/WithBible/withbible-server-etc/contents";
  const headers = {
    Authorization: `Bearer ${process.env.GHP_SERVER_ETC_ACCESS_TOKEN}`,
    Accept: "application/vnd.github.raw",
  };

  const [keyResponse, certResponse] = await Promise.all([
    axios.get(`${REPO_URL}/certs/localhost-key.pem`, {
      headers,
    }),
    axios.get(`${REPO_URL}/certs/localhost.pem`, {
      headers,
    }),
  ]);

  return {
    ssl: {
      key: keyResponse.data,
      cert: certResponse.data,
    },
  };
}

module.exports = {
  getSSLConfigLocal,
  getSSLConfigRemote,
};
