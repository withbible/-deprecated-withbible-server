require("dotenv").config();

const app = require("./src/configs/app");

const { PORT } = process.env;

app().listen(PORT, () =>
  console.log(
    `
##############################################
  🛡️  Server listening on port: ${PORT} 🛡️
##############################################
  `
  )
);
