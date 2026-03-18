const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { authenticateToken } = require('../middleware/auth');

// 获取赛事列表
router.get('/', tournamentController.getTournaments);

// 获取赛事详情
router.get('/:id', tournamentController.getTournamentById);

// 创建赛事
router.post('/', tournamentController.createTournament);

// 更新赛事
router.put('/:id', tournamentController.updateTournament);

// 删除赛事
router.delete('/:id', tournamentController.deleteTournament);

// 参加赛事
router.post('/:id/join', authenticateToken, tournamentController.joinTournament);

// 取消参赛
router.post('/:id/leave', authenticateToken, tournamentController.leaveTournament);

module.exports = router;