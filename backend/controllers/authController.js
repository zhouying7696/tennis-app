const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../middleware/auth');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { nickname, phone, password, level } = req.body;

    // 检查手机号是否已存在
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: '手机号已被注册' });
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = await User.create({
      nickname,
      phone,
      password: hashedPassword,
      level: level || 'beg'
    });

    // 生成令牌
    const token = generateToken(user);

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        level: user.level,
        rating: user.rating,
        xp: user.xp,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(400).json({ message: '手机号或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '手机号或密码错误' });
    }

    // 生成令牌
    const token = generateToken(user);

    res.status(200).json({
      message: '登录成功',
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        level: user.level,
        rating: user.rating,
        xp: user.xp,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};