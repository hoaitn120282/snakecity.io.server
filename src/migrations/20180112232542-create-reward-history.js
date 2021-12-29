module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reward-histories', {
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
    rewardNumber: {
      type: Sequelize.FLOAT,
    },
    expNumber: {
      type: Sequelize.FLOAT,
    },
    rewardType: {
      type: Sequelize.STRING,
    },
    activityName: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('reward-histories'),
};
