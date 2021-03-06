const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
const settings = require('../config/config');
const logger = require('../config/logger');

module.exports = {
    verifyJWT(req, res, next) {
        var token = req.headers['authorization'];
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No token provided.' });
        } else {
            token = token.replace("Bearer ", "")
        }
        jwt.verify(token, process.env.JWT_SECRET || settings.jwt.JWT_SECRET, function (err, decoded) {
            if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
            logger.debug("validations:verifyJWT:user", decoded.result);
            req.token = token;
            req.user = decoded.result;
            req.email = decoded.result.email;
            next();
        });
    }
}

module.exports.login = [
    check('email').isEmail().not().isEmpty().withMessage('O e-mail é obrigatório!'),
    check('password').not().isEmpty().withMessage('A senha é obrigatória!'),
];
