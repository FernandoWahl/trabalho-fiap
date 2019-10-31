const settings  = require('../config/config');
const jwt       = require('jsonwebtoken');
const logger    = require('../config/logger');
const shajs     = require('sha.js')
const User      = require('../database/models/user')

module.exports = {
    help: (req, res) => {
        res.status(200).send("Oi");
    },

    userAuthentication: (req, res) => {
        logger.debug("controller:userAuthentication:body", req.body);
        const email = req.body.email;
        const password = shajs('sha256').update(req.body.password).digest('hex');
        
        User.findOne({email: email, password: password}).exec(function(err, result) {
            if(err || result == null){
                logger.debug("controller:userAuthentication:error", err);
                res.status(401).send({ error: 'Usuário ou senha incorreta!'});
            } else {
                if(result.group == 'device'){
                    res.status(200).send({ error: 'Grupo não tem permissão de acesso nessa ferramenta!'});
                } else {
                    logger.debug("controller:userAuthentication:user", result);
                    var cript = {
                        "_id": result["_id"],
                        "name": result["name"],
                        "email": result["email"],
                        "group": result["group"],
                        "date": result["date"]
                    };

                    var token = jwt.sign({ result: cript }, (process.env.JWT_SECRET || settings.jwt.JWT_SECRET), { expiresIn:  process.env.JWT_EXPIRES_IN || settings.jwt.JWT_EXPIRES_IN });    
                    res.status(200).send({ auth: true, token: token });
                }
            }
        });
    },

    userVerification: (req, res) => {
        var token = req.headers['authorization'];
        logger.debug("controller:userVerification:token", token);
        if (!token) {
            return res.status(401).send({ auth: false, message: 'Nenhum token fornecido.' });
        } else {
            token = token.replace("Bearer ", "")
        }
        jwt.verify(token, (process.env.JWT_SECRET || settings.jwt.JWT_SECRET), function (err, decoded) {
            if (err) {
                logger.error("controller:userVerification:error", err);
                return res.status(401).send({ auth: false, message: 'Falha ao autenticar o token.' });
            }
            logger.debug("controller:userVerification:result", decoded.result);
            return res.status(200).send(decoded.result);
        });
    },
};