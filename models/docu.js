const Sequelize = require('sequelize');

module.exports = class Docu extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(60),
          allowNull: false,
        },
        file: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        hash: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        kab: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        eul: {
          type: Sequelize.BOOLEAN, // true false
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Docu',
        tableName: 'docus',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }

  static associate(db) {
    db.Docu.belongsTo(db.User);
  }
};
