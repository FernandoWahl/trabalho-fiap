const express               = require('express');
const router                = express.Router();
const routerExpress         = express.Router();
const authController        = require("../controllers/auth.controller");
const authValidation        = require("../validations/auth.validation");

const usersController       = require("../controllers/user.controller");
const usersValidation       = require("../validations/user.validation");

const { validationResult }  = require('express-validator');

function verifyErros(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  next();
}

routerExpress.post(   "/login",                 authValidation.login, verifyErros, authController.userAuthentication);
routerExpress.get(    "/verify",                authValidation.verifyJWT, authController.userVerification);

//Users
routerExpress.get(    "/users",                 authValidation.verifyJWT, usersController.get);
routerExpress.get(    "/users/:id([0-9Aa-z]+)", authValidation.verifyJWT, usersValidation.get, verifyErros, usersController.get);
routerExpress.post(   "/users",                 authValidation.verifyJWT, usersValidation.post, verifyErros, usersController.post);
routerExpress.put(    "/users/:id([0-9Aa-z]+)", authValidation.verifyJWT, usersValidation.put, verifyErros, usersController.put);
routerExpress.delete( "/users/:id([0-9Aa-z]+)", authValidation.verifyJWT, usersValidation.delete, verifyErros, usersController.delete);

router.use("/" , routerExpress);
module.exports = router;
