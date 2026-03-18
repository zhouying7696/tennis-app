<template>
  <div v-if="$route.path === '/login'">
    <router-view />
  </div>
  <div v-else class="app-wrapper">
    <el-container class="app-container">
      <el-header height="60px" class="app-header">
        <div class="header-left">
          <h1>TENFUN 后台管理系统</h1>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small">{{ user.nickname.charAt(0) }}</el-avatar>
              <span style="margin-left: 10px;">{{ user.nickname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showProfileDialog">👤 个人中心</el-dropdown-item>
                <el-dropdown-item @click="logout">🚪 退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="app-aside">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            router
          >
            <el-menu-item index="/">
              <span style="font-size: 20px; margin-right: 8px;">🏠</span>
              <span>首页</span>
            </el-menu-item>
            <el-sub-menu index="users">
              <template #title>
                <span style="font-size: 20px; margin-right: 8px;">👥</span>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/users">👤 用户列表</el-menu-item>
              <el-menu-item index="/users/create">✨ 创建用户</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="activities">
              <template #title>
                <span style="font-size: 20px; margin-right: 8px;">🎾</span>
                <span>活动管理</span>
              </template>
              <el-menu-item index="/activities">📅 活动列表</el-menu-item>
              <el-menu-item index="/activities/create">✨ 创建活动</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="venues">
              <template #title>
                <span style="font-size: 20px; margin-right: 8px;">📍</span>
                <span>场地管理</span>
              </template>
              <el-menu-item index="/venues">🏟️ 场地列表</el-menu-item>
              <el-menu-item index="/venues/create">✨ 创建场地</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="tournaments">
              <template #title>
                <span style="font-size: 20px; margin-right: 8px;">🏆</span>
                <span>赛事管理</span>
              </template>
              <el-menu-item index="/tournaments">🎖️ 赛事列表</el-menu-item>
              <el-menu-item index="/tournaments/create">✨ 创建赛事</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/stats">
              <span style="font-size: 20px; margin-right: 8px;">📊</span>
              <span>数据分析</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="app-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <el-dialog v-model="profileDialogVisible" title="个人中心 - 修改密码" width="400px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword" :loading="passwordLoading">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const user = ref(JSON.parse(localStorage.getItem('user')) || { nickname: '管理员' })

const profileDialogVisible = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordLoading = ref(false)

const showProfileDialog = () => {
  profileDialogVisible.value = true
}

const changePassword = async () => {
  if (!passwordForm.value.oldPassword) {
    ElMessage.error('请输入原密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    ElMessage.error('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    ElMessage.error('新密码长度不能少于6位')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  passwordLoading.value = true
  try {
    const token = localStorage.getItem('token')
    await axios.put('/api/users/change-password', {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    ElMessage.success('密码修改成功')
    profileDialogVisible.value = false
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    logout()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

const activeMenu = computed(() => {
  const path = route.path
  if (path === '/') return '/'  
  return path.split('/')[1]
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>

<style>
.app-wrapper {
  height: 100vh;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  overflow: hidden;
}

.app-header {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.app-aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.el-menu-vertical-demo {
  height: 100%;
}

.app-main {
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
  width: 100%;
  box-sizing: border-box;
}

.app-main > * {
  max-width: 100%;
  box-sizing: border-box;
}

.el-table {
  width: 100% !important;
  font-size: 14px;
}

.el-table__inner-wrapper {
  width: 100% !important;
}

.el-table__header-wrapper {
  width: 100% !important;
}

.el-table__body-wrapper {
  width: 100% !important;
}

.el-card {
  width: 100%;
  box-sizing: border-box;
}

.el-card__body {
  width: 100%;
  box-sizing: border-box;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

@media screen and (max-width: 768px) {
  .app-main {
    padding: 10px;
  }
  
  .el-table {
    font-size: 12px;
    min-width: 600px;
  }
  
  .el-table .el-table__cell {
    padding: 6px 4px;
  }
  
  .el-pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .el-menu-vertical-demo {
    width: 180px !important;
  }
  
  .el-aside {
    width: 180px !important;
  }
}

@media screen and (min-width: 1920px) {
  .app-main {
    padding: 30px 60px;
  }
  
  .el-card {
    max-width: 100%;
  }
  
  .el-table {
    min-width: 800px;
  }
}

@media (min-width: 1200px) and (max-width: 1400px) {
  .el-table {
    min-width: 700px;
  }
}
</style>
