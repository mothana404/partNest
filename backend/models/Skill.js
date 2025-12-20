const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true
  },
  yearsOfExp: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'skills',
  timestamps: true,
  updatedAt: false
});

module.exports = Skill;