const Reward = require('./reward.model');

/**
 * Load reward and append to req.
 */
function load(req, res, next, walletID) {
  return Reward.getBywalletID(walletID)
    .then((reward) => {
      req.reward = reward; // eslint-disable-line no-param-reassign
      return res.json(req.reward);
    })
    .catch((e) => next(e));
}

/**
 * Get reward
 * @returns {Reward}
 */
function get(req, res) {
  return res.json(req.reward.safeModel());
}

/**
 * Get reward profile of logged in reward
 * @returns {Promise<Reward>}
 */
function getProfile(req, res, next) {
  return Reward.get(res.locals.session.id)
    .then((reward) => res.json(reward.safeModel()))
    .catch((e) => next(e));
}
/**
 * Create reward
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function create(req, res, next) {
  const reward = new Reward(req.body);
  return reward.save()
    .then((savedReward) => res.json(savedReward.safeModel()))
    .catch((e) => next(e));
}

/**
 * Update existing reward
 * @property {string} req.body.walletID .
 * @property {float} req.body.rewardAmount .
 * @property {float} req.body.rewardWithdrawn .
 * @property {float} req.body.rewardAvailable .
 * * @property {string} req.body.rewardType .
 * @returns {Reward}
 */
function update(req, res, next) {
  const { reward } = req;
  reward.walletID = req.body.walletID;
  reward.rewardAmount = req.body.rewardAmount;
  reward.rewardWithdrawn = req.body.rewardWithdrawn;
  reward.rewardAvailable = req.body.rewardAvailable;
  reward.rewardType = req.body.rewardType;

  return reward.save()
    .then((savedReward) => res.json(savedReward.safeModel()))
    .catch((e) => next(e));
}

/**
 * Get reward list.
 * @property {number} req.query.skip
 * @property {number} req.query.limit
 * @returns {Promise<Reward[]>}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Reward.list({ limit, skip })
    .then((rewards) => res.json(rewards))
    .catch((e) => next(e));
}

/**
 * Delete Reward.
 * @returns {Reward}
 */
function destroy(req, res, next) {
  const { reward } = req;
  reward.destroy()
    .then((deletedReward) => res.json(deletedReward.safeModel()))
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
