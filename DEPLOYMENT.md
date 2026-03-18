# 网球约球小程序系统部署和使用说明

## 系统架构

- **前端**：微信小程序（原生框架）
- **后端**：Node.js + Express
- **数据库**：SQLite（嵌入式）
- **管理后台**：Vue 3 + Element Plus

## 部署步骤

### 1. 后端部署

1. **安装依赖**
   ```bash
   cd backend
   npm install
   ```

2. **启动服务器**
   ```bash
   npm start
   ```
   服务器将在 http://localhost:3000 运行

### 2. 管理后台部署

1. **安装依赖**
   ```bash
   cd admin
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   管理后台将在 http://localhost:3000 运行

3. **构建生产版本**
   ```bash
   npm run build
   ```
   构建产物将在 `dist` 目录中

### 3. 微信小程序部署

1. **在微信开发者工具中导入项目**
   - 打开微信开发者工具
   - 选择「导入项目」
   - 选择 `wechat-miniprogram` 目录
   - 填写 AppID（如果没有，可以使用测试号）

2. **配置小程序**
   - 在 `app.json` 中配置页面路径
   - 在 `request.js` 中配置 API 基础路径

3. **预览和发布**
   - 点击「预览」按钮生成二维码
   - 使用微信扫描二维码查看效果
   - 发布前需要在微信公众平台提交审核

## 系统功能

### 后端 API 接口

- **认证相关**
  - POST /api/auth/register - 用户注册
  - POST /api/auth/login - 用户登录
  - GET /api/auth/me - 获取当前用户信息

- **用户相关**
  - GET /api/users - 获取用户列表
  - GET /api/users/:id - 获取用户详情
  - PUT /api/users/:id - 更新用户信息
  - DELETE /api/users/:id - 删除用户

- **活动相关**
  - GET /api/activities - 获取活动列表
  - POST /api/activities - 创建活动
  - GET /api/activities/:id - 获取活动详情
  - PUT /api/activities/:id - 更新活动
  - DELETE /api/activities/:id - 删除活动
  - POST /api/activities/:id/join - 参加活动
  - POST /api/activities/:id/leave - 退出活动

- **场地相关**
  - GET /api/venues - 获取场地列表
  - POST /api/venues - 创建场地
  - GET /api/venues/:id - 获取场地详情
  - PUT /api/venues/:id - 更新场地
  - DELETE /api/venues/:id - 删除场地

- **赛事相关**
  - GET /api/tournaments - 获取赛事列表
  - POST /api/tournaments - 创建赛事
  - GET /api/tournaments/:id - 获取赛事详情
  - PUT /api/tournaments/:id - 更新赛事
  - DELETE /api/tournaments/:id - 删除赛事
  - POST /api/tournaments/:id/join - 参加赛事

- **统计相关**
  - GET /api/stats - 获取系统统计数据
  - GET /api/stats/user/:id - 获取用户统计数据

### 管理后台功能

- **用户管理**：查看、编辑、删除用户
- **活动管理**：查看、创建、编辑、删除活动
- **场地管理**：查看、创建、编辑、删除场地
- **赛事管理**：查看、创建、编辑、删除赛事
- **统计分析**：查看系统统计数据

### 微信小程序功能

- **首页**：查看活动列表、搜索和筛选活动
- **创建活动**：创建新的约球活动
- **活动详情**：查看活动详情、参加/退出活动
- **个人中心**：查看个人信息、活动记录、统计数据

## 技术栈

- **后端**：Node.js, Express, Sequelize, SQLite, JWT
- **前端（管理后台）**：Vue 3, Vue Router, Element Plus, Axios
- **前端（微信小程序）**：原生小程序框架

## 注意事项

1. **数据库**：使用 SQLite 作为嵌入式数据库，无需额外配置
2. **API 地址**：小程序中需要根据实际部署地址修改 API 基础路径
3. **微信小程序审核**：发布前需要确保内容符合微信小程序审核规范
4. **安全**：生产环境中需要配置合适的 CORS 策略和 JWT 密钥

## 开发环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- 微信开发者工具
- 浏览器（管理后台）

## 故障排除

1. **后端启动失败**：检查端口是否被占用，检查依赖是否安装完整
2. **数据库连接失败**：确保 sqlite3 包已正确安装
3. **小程序无法连接 API**：检查网络连接，确保 API 地址配置正确
4. **管理后台无法访问**：检查开发服务器是否启动，检查端口是否被占用

## 联系信息

如有问题，请联系系统管理员。