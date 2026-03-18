<template>
  <div class="login-container">
    <div class="login-background">
      <div class="tennis-ball"></div>
      <div class="tennis-ball ball-2"></div>
      <div class="tennis-ball ball-3"></div>
      
      <!-- 网球元素 -->
      <div class="tennis-element">🎾</div>
      <div class="tennis-element">🎾</div>
      <div class="tennis-element">🎾</div>
      <div class="tennis-element">🎾</div>
      <div class="tennis-element">🎾</div>
      <div class="tennis-element">🎾</div>
      
      <!-- 网球拍装饰 -->
      <div class="tennis-racket racket-1">🎾</div>
      <div class="tennis-racket racket-2">🎾</div>
    </div>
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <div class="logo">
            <div class="logo-icon">🎾</div>
            <span>TENFUN</span>
          </div>
          <h2>管理员登录</h2>
        </div>
      </template>
      <el-form :model="loginForm" label-width="80px" style="max-width: 400px;" @submit.prevent="submitForm">
        <el-form-item label="手机号">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号" @keyup.enter="submitForm">
            <template #prefix>
              <el-icon><i-ep-phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter="submitForm">
            <template #prefix>
              <el-icon><i-ep-lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading" style="width: 100%">
            <el-icon><i-ep-right /></el-icon>
            登录
          </el-button>
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

const loginForm = ref({
  phone: '',
  password: ''
})

const loading = ref(false)

const submitForm = async () => {
  // 表单验证
  if (!loginForm.value.phone) {
    ElMessage.error('请输入手机号')
    return
  }
  if (!loginForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }

  loading.value = true
  try {
    console.log('准备发送登录请求:', {
      phone: loginForm.value.phone,
      password: loginForm.value.password
    })
    
    const response = await axios.post('/api/auth/login', {
      phone: loginForm.value.phone,
      password: loginForm.value.password
    })
    
    console.log('登录请求成功:', response.data)
    
    // 检查用户角色
    if (response.data.user.role !== 'admin') {
      ElMessage.error('只有管理员才能登录管理后台')
      return
    }
    
    // 存储token
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    ElMessage.success('登录成功')
    // 跳转回首页
    router.push('/')
  } catch (error) {
    console.error('登录错误:', error)
    console.error('错误响应:', error.response)
    const errorMessage = error.response?.data?.message || '登录失败'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tennis%20court%20realistic%20photo%20top%20view%20deep%20blue%20hard%20court%20with%20white%20lines%20and%20net%20professional%20quality&image_size=landscape_16_9') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.3); /* 半透明黑色叠加，使登录框更清晰 */
}

/* 网球场地效果增强 */
.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(25, 118, 210, 0.2) 0%,
    rgba(33, 150, 243, 0.2) 100%
  );
  z-index: -1;
}

/* 网球元素 */
.tennis-element {
  position: absolute;
  font-size: 24px;
  opacity: 0.2;
  animation: float 6s infinite ease-in-out;
  color: white;
}

.tennis-element:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.tennis-element:nth-child(2) {
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.tennis-element:nth-child(3) {
  bottom: 30%;
  left: 15%;
  animation-delay: 2s;
}

.tennis-element:nth-child(4) {
  bottom: 10%;
  right: 10%;
  animation-delay: 3s;
}

.tennis-element:nth-child(5) {
  top: 50%;
  left: 5%;
  animation-delay: 4s;
}

.tennis-element:nth-child(6) {
  top: 40%;
  right: 5%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(0) rotate(180deg);
  }
  75% {
    transform: translateY(20px) rotate(270deg);
  }
}

.tennis-ball {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, white 0%, white 40%, #2196f3 40%, #2196f3 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: bounce 8s infinite ease-in-out;
}

.tennis-ball::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: white;
}

.tennis-ball::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, transparent 0%, transparent 35%, rgba(0, 0, 0, 0.1) 35%, rgba(0, 0, 0, 0.1) 100%);
}

.ball-2 {
  top: 20%;
  right: 10%;
  width: 60px;
  height: 60px;
  animation-delay: -2s;
  animation-duration: 10s;
}

.ball-3 {
  bottom: 20%;
  left: 10%;
  width: 40px;
  height: 40px;
  animation-delay: -4s;
  animation-duration: 12s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) rotate(90deg);
  }
  50% {
    transform: translateY(0) rotate(180deg);
  }
  75% {
    transform: translateY(30px) rotate(270deg);
  }
}

.login-card {
  width: 450px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  background: white;
  backdrop-filter: blur(10px);
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  color: #1976d2;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 40px;
  margin-right: 15px;
  animation: rotate 4s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.logo span {
  font-size: 28px;
  font-weight: bold;
  color: #1976d2;
  font-family: 'Arial', sans-serif;
}

.card-header h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
  font-weight: 600;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  border-radius: 8px;
}

.el-input__wrapper {
  box-shadow: none;
}

.el-input__prefix {
  color: #1976d2;
}

.el-button {
  border-radius: 8px;
  font-size: 16px;
  padding: 12px;
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.el-button:hover {
  background-color: #1565c0;
  border-color: #1565c0;
  transform: translateY(-2px);
}

.el-button:active {
  background-color: #0d47a1;
  border-color: #0d47a1;
}

/* 网球拍装饰 */
.tennis-racket {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.1;
  animation: spin 10s infinite linear;
  color: white;
}

.racket-1 {
  top: 15%;
  right: 20%;
}

.racket-2 {
  bottom: 15%;
  left: 20%;
  animation-direction: reverse;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>