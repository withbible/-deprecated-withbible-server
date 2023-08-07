module.exports = ({ express, makeQueryParserMiddleware }) => {
  const queryParserOption = {
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  };
  const urlEncodedOption = { extended: false };

  return Object.freeze({
    queryParser: makeQueryParserMiddleware(queryParserOption),
    bodyParser: [express.urlencoded(urlEncodedOption), express.json()],
  });
};
