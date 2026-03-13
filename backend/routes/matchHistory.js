const express = require('express');
const router = express.Router();
const MatchHistory = require('../models/MatchHistory');
const User = require('../models/User');

// 添加对局记录
router.post('/add', async (req, res) => {
  try {
    const { user_id, score, survival_time } = req.body;
    
    // 验证用户是否存在
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // 创建对局记录
    const matchHistory = await MatchHistory.create({
      user_id,
      score,
      survival_time
    });
    
    res.status(201).json({ message: 'Match history added successfully', matchHistory });
  } catch (error) {
    console.error('Add match history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取用户的对局历史
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // 验证用户是否存在
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // 获取用户的对局历史，按分数降序排列
    const matchHistories = await MatchHistory.findAll({
      where: { user_id },
      order: [['score', 'DESC']],
      limit: 10
    });
    
    res.status(200).json({ matchHistories });
  } catch (error) {
    console.error('Get match history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取全局排行榜
router.get('/leaderboard', async (req, res) => {
  try {
    // 获取全局最高分，按分数降序排列
    const leaderboard = await MatchHistory.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['score', 'DESC']],
      limit: 10
    });
    
    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;