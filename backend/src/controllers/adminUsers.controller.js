const {
  User,
  Student,
  Company,
  Job,
  Application,
  SavedJob,
  Skill,
  Experience,
  Link
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");

const adminUsersController = {
  // Get all users with pagination and filters
  getAllUsers: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        status,
        verified,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phoneNumber: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (role && role !== 'all') {
        whereConditions.role = role;
      }

      if (status && status !== 'all') {
        whereConditions.isActive = status === 'active';
      }

      if (verified && verified !== 'all') {
        whereConditions.isVerified = verified === 'verified';
      }

      // Get users with related data
      const { rows: users, count: totalUsers } = await User.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Student,
            as: 'student',
            required: false,
            attributes: ['id', 'university', 'major', 'year']
          },
          {
            model: Company,
            as: 'company',
            required: false,
            attributes: ['id', 'companyName', 'industry', 'isVerified']
          }
        ],
        attributes: [
          'user_id',
          'email',
          'fullName',
          'phoneNumber',
          'location',
          'image',
          'role',
          'isActive',
          'isVerified',
          'lastLogin',
          'createdAt',
          'updatedAt'
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      // Get additional stats for each user
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const userStats = {};
          
          if (user.role === 'STUDENT' && user.student) {
            const [applicationCount, savedJobCount] = await Promise.all([
              Application.count({
                where: { studentId: user.student.id }
              }),
              SavedJob.count({
                where: { studentId: user.student.id }
              })
            ]);
            
            userStats.applicationCount = applicationCount;
            userStats.savedJobCount = savedJobCount;
          }
          
          if (user.role === 'COMPANY' && user.company) {
            const [jobCount, totalApplications] = await Promise.all([
              Job.count({
                where: { companyId: user.company.id }
              }),
              Job.findAll({
                where: { companyId: user.company.id },
                attributes: [
                  [Sequelize.fn('SUM', Sequelize.col('applicationCount')), 'totalApps']
                ],
                raw: true
              })
            ]);
            
            userStats.jobCount = jobCount;
            userStats.totalApplications = parseInt(totalApplications[0]?.totalApps) || 0;
          }

          return {
            ...user.toJSON(),
            stats: userStats
          };
        })
      );

      const totalPages = Math.ceil(totalUsers / limit);

      return ApiResponse.successResponse(res, 200, "Users retrieved successfully", {
        users: usersWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve users");
    }
  },

  // Get users statistics
  getUsersStats: async (req, res) => {
    try {
      const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        verifiedUsers,
        studentsCount,
        companiesCount,
        adminsCount,
        recentUsers
      ] = await Promise.all([
        User.count(),
        User.count({ where: { isActive: true } }),
        User.count({ where: { isActive: false } }),
        User.count({ where: { isVerified: true } }),
        User.count({ where: { role: 'STUDENT' } }),
        User.count({ where: { role: 'COMPANY' } }),
        User.count({ where: { role: 'ADMIN' } }),
        User.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      // Get users registered per month for the last 12 months
      const monthlyStats = await User.findAll({
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
          [Sequelize.fn('COUNT', '*'), 'count'],
          'role'
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        },
        group: [
          Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')),
          'role'
        ],
        order: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'ASC']
        ],
        raw: true
      });

      const stats = {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          verifiedUsers,
          recentUsers
        },
        byRole: {
          students: studentsCount,
          companies: companiesCount,
          admins: adminsCount
        },
        monthlyRegistrations: monthlyStats.map(stat => ({
          month: stat.month,
          count: parseInt(stat.count),
          role: stat.role
        }))
      };

      return ApiResponse.successResponse(res, 200, "User stats retrieved successfully", stats);
    } catch (error) {
      console.error("Get user stats error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve user stats");
    }
  },

  // Get user by ID with full details
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findOne({
        where: { user_id: userId },
        include: [
          {
            model: Student,
            as: 'student',
            required: false
          },
          {
            model: Company,
            as: 'company',
            required: false
          },
          {
            model: Skill,
            as: 'skills',
            required: false
          },
          {
            model: Experience,
            as: 'experiences',
            required: false
          },
          {
            model: Link,
            as: 'links',
            required: false
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      // Get additional stats based on user role
      let additionalData = {};
      
      if (user.role === 'STUDENT' && user.student) {
        const [applications, savedJobs] = await Promise.all([
          Application.findAll({
            where: { studentId: user.student.id },
            include: [
              {
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'companyId'],
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: ['companyName']
                  }
                ]
              }
            ],
            limit: 10,
            order: [['appliedAt', 'DESC']]
          }),
          SavedJob.findAll({
            where: { studentId: user.student.id },
            include: [
              {
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'companyId'],
                include: [
                  {
                    model: Company,
                    as: 'company',
                    attributes: ['companyName']
                  }
                ]
              }
            ],
            limit: 10,
            order: [['savedAt', 'DESC']]
          })
        ]);

        additionalData = {
          recentApplications: applications,
          recentSavedJobs: savedJobs
        };
      }

      if (user.role === 'COMPANY' && user.company) {
        const [jobs, applications] = await Promise.all([
          Job.findAll({
            where: { companyId: user.company.id },
            attributes: [
              'id',
              'title',
              'status',
              'applicationCount',
              'createdAt'
            ],
            limit: 10,
            order: [['createdAt', 'DESC']]
          }),
          Application.findAll({
            include: [
              {
                model: Job,
                as: 'job',
                where: { companyId: user.company.id },
                attributes: ['title']
              },
              {
                model: Student,
                as: 'student',
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['fullName', 'email']
                  }
                ],
                attributes: ['university', 'major']
              }
            ],
            limit: 10,
            order: [['appliedAt', 'DESC']]
          })
        ]);

        additionalData = {
          recentJobs: jobs,
          recentApplications: applications
        };
      }

      return ApiResponse.successResponse(res, 200, "User retrieved successfully", {
        user: user.toJSON(),
        ...additionalData
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve user");
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      // Remove sensitive fields that shouldn't be updated through this endpoint
      delete updates.password;
      delete updates.user_id;

      const user = await User.findOne({ where: { user_id: userId } });
      
      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      // Validate role change
      if (updates.role && updates.role !== user.role) {
        // Only allow role changes between STUDENT and COMPANY
        const allowedRoleChanges = {
          'STUDENT': ['COMPANY'],
          'COMPANY': ['STUDENT']
        };
        
        if (!allowedRoleChanges[user.role]?.includes(updates.role)) {
          return ApiResponse.errorResponse(res, 400, "Invalid role change");
        }
      }

      await user.update(updates);

      return ApiResponse.successResponse(res, 200, "User updated successfully", {
        user: { ...user.toJSON(), password: undefined }
      });
    } catch (error) {
      console.error("Update user error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update user");
    }
  },

  // Delete user (soft delete)
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findOne({ where: { user_id: userId } });
      
      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      // Prevent deleting admin users
      if (user.role === 'ADMIN') {
        return ApiResponse.errorResponse(res, 403, "Cannot delete admin users");
      }

      // Soft delete by deactivating the user
      await user.update({ isActive: false });

      return ApiResponse.successResponse(res, 200, "User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete user");
    }
  },

  // Toggle user status (active/inactive)
  toggleUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      const user = await User.findOne({ where: { user_id: userId } });
      
      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      // Prevent deactivating admin users
      if (user.role === 'ADMIN' && !isActive) {
        return ApiResponse.errorResponse(res, 403, "Cannot deactivate admin users");
      }

      await user.update({ isActive });

      return ApiResponse.successResponse(res, 200, `User ${isActive ? 'activated' : 'deactivated'} successfully`, {
        user: { ...user.toJSON(), password: undefined }
      });
    } catch (error) {
      console.error("Toggle user status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update user status");
    }
  },

  // Verify user
  verifyUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { isVerified } = req.body;

      const user = await User.findOne({ where: { user_id: userId } });
      
      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      await user.update({ isVerified });

      return ApiResponse.successResponse(res, 200, `User ${isVerified ? 'verified' : 'unverified'} successfully`, {
        user: { ...user.toJSON(), password: undefined }
      });
    } catch (error) {
      console.error("Verify user error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to verify user");
    }
  },

  // Change user role
  changeUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['STUDENT', 'COMPANY'].includes(role)) {
        return ApiResponse.errorResponse(res, 400, "Invalid role");
      }

      const user = await User.findOne({ where: { user_id: userId } });
      
      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      // Prevent changing admin role
      if (user.role === 'ADMIN') {
        return ApiResponse.errorResponse(res, 403, "Cannot change admin role");
      }

      await user.update({ role });

      return ApiResponse.successResponse(res, 200, "User role updated successfully", {
        user: { ...user.toJSON(), password: undefined }
      });
    } catch (error) {
      console.error("Change user role error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to change user role");
    }
  },

  // Reset user password
  resetUserPassword: async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword = 'TempPassword123!' } = req.body;

      const user = await User.findOne({ where: { user_id: userId } });
      
      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      return ApiResponse.successResponse(res, 200, "Password reset successfully", {
        temporaryPassword: newPassword
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to reset password");
    }
  },

  // Bulk delete users
  bulkDeleteUsers: async (req, res) => {
    try {
      const { userIds } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "User IDs array is required");
      }

      // Prevent deleting admin users
      const adminUsers = await User.findAll({
        where: {
          user_id: { [Op.in]: userIds },
          role: 'ADMIN'
        }
      });

      if (adminUsers.length > 0) {
        return ApiResponse.errorResponse(res, 403, "Cannot delete admin users");
      }

      const result = await User.update(
        { isActive: false },
        {
          where: {
            user_id: { [Op.in]: userIds }
          }
        }
      );

      return ApiResponse.successResponse(res, 200, "Users deleted successfully", {
        affectedUsers: result[0]
      });
    } catch (error) {
      console.error("Bulk delete users error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete users");
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (req, res) => {
    try {
      const { userIds, isActive } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "User IDs array is required");
      }

      // Prevent deactivating admin users
      if (!isActive) {
        const adminUsers = await User.findAll({
          where: {
            user_id: { [Op.in]: userIds },
            role: 'ADMIN'
          }
        });

        if (adminUsers.length > 0) {
          return ApiResponse.errorResponse(res, 403, "Cannot deactivate admin users");
        }
      }

      const result = await User.update(
        { isActive },
        {
          where: {
            user_id: { [Op.in]: userIds }
          }
        }
      );

      return ApiResponse.successResponse(res, 200, "User status updated successfully", {
        affectedUsers: result[0]
      });
    } catch (error) {
      console.error("Bulk update status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update user status");
    }
  },

  // Bulk verify users
  bulkVerifyUsers: async (req, res) => {
    try {
      const { userIds, isVerified } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "User IDs array is required");
      }

      const result = await User.update(
        { isVerified },
        {
          where: {
            user_id: { [Op.in]: userIds }
          }
        }
      );

      return ApiResponse.successResponse(res, 200, "Users verification updated successfully", {
        affectedUsers: result[0]
      });
    } catch (error) {
      console.error("Bulk verify users error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to verify users");
    }
  },

  // Export users to CSV
  exportUsersCSV: async (req, res) => {
    try {
      const { role, status, verified } = req.query;
      
      const whereConditions = {};
      
      if (role && role !== 'all') {
        whereConditions.role = role;
      }

      if (status && status !== 'all') {
        whereConditions.isActive = status === 'active';
      }

      if (verified && verified !== 'all') {
        whereConditions.isVerified = verified === 'verified';
      }

      const users = await User.findAll({
        where: whereConditions,
        include: [
          {
            model: Student,
            as: 'student',
            required: false,
            attributes: ['university', 'major', 'year']
          },
          {
            model: Company,
            as: 'company',
            required: false,
            attributes: ['companyName', 'industry']
          }
        ],
        attributes: [
          'user_id',
          'email',
          'fullName',
          'phoneNumber',
          'location',
          'role',
          'isActive',
          'isVerified',
          'createdAt'
        ]
      });

      // Convert to CSV format
      const csvHeaders = [
        'ID',
        'Email',
        'Full Name',
        'Phone',
        'Location',
        'Role',
        'Status',
        'Verified',
        'University/Company',
        'Major/Industry',
        'Created At'
      ].join(',');

      const csvData = users.map(user => {
        const additionalInfo = user.student 
          ? [user.student.university, user.student.major]
          : user.company 
            ? [user.company.companyName, user.company.industry]
            : ['', ''];

        return [
          user.user_id,
          user.email,
          `"${user.fullName}"`,
          user.phoneNumber || '',
          `"${user.location || ''}"`,
          user.role,
          user.isActive ? 'Active' : 'Inactive',
          user.isVerified ? 'Verified' : 'Unverified',
          `"${additionalInfo[0] || ''}"`,
          `"${additionalInfo[1] || ''}"`,
          new Date(user.createdAt).toISOString()
        ].join(',');
      }).join('\n');

      const csv = `${csvHeaders}\n${csvData}`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users-export-${Date.now()}.csv`);
      
      return res.send(csv);
    } catch (error) {
      console.error("Export users CSV error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to export users");
    }
  }
};

module.exports = adminUsersController;