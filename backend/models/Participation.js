const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Activity = require('./Activity');

const Participation = sequelize.define('Participation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Activity,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'confirmed'
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
  tableName: 'participations',
  timestamps: false
});

// 关联关系
Participation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Participation.belongsTo(Activity, { foreignKey: 'activity_id', as: 'activity' });

module.exports = Participation;