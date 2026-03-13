<template>
  <div class="login-container">
    <div class="login-form">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            required 
            placeholder="请输入用户名"
          />
        </div>
        <div class="form-group password-group">
          <label for="password">密码</label>
          <div class="password-input-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="form.password" 
              required 
              placeholder="请输入密码"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showPassword = !showPassword"
              aria-label="Toggle password visibility"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>
        <button type="submit" class="btn-submit">登录</button>
      </form>
      <div class="form-footer">
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '../http'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    const response = await http.post('/login', form.value)
    // 保存token到localStorage
    localStorage.setItem('authToken', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    // 跳转到首页
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || '登录失败，请检查用户名和密码'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.password-group {
  position: relative;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.password-toggle:hover {
  color: #4CAF50;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: linear-gradient(90deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.form-footer a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #ffebee;
  color: #c62828;
  border-radius: 5px;
  text-align: center;
}
</style>