<template>
  <div class="users-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="goToCreateUser">创建用户</el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户"
          prefix-icon="i-ep-search"
          style="width: 300px"
          @keyup.enter="searchUsers"
        />
        <el-button type="primary" @click="searchUsers">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="table-wrapper">
        <el-table :data="users" style="width: 100%; min-width: 1200px;" :max-height="tableHeight">
          <el-table-column type="index" label="序号" width="100" fixed></el-table-column>
          <el-table-column prop="id" label="用户ID" width="150"></el-table-column>
          <el-table-column prop="nickname" label="昵称" width="200"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
          <el-table-column prop="level" label="水平" width="150">
            <template #default="scope">
              <el-tag :type="getLevelType(scope.row.level)">
                {{ scope.row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="用户类型" width="150">
            <template #default="scope">
              <el-tag :type="scope.row.role === 'admin' ? 'warning' : 'info'">
                {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" min-width="200"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="toggleUserStatus(scope.row)">
                {{ scope.row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const loading = ref(false)
const users = ref([])

const tableHeight = ref(500)

const updateTableHeight = () => {
  const windowHeight = window.innerHeight
  tableHeight.value = windowHeight - 280
}

const goToCreateUser = () => {
  router.push('/users/create')
}

const getUsers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/users', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchQuery.value
      }
    })
    users.value = response.data.users || []
    total.value = response.data.total || users.value.length
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const searchUsers = () => {
  currentPage.value = 1
  getUsers()
}

const resetSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  getUsers()
}

const editUser = (user) => {
  router.push(`/users/edit/${user.id}`)
}

const toggleUserStatus = async (user) => {
  try {
    await axios.put(`/api/users/${user.id}`, {
      status: user.status === 'active' ? 'inactive' : 'active'
    })
    // 刷新用户列表
    getUsers()
  } catch (error) {
    console.error('切换用户状态失败:', error)
    const errorMessage = error.response?.data?.message || '切换用户状态失败';
    const errorDetails = error.response?.data?.error || '';
    ElMessage.error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`)
  }
}

const getLevelType = (level) => {
  const levelMap = {
    '初级': 'info',
    '中级': 'success',
    '高级': 'warning'
  }
  return levelMap[level] || 'info'
}

const handleSizeChange = (size) => {
  pageSize.value = size
  getUsers()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  getUsers()
}

onMounted(() => {
  getUsers()
})
</script>

<style scoped>
.users-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
