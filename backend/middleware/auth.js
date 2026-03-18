const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, 'your-secret-key', async (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // 检查用户是否被封禁
    const dbUser = await User.findByPk(user.id);
    if (!dbUser || dbUser.role === 'banned') {
      return res.status(403).json({ message: 'User is banned' });
    }
    
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;