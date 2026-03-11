<template>
  <div class="home">
    <div class="welcome-container">
      <h1 class="title">贪吃蛇游戏</h1>
      <p class="subtitle">经典游戏，重温童年乐趣</p>
      <div class="snake-animation">
        <div class="snake">
          <div class="snake-head"></div>
          <div class="snake-body"></div>
          <div class="snake-body"></div>
          <div class="snake-body"></div>
        </div>
      </div>
      <router-link to="/game" class="start-button">开始游戏</router-link>
      <div class="features">
        <div class="feature-item">
          <h3>经典玩法</h3>
          <p>方向键控制，吃到食物增长身体</p>
        </div>
        <div class="feature-item">
          <h3>排行榜</h3>
          <p>与好友比拼最高分</p>
        </div>
        <div class="feature-item">
          <h3>个人战绩</h3>
          <p>记录你的游戏历史</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  width: 100%;
  max-width: 100%;
}

.welcome-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.title {
  font-size: 2.5rem;
  color: #4CAF50;
  margin-bottom: 10px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.snake-animation {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.snake {
  display: flex;
  animation: move 3s infinite linear;
}

.snake-head {
  width: 20px;
  height: 20px;
  background-color: #4CAF50;
  border-radius: 50%;
}

.snake-body {
  width: 20px;
  height: 20px;
  background-color: #45a049;
  margin-left: 5px;
  border-radius: 4px;
}

@keyframes move {
  0% {
    transform: translateX(-50px);
  }
  100% {
    transform: translateX(50px);
  }
}

.start-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 20px 0;
  transition: all 0.3s ease;
}

.start-button:hover {
  background-color: #45a049;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  flex-wrap: wrap;
}

.feature-item {
  flex: 1;
  min-width: 150px;
  margin: 10px;
  padding: 20px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
}

.feature-item h3 {
  color: #4CAF50;
  margin-bottom: 10px;
}

.feature-item p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .welcome-container {
    padding: 30px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .features {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-item {
    width: 100%;
    max-width: 300px;
  }
}
</style>