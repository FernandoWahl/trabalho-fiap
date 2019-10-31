const logger    = require('../config/logger');
const shajs     = require('sha.js')
const User      = require('../database/models/user')

module.exports = {
    get: (req, res) => {
        logger.debug("users.controller:get:id", req.params.id);
        var id = req.params.id;
        var search = {};
        if(id){
            search = {_id: id};
        }
        User.find(search).sort({ name: 1 }).exec((err, results) => {
            if(err || results == null){
                logger.debug("users.controller:get:error", err);
                res.status(200).send({ user: null });
            } else {
                logger.debug("users.controller:get:users", results);
                if(id){
                    res.status(200).send({ user: results[0] });
                } else {
                    res.status(200).send({ users: results });
                }
            }
        });
    },

    post: (req, res) => {
        logger.debug("users.controller:post:body", req.body);
        req.body.password = shajs('sha256').update(req.body.password).digest('hex');
        User.create(req.body, (err, user) => {
            if (err) {
                logger.debug("users.controller:post:error", err);
                if(err.message.indexOf('duplicate key error') !== -1){
                    res.status(400).send({ error: "Erro ao incluir o usuário! O e-mail já existe!" });
                } else {
                    res.status(400).send({ error: "Erro ao incluir o usuário!" });
                }
            } else {
                res.status(201).send({ user: user });
            }
        });
    },

    put: (req, res) => {
        logger.debug("users.controller:post:id", req.params.id);
        logger.debug("users.controller:post:body", req.body);

        if(req.body.password){
            req.body.password = shajs('sha256').update(req.body.password).digest('hex');
        }

        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
            if (err) {
                logger.debug("users.controller:post:error", err);
                res.status(400).send({ error: "Erro ao atualizar o usuário!" });
            } else {
                logger.debug("users.controller:get:user", user);
                res.status(200).send({ user: user });
            }
        });
    },
    
    delete: (req, res) => {
        logger.debug("users.controller:post:id", req.params.id);
        User.deleteOne({ _id: req.params.id }, function (err) {
            if (err) {
                logger.debug("users.controller:post:error", err);
                res.status(400).send({ error: "Erro ao deletar o usuário!" });
            } else {
                res.status(204).send();
            }
        });
    },

    createUserInit: () => {
        User.find({_id: 1}).sort({ name: 1 }).exec((err, results) => {
            if(err || results == null){
                var body = {
                    "name" : "Fernando Wahl",
                    "email" : "fernando.pepe@gmail.com",
                    "group" : "admin",
                    "password" : shajs('sha256').update("1234567").digest('hex')
                };
                User.create(body, (err, user) => {
                    console.log("Usuário inicial criado com sucesso!");
                });
            }
        });
    },
};