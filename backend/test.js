const axios = require('axios');

// 测试注册
async function testRegister() {
  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      username: 'testuser',
      password: '123456'
    });
    console.log('注册测试结果:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('注册测试失败:', error.response ? error.response.data : error.message);
  }
}

// 测试登录
async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      username: 'testuser',
      password: '123456'
    });
    console.log('登录测试结果:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('登录测试失败:', error.response ? error.response.data : error.message);
  }
}

// 测试成绩上报
async function testScore(token) {
  try {
    const response = await axios.post('http://localhost:3000/api/scores', {
      score: 1000,
      survivalTime: 120
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('成绩上报测试结果:', response.data);
  } catch (error) {
    console.error('成绩上报测试失败:', error.response ? error.response.data : error.message);
  }
}

// 测试排行榜
async function testLeaderboard() {
  try {
    const response = await axios.get('http://localhost:3000/api/leaderboard');
    console.log('排行榜测试结果:', response.data);
  } catch (error) {
    console.error('排行榜测试失败:', error.response ? error.response.data : error.message);
  }
}

// 执行测试
async function runTests() {
  console.log('开始测试API接口...');
  await testRegister();
  const token = await testLogin();
  if (token) {
    await testScore(token);
  }
  await testLeaderboard();
  console.log('测试完成!');
}

runTests();