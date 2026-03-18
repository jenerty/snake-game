const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MatchHistory = require('../models/MatchHistory');
const requireAdmin = require('../middleware/admin');

// 获取所有用户（支持分页）
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      data: rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 封禁用户
router.post('/ban/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // 不能封禁管理员
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban admin user' });
    }
    
    // 将用户角色设为 banned（这里我们使用一个特殊的角色值）
    await user.update({ role: 'banned' });
    
    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 解封用户
router.post('/unban/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // 将用户角色恢复为 user
    await user.update({ role: 'user' });
    
    res.status(200).json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 删除异常分数
router.delete('/scores/:scoreId', requireAdmin, async (req, res) => {
  try {
    const { scoreId } = req.params;
    
    const score = await MatchHistory.findByPk(scoreId);
    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }
    
    await score.destroy();
    
    res.status(200).json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Delete score error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取所有分数（支持分页）
router.get('/scores', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await MatchHistory.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['username', 'role']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      data: rows
    });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;