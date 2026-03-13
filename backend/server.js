const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', authRoutes);
app.use('/api', scoreRoutes);

// 提供前端静态文件
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 处理前端路由，当请求的路径不是API时，返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 404错误处理
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// 全局异常处理
app.use((err, req, res, next) => {
  // 记录错误日志
  console.error('Global error:', err);

  // 提取错误信息
  const errorMessage = err.message || 'Internal server error';

  // 返回JSON格式的错误响应
  res.status(err.status || 500).json({ error: errorMessage });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;