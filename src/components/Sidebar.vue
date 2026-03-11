<template>
  <div class="sidebar">
    <h3>游戏统计</h3>
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">当前分数:</span>
        <span class="stat-value">{{ score }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">最高分数:</span>
        <span class="stat-value">{{ highScore }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">当前等级:</span>
        <span class="stat-value">{{ level }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">蛇的长度:</span>
        <span class="stat-value">{{ snakeLength }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">游戏速度:</span>
        <span class="stat-value">{{ gameSpeed }} FPS</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">游戏状态:</span>
        <span class="stat-value">{{ gameStatusText }}</span>
      </div>
    </div>
    
    <h3>游戏规则</h3>
    <ul class="rules">
      <li>使用方向键控制蛇的移动</li>
      <li>吃到红色方块增加分数</li>
      <li>每获得50分升级一次</li>
      <li>升级后游戏速度会增加</li>
      <li>碰到边界或自身会游戏结束</li>
    </ul>
    
    <div class="quick-actions">
      <router-link to="/profile" class="action-button">查看战绩</router-link>
      <router-link to="/rank" class="action-button">查看排行榜</router-link>
      <button class="action-button restart-button" @click="restartGame">重新开始</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义props
const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  snakeLength: {
    type: Number,
    default: 3
  },
  gameSpeed: {
    type: Number,
    default: 6.67 // 默认150ms间隔，约6.67 FPS
  },
  gameStatus: {
    type: String,
    default: 'ready' // ready, playing, paused, gameOver
  }
})

// 定义emit
const emit = defineEmits(['restart'])

// 计算游戏状态文本
const gameStatusText = computed(() => {
  switch (props.gameStatus) {
    case 'ready':
      return '准备就绪'
    case 'playing':
      return '游戏中'
    case 'paused':
      return '已暂停'
    case 'gameOver':
      return '游戏结束'
    default:
      return '未知状态'
  }
})

// 重启游戏
const restartGame = () => {
  emit('restart')
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  padding: 20px;
  background-color: #f8f9fa;
  border-left: 1px solid #e0e0e0;
}

.sidebar h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.stats {
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #4CAF50;
}

.rules {
  margin-bottom: 30px;
  padding-left: 20px;
}

.rules li {
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-button {
  display: block;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
}

.action-button:hover {
  background-color: #45a049;
}

.restart-button {
  background-color: #ff9800;
}

.restart-button:hover {
  background-color: #f57c00;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }
}
</style>