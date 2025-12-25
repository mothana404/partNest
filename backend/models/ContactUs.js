const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const ContactUs = sequelize.define('ContactUs', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('NEW', 'READ', 'RESPONDED', 'ARCHIVED'),
    defaultValue: 'NEW'
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'contact_us',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = ContactUs;