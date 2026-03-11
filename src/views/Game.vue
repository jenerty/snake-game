<template>
  <div class="game-page">
    <div class="game-container">
      <div class="game-area">
        <h2>贪吃蛇游戏</h2>
        
        <div class="game-info">
          <div class="score">分数: {{ score }}</div>
          <div class="level">等级: {{ level }}</div>
        </div>
        
        <div class="canvas-container">
          <canvas 
            ref="gameBoard" 
            class="game-board"
            :width="boardWidth" 
            :height="boardHeight"
          ></canvas>
          
          <div v-if="gameOver" class="game-over">
            <h3>游戏结束</h3>
            <p>最终分数: {{ score }}</p>
            <p>最终等级: {{ level }}</p>
            <button @click="resetGame">重新开始</button>
          </div>
        </div>
        
        <div class="controls">
          <button @click="startGame" v-if="!gameStarted">开始游戏</button>
          <button @click="pauseGame" v-else-if="!gamePaused">暂停</button>
          <button @click="resumeGame" v-else>继续</button>
          <button @click="resetGame">重置</button>
        </div>
        
        <div class="instructions">
          <p>使用方向键控制蛇的移动，空格键暂停/继续</p>
        </div>
      </div>
      
      <Sidebar 
        :score="score" 
        :high-score="highScore" 
        :level="level"
        :snake-length="snake.length"
        :game-speed="1000 / speed"
        :game-status="gameStatus"
        @restart="resetGame"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'

// 游戏配置
const gridSize = 20
const boardWidth = 600
const boardHeight = 400
const initialSnakeLength = 3
const initialSpeed = 300
const speedIncrease = 8
const foodValue = 10

// 游戏状态
const gameBoard = ref(null)
const snake = ref([])
const food = ref({})
const direction = ref('right')
const nextDirection = ref('right')
const gameStarted = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const score = ref(0)
const highScore = ref(0)
const level = ref(1)
const speed = ref(initialSpeed)
let gameInterval = null
let gameStartTime = 0

// 计算游戏状态
const gameStatus = computed(() => {
  if (gameOver.value) return 'gameOver'
  if (gamePaused.value) return 'paused'
  if (gameStarted.value) return 'playing'
  return 'ready'
})

// 初始化游戏
const initGame = () => {
  // 初始化蛇
  snake.value = []
  const startX = Math.floor(boardWidth / 2 / gridSize) * gridSize
  const startY = Math.floor(boardHeight / 2 / gridSize) * gridSize
  
  for (let i = 0; i < initialSnakeLength; i++) {
    snake.value.push({
      x: startX - i * gridSize,
      y: startY
    })
  }
  
  // 生成食物
  generateFood()
  
  // 重置状态
  direction.value = 'right'
  nextDirection.value = 'right'
  gameStarted.value = false
  gamePaused.value = false
  gameOver.value = false
  score.value = 0
  level.value = 1
  speed.value = initialSpeed
  
  // 绘制初始状态
  draw()
}

// 生成食物
const generateFood = () => {
  const availablePositions = []
  
  // 生成所有可用位置
  for (let x = 0; x < boardWidth; x += gridSize) {
    for (let y = 0; y < boardHeight; y += gridSize) {
      const isOccupied = snake.value.some(segment => segment.x === x && segment.y === y)
      if (!isOccupied) {
        availablePositions.push({ x, y })
      }
    }
  }
  
  // 随机选择一个位置
  if (availablePositions.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePositions.length)
    food.value = availablePositions[randomIndex]
  }
}

// 绘制游戏
const draw = () => {
  const canvas = gameBoard.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  
  // 清空画布
  ctx.clearRect(0, 0, boardWidth, boardHeight)
  
  // 绘制网格线
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  // 绘制垂直线
  for (let x = 0; x <= boardWidth; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, boardHeight)
    ctx.stroke()
  }
  
  // 绘制水平线
  for (let y = 0; y <= boardHeight; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(boardWidth, y)
    ctx.stroke()
  }
  
  // 绘制食物
  ctx.fillStyle = '#ff6b6b'
  ctx.fillRect(food.value.x, food.value.y, gridSize, gridSize)
  
  // 绘制蛇
  snake.value.forEach((segment, index) => {
    if (index === 0) {
      // 蛇头
      ctx.fillStyle = '#4CAF50'
    } else {
      // 蛇身
      ctx.fillStyle = '#45a049'
    }
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize)
    
    // 绘制边框
    ctx.strokeStyle = '#333'
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize)
  })
}

