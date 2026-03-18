const { Sequelize } = require('sequelize');

// 使用SQLite作为嵌入式数据库
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './tennis_app.db',
  logging: false
});

module.exports = sequelize;
