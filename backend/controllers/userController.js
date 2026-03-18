const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 获取用户信息
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        level: user.level,
        rating: user.rating,
        rating_count: user.rating_count,
        xp: user.xp
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const { nickname, avatar, level } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新用户信息
    if (nickname) user.nickname = nickname;
    if (avatar) user.avatar = avatar;
    if (level) user.level = level;

    await user.save();

    res.status(200).json({
      message: '更新成功',
      user: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        level: user.level,
        rating: user.rating,
        rating_count: user.rating_count,
        xp: user.xp
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取用户列表
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (search) {
      where[require('sequelize').Op.or] = [
        { nickname: { [require('sequelize').Op.like]: `%${search}%` } },
        { phone: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }
    if (role) {
      where.role = role;
    }
    
    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      users: rows.map(user => ({
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        level: user.level,
        status: user.status,
        role: user.role,
        created_at: user.created_at
      })),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 创建用户
exports.createUser = async (req, res) => {
  try {
    const { nickname, phone, password, level, status, role } = req.body;

    // 检查手机号是否已存在
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: '手机号已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      nickname,
      phone,
      password: hashedPassword,
      level: level || '初级',
      status: status || 'active',
      role: role || 'user'
    });

    res.status(201).json({
      message: '用户创建成功',
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        level: user.level,
        status: user.status,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 获取用户详情
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        level: user.level,
        status: user.status,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const { nickname, phone, level, status, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新用户信息
    if (nickname) user.nickname = nickname;
    if (phone) user.phone = phone;
    if (level) user.level = level;
    if (status) user.status = status;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({
      message: '更新成功',
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        level: user.level,
        status: user.status,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    await user.destroy();

    res.status(200).json({ message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: '请提供原密码和新密码' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '原密码错误' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};