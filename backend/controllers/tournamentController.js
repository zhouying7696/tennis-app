const Tournament = require('../models/Tournament');
const User = require('../models/User');
const Venue = require('../models/Venue');
const TournamentParticipant = require('../models/TournamentParticipant');

// 获取赛事列表
exports.getTournaments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const tournaments = await Tournament.findAll({
      where,
      include: [
        { model: User, as: 'host', attributes: ['id', 'nickname', 'avatar'] },
        { model: Venue, as: 'venue', attributes: ['id', 'name', 'address'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Tournament.count({ where });

    res.status(200).json({
      tournaments,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取赛事详情
exports.getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'nickname', 'avatar'] },
        { model: Venue, as: 'venue', attributes: ['id', 'name', 'address', 'latitude', 'longitude'] }
      ]
    });

    if (!tournament) {
      return res.status(404).json({ message: '赛事不存在' });
    }

    // 获取参赛列表
    const participants = await TournamentParticipant.findAll({
      where: { tournament_id: id },
      include: [{ model: User, as: 'user', attributes: ['id', 'nickname', 'avatar', 'level'] }]
    });

    res.status(200).json({
      tournament,
      participants
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 创建赛事
exports.createTournament = async (req, res) => {
  try {
    const { title, venue_id, start_date, end_date, max_players, fee, description } = req.body;

    // 验证场地是否存在
    const venue = await Venue.findByPk(venue_id);
    if (!venue) {
      return res.status(400).json({ message: '场地不存在' });
    }

    // 创建赛事，使用默认的host_id为1
    const tournament = await Tournament.create({
      title,
      host_id: 1,
      venue_id,
      start_date,
      end_date,
      max_players,
      fee: fee || 0,
      description
    });

    res.status(201).json({ message: '赛事创建成功', tournament });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新赛事
exports.updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, venue_id, start_date, end_date, max_players, fee, description, status } = req.body;

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ message: '赛事不存在' });
    }

    // 验证场地是否存在
    if (venue_id) {
      const venue = await Venue.findByPk(venue_id);
      if (!venue) {
        return res.status(400).json({ message: '场地不存在' });
      }
      tournament.venue_id = venue_id;
    }

    // 更新赛事信息
    if (title) tournament.title = title;
    if (start_date) tournament.start_date = start_date;
    if (end_date) tournament.end_date = end_date;
    if (max_players) tournament.max_players = max_players;
    if (fee !== undefined) tournament.fee = fee;
    if (description) tournament.description = description;
    if (status) tournament.status = status;

    await tournament.save();

    res.status(200).json({ message: '赛事更新成功', tournament });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除赛事
exports.deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ message: '赛事不存在' });
    }

    // 删除相关的参赛记录
    await TournamentParticipant.destroy({ where: { tournament_id: id } });

    // 删除赛事
    await tournament.destroy();

    res.status(200).json({ message: '赛事删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 参加赛事
exports.joinTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ message: '赛事不存在' });
    }

    // 检查赛事状态
    if (tournament.status !== 'active') {
      return res.status(400).json({ message: '赛事已结束或已取消' });
    }

    // 检查人数限制
    if (tournament.current_players >= tournament.max_players) {
      return res.status(400).json({ message: '赛事人数已满' });
    }

    // 检查是否已经参赛
    const existingParticipation = await TournamentParticipant.findOne({
      where: { user_id: req.user.id, tournament_id: id }
    });
    if (existingParticipation) {
      return res.status(400).json({ message: '已经参加过此赛事' });
    }

    // 创建参赛记录
    await TournamentParticipant.create({
      user_id: req.user.id,
      tournament_id: id
    });

    // 更新赛事人数
    tournament.current_players += 1;
    await tournament.save();

    res.status(200).json({ message: '参赛成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 取消参赛
exports.leaveTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findByPk(id);

    if (!tournament) {
      return res.status(404).json({ message: '赛事不存在' });
    }

    // 检查是否已经参赛
    const participation = await TournamentParticipant.findOne({
      where: { user_id: req.user.id, tournament_id: id }
    });
    if (!participation) {
      return res.status(400).json({ message: '未参加此赛事' });
    }

    // 删除参赛记录
    await participation.destroy();

    // 更新赛事人数
    tournament.current_players -= 1;
    await tournament.save();

    res.status(200).json({ message: '取消参赛成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};