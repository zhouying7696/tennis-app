const Activity = require('../models/Activity');
const User = require('../models/User');
const Venue = require('../models/Venue');
const Participation = require('../models/Participation');

// 获取活动列表
exports.getActivities = async (req, res) => {
  try {
    const { type, level, date, page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (level) where.level = level;
    if (date) where.date = date;
    if (status) where.status = status;
    if (search) {
      where[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const activities = await Activity.findAll({
      where,
      include: [
        { model: User, as: 'host', attributes: ['id', 'nickname', 'avatar', 'level'] },
        { model: Venue, as: 'venue', attributes: ['id', 'name', 'address', 'court_type'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Activity.count({ where });

    res.status(200).json({
      activities,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取活动详情
exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'nickname', 'avatar', 'level'] },
        { model: Venue, as: 'venue', attributes: ['id', 'name', 'address', 'latitude', 'longitude', 'court_type'] }
      ]
    });

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    // 获取参与者列表
    const participants = await Participation.findAll({
      where: { activity_id: id },
      include: [{ model: User, as: 'user', attributes: ['id', 'nickname', 'avatar', 'level'] }]
    });

    res.status(200).json({
      activity,
      participants
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 创建活动
exports.createActivity = async (req, res) => {
  try {
    const { title, venue_id, type, level, date, start_time, end_time, max_players, fee, fee_type, description, rules } = req.body;

    // 验证场地是否存在
    const venue = await Venue.findByPk(venue_id);
    if (!venue) {
      return res.status(400).json({ message: '场地不存在' });
    }

    // 创建活动，使用默认的host_id为1（我们创建的用户id）
    const activity = await Activity.create({
      title,
      host_id: 1,
      venue_id,
      type,
      level,
      date,
      start_time,
      end_time,
      max_players,
      fee: fee || 0,
      fee_type: fee_type || 'free',
      description,
      rules
    });

    res.status(201).json({ message: '活动创建成功', activity });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新活动
exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, venue_id, type, level, date, start_time, end_time, max_players, fee, fee_type, description, rules, status } = req.body;

    const activity = await Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    // 验证场地是否存在
    if (venue_id) {
      const venue = await Venue.findByPk(venue_id);
      if (!venue) {
        return res.status(400).json({ message: '场地不存在' });
      }
      activity.venue_id = venue_id;
    }

    // 更新活动信息
    if (title) activity.title = title;
    if (type) activity.type = type;
    if (level) activity.level = level;
    if (date) activity.date = date;
    if (start_time) activity.start_time = start_time;
    if (end_time) activity.end_time = end_time;
    if (max_players) activity.max_players = max_players;
    if (fee !== undefined) activity.fee = fee;
    if (fee_type) activity.fee_type = fee_type;
    if (description) activity.description = description;
    if (rules) activity.rules = rules;
    if (status) activity.status = status;

    await activity.save();

    res.status(200).json({ message: '活动更新成功', activity });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除活动
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    // 删除相关的报名记录
    await Participation.destroy({ where: { activity_id: id } });

    // 删除活动
    await activity.destroy();

    res.status(200).json({ message: '活动删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 报名活动
exports.joinActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    // 检查活动状态
    if (activity.status !== 'active') {
      return res.status(400).json({ message: '活动已结束或已取消' });
    }

    // 检查人数限制
    if (activity.current_players >= activity.max_players) {
      return res.status(400).json({ message: '活动人数已满' });
    }

    // 检查是否已经报名
    const existingParticipation = await Participation.findOne({
      where: { user_id: req.user.id, activity_id: id }
    });
    if (existingParticipation) {
      return res.status(400).json({ message: '已经报名过此活动' });
    }

    // 创建报名记录
    await Participation.create({
      user_id: req.user.id,
      activity_id: id
    });

    // 更新活动人数
    activity.current_players += 1;
    await activity.save();

    res.status(200).json({ message: '报名成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 取消报名
exports.leaveActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' });
    }

    // 检查是否已经报名
    const participation = await Participation.findOne({
      where: { user_id: req.user.id, activity_id: id }
    });
    if (!participation) {
      return res.status(400).json({ message: '未报名此活动' });
    }

    // 删除报名记录
    await participation.destroy();

    // 更新活动人数
    activity.current_players -= 1;
    await activity.save();

    res.status(200).json({ message: '取消报名成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};