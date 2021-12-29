const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const _ = require('lodash');
const db = require('../../config/db');
const APIError = require('../../helpers/APIError');

/**
 * Reward Schema
 */
const RewardSchema = {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  walletID: {
    type: Sequelize.STRING,
    allowNull: false,

  },
  rewardAmount: {
    type: Sequelize.FLOAT,
  },
  rewardWithdrawn: {
    type: Sequelize.FLOAT,
  },
  rewardAvailable: {
    type: Sequelize.FLOAT,
  },
  totalExp: {
    type: Sequelize.INTEGER,
  },
  rewardType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
};

const Reward = db.sequelize.define('reward', RewardSchema);

/**
 * Statics
 */

/**
 * Get Reward
 * @param {number} id - The id of Reward.
 * @returns {Promise<Reward, APIError>}
 */
Reward.get = function get(id) {
  return this.findByPk(id)
    .then((reward) => {
      if (reward) {
        return reward;
      }
      const err = new APIError('No such Record exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
};

/**
 * List Rewards in order of 'id'.
 * @param {number} skip - Number of Rewards to be skipped.
 * @param {number} limit - Limit number of Rewards to be returned.
 * @returns {Promise<Reward[]>}
 */
Reward.list = function list({ skip = 0, limit = 50 } = {}) {
  return this.findAll({
    limit,
    offset: skip,
    $sort: { id: 1 },
  });
};

Reward.getBywalletID = function getBywalletID(walletID) {
  return this.findAll({
    where: {
      walletID: walletID
    }
  });
};

/**
 * Generates same model of Rewards details.
 * @returns {object} - Public information of Rewards.
 */
Reward.prototype.safeModel = function safeModel() {
  return _.omit(this.toJSON(), [ 'password' ]);
};

/**
 * @typedef Reward
 */
module.exports = Reward;
