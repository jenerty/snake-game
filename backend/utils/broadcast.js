const MatchHistory = require('../models/MatchHistory');
const User = require('../models/User');

// 存储已认证的客户端
const authenticatedClients = new Set();

// 广播消息给所有已认证的客户端
function broadcast(message) {
  const data = JSON.stringify(message);
  authenticatedClients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(data);
    }
  });
}

// 检查并广播新的最高分
async function checkAndBroadcastNewRecord(score, userId) {
  try {
    console.log('Checking for new record:', { score, userId });
    // 查询当前全局最高分
    const highestScoreRecord = await MatchHistory.findOne({
      attributes: ['score', 'user_id'],
      include: [{
        model: User,
        attributes: ['username']
      }],
      order: [['score', 'DESC']],
      limit: 1
    });

    console.log('Current highest score record:', highestScoreRecord);

    if (highestScoreRecord) {
      const highestScore = highestScoreRecord.score;
      console.log('Current highest score:', highestScore);

      // 检查是否是新的最高分
      if (score > highestScore) {
        console.log('New record found!', { score, highestScore });
        // 获取用户信息
        const user = await User.findByPk(userId);
        if (user) {
          console.log('User found:', user.username);
          // 广播新纪录消息
          const message = {
            type: 'NEW_RECORD',
            username: user.username,
            score: score
          };
          console.log('Broadcasting message:', message);
          console.log('Number of authenticated clients:', authenticatedClients.size);
          broadcast(message);
          console.log(`New record broadcasted: ${user.username} - ${score}`);
        } else {
          console.error('User not found:', userId);
        }
      } else {
        console.log('Not a new record:', { score, highestScore });
      }
    } else {
      // 没有记录，这是第一个成绩，直接广播
      console.log('No existing records, broadcasting first record');
      const user = await User.findByPk(userId);
      if (user) {
        console.log('User found:', user.username);
        const message = {
          type: 'NEW_RECORD',
          username: user.username,
          score: score
        };
        console.log('Broadcasting message:', message);
        console.log('Number of authenticated clients:', authenticatedClients.size);
        broadcast(message);
        console.log(`First record broadcasted: ${user.username} - ${score}`);
      } else {
        console.error('User not found:', userId);
      }
    }
  } catch (error) {
    console.error('Error checking for new record:', error);
  }
}

// 导出函数
module.exports = {
  broadcast,
  checkAndBroadcastNewRecord,
  authenticatedClients
};