// 移动蛇
const moveSnake = () => {
  if (gamePaused.value || gameOver.value) return
  
  // 更新方向
  direction.value = nextDirection.value
  
  // 创建新的蛇头
  const head = { ...snake.value[0] }
  
  switch (direction.value) {
    case 'up':
      head.y -= gridSize
      break
    case 'down':
      head.y += gridSize
      break
    case 'left':
      head.x -= gridSize
      break
    case 'right':
      head.x += gridSize
      break
  }
  
  // 将新蛇头添加到蛇的前面
  snake.value.unshift(head)
  
  // 检查是否吃到食物
  if (head.x === food.value.x && head.y === food.value.y) {
    // 增加分数
    score.value += foodValue
    
    // 检查是否升级
    const newLevel = Math.floor(score.value / 50) + 1
    if (newLevel > level.value) {
      level.value = newLevel
      // 增加速度
      speed.value = Math.max(50, initialSpeed - (level.value - 1) * speedIncrease)
      // 重新设置游戏间隔
      clearInterval(gameInterval)
      gameInterval = setInterval(moveSnake, speed.value)
    }
    
    // 生成新食物
    generateFood()
  } else {
    // 移除蛇尾
    snake.value.pop()
  }
  
  // 检查碰撞
  checkCollision()
  
  // 绘制游戏
  draw()
}

// 检查碰撞
const checkCollision = () => {
  const head = snake.value[0]
  
  // 检查边界碰撞
  if (
    head.x < 0 || 
    head.x >= boardWidth || 
    head.y < 0 || 
    head.y >= boardHeight
  ) {
    endGame()
    return
  }
  
  // 检查自身碰撞
  for (let i = 1; i < snake.value.length; i++) {
    if (head.x === snake.value[i].x && head.y === snake.value[i].y) {
      endGame()
      return
    }
  }
}

// 结束游戏
const endGame = () => {
  clearInterval(gameInterval)
  gameOver.value = true
  gameStarted.value = false
  
  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
  }
  
  // 保存游戏记录到localStorage
  const gameRecord = {
    date: new Date().toLocaleString('zh-CN'),
    score: score.value,
    level: level.value,
    time: Math.floor((Date.now() - gameStartTime) / 1000) // 计算游戏时长（秒）
  }
  
  try {
    const savedHistory = localStorage.getItem('gameHistory')
    const gameHistory = savedHistory ? JSON.parse(savedHistory) : []
    gameHistory.push(gameRecord)
    // 只保留最近20条记录
    if (gameHistory.length > 20) {
      gameHistory.shift()
    }
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory))
  } catch (error) {
    console.error('保存游戏记录失败:', error)
  }
}

// 开始游戏
const startGame = () => {
  if (gameStarted.value) return
  
  gameStarted.value = true
  gamePaused.value = false
  gameOver.value = false
  
  // 设置游戏开始时间
  gameStartTime = Date.now()
  
  // 启动游戏循环
  gameInterval = setInterval(moveSnake, speed.value)
}

// 暂停游戏
const pauseGame = () => {
  if (!gameStarted.value || gameOver.value) return
  
  gamePaused.value = true
  clearInterval(gameInterval)
}

// 继续游戏
const resumeGame = () => {
  if (!gameStarted.value || gameOver.value || !gamePaused.value) return
  
  gamePaused.value = false
  gameInterval = setInterval(moveSnake, speed.value)
}

// 重置游戏
const resetGame = () => {
  clearInterval(gameInterval)
  initGame()
}

// 处理键盘事件
const handleKeyDown = (event) => {
  if (!gameStarted.value || gameOver.value) return
  
  switch (event.key) {
    case 'ArrowUp':
      if (direction.value !== 'down') {
        nextDirection.value = 'up'
      }
      break
    case 'ArrowDown':
      if (direction.value !== 'up') {
        nextDirection.value = 'down'
      }
      break
    case 'ArrowLeft':
      if (direction.value !== 'right') {
        nextDirection.value = 'left'
      }
      break
    case 'ArrowRight':
      if (direction.value !== 'left') {
        nextDirection.value = 'right'
      }
      break
    case ' ': // 空格键暂停/继续
      if (gamePaused.value) {
        resumeGame()
      } else {
        pauseGame()
      }
      break
  }
}

// 生命周期钩子
onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  clearInterval(gameInterval)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.game-container {
  display: flex;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.game-area {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.game-area h2 {
  color: #4CAF50;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.game-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.score, .level {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.score:hover, .level:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
}

.canvas-container {
  position: relative;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
}

.canvas-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.game-board {
  border: 3px solid #333;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  max-width: 100%;
  height: auto;
}

.game-board:hover {
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.15);
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%);
  color: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  z-index: 10;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.game-over h3 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #ff6b6b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.game-over p {
  margin: 15px 0;
  font-size: 1.1rem;
}

.game-over button {
  margin-top: 30px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.game-over button:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}

.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.controls button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

.controls button:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
}

.controls button:disabled {
  background: linear-gradient(135deg, #cccccc 0%, #b0b0b0 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.instructions {
  margin-top: 20px;
  font-size: 1rem;
  color: #666;
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.instructions p {
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .game-container {
    flex-direction: column;
    max-width: 800px;
  }
  
  .game-area {
    padding: 20px;
  }
  
  .game-info {
    max-width: 400px;
  }
  
  .canvas-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .game-page {
    padding: 10px;
  }
  
  .game-container {
    max-width: 100%;
  }
  
  .game-area h2 {
    font-size: 1.5rem;
  }
  
  .game-info {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .canvas-container {
    padding: 10px;
  }
  
  .game-board {
    width: 100%;
    height: auto;
  }
}
</style>