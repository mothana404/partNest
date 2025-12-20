const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  university: {
    type: DataTypes.STRING,
    allowNull: false
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gpa: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cvLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  preferredJobTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  preferredLocations: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  expectedSalaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  expectedSalaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['university'] },
    { fields: ['availability'] }
  ]
});

module.exports = Student;