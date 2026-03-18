<template>
  <div class="create-venue-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建场地</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>
      <el-form :model="venueForm" label-width="120px" style="max-width: 600px;">
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
          <el-button type="primary" @click="submitForm" :loading="loading">创建场地</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

const venueForm = ref({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  court_type: '硬地',
  price: '',
  description: ''
})

const loading = ref(false)

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

  loading.value = true
  try {
    await axios.post('/api/venues', {
      name: venueForm.value.name,
      address: venueForm.value.address,
      latitude: venueForm.value.latitude,
      longitude: venueForm.value.longitude,
      court_type: venueForm.value.court_type,
      price: venueForm.value.price || 0,
      description: venueForm.value.description
    })
    ElMessage.success('场地创建成功')
    goBack()
  } catch (error) {
    console.error('创建场地失败:', error)
    ElMessage.error(error.response?.data?.message || '创建场地失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  venueForm.value = {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    court_type: '硬地',
    price: '',
    description: ''
  }
}
</script>

<style scoped>
.create-venue-container {
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
