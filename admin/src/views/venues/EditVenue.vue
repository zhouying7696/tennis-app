<template>
  <div class="edit-venue-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑场地</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>
      <el-form :model="venueForm" label-width="120px" style="max-width: 600px;" v-loading="loading">
        <el-form-item label="场地名称">
          <el-input v-model="venueForm.name" placeholder="请输入场地名称" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="venueForm.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="venueForm.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="venueForm.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="场地类型">
          <el-select v-model="venueForm.court_type" placeholder="请选择场地类型">
            <el-option label="硬地" value="硬地" />
            <el-option label="红土" value="红土" />
            <el-option label="草地" value="草地" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格(元/小时)">
          <el-input v-model="venueForm.price" type="number" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="venueForm.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">更新场地</el-button>
          <el-button @click="goBack">取消</el-button>
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
const venueId = route.params.id

const venueForm = ref({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  court_type: '硬地',
  price: '',
  description: ''
})

const loading = ref(true)
const submitLoading = ref(false)

const getVenueDetail = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/venues/${venueId}`)
    const venue = response.data.venue
    venueForm.value = {
      name: venue.name,
      address: venue.address,
      latitude: venue.latitude,
      longitude: venue.longitude,
      court_type: venue.court_type,
      price: venue.price,
      description: venue.description
    }
  } catch (error) {
    console.error('获取场地详情失败:', error)
    ElMessage.error('获取场地详情失败')
    goBack()
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/venues')
}

const submitForm = async () => {
  if (!venueForm.value.name) {
    ElMessage.error('请输入场地名称')
    return
  }
  if (!venueForm.value.address) {
    ElMessage.error('请输入地址')
    return
  }
  if (!venueForm.value.latitude || !venueForm.value.longitude) {
    ElMessage.error('请输入经纬度')
    return
  }

  submitLoading.value = true
  try {
    await axios.put(`/api/venues/${venueId}`, {
      name: venueForm.value.name,
      address: venueForm.value.address,
      latitude: venueForm.value.latitude,
      longitude: venueForm.value.longitude,
      court_type: venueForm.value.court_type,
      price: venueForm.value.price || 0,
      description: venueForm.value.description
    })
    ElMessage.success('场地更新成功')
    goBack()
  } catch (error) {
    console.error('更新场地失败:', error)
    ElMessage.error(error.response?.data?.message || '更新场地失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  getVenueDetail()
})
</script>

<style scoped>
.edit-venue-container {
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
