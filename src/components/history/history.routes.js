const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./history.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardNumber: Joi.number(),
      expNumber: Joi.number(),
      rewardType: Joi.string(),
      activityName: Joi.string(),
    }),
    params: Joi.object({
      id: Joi.string().hex().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardNumber: Joi.number(),
      expNumber: Joi.number(),
      rewardType: Joi.string(),
      activityName: Joi.string(),
    }),
  },
};

router.route('/')
  .get(modelCtrl.list)

  .post(validate(paramValidation.createModel), modelCtrl.create);

router.route('/:id')
  .get(modelCtrl.get)

  .put(validate(paramValidation.updateModel), modelCtrl.update)

  .delete(modelCtrl.destroy);

router.param('id', modelCtrl.load);

module.exports = router;
