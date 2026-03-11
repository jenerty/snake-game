<template>
  <div class="profile-page">
    <h2>个人战绩</h2>
    <div class="profile-container">
      <div class="stats-card">
        <h3>统计信息</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ totalGames }}</div>
            <div class="stat-label">总游戏次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ highestScore }}</div>
            <div class="stat-label">最高分数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ highestLevel }}</div>
            <div class="stat-label">最高等级</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ averageScore }}</div>
            <div class="stat-label">平均分数</div>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="clearHistory" class="clear-button">清除历史</button>
          <router-link to="/game" class="play-button">开始游戏</router-link>
        </div>
      </div>
      
      <div v-if="gameHistory.length > 0" class="charts-card">
        <h3>游戏数据统计</h3>
        <div class="data-visualization">
          <div class="score-trend">
            <h4>分数变化趋势</h4>
            <div class="trend-container">
              <div 
                v-for="(game, index) in gameHistory" 
                :key="index"
                class="trend-bar"
                :style="{ 
                  height: `${(game.score / highestScore) * 100}%`,
                  backgroundColor: getScoreColor(game.score)
                }"
                :title="`游戏${index + 1}: ${game.score}分`"
              >
                <span class="bar-value">{{ game.score }}</span>
              </div>
            </div>
            <div class="trend-labels">
              <span v-for="(game, index) in gameHistory" :key="index" class="trend-label">
                {{ index + 1 }}
              </span>
            </div>
          </div>
          
          <div class="time-distribution">
            <h4>存活时间分布</h4>
            <div class="distribution-container">
              <div class="distribution-item">
                <div class="distribution-label">0-20秒</div>
                <div class="distribution-bar">
                  <div 
                    class="distribution-fill short"
                    :style="{ width: `${(timeDistribution.short / totalGames) * 100}%` }"
                  ></div>
                </div>
                <div class="distribution-value">{{ timeDistribution.short }}</div>
              </div>
              <div class="distribution-item">
                <div class="distribution-label">21-40秒</div>
                <div class="distribution-bar">
                  <div 
                    class="distribution-fill medium"
                    :style="{ width: `${(timeDistribution.medium / totalGames) * 100}%` }"
                  ></div>
                </div>
                <div class="distribution-value">{{ timeDistribution.medium }}</div>
              </div>
              <div class="distribution-item">
                <div class="distribution-label">40秒以上</div>
                <div class="distribution-bar">
                  <div 
                    class="distribution-fill long"
                    :style="{ width: `${(timeDistribution.long / totalGames) * 100}%` }"
                  ></div>
                </div>
                <div class="distribution-value">{{ timeDistribution.long }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="history-card">
        <h3>游戏历史</h3>
        <div v-if="gameHistory.length === 0" class="empty-history">
          <p>还没有游戏记录</p>
          <router-link to="/game" class="play-button">开始游戏</router-link>
        </div>
        <div v-else class="history-list">
          <div 
            v-for="(game, index) in gameHistory" 
            :key="index"
            class="history-item"
          >
            <div class="history-date">{{ game.date }}</div>
            <div class="history-score">分数: {{ game.score }}</div>
            <div class="history-level">等级: {{ game.level }}</div>
            <div class="history-time">时间: {{ game.time }}秒</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 游戏历史数据
const gameHistory = ref([])

// 计算统计信息
const totalGames = computed(() => gameHistory.value.length)
const highestScore = computed(() => Math.max(...gameHistory.value.map(game => game.score), 0))
const highestLevel = computed(() => Math.max(...gameHistory.value.map(game => game.level), 0))
const averageScore = computed(() => {
  if (totalGames.value === 0) return 0
  return Math.round(gameHistory.value.reduce((sum, game) => sum + game.score, 0) / totalGames.value)
})

// 计算时间分布
const timeDistribution = computed(() => {
  const distribution = {
    short: 0, // 0-20秒
    medium: 0, // 21-40秒
    long: 0 // 40秒以上
  }
  
  gameHistory.value.forEach(game => {
    const time = game.time || 0
    if (time <= 20) {
      distribution.short++
    } else if (time <= 40) {
      distribution.medium++
    } else {
      distribution.long++
    }
  })
  
  return distribution
})

// 获取分数对应的颜色
const getScoreColor = (score) => {
  const percentage = score / highestScore.value
  if (percentage >= 0.8) return '#4CAF50'
  if (percentage >= 0.5) return '#4ecdc4'
  if (percentage >= 0.3) return '#45b7d1'
  return '#ff6b6b'
}

// 从localStorage加载数据
const loadHistory = () => {
  try {
    const savedHistory = localStorage.getItem('gameHistory')
    if (savedHistory) {
      gameHistory.value = JSON.parse(savedHistory)
    } else {
      // 添加一些模拟数据用于测试
      gameHistory.value = [
        { date: '2026-03-11 14:30', score: 120, level: 3, time: 35 },
        { date: '2026-03-11 13:15', score: 85, level: 2, time: 25 },
        { date: '2026-03-11 10:45', score: 150, level: 4, time: 45 },
        { date: '2026-03-10 16:20', score: 60, level: 2, time: 18 },
        { date: '2026-03-10 09:10', score: 95, level: 2, time: 30 }
      ]
      // 保存到localStorage
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory.value))
    }
  } catch (error) {
    console.error('加载游戏历史失败:', error)
    gameHistory.value = []
  }
}

// 清除历史记录
const clearHistory = () => {
  if (confirm('确定要清除所有游戏历史记录吗？')) {
    gameHistory.value = []
    localStorage.removeItem('gameHistory')
  }
}

// 生命周期钩子
onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-page h2 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.stats-card, .history-card, .charts-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover, .history-card:hover, .charts-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.stats-card h3, .history-card h3, .charts-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #4CAF50;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.clear-button {
  padding: 10px 20px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
}

.clear-button:hover {
  background-color: #ee5a5a;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
}

.play-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
  text-align: center;
}

.play-button:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
}

.data-visualization {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.score-trend, .time-distribution {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.score-trend h4, .time-distribution h4 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}

.trend-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 200px;
  margin-bottom: 10px;
  padding: 10px 0;
}

.trend-bar {
  flex: 1;
  min-width: 30px;
  border-radius: 5px 5px 0 0;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.trend-bar:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.trend-labels {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.trend-label {
  flex: 1;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
  min-width: 30px;
}

.distribution-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.distribution-label {
  width: 80px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.distribution-bar {
  flex: 1;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.distribution-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.distribution-fill.short {
  background: #ff6b6b;
}

.distribution-fill.medium {
  background: #4ecdc4;
}

.distribution-fill.long {
  background: #45b7d1;
}

.distribution-value {
  width: 40px;
  text-align: right;
  font-weight: bold;
  color: #333;
}

.empty-history {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.empty-history p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.history-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: transparent;
  transition: all 0.3s ease;
}

.history-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.history-item:hover::before {
  background: #4CAF50;
}

.history-date {
  flex: 1;
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-score {
  flex: 1;
  font-weight: bold;
  color: #4CAF50;
}

.history-level {
  flex: 1;
  color: #333;
}

.history-time {
  flex: 1;
  color: #666;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }
  
  .profile-page h2 {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-visualization {
    grid-template-columns: 1fr;
  }
  
  .trend-container {
    height: 150px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .clear-button, .play-button {
    width: 200px;
    text-align: center;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .history-date, .history-score, .history-level, .history-time {
    flex: none;
  }
  
  .distribution-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .distribution-label {
    width: auto;
  }
  
  .distribution-bar {
    width: 100%;
  }
  
  .distribution-value {
    align-self: flex-end;
  }
}
</style>