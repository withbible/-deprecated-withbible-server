const fetch = require("node-fetch");

module.exports = async () => {
  const REPO_URL =
    "https://api.github.com/repos/WithBible/withbible-server-etc/contents";
  const headers = {
    Authorization: `Bearer ${process.env.GHP_SERVER_ETC_ACCESS_TOKEN}`,
    Accept: "application/vnd.github.raw",
  };

  const [keyResponse, certResponse] = await Promise.all([
    fetch(`${REPO_URL}/certs/localhost-key.pem`, {
      method: "GET",
      headers,
    }),
    fetch(`${REPO_URL}/certs/localhost.pem`, {
      method: "GET",
      headers,
    }),
  ]);

  return {
    ssl: {
      key: keyResponse.data,
      cert: certResponse.data,
    },
  };
};
