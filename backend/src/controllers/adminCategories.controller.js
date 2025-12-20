const {
  Category,
  Job,
  Company,
  Application,
  User
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");

const adminCategoriesController = {
  // Get all categories with pagination and filters
  getAllCategories: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = {};
      
      if (search) {
        whereConditions.name = { [Op.iLike]: `%${search}%` };
      }

      if (status && status !== 'all') {
        whereConditions.isActive = status === 'active';
      }

      // Get categories with job counts
      const { rows: categories, count: totalCategories } = await Category.findAndCountAll({
        where: whereConditions,
        attributes: [
          'id',
          'name',
          'isActive',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id"
            )`), 
            'jobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id" 
              AND jobs."status" = 'ACTIVE'
            )`), 
            'activeJobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM applications a
              INNER JOIN jobs j ON a."jobId" = j."id"
              WHERE j."categoryId" = "Category"."id"
            )`), 
            'totalApplications'
          ]
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        raw: true
      });

      const totalPages = Math.ceil(totalCategories / limit);

      return ApiResponse.successResponse(res, 200, "Categories retrieved successfully", {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCategories,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error("Get all categories error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve categories");
    }
  },

  // Get categories statistics
  getCategoriesStats: async (req, res) => {
    try {
      const [
        totalCategories,
        activeCategories,
        inactiveCategories,
        totalJobs,
        totalApplications,
        recentCategories
      ] = await Promise.all([
        Category.count(),
        Category.count({ where: { isActive: true } }),
        Category.count({ where: { isActive: false } }),
        Job.count(),
        Application.count(),
        Category.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      // Get category performance data
      const categoryPerformance = await Category.findAll({
        attributes: [
          'id',
          'name',
          'isActive',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id"
            )`), 
            'jobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM applications a
              INNER JOIN jobs j ON a."jobId" = j."id"
              WHERE j."categoryId" = "Category"."id"
            )`), 
            'applicationCount'
          ]
        ],
        order: [
          [Sequelize.literal('"jobCount"'), 'DESC']
        ],
        limit: 10,
        raw: true
      });

      // Get monthly category creation stats
      const monthlyStats = await Category.findAll({
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
          [Sequelize.fn('COUNT', '*'), 'count']
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        },
        group: [
          Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))
        ],
        order: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'ASC']
        ],
        raw: true
      });

      const stats = {
        overview: {
          totalCategories,
          activeCategories,
          inactiveCategories,
          recentCategories,
          totalJobs,
          totalApplications,
          averageJobsPerCategory: activeCategories > 0 ? (totalJobs / activeCategories).toFixed(2) : 0
        },
        topPerforming: categoryPerformance.slice(0, 5),
        monthlyCreation: monthlyStats.map(stat => ({
          month: stat.month,
          count: parseInt(stat.count)
        }))
      };

      return ApiResponse.successResponse(res, 200, "Category stats retrieved successfully", stats);
    } catch (error) {
      console.error("Get category stats error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve category stats");
    }
  },

  // Get category by ID with detailed information
  getCategoryById: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const category = await Category.findOne({
        where: { id: categoryId },
        attributes: [
          'id',
          'name',
          'isActive',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id"
            )`), 
            'jobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id" 
              AND jobs."status" = 'ACTIVE'
            )`), 
            'activeJobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM applications a
              INNER JOIN jobs j ON a."jobId" = j."id"
              WHERE j."categoryId" = "Category"."id"
            )`), 
            'totalApplications'
          ]
        ],
        raw: true
      });

      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Get recent jobs in this category
      const recentJobs = await Job.findAll({
        where: { categoryId },
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['companyName']
          }
        ],
        attributes: [
          'id',
          'title',
          'status',
          'jobType',
          'applicationCount',
          'createdAt'
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Get job type distribution
      const jobTypeDistribution = await Job.findAll({
        where: { categoryId },
        attributes: [
          'jobType',
          [Sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['jobType'],
        raw: true
      });

      return ApiResponse.successResponse(res, 200, "Category retrieved successfully", {
        category,
        recentJobs,
        jobTypeDistribution: jobTypeDistribution.map(item => ({
          jobType: item.jobType,
          count: parseInt(item.count)
        }))
      });
    } catch (error) {
      console.error("Get category by ID error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve category");
    }
  },

  // Create new category
  createCategory: async (req, res) => {
    try {
      const { name, isActive = true } = req.body;

      // Validate input
      if (!name || name.trim().length === 0) {
        return ApiResponse.errorResponse(res, 400, "Category name is required");
      }

      // Check if category name already exists
      const existingCategory = await Category.findOne({
        where: { name: name.trim() }
      });

      if (existingCategory) {
        return ApiResponse.errorResponse(res, 409, "Category with this name already exists");
      }

      const category = await Category.create({
        name: name.trim(),
        isActive
      });

      return ApiResponse.successResponse(res, 201, "Category created successfully", { category });
    } catch (error) {
      console.error("Create category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to create category");
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, isActive } = req.body;

      const category = await Category.findOne({ where: { id: categoryId } });
      
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Validate name if provided
      if (name !== undefined) {
        if (!name || name.trim().length === 0) {
          return ApiResponse.errorResponse(res, 400, "Category name cannot be empty");
        }

        // Check if name already exists (excluding current category)
        const existingCategory = await Category.findOne({
          where: { 
            name: name.trim(),
            id: { [Op.ne]: categoryId }
          }
        });

        if (existingCategory) {
          return ApiResponse.errorResponse(res, 409, "Category with this name already exists");
        }
      }

      const updates = {};
      if (name !== undefined) updates.name = name.trim();
      if (isActive !== undefined) updates.isActive = isActive;

      await category.update(updates);

      return ApiResponse.successResponse(res, 200, "Category updated successfully", { category });
    } catch (error) {
      console.error("Update category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update category");
    }
  },

  // Delete category (with validation)
  deleteCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const category = await Category.findOne({ where: { id: categoryId } });
      
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Check if category has jobs
      const jobCount = await Job.count({ where: { categoryId } });
      
      if (jobCount > 0) {
        return ApiResponse.errorResponse(res, 400, `Cannot delete category. It has ${jobCount} job(s) associated with it. Please move or delete the jobs first.`);
      }

      await category.destroy();

      return ApiResponse.successResponse(res, 200, "Category deleted successfully");
    } catch (error) {
      console.error("Delete category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete category");
    }
  },

  // Toggle category status (active/inactive)
  toggleCategoryStatus: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { isActive } = req.body;

      const category = await Category.findOne({ where: { id: categoryId } });
      
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // If deactivating, warn about jobs
      if (!isActive) {
        const activeJobCount = await Job.count({ 
          where: { 
            categoryId,
            status: 'ACTIVE'
          } 
        });
        
        if (activeJobCount > 0) {
          // Just warn but allow the action
          console.warn(`Deactivating category with ${activeJobCount} active jobs`);
        }
      }

      await category.update({ isActive });

      return ApiResponse.successResponse(res, 200, `Category ${isActive ? 'activated' : 'deactivated'} successfully`, {
        category
      });
    } catch (error) {
      console.error("Toggle category status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update category status");
    }
  },

  // Bulk delete categories
  bulkDeleteCategories: async (req, res) => {
    try {
      const { categoryIds } = req.body;

      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "Category IDs array is required");
      }

      // Check if any categories have jobs
      const categoriesWithJobs = await Category.findAll({
        where: { id: { [Op.in]: categoryIds } },
        attributes: [
          'id',
          'name',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id"
            )`), 
            'jobCount'
          ]
        ],
        raw: true
      });

      const blockedCategories = categoriesWithJobs.filter(cat => cat.jobCount > 0);
      
      if (blockedCategories.length > 0) {
        return ApiResponse.errorResponse(res, 400, 
          `Cannot delete categories with associated jobs: ${blockedCategories.map(cat => `${cat.name} (${cat.jobCount} jobs)`).join(', ')}`
        );
      }

      const result = await Category.destroy({
        where: { id: { [Op.in]: categoryIds } }
      });

      return ApiResponse.successResponse(res, 200, "Categories deleted successfully", {
        deletedCategories: result
      });
    } catch (error) {
      console.error("Bulk delete categories error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete categories");
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (req, res) => {
    try {
      const { categoryIds, isActive } = req.body;

      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "Category IDs array is required");
      }

      const result = await Category.update(
        { isActive },
        {
          where: { id: { [Op.in]: categoryIds } }
        }
      );

      return ApiResponse.successResponse(res, 200, "Category status updated successfully", {
        affectedCategories: result[0]
      });
    } catch (error) {
      console.error("Bulk update status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update category status");
    }
  },

  // Get jobs in a specific category
  getCategoryJobs: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const {
        page = 1,
        limit = 10,
        status,
        jobType
      } = req.query;

      const offset = (page - 1) * limit;

      // Check if category exists
      const category = await Category.findOne({ where: { id: categoryId } });
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Build where conditions
      const whereConditions = { categoryId };
      
      if (status && status !== 'all') {
        whereConditions.status = status;
      }
      
      if (jobType && jobType !== 'all') {
        whereConditions.jobType = jobType;
      }

      const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['companyName', 'isVerified']
          }
        ],
        attributes: [
          'id',
          'title',
          'status',
          'jobType',
          'location',
          'applicationCount',
          'createdAt'
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(totalJobs / limit);

      return ApiResponse.successResponse(res, 200, "Category jobs retrieved successfully", {
        category,
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error("Get category jobs error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve category jobs");
    }
  },

  // Get category analytics
  getCategoryAnalytics: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { period = '30d' } = req.query;

      // Check if category exists
      const category = await Category.findOne({ where: { id: categoryId } });
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      let dateFilter;
      switch (period) {
        case '7d':
          dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          dateFilter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }

      // Jobs posted over time
      const jobsOverTime = await Job.findAll({
        where: {
          categoryId,
          createdAt: { [Op.gte]: dateFilter }
        },
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')), 'date'],
          [Sequelize.fn('COUNT', '*'), 'count']
        ],
        group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt'))],
        order: [[Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')), 'ASC']],
        raw: true
      });

      // Applications over time
      const { sequelize } = require("../../models/associations");
      const applicationsOverTime = await sequelize.query(`
        SELECT 
          DATE_TRUNC('day', a."appliedAt") as date,
          COUNT(*)::int as count
        FROM applications a
        INNER JOIN jobs j ON a."jobId" = j.id
        WHERE j."categoryId" = :categoryId 
          AND a."appliedAt" >= :dateFilter
        GROUP BY DATE_TRUNC('day', a."appliedAt")
        ORDER BY DATE_TRUNC('day', a."appliedAt") ASC
      `, {
        replacements: { categoryId, dateFilter },
        type: Sequelize.QueryTypes.SELECT
      });

      // Job type distribution
      const jobTypeDistribution = await Job.findAll({
        where: { categoryId },
        attributes: [
          'jobType',
          [Sequelize.fn('COUNT', '*'), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('applicationCount')), 'totalApplications']
        ],
        group: ['jobType'],
        raw: true
      });

      const analytics = {
        category,
        period,
        jobsOverTime: jobsOverTime.map(item => ({
          date: item.date,
          count: parseInt(item.count)
        })),
        applicationsOverTime: applicationsOverTime.map(item => ({
          date: item.date,
          count: item.count
        })),
        jobTypeDistribution: jobTypeDistribution.map(item => ({
          jobType: item.jobType,
          jobCount: parseInt(item.count),
          applicationCount: parseInt(item.totalApplications) || 0
        }))
      };

      return ApiResponse.successResponse(res, 200, "Category analytics retrieved successfully", analytics);
    } catch (error) {
      console.error("Get category analytics error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve category analytics");
    }
  },

  // Export categories to CSV
  exportCategoriesCSV: async (req, res) => {
    try {
      const { status } = req.query;
      
      const whereConditions = {};
      
      if (status && status !== 'all') {
        whereConditions.isActive = status === 'active';
      }

      const categories = await Category.findAll({
        where: whereConditions,
        attributes: [
          'id',
          'name',
          'isActive',
          'createdAt',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id"
            )`), 
            'jobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM jobs 
              WHERE jobs."categoryId" = "Category"."id" 
              AND jobs."status" = 'ACTIVE'
            )`), 
            'activeJobCount'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM applications a
              INNER JOIN jobs j ON a."jobId" = j."id"
              WHERE j."categoryId" = "Category"."id"
            )`), 
            'totalApplications'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true
      });

      // Convert to CSV format
      const csvHeaders = [
        'ID',
        'Name',
        'Status',
        'Total Jobs',
        'Active Jobs',
        'Total Applications',
        'Created At'
      ].join(',');

      const csvData = categories.map(category => {
        return [
          category.id,
          `"${category.name}"`,
          category.isActive ? 'Active' : 'Inactive',
          category.jobCount || 0,
          category.activeJobCount || 0,
          category.totalApplications || 0,
          new Date(category.createdAt).toISOString()
        ].join(',');
      }).join('\n');

      const csv = `${csvHeaders}\n${csvData}`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=categories-export-${Date.now()}.csv`);
      
      return res.send(csv);
    } catch (error) {
      console.error("Export categories CSV error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to export categories");
    }
  },

  // Reorder categories (for future drag-and-drop functionality)
  reorderCategories: async (req, res) => {
    try {
      const { categoryOrders } = req.body;

      if (!Array.isArray(categoryOrders)) {
        return ApiResponse.errorResponse(res, 400, "Category orders array is required");
      }

      // Update each category with its new order
      const updatePromises = categoryOrders.map(({ categoryId, order }) => {
        return Category.update(
          { displayOrder: order },
          { where: { id: categoryId } }
        );
      });

      await Promise.all(updatePromises);

      return ApiResponse.successResponse(res, 200, "Categories reordered successfully");
    } catch (error) {
      console.error("Reorder categories error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to reorder categories");
    }
  }
};

module.exports = adminCategoriesController;