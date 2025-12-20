const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobType: {
    type: DataTypes.ENUM('PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED'),
    defaultValue: 'ACTIVE'
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salaryCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  experienceRequired: {
    type: DataTypes.STRING,
    allowNull: true
  },
  educationRequired: {
    type: DataTypes.STRING,
    allowNull: true
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  maxApplications: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  applicationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  indexes: [
    { fields: ['companyId'] },
    { fields: ['categoryId'] },
    { fields: ['status'] },
    { fields: ['jobType'] },
    { fields: ['createdAt'] },
    { fields: ['applicationDeadline'] }
  ]
});

module.exports = Job;