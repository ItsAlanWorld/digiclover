const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Docu = require('./docu');

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.User = User;
db.Docu = Docu;

User.init(sequelize);
Docu.init(sequelize);

User.associate(db);
Docu.associate(db);

module.exports = db;
