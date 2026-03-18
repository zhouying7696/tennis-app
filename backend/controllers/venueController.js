const Venue = require('../models/Venue');
const Activity = require('../models/Activity');
const Tournament = require('../models/Tournament');

// 获取场地列表
exports.getVenues = async (req, res) => {
  try {
    const { court_type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (court_type) where.court_type = court_type;

    const venues = await Venue.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Venue.count({ where });

    res.status(200).json({
      venues,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取场地详情
exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findByPk(id);

    if (!venue) {
      return res.status(404).json({ message: '场地不存在' });
    }

    res.status(200).json({ venue });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 创建场地
exports.createVenue = async (req, res) => {
  try {
    const { name, address, latitude, longitude, court_type, price, description } = req.body;

    // 创建场地
    const venue = await Venue.create({
      name,
      address,
      latitude,
      longitude,
      court_type,
      price: price || 0,
      description
    });

    res.status(201).json({ message: '场地创建成功', venue });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新场地
exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, court_type, price, description } = req.body;

    const venue = await Venue.findByPk(id);
    if (!venue) {
      return res.status(404).json({ message: '场地不存在' });
    }

    // 更新场地信息
    if (name) venue.name = name;
    if (address) venue.address = address;
    if (latitude) venue.latitude = latitude;
    if (longitude) venue.longitude = longitude;
    if (court_type) venue.court_type = court_type;
    if (price !== undefined) venue.price = price;
    if (description) venue.description = description;

    await venue.save();

    res.status(200).json({ message: '场地更新成功', venue });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除场地
exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findByPk(id);

    if (!venue) {
      return res.status(404).json({ message: '场地不存在' });
    }

    // 检查是否有相关的活动
    const activities = await Activity.findAll({ where: { venue_id: id } });
    if (activities.length > 0) {
      return res.status(400).json({ 
        message: '该场地有关联的活动，无法删除',
        relatedCount: activities.length
      });
    }

    // 检查是否有相关的赛事
    const tournaments = await Tournament.findAll({ where: { venue_id: id } });
    if (tournaments.length > 0) {
      return res.status(400).json({ 
        message: '该场地有关联的赛事，无法删除',
        relatedCount: tournaments.length
      });
    }

    // 删除场地
    await venue.destroy();

    res.status(200).json({ message: '场地删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};