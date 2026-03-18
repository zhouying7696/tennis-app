const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// 导入模型
const User = require('./models/User');
const Venue = require('./models/Venue');
const Activity = require('./models/Activity');
const Participation = require('./models/Participation');
const Tournament = require('./models/Tournament');
const TournamentParticipant = require('./models/TournamentParticipant');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const venueRoutes = require('./routes/venues');
const tournamentRoutes = require('./routes/tournaments');
const statsRoutes = require('./routes/stats');

// 配置环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/stats', statsRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 同步数据库模型
sequelize.sync({ force: false })
  .then(async () => {
    console.log('Database synchronized');
    
    // 创建默认管理员用户
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    
    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (!existingAdmin) {
      // 创建管理员用户
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        nickname: '管理员',
        phone: '13800138000',
        password: hashedPassword,
        level: '高级',
        role: 'admin',
        status: 'active'
      });
      console.log('默认管理员用户创建成功');
      console.log('手机号: 13800138000');
      console.log('密码: admin123');
    }
    
    // 启动服务器
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });