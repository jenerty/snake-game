const express = require('express');
const router = express.Router();
const MatchHistory = require('../models/MatchHistory');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const sequelize = require('../config/db');

// 成绩上报路由
router.post('/scores', authenticateToken, async (req, res) => {
  try {
    const { score, survivalTime } = req.body;
    const user_id = req.user.id;

    // 验证用户是否存在
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 创建对局记录
    const matchHistory = await MatchHistory.create({
      user_id,
      score,
      survival_time: survivalTime
    });

    res.status(201).json({ message: 'Score reported successfully', matchHistory });
  } catch (error) {
    console.error('Report score error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 排行榜路由
router.get('/leaderboard', async (req, res) => {
  try {
    // 查询每个用户的最高分，按分数降序返回前10名
    const leaderboard = await MatchHistory.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('MAX', sequelize.col('score')), 'max_score']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ],
      group: ['user_id', 'User.id'],
      order: [[sequelize.fn('MAX', sequelize.col('score')), 'DESC']],
      limit: 10
    });

    // 格式化响应数据
    const formattedLeaderboard = leaderboard.map(item => ({
      username: item.User.username,
      score: item.dataValues.max_score
    }));

    res.status(200).json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取当前用户的历史得分记录
router.get('/scores/my', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 查询当前用户的所有对局记录，按时间降序排序
    const userScores = await MatchHistory.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']]
    });

    // 格式化响应数据
    const formattedScores = userScores.map(item => ({
      id: item.id,
      score: item.score,
      survival_time: item.survival_time,
      created_at: item.created_at
    }));

    res.status(200).json({ scores: formattedScores });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;