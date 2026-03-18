const bcrypt = require('bcryptjs');

// 加密密码
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 验证密码
exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};