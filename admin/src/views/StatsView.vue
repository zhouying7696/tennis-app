<template>
  <div class="stats-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据分析</span>
        </div>
      </template>
      <div class="stats-grid">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <span class="icon-emoji">👥</span>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalUsers }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon activity-icon">
              <span class="icon-emoji">🎾</span>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalActivities }}</div>
              <div class="stat-label">活动总数</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon venue-icon">
              <span class="icon-emoji">📍</span>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalVenues }}</div>
              <div class="stat-label">场地总数</div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon tournament-icon">
              <span class="icon-emoji">🏆</span>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalTournaments }}</div>
              <div class="stat-label">赛事总数</div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="charts-container">
        <el-card class="chart-card">
          <template #header>
            <span>📈 用户增长趋势（近7天）</span>
          </template>
          <div class="chart-content">
            <div class="bar-chart">
              <div class="bar-item" v-for="(item, index) in userTrend" :key="index">
                <div class="bar" :style="{ height: item.count * 10 + 'px' }">
                  <span class="bar-value">{{ item.count }}</span>
                </div>
                <span class="bar-label">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="chart-card">
          <template #header>
            <span>🎯 用户水平分布</span>
          </template>
          <div class="chart-content">
            <div class="pie-chart">
              <div class="pie-circle" :style="pieStyle">
                <div class="pie-center">
                  <span class="pie-total">{{ stats.totalUsers }}</span>
                  <span class="pie-label">总用户</span>
                </div>
              </div>
              <div class="pie-legend">
                <div class="legend-item" v-for="(item, index) in levelDistribution" :key="index">
                  <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                  <span class="legend-label">{{ item.name }}</span>
                  <span class="legend-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="charts-container">
        <el-card class="chart-card">
          <template #header>
            <span>🏟️ 场地类型分布</span>
          </template>
          <div class="chart-content">
            <div class="pie-chart">
              <div class="pie-circle" :style="venuePieStyle">
                <div class="pie-center">
                  <span class="pie-total">{{ stats.totalVenues }}</span>
                  <span class="pie-label">总场地</span>
                </div>
              </div>
              <div class="pie-legend">
                <div class="legend-item" v-for="(item, index) in venueDistribution" :key="index">
                  <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                  <span class="legend-label">{{ item.name }}</span>
                  <span class="legend-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="chart-card">
          <template #header>
            <span>📅 活动状态分布</span>
          </template>
          <div class="chart-content">
            <div class="pie-chart">
              <div class="pie-circle" :style="activityPieStyle">
                <div class="pie-center">
                  <span class="pie-total">{{ stats.totalActivities }}</span>
                  <span class="pie-label">总活动</span>
                </div>
              </div>
              <div class="pie-legend">
                <div class="legend-item" v-for="(item, index) in activityDistribution" :key="index">
                  <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                  <span class="legend-label">{{ item.name }}</span>
                  <span class="legend-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  totalUsers: 0,
  totalActivities: 0,
  totalVenues: 0,
  totalTournaments: 0,
  usersByLevel: {},
  venuesByType: {},
  activitiesByStatus: {}
})

const userTrend = ref([
  { date: '周一', count: 5 },
  { date: '周二', count: 8 },
  { date: '周三', count: 12 },
  { date: '周四', count: 6 },
  { date: '周五', count: 15 },
  { date: '周六', count: 20 },
  { date: '周日', count: 18 }
])

const levelDistribution = computed(() => {
  const total = stats.value.totalUsers || 1
  const levels = stats.value.usersByLevel || {}
  return [
    { name: '初级', value: levels['初级'] || 0, color: '#67c23a' },
    { name: '中级', value: levels['中级'] || 0, color: '#409eff' },
    { name: '高级', value: levels['高级'] || 0, color: '#e6a23c' }
  ]
})

const venueDistribution = computed(() => {
  const total = stats.value.totalVenues || 1
  const types = stats.value.venuesByType || {}
  return [
    { name: '室内', value: types['室内'] || 0, color: '#409eff' },
    { name: '室外', value: types['室外'] || 0, color: '#67c23a' },
    { name: '综合', value: types['综合'] || 0, color: '#e6a23c' }
  ]
})

const activityDistribution = computed(() => {
  const statuses = stats.value.activitiesByStatus || {}
  return [
    { name: '进行中', value: statuses['active'] || 0, color: '#67c23a' },
    { name: '已结束', value: statuses['completed'] || 0, color: '#909399' }
  ]
})

