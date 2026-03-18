const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Venue = require('./Venue');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  host_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  venue_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  max_players: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  current_players: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fee_type: {
    type: DataTypes.STRING(20),
    defaultValue: 'free'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'active'
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
  tableName: 'activities',
  timestamps: false
});

// 关联关系
Activity.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
Activity.belongsTo(Venue, { foreignKey: 'venue_id', as: 'venue' });

module.exports = Activity;