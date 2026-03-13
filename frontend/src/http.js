import axios from 'axios'
import router from './router'

// 创建axios实例
const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('authToken')
    if (token) {
      // 添加到Authorization头
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 如果状态码是401，跳转到登录页
    if (error.response && error.response.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default http