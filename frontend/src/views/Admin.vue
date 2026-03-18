<template>
  <div class="admin-page">
    <h2>管理后台</h2>
    
    <div class="admin-container">
      <div class="admin-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          用户管理
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'scores' }"
          @click="activeTab = 'scores'"
        >
          分数管理
        </button>
      </div>
      
      <div v-if="activeTab === 'users'" class="admin-section">
        <h3>用户列表</h3>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="users.length === 0" class="empty-state">暂无用户数据</div>
        <div v-else class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>角色</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>
                  <span class="role-badge" :class="user.role">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>
                  <button 
                    v-if="user.role === 'user'"
                    class="action-btn ban-btn"
                    @click="banUser(user.id)"
                  >
                    封禁
                  </button>
                  <button 
                    v-if="user.role === 'banned'"
                    class="action-btn unban-btn"
                    @click="unbanUser(user.id)"
                  >
                    解封
                  </button>
                  <span v-if="user.role === 'admin'" class="action-text">管理员</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="totalPages > 1" class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <div class="pagination-info">
            第 {{ currentPage }} / {{ totalPages }} 页
          </div>
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
      
      <div v-if="activeTab === 'scores'" class="admin-section">
        <h3>分数列表</h3>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="scores.length === 0" class="empty-state">暂无分数数据</div>
        <div v-else class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>分数</th>
                <th>存活时间</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in scores" :key="score.id">
                <td>{{ score.id }}</td>
                <td>{{ score.User?.username }}</td>
                <td>{{ score.score }}</td>
                <td>{{ score.survival_time }}秒</td>
                <td>{{ formatDate(score.created_at) }}</td>
                <td>
                  <button 
                    class="action-btn delete-btn"
                    @click="deleteScore(score.id)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="scoreTotalPages > 1" class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="scoreCurrentPage === 1"
            @click="changeScorePage(scoreCurrentPage - 1)"
          >
            上一页
          </button>
          <div class="pagination-info">
            第 {{ scoreCurrentPage }} / {{ scoreTotalPages }} 页
          </div>
          <button 
            class="pagination-btn" 
            :disabled="scoreCurrentPage === scoreTotalPages"
            @click="changeScorePage(scoreCurrentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import http from '../http'

const activeTab = ref('users')
const loading = ref(false)
const users = ref([])
const scores = ref([])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const scoreCurrentPage = ref(1)
const scorePageSize = ref(20)
const scoreTotal = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const scoreTotalPages = computed(() => Math.ceil(scoreTotal.value / scorePageSize.value))

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await http.get('/admin/users', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    })
    users.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const loadScores = async () => {
  loading.value = true
  try {
    const response = await http.get('/admin/scores', {
      params: {
        page: scoreCurrentPage.value,
        limit: scorePageSize.value
      }
    })
    scores.value = response.data
    scoreTotal.value = response.total
  } catch (error) {
    console.error('加载分数列表失败:', error)
  } finally {
    loading.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'users') {
    loadUsers()
  } else if (newTab === 'scores') {
    loadScores()
  }
})

const banUser = async (userId) => {
  if (!confirm('确定要封禁该用户吗？')) return
  
  try {
    await http.post(`/admin/ban/${userId}`)
    alert('用户封禁成功')
    loadUsers()
  } catch (error) {
    console.error('封禁用户失败:', error)
    alert(error.response?.data?.message || '封禁用户失败')
  }
}

const unbanUser = async (userId) => {
  if (!confirm('确定要解封该用户吗？')) return
  
  try {
    await http.post(`/admin/unban/${userId}`)
    alert('用户解封成功')
    loadUsers()
  } catch (error) {
    console.error('解封用户失败:', error)
    alert(error.response?.data?.message || '解封用户失败')
  }
}

const deleteScore = async (scoreId) => {
  if (!confirm('确定要删除该分数吗？')) return
  
  try {
    await http.delete(`/admin/scores/${scoreId}`)
    alert('分数删除成功')
    loadScores()
  } catch (error) {
    console.error('删除分数失败:', error)
    alert(error.response?.data?.message || '删除分数失败')
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadUsers()
}

const changeScorePage = (page) => {
  if (page < 1 || page > scoreTotalPages.value) return
  scoreCurrentPage.value = page
  loadScores()
}

const getRoleLabel = (role) => {
  const labels = {
    'user': '普通用户',
    'admin': '管理员',
    'banned': '已封禁'
  }
  return labels[role] || role
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.admin-page h2 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.admin-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #e9ecef;
  color: #4CAF50;
}

.tab-btn.active {
  color: #4CAF50;
  border-bottom-color: #4CAF50;
  background: white;
}

.admin-section {
  padding: 30px;
}

.admin-section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.admin-table thead {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.admin-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.admin-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.admin-table tbody tr:hover {
  background: #f8f9fa;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.role-badge.user {
  background: #e3f2fd;
  color: #1976d2;
}

.role-badge.admin {
  background: #fff3e0;
  color: #f57c00;
}

.role-badge.banned {
  background: #ffebee;
  color: #c62828;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 5px;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.ban-btn {
  background: #ffebee;
  color: #c62828;
}

.ban-btn:hover {
  background: #ffcdd2;
}

.unban-btn {
  background: #e8f5e9;
  color: #2e7d32;
}

.unban-btn:hover {
  background: #c8e6c9;
}

.delete-btn {
  background: #ffebee;
  color: #c62828;
}

.delete-btn:hover {
  background: #ffcdd2;
}

.action-text {
  color: #999;
  font-size: 0.85rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

.pagination-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.3);
}

.pagination-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination-info {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 10px;
  }
  
  .admin-page h2 {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .admin-section {
    padding: 15px;
  }
  
  .admin-table {
    font-size: 0.85rem;
  }
  
  .admin-table th,
  .admin-table td {
    padding: 8px;
  }
  
  .action-btn {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
  
  .pagination-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>