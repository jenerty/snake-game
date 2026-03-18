const express = require('express');
const router = express.Router();
const MatchHistory = require('../models/MatchHistory');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const sequelize = require('../config/db');
const { checkAndBroadcastNewRecord } = require('../utils/broadcast');

// 成绩上报路由
router.post('/scores', authenticateToken, async (req, res) => {
  try {
    console.log('Received score submission request');
    const { score, survivalTime } = req.body;
    const user_id = req.user.id;
    console.log('Score submission:', { score, survivalTime, user_id });

    // 验证用户是否存在
    const user = await User.findByPk(user_id);
    if (!user) {
      console.error('User not found:', user_id);
      return res.status(404).json({ message: 'User not found' });
    }

    // 先查询当前全局最高分
    const highestScoreRecord = await MatchHistory.findOne({
      attributes: ['score'],
      order: [['score', 'DESC']],
      limit: 1
    });

    let isNewRecord = false;
    if (highestScoreRecord) {
      const highestScore = highestScoreRecord.score;
      isNewRecord = score > highestScore;
      console.log('Current highest score:', highestScore, 'New score:', score, 'Is new record:', isNewRecord);
    } else {
      // 没有记录，这是第一个成绩，直接广播
      isNewRecord = true;
      console.log('No existing records, this is the first record');
    }

    // 创建对局记录
    const matchHistory = await MatchHistory.create({
      user_id,
      score,
      survival_time: survivalTime
    });
    console.log('Match history created:', matchHistory.id);

    // 检查是否是新的最高分并广播
    if (isNewRecord) {
      const message = {
        type: 'NEW_RECORD',
        username: user.username,
        score: score
      };
      console.log('Broadcasting new record:', message);
      // 直接从broadcast.js导入broadcast函数
      const { broadcast } = require('../utils/broadcast');
      broadcast(message);
      console.log(`New record broadcasted: ${user.username} - ${score}`);
    }

    res.status(201).json({ message: 'Score reported successfully', matchHistory });
  } catch (error) {
    console.error('Report score error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 排行榜路由
router.get('/leaderboard', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 先查询总用户数
    const totalCount = await MatchHistory.count({
      distinct: true,
      col: 'user_id'
    });

    // 查询每个用户的最高分，按分数降序返回
    const rows = await MatchHistory.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('MAX', sequelize.col('score')), 'highestScore'],
        [sequelize.fn('MAX', sequelize.col('MatchHistory.created_at')), 'createdAt']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ],
      group: ['user_id', 'User.id'],
      order: [[sequelize.fn('MAX', sequelize.col('score')), 'DESC']],
      limit,
      offset
    });

    // 格式化响应数据
    const formattedLeaderboard = rows.map(item => ({
      username: item.User.username,
      highestScore: item.dataValues.highestScore,
      createdAt: item.dataValues.createdAt
    }));

    res.status(200).json({
      total: totalCount,
      page,
      limit,
      data: formattedLeaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 用户个人战绩路由（支持分页）
router.get('/scores/my', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 查询用户的所有游戏记录，按时间降序返回
    const { count, rows } = await MatchHistory.findAndCountAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // 格式化响应数据
    const formattedScores = rows.map(item => ({
      id: item.id,
      score: item.score,
      survival_time: item.survival_time,
      created_at: item.created_at
    }));

    res.status(200).json({
      total: count,
      page,
      limit,
      scores: formattedScores
    });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;