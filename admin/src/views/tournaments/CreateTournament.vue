<template>
  <div class="create-tournament-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建赛事</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>
      <el-form :model="tournamentForm" label-width="120px" style="max-width: 600px;">
        <el-form-item label="赛事名称">
          <el-input v-model="tournamentForm.title" placeholder="请输入赛事名称" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="tournamentForm.startDate" type="date" placeholder="选择开始日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="tournamentForm.endDate" type="date" placeholder="选择结束日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="活动场地">
          <el-select v-model="tournamentForm.venue_id" placeholder="请选择场地">
            <el-option v-for="venue in venues" :key="venue.id" :label="venue.name" :value="venue.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="参赛人数">
          <el-input v-model="tournamentForm.max_players" type="number" placeholder="请输入最大参赛人数" />
        </el-form-item>
        <el-form-item label="报名费用">
          <el-input v-model="tournamentForm.fee" type="number" placeholder="请输入报名费用" />
        </el-form-item>
        <el-form-item label="赛事描述">
          <el-input v-model="tournamentForm.description" type="textarea" placeholder="请输入赛事描述" :rows="4" />
        </el-form-item>
        <el-form-item label="赛事规则">
          <el-input v-model="tournamentForm.rules" type="textarea" placeholder="请输入赛事规则" :rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">创建赛事</el-button>
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

const tournamentForm = ref({
  title: '',
  startDate: new Date(),
  endDate: new Date(),
  venue_id: '',
  max_players: 32,
  fee: 100,
  description: '',
  rules: ''
})

const venues = ref([])
const loading = ref(false)

const goBack = () => {
  router.push('/tournaments')
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
  if (!tournamentForm.value.title) {
    ElMessage.error('请输入赛事名称')
    return
  }
  if (!tournamentForm.value.startDate) {
    ElMessage.error('请选择开始日期')
    return
  }
  if (!tournamentForm.value.endDate) {
    ElMessage.error('请选择结束日期')
    return
  }
  if (!tournamentForm.value.venue_id) {
    ElMessage.error('请选择活动场地')
    return
  }
  if (!tournamentForm.value.max_players) {
    ElMessage.error('请输入最大参赛人数')
    return
  }

  loading.value = true
  try {
    // 格式化日期
    const startDate = tournamentForm.value.startDate.toISOString().split('T')[0]
    const endDate = tournamentForm.value.endDate.toISOString().split('T')[0]

    await axios.post('/api/tournaments', {
      title: tournamentForm.value.title,
      start_date: startDate,
      end_date: endDate,
      venue_id: tournamentForm.value.venue_id,
      max_players: tournamentForm.value.max_players,
      fee: tournamentForm.value.fee,
      description: tournamentForm.value.description
    })
    ElMessage.success('赛事创建成功')
    // 跳转回赛事列表
    goBack()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '创建赛事失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  tournamentForm.value = {
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    venue_id: '',
    max_players: 32,
    fee: 100,
    description: '',
    rules: ''
  }
}

onMounted(() => {
  getVenues()
})
</script>

<style scoped>
.create-tournament-container {
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
