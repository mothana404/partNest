const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'),
    defaultValue: 'PENDING'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  viewedByCompany: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'appliedAt',
  indexes: [
    { 
      fields: ['jobId', 'studentId'], 
      unique: true 
    },
    { fields: ['jobId'] },
    { fields: ['studentId'] },
    { fields: ['status'] },
    { fields: ['appliedAt'] }
  ]
});

module.exports = Application;