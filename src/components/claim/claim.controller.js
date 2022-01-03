const { isEmpty } = require('lodash');
const Model = require('./claim.model');
const Reward = require('../reward/reward.model');
/**
 * Load Model and append to req.
 */
function load(req, res, next, walletID) {
  const { limit = 50, skip = 0 } = req.query;
  return Model.getBywalletID(walletID, { limit, skip })
    .then((model) => {
      req.model = model;// eslint-disable-line no-param-reassign
      return res.json(req.model);
    })
    .catch((e) => next(e));
}

function findClaim(req, res, next, id) {
  return Model.get(id)
    .then((model) => {
      req.model = model;// eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get Model
 * @returns {Model}
 */
function get(req, res) {
  return res.json(req.model.safeModel());
}

/**
 * Get Model profile of logged in Model
 * @returns {Promise<Model>}
 */
function getProfile(req, res, next) {
  return Model.get(res.locals.session.id)
    .then((model) => res.json(model.safeModel()))
    .catch((e) => next(e));
}

/**
 * Create reward
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function create(req, res, next) {
  const model = new Model(req.body);
  return model.save()
    .then((savedmodel) => {
      Reward.findAll({
        where: {
          walletID: savedmodel.walletID,
          rewardType: savedmodel.claimRewardType,
        }
      })
        .then((reward) => {
          if (!isEmpty(reward)) {
            const rewardModel = reward[ 0 ];
            rewardModel.rewardWithdrawn = rewardModel.rewardWithdrawn + model.claimRewardAmount;
            rewardModel.rewardAvailable = rewardModel.rewardAvailable - model.claimRewardAmount;
            rewardModel.save();
          } else {
            const rewardModel = new Reward();
            rewardModel.walletID = model.walletID;
            rewardModel.rewardAmount = model.claimRewardAmount;
            rewardModel.rewardAvailable = 0;
            rewardModel.rewardWithdrawn = model.claimRewardAmount;
            rewardModel.rewardType = model.claimRewardType;
            rewardModel.save();
          }
        });
      res.json(savedmodel.safeModel());
    })
    .catch((e) => next(e));
}


/**
 * Update existing Model
 * @property {string} req.body.walletID .
 * @property {float} req.body.claimRewardAmount .
 * @property {string} req.body.transactionID .
 * @property {string} req.body.claimRewardType .
 * @property {string} req.body.claimStatus .
 * @returns {Model}
 */
function update(req, res, next) {
  const { model } = req;
  model.walletID = req.body.walletID;
  model.claimRewardAmount = req.body.claimRewardAmount;
  model.transactionID = req.body.transactionID;
  model.claimRewardType = req.body.claimRewardType;
  model.claimStatus = req.body.claimStatus;

  return model.save()
    .then((savedModel) => {
      res.json(savedModel.safeModel());
    })
    .catch((e) => next(e));
}

/**
 * Get Model list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Model[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Model.list({ limit, skip })
    .then((Models) => res.json(Models))
    .catch((e) => next(e));
}

/**
 * Delete Model.
 * @returns {Model}
 */
function destroy(req, res, next) {
  const { Model } = req;
  Model.destroy()
    .then((deletedModel) => res.json(deletedModel.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  getProfile,
  update,
  list,
  destroy,
  create,
  findClaim,
};
