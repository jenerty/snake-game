
<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          <span class="snake-icon">🐍</span>
          <span class="brand-name">贪吃蛇游戏</span>
        </router-link>
        <div class="navbar-menu">
          <router-link to="/" class="navbar-item" active-class="active">首页</router-link>
          <router-link to="/game" class="navbar-item" active-class="active">游戏</router-link>
          <router-link to="/profile" class="navbar-item" active-class="active">个人战绩</router-link>
          <router-link to="/rank" class="navbar-item" active-class="active">排行榜</router-link>
        </div>
      </div>
    </nav>
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
// App组件只负责布局和导航
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* 确保路由视图能够正确显示 */
:deep(.router-view) {
  width: 100%;
}

.navbar {
  background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  margin: 0;
  padding: 0;
}

.navbar-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.snake-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

.brand-name {
  font-size: 1.2rem;
}

.navbar-menu {
  display: flex;
  gap: 20px;
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.navbar-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.navbar-item.active {
  background: white;
  color: #4CAF50;
  font-weight: bold;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 10px;
  }
  
  .brand-name {
    font-size: 1rem;
  }
  
  .navbar-menu {
    gap: 10px;
  }
  
  .navbar-item {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>