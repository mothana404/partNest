const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Link = sequelize.define('Link', {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'links',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['userId'] }
  ]
});

module.exports = Link;