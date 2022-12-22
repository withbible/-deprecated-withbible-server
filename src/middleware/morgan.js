const morgan = require("morgan");

//INTERNAL IMPORT
const { logger } = require("../../config/logger");

const colors = {
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  cyan: "\x1B[36m",
  endColor: "\033[0m",
};

morgan.token("status", function (req, res) {
  let color;

  if(res.statusCode < 300) {
    color = colors.green;
  }else if(res.statusCode < 400){
    color = colors.cyan;
  }else if(res.statusCode < 500){
    color = colors.yellow;
  }else if(res.statusCode < 600){
    color = colors.red;
  }else{
    color = colors.endColor;      
  }

  return color + res.statusCode + colors.endColor;
});

const format = `
  :method :url ｜ :status ｜ :response-time ms ｜ :res[content-length] B  
`;

module.exports = morgan(format, { stream: logger.stream });
