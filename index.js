const app = require('./app/config/express');
const path = require('path');

global.appRoot = path.resolve(__dirname);

const fileRouter = require('./app/routes/iot.route');
const homeHTML = require('./app/config/home.json');
const settings = require('./app/config/config');
const logger = require('./app/config/logger');
const httpContext = require('express-http-context');
const mongo = require('./app/database/mongo.connection')
const usersController = require("./app/controllers/user.controller");
const server = require('http').createServer(app);
const urlPrefix = app.urlPrefix;

process.setMaxListeners(0);

app.use(httpContext.middleware);
app.use(logger.loggerExpress);
app.use(`${app.urlPrefix}`, fileRouter);
app.get('/', (req, res) => {
    res.status(200).send(homeHTML.html);
});
app.use((req, res, next) => { 
    res.status(404).send({ code: 404 });
    next();
})

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('error/500');
        return;
    }
    next(error);
});

var connecDatabase = () => {
    setTimeout(() => {
        mongo.connect().then(() => {
            logger.info('Conexão com o banco de dados criada com sucesso');
            usersController.createUserInit();
        }).catch(err => {
            logger.error('ERRO de conexão com o banco de dados. Erro: '+err);
            connecDatabase();
        });
    }, 1000);
}

let port = process.env.SERVER_PORT || settings.server.SERVER_PORT;
server.listen(port, () => {
    connecDatabase();
logger.debug(`
================================================================================================
================================================================================================

Server running on
http://localhost:${port}

GET
http://localhost:${port}${urlPrefix}/

================================================================================================
================================================================================================
`);
})