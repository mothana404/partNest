const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tags',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['slug'] }
  ]
});

module.exports = Tag;