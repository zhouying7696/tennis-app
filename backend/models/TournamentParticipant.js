const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Tournament = require('./Tournament');

const TournamentParticipant = sequelize.define('TournamentParticipant', {
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
  tournament_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tournament,
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
  tableName: 'tournament_participants',
  timestamps: false
});

// 关联关系
TournamentParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
TournamentParticipant.belongsTo(Tournament, { foreignKey: 'tournament_id', as: 'tournament' });

module.exports = TournamentParticipant;