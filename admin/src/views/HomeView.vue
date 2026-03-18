<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1>🎾 TENFUN</h1>
        <p>后台管理系统</p>
      </div>
    </div>

    <div class="stats-grid">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon user-icon">
            <span class="icon-emoji">👥</span>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.users }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon activity-icon">
            <span class="icon-emoji">🎾</span>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.activities }}</div>
            <div class="stat-label">活动总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon venue-icon">
            <span class="icon-emoji">📍</span>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.venues }}</div>
            <div class="stat-label">场地总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon tournament-icon">
            <span class="icon-emoji">🏆</span>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.tournaments }}</div>
            <div class="stat-label">赛事总数</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="features-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>🎾 系统功能</span>
        </div>
      </template>
      <div class="features-grid">
        <div class="feature-item" @click="router.push('/users')">
          <span class="feature-icon">👥</span>
          <span>用户管理</span>
        </div>
        <div class="feature-item" @click="router.push('/activities')">
          <span class="feature-icon">🎾</span>
          <span>活动管理</span>
        </div>
        <div class="feature-item" @click="router.push('/venues')">
          <span class="feature-icon">📍</span>
          <span>场地管理</span>
        </div>
        <div class="feature-item" @click="router.push('/tournaments')">
          <span class="feature-icon">🏆</span>
          <span>赛事管理</span>
        </div>
        <div class="feature-item" @click="router.push('/stats')">
          <span class="feature-icon">📊</span>
          <span>数据分析</span>
        </div>
      </div>
    </el-card>

    <el-card class="recent-activities-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>📅 最近活动</span>
          <el-button type="primary" size="small" @click="goToActivities">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentActivities" style="width: 100%">
        <el-table-column prop="title" label="活动名称" width="300"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="venue" label="场地"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '进行中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

const user = ref({
  nickname: '管理员'
})

const stats = ref({
  users: 0,
  activities: 0,
  venues: 0,
  tournaments: 0
})

const recentActivities = ref([])

const loading = ref(false)

const getStats = async () => {
  loading.value = true
  try {
    const [usersRes, activitiesRes, venuesRes, tournamentsRes] = await Promise.all([
      axios.get('/api/users', { params: { limit: 1, role: 'user' } }),
      axios.get('/api/activities', { params: { limit: 1 } }),
      axios.get('/api/venues', { params: { limit: 1 } }),
      axios.get('/api/tournaments', { params: { limit: 1 } })
    ])

    stats.value = {
      users: usersRes.data.total || 0,
      activities: activitiesRes.data.total || 0,
      venues: venuesRes.data.total || 0,
      tournaments: tournamentsRes.data.total || 0
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const getRecentActivities = async () => {
  try {
    const response = await axios.get('/api/activities', {
      params: { limit: 5, page: 1, status: 'active' }
    })
    recentActivities.value = (response.data.activities || []).map(activity => ({
      title: activity.title,
      date: activity.date,
      time: activity.time,
      venue: activity.venue?.name || '未知场地',
      status: activity.status
    }))
  } catch (error) {
    console.error('获取最近活动失败:', error)
  }
}

const getUserInfo = () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  } catch (e) {
    console.error('Error parsing user:', e)
  }
}

const goToActivities = () => {
  router.push('/activities')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

onMounted(() => {
  getUserInfo()
  getStats()
  getRecentActivities()
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.hero-section {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.hero-content h1 {
  font-size: 48px;
  margin: 0;
  font-weight: 800;
  letter-spacing: 2px;
}

.hero-content p {
  font-size: 20px;
  margin: 10px 0 0 0;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  height: 120px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 20px;
}

.icon-emoji {
  font-size: 28px;
}

.user-icon {
  background-color: #e8f7ef;
  color: #1a6b3c;
}

.activity-icon {
  background-color: #fff3e8;
  color: #e8621a;
}

.venue-icon {
  background-color: #e8f0ff;
  color: #1a4eb8;
}

.tournament-icon {
  background-color: #f3e8ff;
  color: #6b1a8b;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.features-card {
  margin-top: 20px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.feature-item .el-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.feature-item span {
  font-size: 14px;
  font-weight: 600;
}

.recent-activities-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  line-height: 1.6;
}

.welcome-content ul {
  margin: 10px 0 0 20px;
}
</style>
