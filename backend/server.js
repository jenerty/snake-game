const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');
const adminRoutes = require('./routes/admin');
const MatchHistory = require('./models/MatchHistory');
const User = require('./models/User');

// 导入广播工具
const { broadcast } = require('./utils/broadcast');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'https://jenerty.github.io'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', authRoutes);
app.use('/api', scoreRoutes);
app.use('/api/admin', adminRoutes);

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

// 创建HTTP服务器
const server = http.createServer(app);

// 创建WebSocket服务器
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端
const clients = new Map();

// 从broadcast.js导入authenticatedClients集合
const { authenticatedClients } = require('./utils/broadcast');

// 验证token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    return decoded;
  } catch (error) {
    return null;
  }
}

// 监听WebSocket连接
wss.on('connection', (ws, req) => {
  // 从URL参数中提取token
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  // 存储客户端信息
  clients.set(ws, { authenticated: false, userId: null, role: null });
  console.log('New WebSocket connection established');

  // 如果有token，直接验证
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      clients.set(ws, { authenticated: true, userId: decoded.id, role: decoded.role });
      authenticatedClients.add(ws);
      ws.send(JSON.stringify({
        type: 'AUTH_RESPONSE',
        success: true,
        message: 'Authentication successful'
      }));
      console.log(`WebSocket client authenticated: ${decoded.username}`);
    } else {
      ws.send(JSON.stringify({
        type: 'AUTH_RESPONSE',
        success: false,
        message: 'Invalid token'
      }));
    }
  }

  // 监听消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      // 处理认证消息
      if (data.type === 'AUTHENTICATE') {
        const decoded = verifyToken(data.token);
        if (decoded) {
          clients.set(ws, { authenticated: true, userId: decoded.id, role: decoded.role });
          authenticatedClients.add(ws);
          ws.send(JSON.stringify({
            type: 'AUTH_RESPONSE',
            success: true,
            message: 'Authentication successful'
          }));
          console.log(`WebSocket client authenticated: ${decoded.username}`);
        } else {
          ws.send(JSON.stringify({
            type: 'AUTH_RESPONSE',
            success: false,
            message: 'Invalid token'
          }));
        }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  // 监听连接关闭
  ws.on('close', () => {
    clients.delete(ws);
    authenticatedClients.delete(ws);
    console.log('WebSocket connection closed');
  });

  // 监听错误
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
});

// 导出app
module.exports = app;