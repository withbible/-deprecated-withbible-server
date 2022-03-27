const express = require('express');

const logger = require('./log')

require('dotenv/config');
require('./db/atlas');
const { PORT } = process.env;

const app = express();
app.set('trust proxy', 1);

app.use(
    require('./middleware/morgan'),
    express.json(),
    express.urlencoded({ extended: false }),
    require('./middleware/cors'),
    require('./middleware/session')
);
app.use('/user', require('./routes/user'));
app.use('/quiz', require('./routes/quiz'));
app.use('/score', require('./routes/score'));
app.use('/search', require('./routes/search'));

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => logger.error(err.message));

app.listen(PORT, () => logger.info(
    `
##############################################
    🛡️  Server listening on port: ${PORT} 🛡️
##############################################
    `
));