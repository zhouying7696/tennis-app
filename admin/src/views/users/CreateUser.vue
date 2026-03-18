<template>
  <div class="create-user-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建用户</span>
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
        <el-form-item label="密码">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="userForm.confirmPassword" type="password" placeholder="请确认密码" />
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
          <el-button type="primary" @click="submitForm">创建用户</el-button>
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

const userForm = ref({
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  level: '初级',
  status: 'active',
  role: 'user'
})

const loading = ref(false)

const goBack = () => {
  router.push('/users')
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
  if (!userForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  // 密码正则验证
  const passwordRegex = /^\w{6,20}$/
  if (!passwordRegex.test(userForm.value.password)) {
    ElMessage.error('密码长度应为6-20位，包含字母、数字或下划线')
    return
  }
  if (userForm.value.password !== userForm.value.confirmPassword) {
    ElMessage.error('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    await axios.post('/api/users', {
      nickname: userForm.value.nickname,
      phone: userForm.value.phone,
      password: userForm.value.password,
      level: userForm.value.level,
      status: userForm.value.status
    })
    ElMessage.success('用户创建成功')
    // 跳转回用户列表
    goBack()
  } catch (error) {
    const errorMessage = error.response?.data?.message || '创建用户失败';
    const errorDetails = error.response?.data?.error || '';
    ElMessage.error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  userForm.value = {
    nickname: '',
    phone: '',
    password: '',
    confirmPassword: '',
    level: '初级',
    status: 'active',
    role: 'user'
  }
}
</script>

<style scoped>
.create-user-container {
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
