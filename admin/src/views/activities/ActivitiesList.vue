<template>
  <div class="activities-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>活动管理</span>
          <el-button type="primary" @click="goToCreateActivity">创建活动</el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索活动"
          prefix-icon="i-ep-search"
          style="width: 300px"
          @keyup.enter="searchActivities"
        />
        <el-select v-model="statusFilter" placeholder="活动状态" style="width: 150px" @change="searchActivities">
          <el-option label="全部" value="" />
          <el-option label="进行中" value="active" />
          <el-option label="已结束" value="completed" />
        </el-select>
        <el-button type="primary" @click="searchActivities">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="table-wrapper">
        <el-table :data="activities" style="width: 100%; min-width: 1200px;">
          <el-table-column type="index" label="序号" width="100" fixed></el-table-column>
          <el-table-column prop="id" label="活动ID" width="150"></el-table-column>
          <el-table-column prop="title" label="活动名称" width="350"></el-table-column>
          <el-table-column prop="date" label="日期" width="150"></el-table-column>
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="venue" label="场地" width="250"></el-table-column>
          <el-table-column prop="status" label="状态" width="150">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
                {{ scope.row.status === 'active' ? '进行中' : '已结束' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editActivity(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteActivity(scope.row.id)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const activities = ref([])

const tableHeight = ref(500)

const updateTableHeight = () => {
  const windowHeight = window.innerHeight
  tableHeight.value = windowHeight - 280
}

const goToCreateActivity = () => {
  router.push('/activities/create')
}

const getActivities = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/activities', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchQuery.value,
        status: statusFilter.value
      }
    })
    activities.value = response.data.activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      date: activity.date,
      time: `${activity.start_time}-${activity.end_time}`,
      venue: activity.venue?.name || '未知场地',
      status: activity.status
    }))
    total.value = response.data.total
  } catch (error) {
    console.error('获取活动列表失败:', error)
  } finally {
    loading.value = false
  }
}

const searchActivities = () => {
  currentPage.value = 1
  getActivities()
}

const resetSearch = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  getActivities()
}

const editActivity = (activity) => {
  router.push(`/activities/edit/${activity.id}`)
}

const deleteActivity = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个活动吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await axios.delete(`/api/activities/${id}`)
    ElMessage.success('活动删除成功')
    // 刷新活动列表
    getActivities()
  } catch (error) {
    if (error.message !== 'cancel') {
      ElMessage.error('删除活动失败')
    }
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  // 模拟分页
  console.log('每页条数:', size)
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  // 模拟分页
  console.log('当前页码:', current)
}

onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
  getActivities()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})
</script>

<style scoped>
.activities-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
