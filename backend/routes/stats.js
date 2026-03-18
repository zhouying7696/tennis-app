const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticateToken } = require('../middleware/auth');

// 用户统计
router.get('/users', authenticateToken, statsController.getUserStats);

// 活动统计
router.get('/activities', authenticateToken, statsController.getActivityStats);

// 场地统计
router.get('/venues', authenticateToken, statsController.getVenueStats);

// 赛事统计
router.get('/tournaments', authenticateToken, statsController.getTournamentStats);

module.exports = router;