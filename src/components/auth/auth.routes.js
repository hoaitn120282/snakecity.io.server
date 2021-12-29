const express = require('express');
const { Joi } = require('express-validation');
const authCtrl = require('./auth.controller');
const { validate } = require('../../helpers');

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  login: {
    body: Joi.object({
      signature: Joi.string().required(),
      publicAddress: Joi.string().required(),
    }),
  },
  registerUser: {
    body: Joi.object({
      publicAddress: Joi.string().required(),
    }),
  },
};

/** POST /api/auth/login - Returns token if correct username and secret is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register - Register a new user */
router.route('/register')
  .post(validate(paramValidation.registerUser), authCtrl.register);


router.route('/checkAddress')
  .get(authCtrl.check);

module.exports = router;
