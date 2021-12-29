module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('turns', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    walletID: {
      type: Sequelize.STRING,
    },
    turnNumber: {
      type: Sequelize.INTEGER,
    },
    turnLimit: {
      type: Sequelize.INTEGER,
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
  down: (queryInterface) => queryInterface.dropTable('turns'),
};
