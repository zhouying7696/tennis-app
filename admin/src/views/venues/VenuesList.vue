<template>
  <div class="venues-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>场地管理</span>
          <el-button type="primary" @click="goToCreateVenue">创建场地</el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索场地"
          prefix-icon="i-ep-search"
          style="width: 300px"
          @keyup.enter="searchVenues"
        />
        <el-button type="primary" @click="searchVenues">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <div class="table-wrapper">
        <el-table :data="venues" style="width: 100%; min-width: 1200px;" v-loading="loading">
          <el-table-column type="index" label="序号" width="100" fixed></el-table-column>
          <el-table-column prop="id" label="场地ID" width="150"></el-table-column>
          <el-table-column prop="name" label="场地名称" width="250"></el-table-column>
          <el-table-column prop="address" label="地址" width="350"></el-table-column>
          <el-table-column prop="court_type" label="场地类型" width="150"></el-table-column>
          <el-table-column prop="price" label="价格(元/小时)" width="180">
            <template #default="scope">
              ¥{{ scope.row.price }}/小时
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editVenue(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteVenue(scope.row.id)">删除</el-button>
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
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const venues = ref([])

const tableHeight = ref(500)

const updateTableHeight = () => {
  const windowHeight = window.innerHeight
  tableHeight.value = windowHeight - 280
}

const getVenues = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/venues', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchQuery.value
      }
    })
    venues.value = response.data.venues
    total.value = response.data.total
  } catch (error) {
    console.error('获取场地列表失败:', error)
    ElMessage.error('获取场地列表失败')
  } finally {
    loading.value = false
  }
}

const goToCreateVenue = () => {
  router.push('/venues/create')
}

const searchVenues = () => {
  currentPage.value = 1
  getVenues()
}

const resetSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  getVenues()
}

const editVenue = (venue) => {
  router.push(`/venues/edit/${venue.id}`)
}

const deleteVenue = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个场地吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete(`/api/venues/${id}`)
    ElMessage.success('删除成功')
    getVenues()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除场地失败:', error)
      ElMessage.error('删除场地失败')
    }
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  getVenues()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  getVenues()
}

onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
  getVenues()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})
</script>

<style scoped>
.venues-container {
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
