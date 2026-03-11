<template>
  <div class="rank-page">
    <h2>排行榜</h2>
    <div class="rank-container">
      <div class="rank-card">
        <div class="card-header">
          <h3>游戏分数排名</h3>
          <div class="card-stats">
            <span class="stat-item">
              <i class="icon">🎮</i>
              <span>{{ rankList.length }} 局游戏</span>
            </span>
            <span class="stat-item">
              <i class="icon">🏆</i>
              <span>最高: {{ highestScore }} 分</span>
            </span>
          </div>
        </div>
        
        <div v-if="rankList.length === 0" class="empty-rank">
          <div class="empty-icon">🎯</div>
          <p>还没有游戏记录</p>
          <router-link to="/game" class="play-button">开始游戏</router-link>
        </div>
        
        <div v-else class="rank-list">
          <div 
            v-for="(item, index) in rankList" 
            :key="index"
            class="rank-item"
            :class="{
              'first-place': index === 0,
              'second-place': index === 1,
              'third-place': index === 2,
              'top-three': index < 3
            }"
          >
            <div class="rank-number">
              <span v-if="index < 3" class="medal">{{ getMedal(index) }}</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            
            <div class="rank-avatar">
              {{ getAvatar(index) }}
            </div>
            
            <div class="rank-info">
              <div class="rank-date">{{ item.date }}</div>
              <div class="rank-details">
                <span class="rank-level">等级: {{ item.level }}</span>
                <span class="rank-time">时长: {{ item.time }}秒</span>
              </div>
            </div>
            
            <div class="rank-score">
              <div class="score-value">{{ item.score }}</div>
              <div class="score-label">分</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 排名列表
const rankList = ref([])

// 计算最高分
const highestScore = computed(() => {
  if (rankList.value.length === 0) return 0
  return rankList.value[0].score
})

// 从localStorage加载数据并排序
const loadRankings = () => {
  try {
    const savedHistory = localStorage.getItem('gameHistory')
    if (savedHistory) {
      const gameHistory = JSON.parse(savedHistory)
      // 按分数从高到低排序
      rankList.value = gameHistory.sort((a, b) => b.score - a.score)
    } else {
      // 添加一些模拟数据用于测试
      rankList.value = [
        { date: '2026-03-11 14:30', score: 150, level: 4, time: 45 },
        { date: '2026-03-11 13:15', score: 120, level: 3, time: 35 },
        { date: '2026-03-11 10:45', score: 95, level: 2, time: 30 },
        { date: '2026-03-10 16:20', score: 85, level: 2, time: 25 },
        { date: '2026-03-10 09:10', score: 60, level: 2, time: 18 }
      ]
      // 保存到localStorage
      localStorage.setItem('gameHistory', JSON.stringify(rankList.value))
    }
  } catch (error) {
    console.error('加载排行榜数据失败:', error)
    rankList.value = []
  }
}

// 获取奖牌图标
const getMedal = (index) => {
  const medals = ['🥇', '🥈', '🥉']
  return medals[index]
}

// 获取头像字符
const getAvatar = (index) => {
  const avatars = ['🐍', '🏆', '🎮', '🎯', '⚡', '🔥', '⭐', '💎', '🌟', '🎖️']
  return avatars[index % avatars.length]
}

// 生命周期钩子
onMounted(() => {
  loadRankings()
})
</script>

<style scoped>
.rank-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.rank-page h2 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.rank-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.rank-card {
  background: white;
  border-radius: 15px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rank-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  border-bottom: none;
  color: white;
}

.card-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
}

.stat-item .icon {
  font-size: 1.1rem;
}

.empty-rank {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.empty-rank p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.play-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.play-button:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-item:hover {
  background-color: #f8f9fa;
  transform: translateX(8px);
}

.rank-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: transparent;
  transition: all 0.3s ease;
}

.rank-item:hover::before {
  background: #4CAF50;
}

/* 前三名样式 */
.rank-item.first-place {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
}

.rank-item.second-place {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
}

.rank-item.third-place {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.rank-item.first-place::before {
  background: #ffc107;
}

.rank-item.second-place::before {
  background: #2196f3;
}

.rank-item.third-place::before {
  background: #9c27b0;
}

.rank-number {
  width: 50px;
  text-align: center;
  font-weight: bold;
  color: #666;
  font-size: 1.1rem;
  position: relative;
}

.rank-item.top-three .rank-number {
  color: transparent;
}

.medal {
  font-size: 1.8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translate(-50%, -50%);
  }
  40% {
    transform: translate(-50%, -60%);
  }
  60% {
    transform: translate(-50%, -55%);
  }
}

.rank-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  font-weight: bold;
  font-size: 1.4rem;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.rank-item:hover .rank-avatar {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-date {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-details {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #666;
}

.rank-level, .rank-time {
  background: #f0f0f0;
  padding: 3px 8px;
  border-radius: 12px;
}

.rank-score {
  text-align: right;
  min-width: 80px;
  margin-left: 20px;
}

.score-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4CAF50;
  line-height: 1;
}

.score-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rank-page {
    padding: 10px;
  }
  
  .rank-page h2 {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .card-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .rank-item {
    padding: 14px 16px;
  }
  
  .rank-number {
    width: 40px;
  }
  
  .medal {
    font-size: 1.4rem;
  }
  
  .rank-avatar {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    font-size: 1.2rem;
  }
  
  .rank-date {
    font-size: 0.85rem;
  }
  
  .rank-details {
    gap: 8px;
    font-size: 0.75rem;
  }
  
  .rank-score {
    min-width: 60px;
    margin-left: 10px;
  }
  
  .score-value {
    font-size: 1.2rem;
  }
  
  .empty-rank {
    padding: 40px 10px;
  }
  
  .empty-icon {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .rank-item {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .rank-info {
    order: 3;
    width: 100%;
  }
  
  .rank-score {
    order: 2;
    margin-left: auto;
  }
  
  .rank-details {
    flex-wrap: wrap;
  }
}
</style>