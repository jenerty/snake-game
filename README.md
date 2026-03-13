# Snake Game (贪吃蛇游戏)

一个简单的贪吃蛇游戏，基于Vue 3和Node.js开发，支持用户注册、登录和基本游戏记录功能。

## 功能特性

- 🎮 基础贪吃蛇游戏
- 👤 用户注册和登录
- 📊 个人游戏记录
- 🏆 游戏排行榜

## 技术栈

### 前端
- Vue 3
- Vue Router 4
- Vite
- Axios

### 后端
- Node.js
- Express
- MySQL
- JWT认证
- bcrypt密码加密

## 在线访问

项目已部署到GitHub Pages，可通过以下地址访问：
https://jenerty.github.io/snake-game/

## 本地运行

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
npm install
npm start
```

## 项目结构

```
Class01/
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── components/
│   │   ├── router/
│   │   └── views/
│   └── package.json
├── backend/           # 后端代码
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── server.js
└── README.md
```

## 部署

项目使用GitHub Actions自动部署到GitHub Pages，每次推送到main分支会自动构建和部署。

## 注意事项

- 后端服务器需要本地运行以支持登录和注册功能
- 数据库需要预先配置
- 游戏功能仍在不断完善中

## 许可证

MIT License
