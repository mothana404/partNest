const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const SavedJob = sequelize.define('SavedJob', {
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
  savedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'saved_jobs',
  timestamps: false,
  indexes: [
    { 
      fields: ['studentId', 'jobId'], 
      unique: true 
    },
    { fields: ['studentId'] },
    { fields: ['jobId'] }
  ]
});

module.exports = SavedJob;