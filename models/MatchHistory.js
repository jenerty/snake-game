const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const MatchHistory = sequelize.define('MatchHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  survival_time: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'matchhistory',
  timestamps: false
});

// 关联关系
MatchHistory.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(MatchHistory, { foreignKey: 'user_id' });

module.exports = MatchHistory;