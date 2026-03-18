<template>
  <div class="create-activity-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建活动</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>
      <el-form :model="activityForm" label-width="120px" style="max-width: 600px;">
        <el-form-item label="活动名称">
          <el-input v-model="activityForm.title" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="activityForm.type" placeholder="请选择活动类型">
            <el-option label="友谊赛" value="友谊赛" />
            <el-option label="训练" value="训练" />
            <el-option label="比赛" value="比赛" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期">
          <el-date-picker v-model="activityForm.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker v-model="activityForm.startTime" placeholder="选择开始时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker v-model="activityForm.endTime" placeholder="选择结束时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="活动场地">
          <el-select v-model="activityForm.venue_id" placeholder="请选择场地">
            <el-option v-for="venue in venues" :key="venue.id" :label="venue.name" :value="venue.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型">
          <el-select v-model="activityForm.fee_type" placeholder="请选择费用类型">
            <el-option label="免费" value="free" />
            <el-option label="AA制" value="aa" />
            <el-option label="固定费用" value="fixed" />
          </el-select>
        </el-form-item>
        <el-form-item label="参与人数">
          <el-input v-model="activityForm.max_players" type="number" placeholder="请输入最大参与人数" />
        </el-form-item>
        <el-form-item label="水平要求">
          <el-select v-model="activityForm.level" placeholder="请选择水平要求">
            <el-option label="不限" value="不限" />
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
        </el-form-item>
        <el-form-item label="收取费用">
          <el-switch v-model="activityForm.feeEnabled" />
        </el-form-item>
        <el-form-item label="费用金额" v-if="activityForm.feeEnabled">
          <el-input v-model="activityForm.fee" type="number" placeholder="请输入费用金额" />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="activityForm.description" type="textarea" placeholder="请输入活动描述" :rows="4" />
        </el-form-item>
        <el-form-item label="活动规则">
          <el-input v-model="activityForm.rules" type="textarea" placeholder="请输入活动规则" :rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">创建活动</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

const activityForm = ref({
  title: '',
  type: '友谊赛',
  date: new Date(),
  startTime: new Date(),
  endTime: new Date(),
  venue_id: '',
  max_players: 4,
  level: '不限',
  feeEnabled: false,
  fee: 0,
  fee_type: 'free',
  description: '',
  rules: ''
})

const venues = ref([])
const loading = ref(false)

const goBack = () => {
  router.push('/activities')
}

const getVenues = async () => {
  try {
    const response = await axios.get('/api/venues')
    venues.value = response.data.venues
  } catch (error) {
    console.error('获取场地列表失败:', error)
  }
}

const submitForm = async () => {
  // 表单验证
  if (!activityForm.value.title) {
    ElMessage.error('请输入活动名称')
    return
  }
  if (!activityForm.value.date) {
    ElMessage.error('请选择活动日期')
    return
  }
  if (!activityForm.value.startTime) {
    ElMessage.error('请选择开始时间')
    return
  }
  if (!activityForm.value.endTime) {
    ElMessage.error('请选择结束时间')
    return
  }
  if (!activityForm.value.venue_id) {
    ElMessage.error('请选择活动场地')
    return
  }
  if (!activityForm.value.max_players) {
    ElMessage.error('请输入最大参与人数')
    return
  }

  loading.value = true
  try {
    // 格式化日期和时间
    const date = activityForm.value.date.toISOString().split('T')[0]
    const startTime = activityForm.value.startTime.toTimeString().split(' ')[0]
    const endTime = activityForm.value.endTime.toTimeString().split(' ')[0]

    await axios.post('/api/activities', {
      title: activityForm.value.title,
      type: activityForm.value.type,
      date: date,
      start_time: startTime,
      end_time: endTime,
      venue_id: activityForm.value.venue_id,
      max_players: activityForm.value.max_players,
      level: activityForm.value.level,
      fee: activityForm.value.fee,
      fee_type: activityForm.value.fee_type,
      description: activityForm.value.description,
      rules: activityForm.value.rules
    }, {
      headers: {
        // 这里需要添加认证token，暂时使用模拟token
        Authorization: 'Bearer mock_token'
      }
    })
    ElMessage.success('活动创建成功')
    // 跳转回活动列表
    goBack()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '创建活动失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  activityForm.value = {
    title: '',
    type: '友谊赛',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    venue_id: '',
    max_players: 4,
    level: '不限',
    feeEnabled: false,
    fee: 0,
    fee_type: 'free',
    description: '',
    rules: ''
  }
}

onMounted(() => {
  getVenues()
})
</script>

<style scoped>
.create-activity-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
