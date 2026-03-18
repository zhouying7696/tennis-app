<template>
  <div class="edit-tournament-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑赛事</span>
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
        <el-form-item label="赛事状态">
          <el-select v-model="tournamentForm.status" placeholder="请选择赛事状态">
            <el-option label="进行中" value="active" />
            <el-option label="已结束" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">更新赛事</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const tournamentId = route.params.id

const tournamentForm = ref({
  title: '',
  startDate: new Date(),
  endDate: new Date(),
  venue_id: '',
  max_players: 32,
  fee: 100,
  description: '',
  status: 'active'
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

const getTournamentDetail = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/tournaments/${tournamentId}`)
    const tournament = response.data.tournament
    
    // 格式化日期
    const startDate = new Date(tournament.start_date)
    const endDate = new Date(tournament.end_date)
    
    tournamentForm.value = {
      title: tournament.title,
      startDate: startDate,
      endDate: endDate,
      venue_id: tournament.venue_id,
      max_players: tournament.max_players,
      fee: tournament.fee,
      description: tournament.description,
      status: tournament.status
    }
  } catch (error) {
    ElMessage.error('获取赛事信息失败')
    goBack()
  } finally {
    loading.value = false
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

    await axios.put(`/api/tournaments/${tournamentId}`, {
      title: tournamentForm.value.title,
      start_date: startDate,
      end_date: endDate,
      venue_id: tournamentForm.value.venue_id,
      max_players: tournamentForm.value.max_players,
      fee: tournamentForm.value.fee,
      description: tournamentForm.value.description,
      status: tournamentForm.value.status
    })
    ElMessage.success('赛事更新成功')
    // 跳转回赛事列表
    goBack()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '更新赛事失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  getTournamentDetail()
}

onMounted(() => {
  getVenues()
  getTournamentDetail()
})
</script>

<style scoped>
.edit-tournament-container {
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