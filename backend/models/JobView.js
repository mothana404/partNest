const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const JobView = sequelize.define('JobView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  viewedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'job_views',
  timestamps: false,
  indexes: [
    { 
      fields: ['studentId', 'jobId'], 
      unique: true // This ensures one view per student per job
    },
    { fields: ['studentId'] },
    { fields: ['jobId'] },
    { fields: ['viewedAt'] }
  ]
});

module.exports = JobView;