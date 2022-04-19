const express = require('express');

const config = require('../config');
require('./database/atlas');

const PORT = config.port;

const app = express();

app.use(
    require('./middleware/morgan'),
    express.json(),
    express.urlencoded({ extended: false }),    
);
app.use('/quiz', require('./routes/quiz'));

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => console.error(err.message));

app.listen(PORT, () => console.log(
    `
##############################################
    🛡️  Server listening on port: ${PORT} 🛡️
##############################################
    `
));