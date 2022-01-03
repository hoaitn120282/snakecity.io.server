const { isEmpty } = require('lodash');
const Model = require('./hisroty.model');
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
          rewardType: savedmodel.rewardType,
        }
      }).then((reward) => {
        if (!isEmpty(reward)) {
          const rewardModel = reward[ 0 ];
          rewardModel.rewardAvailable = rewardModel.rewardAvailable + savedmodel.rewardNumber;
          rewardModel.rewardAmount = rewardModel.rewardAvailable + rewardModel.rewardWithdrawn;
          rewardModel.totalExp = rewardModel.totalExp + savedmodel.expNumber;
          rewardModel.save();
        } else {
          const rewardModel = new Reward();
          rewardModel.walletID = savedmodel.walletID;
          rewardModel.rewardAmount = savedmodel.rewardNumber;
          rewardModel.rewardAvailable = savedmodel.rewardNumber;
          rewardModel.rewardWithdrawn = 0;
          rewardModel.totalExp = savedmodel.expNumber;
          rewardModel.rewardType = savedmodel.rewardType;
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
 * @property {float} req.body.rewardNumber .
 * @property {float} req.body.expNumber .
 * @property {string} req.body.rewardType .
 * @property {string} req.body.activityName .
 * @returns {Model}
 */
function update(req, res, next) {
  const { model } = req;
  model.walletID = req.body.walletID;
  model.rewardNumber = req.body.rewardNumber;
  model.expNumber = req.body.expNumber;
  model.rewardType = req.body.rewardType;
  model.activityName = req.body.activityName;

  return model.save()
    .then((savedModel) => res.json(savedModel.safeModel()))
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
    .then((models) => res.json(models))
    .catch((e) => next(e));
}

/**
 * Delete Model.
 * @returns {Model}
 */
function destroy(req, res, next) {
  const { model } = req;
  model.destroy()
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
};
