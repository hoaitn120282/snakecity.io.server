const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./reward.controller');
const { validate } = require('../../helpers');

const router = express.Router(); // eslint-disable-line new-cap

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardAmount: Joi.number(),
      rewardWithdrawn: Joi.number(),
      rewardAvailable: Joi.number(),
      rewardType: Joi.string(),
    }),
    params: Joi.object({
      walletID: Joi.string().hex().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      rewardAmount: Joi.number(),
      rewardWithdrawn: Joi.number(),
      rewardAvailable: Joi.number(),
      rewardType: Joi.string(),
    }),
  },
};

router.route('/')

  .get(modelCtrl.list)

  .post(validate(paramValidation.createModel), modelCtrl.create);

router.route('/:walletID')

  .get(modelCtrl.get)

  .put(validate(paramValidation.updateModel), modelCtrl.update)

  .delete(modelCtrl.destroy);


router.param('walletID', modelCtrl.load);

module.exports = router;
