const { Op } = require('sequelize');
const sequelize = require('sequelize');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Venue = require('../models/Venue');
const Participation = require('../models/Participation');
const Tournament = require('../models/Tournament');
const TournamentParticipant = require('../models/TournamentParticipant');

// 用户统计
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const activeUsers = await User.count({ where: { role: 'user', xp: { [Op.gt]: 0 } } });
    const userLevels = await User.findAll({
      attributes: ['level', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { role: 'user' },
      group: ['level']
    });

    res.status(200).json({
      totalUsers,
      activeUsers,
      userLevels: userLevels.map(item => ({
        level: item.level,
        count: parseInt(item.dataValues.count)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 活动统计
exports.getActivityStats = async (req, res) => {
  try {
    const totalActivities = await Activity.count();
    const activeActivities = await Activity.count({ where: { status: 'active' } });
    const completedActivities = await Activity.count({ where: { status: 'completed' } });
    const activityTypes = await Activity.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type']
    });
    const activityStatuses = await Activity.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status']
    });
    const totalParticipations = await Participation.count();

    res.status(200).json({
      totalActivities,
      activeActivities,
      completedActivities,
      activityTypes: activityTypes.map(item => ({
        type: item.type,
        count: parseInt(item.dataValues.count)
      })),
      activityStatuses: activityStatuses.map(item => ({
        status: item.status,
        count: parseInt(item.dataValues.count)
      })),
      totalParticipations
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 场地统计
exports.getVenueStats = async (req, res) => {
  try {
    const totalVenues = await Venue.count();
    const venueTypes = await Venue.findAll({
      attributes: ['court_type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['court_type']
    });

    res.status(200).json({
      totalVenues,
      venueTypes: venueTypes.map(item => ({
        type: item.court_type,
        count: parseInt(item.dataValues.count)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 赛事统计
exports.getTournamentStats = async (req, res) => {
  try {
    const totalTournaments = await Tournament.count();
    const activeTournaments = await Tournament.count({ where: { status: 'active' } });
    const totalParticipants = await TournamentParticipant.count();

    res.status(200).json({
      totalTournaments,
      activeTournaments,
      totalParticipants
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};