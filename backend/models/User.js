const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'beg'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active'
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'user'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;