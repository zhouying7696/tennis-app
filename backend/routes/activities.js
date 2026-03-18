const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/auth');

// 获取活动列表
router.get('/', activityController.getActivities);

// 获取活动详情
router.get('/:id', activityController.getActivityById);

// 创建活动
router.post('/', activityController.createActivity);

// 更新活动
router.put('/:id', activityController.updateActivity);

// 删除活动
router.delete('/:id', activityController.deleteActivity);

// 报名活动
router.post('/:id/join', authenticateToken, activityController.joinActivity);

// 取消报名
router.post('/:id/leave', authenticateToken, activityController.leaveActivity);

module.exports = router;