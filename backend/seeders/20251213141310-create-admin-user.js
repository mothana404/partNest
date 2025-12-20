'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        user_id: uuidv4(),
        email: 'admin@admin.com',
        password: hashedPassword,
        fullName: 'System Admin',
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'admin@admin.com'
    }, {});
  }
};