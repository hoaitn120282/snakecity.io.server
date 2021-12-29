const express = require('express');
const { Joi } = require('express-validation');
const modelCtrl = require('./claim.controller');
const { validate } = require('../../helpers');

const router = express.Router();

const paramValidation = {
  updateModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      claimRewardAmount: Joi.number(),
      claimRewardType: Joi.string(),
      claimStatus: Joi.string(),
      transactionID: Joi.string(),
    }),
    params: Joi.object({
      id: Joi.string().hex().required(),
    }),
  },
  createModel: {
    body: Joi.object({
      walletID: Joi.string().required(),
      claimRewardAmount: Joi.number(),
      claimRewardType: Joi.string(),
      claimStatus: Joi.string(),
      transactionID: Joi.string(),
    }),
  },
};

router.route('/')
  .get(modelCtrl.list)

  .post(validate(paramValidation.createModel), modelCtrl.create);

router.route('/:walletID')
  .get(modelCtrl.get)

  .delete(modelCtrl.destroy);

router.route('/:id')
  .put(validate(paramValidation.updateModel), modelCtrl.update);

router.param('id', modelCtrl.findClaim);
router.param('walletID', modelCtrl.load);

module.exports = router;
