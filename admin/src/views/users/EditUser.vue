<template>
  <div class="edit-user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑用户</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>
      <el-form :model="userForm" label-width="120px" style="max-width: 600px;">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="水平">
          <el-select v-model="userForm.level" placeholder="请选择水平">
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="userForm.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="userForm.role" placeholder="请选择用户类型">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">更新用户</el-button>
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
const userId = route.params.id

const userForm = ref({
  nickname: '',
  phone: '',
  level: '初级',
  status: 'active',
  role: 'user'
})

const loading = ref(false)

const goBack = () => {
  router.push('/users')
}

const getuserDetail = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/users/${userId}`)
    userForm.value = {
      nickname: response.data.user.nickname,
      phone: response.data.user.phone,
      level: response.data.user.level,
      status: response.data.user.status,
      role: response.data.user.role
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
    goBack()
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  // 表单验证
  if (!userForm.value.nickname) {
    ElMessage.error('请输入昵称')
    return
  }
  if (!userForm.value.phone) {
    ElMessage.error('请输入手机号')
    return
  }
  // 手机号正则验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(userForm.value.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  loading.value = true
  try {
    await axios.put(`/api/users/${userId}`, {
      nickname: userForm.value.nickname,
      phone: userForm.value.phone,
      level: userForm.value.level,
      status: userForm.value.status,
      role: userForm.value.role
    })
    ElMessage.success('用户更新成功')
    // 跳转回用户列表
    goBack()
  } catch (error) {
    const errorMessage = error.response?.data?.message || '更新用户失败';
    const errorDetails = error.response?.data?.error || '';
    ElMessage.error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  getuserDetail()
}

onMounted(() => {
  getuserDetail()
})
</script>

<style scoped>
.edit-user-container {
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