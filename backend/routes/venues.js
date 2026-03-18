const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 获取场地列表
router.get('/', authenticateToken, venueController.getVenues);

// 获取场地详情
router.get('/:id', authenticateToken, venueController.getVenueById);

// 创建场地
router.post('/', authenticateToken, requireAdmin, venueController.createVenue);

// 更新场地
router.put('/:id', authenticateToken, requireAdmin, venueController.updateVenue);

// 删除场地
router.delete('/:id', authenticateToken, requireAdmin, venueController.deleteVenue);

module.exports = router;