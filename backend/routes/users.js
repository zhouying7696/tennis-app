const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 获取用户信息
router.get('/profile', authenticateToken, userController.getProfile);

// 更新用户信息
router.put('/profile', authenticateToken, userController.updateProfile);

// 修改密码
router.put('/change-password', authenticateToken, userController.changePassword);

// 管理后台API
router.get('/', authenticateToken, requireAdmin, userController.getUsers);
router.post('/', authenticateToken, requireAdmin, userController.createUser);
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

module.exports = router;