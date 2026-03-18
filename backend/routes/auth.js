const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 注册路由
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      password_hash: password
    });

    // 生成JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'your-secret-key', { expiresIn: '7d' });

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username, role: user.role }, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 检查用户是否被封禁
    if (user.role === 'banned') {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    // 生成JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'your-secret-key', { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;