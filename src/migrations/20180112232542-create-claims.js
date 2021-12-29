module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('claims', {
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
    claimRewardAmount: {
      type: Sequelize.FLOAT,
    },
    transactionID: {
      type: Sequelize.STRING,
    },
    claimRewardType: {
      type: Sequelize.STRING,
    },
    claimStatus: {
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
  down: (queryInterface) => queryInterface.dropTable('claims'),
};
