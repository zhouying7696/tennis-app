const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Venue = require('./Venue');

const Tournament = sequelize.define('Tournament', {
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
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  venue_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Venue,
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  max_players: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  current_players: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  description: {
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
  tableName: 'tournaments',
  timestamps: false
});

// 关联关系
Tournament.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
Tournament.belongsTo(Venue, { foreignKey: 'venue_id', as: 'venue' });

module.exports = Tournament;