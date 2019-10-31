const { check, param } = require('express-validator');
const User             = require('../database/models/user')
const logger           = require('../config/logger');

function validateId(value) {
    return new Promise((resolve, reject) => {
        logger.debug("user.validation:validateId:value", value);
        User.findOne({ _id: value}).exec(function(err, user) {
            if(err){
                reject('Usuário não encontrado!');
            } 
            resolve(true);
        });
    });
}

function validateGroup(value) {
    logger.debug("user.validation:validateGroup:value", value);
    let allowed = ["admin", "default"]
    if(allowed.includes(value)){
        return Promise.resolve(true);
    }
    return Promise.reject('O grupo é inválido!');
}

module.exports.get = [
    param('id').not().isEmpty().withMessage('O ID do usuário é inválido!').custom(validateId)
];

module.exports.post = [
    check('name').not().isEmpty().withMessage('O nome é obrigatório!'),
    check('email').isEmail().withMessage('O e-mail é inválido!').not().isEmpty().withMessage('O e-mail é obrigatório!'),
    check('group').not().isEmpty().withMessage('O grupo é obrigatório!').custom(validateGroup),
    check('password').not().isEmpty().withMessage('A senha é obrigatória!')
];

module.exports.put = [
    param('id').not().isEmpty().withMessage('O ID do usuário é inválido!').custom(validateId),
    check('name').not().isEmpty().withMessage('O nome é obrigatório!'),
    check('email').isEmail().not().isEmpty().withMessage('O e-mail é obrigatório!'),
    check('group').not().isEmpty().withMessage('O grupo é obrigatório!').custom(validateGroup),
    check('polarsteps').optional({nullable: true}).isURL().withMessage('O Link do Polarstep deve ser uma URL!'),
    check('password').optional({nullable: true})
];

module.exports.delete = [
    param('id').not().isEmpty().withMessage('O ID do usuário é inválido!').custom(validateId),
];