const pieStyle = computed(() => {
  const levels = levelDistribution.value
  if (levels[0].value === 0 && levels[1].value === 0 && levels[2].value === 0) {
    return { background: conicGradient([{ percent: 33, color: '#67c23a' }, { percent: 33, color: '#409eff' }, { percent: 34, color: '#e6a23c' }]) }
  }
  const total = levels.reduce((sum, item) => sum + item.value, 0) || 1
  const p1 = (levels[0].value / total) * 100
  const p2 = (levels[1].value / total) * 100
  const p3 = 100 - p1 - p2
  return { background: conicGradient([{ percent: p1, color: '#67c23a' }, { percent: p1 + p2, color: '#409eff' }, { percent: 100, color: '#e6a23c' }]) }
})

const venuePieStyle = computed(() => {
  const venues = venueDistribution.value
  if (venues[0].value === 0 && venues[1].value === 0 && venues[2].value === 0) {
    return { background: conicGradient([{ percent: 33, color: '#409eff' }, { percent: 33, color: '#67c23a' }, { percent: 34, color: '#e6a23c' }]) }
  }
  const total = venues.reduce((sum, item) => sum + item.value, 0) || 1
  const p1 = (venues[0].value / total) * 100
  const p2 = (venues[1].value / total) * 100
  const p3 = 100 - p1 - p2
  return { background: conicGradient([{ percent: p1, color: '#409eff' }, { percent: p1 + p2, color: '#67c23a' }, { percent: 100, color: '#e6a23c' }]) }
})

const activityPieStyle = computed(() => {
  const activities = activityDistribution.value
  if (activities[0].value === 0 && activities[1].value === 0) {
    return { background: conicGradient([{ percent: 50, color: '#67c23a' }, { percent: 100, color: '#909399' }]) }
  }
  const total = activities.reduce((sum, item) => sum + item.value, 0) || 1
  const p1 = (activities[0].value / total) * 100
  return { background: conicGradient([{ percent: p1, color: '#67c23a' }, { percent: 100, color: '#909399' }]) }
})

function conicGradient(segments) {
  let current = 0
  const gradientParts = segments.map(seg => {
    const color = seg.color
    const start = current
    current += seg.percent
    return `${color} ${start}% ${current}%`
  })
  return `conic-gradient(${gradientParts.join(', ')})`
}

const getStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const [usersRes, activitiesRes, venuesRes, tournamentsRes] = await Promise.all([
      axios.get('/api/stats/users', { headers }),
      axios.get('/api/stats/activities', { headers }),
      axios.get('/api/stats/venues', { headers }),
      axios.get('/api/stats/tournaments', { headers })
    ])

    const usersByLevel = {}
    ;(usersRes.data.userLevels || []).forEach(u => {
      usersByLevel[u.level] = u.count
    })

    const venuesByType = {}
    ;(venuesRes.data.venueTypes || []).forEach(v => {
      venuesByType[v.type] = v.count
    })

    const activitiesByStatus = {}
    ;(activitiesRes.data.activityStatuses || []).forEach(a => {
      activitiesByStatus[a.status] = a.count
    })

    stats.value = {
      totalUsers: usersRes.data.totalUsers || 0,
      totalActivities: activitiesRes.data.totalActivities || 0,
      totalVenues: venuesRes.data.totalVenues || 0,
      totalTournaments: tournamentsRes.data.totalTournaments || 0,
      usersByLevel,
      venuesByType,
      activitiesByStatus
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  getStats()
})
</script>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
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
  margin-right: 20px;
}

.icon-emoji {
  font-size: 28px;
}

.user-icon {
  background-color: #e8f7ef;
}

.activity-icon {
  background-color: #fff3e8;
}

.venue-icon {
  background-color: #e8f0ff;
}

.tournament-icon {
  background-color: #f3e8ff;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  height: 320px;
}

.chart-content {
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  padding: 10px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 60px;
}

.bar {
  width: 30px;
  background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 20px;
  transition: height 0.3s;
}

.bar-value {
  font-size: 12px;
  color: white;
  font-weight: bold;
  padding-top: 4px;
}

.bar-label {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 30px;
}

.pie-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pie-center {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
}

.pie-total {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.pie-label {
  font-size: 12px;
  color: #999;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 14px;
  color: #666;
  min-width: 40px;
}

.legend-value {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .pie-chart {
    flex-direction: column;
  }
}
</style>
