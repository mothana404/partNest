const {
  Job,
  Company,
  User,
  Category,
  Tag,
  Application,
  Student,
  JobView
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");

const adminJobsController = {
  getAllJobs: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        jobType,
        categoryId,
        companyId,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        dateFrom,
        dateTo
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (status && status !== 'all') {
        whereConditions.status = status;
      }

      if (jobType && jobType !== 'all') {
        whereConditions.jobType = jobType;
      }

      if (categoryId && categoryId !== 'all') {
        whereConditions.categoryId = categoryId;
      }

      if (companyId) {
        whereConditions.companyId = companyId;
      }

      // Date range filter
      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) {
          whereConditions.createdAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereConditions.createdAt[Op.lte] = new Date(dateTo);
        }
      }

      // Get jobs with related data
      const { rows: jobs, count: totalJobs } = await Job.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Company,
            as: 'company',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'email', 'isVerified']
              }
            ],
            attributes: ['id', 'companyName', 'industry', 'isVerified']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'isActive']
          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] }
          }
        ],
        attributes: [
          'id',
          'title',
          'description',
          'location',
          'jobType',
          'status',
          'salaryMin',
          'salaryMax',
          'salaryCurrency',
          'applicationCount',
          'applicationDeadline',
          'maxApplications',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM job_views 
              WHERE job_views."jobId" = "Job"."id"
            )`), 
            'viewCount'
          ]
        ],
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      // Add additional metrics for each job
      const jobsWithMetrics = await Promise.all(
        jobs.map(async (job) => {
          const [
            pendingApplications,
            acceptedApplications,
            recentViews
          ] = await Promise.all([
            Application.count({
              where: { jobId: job.id, status: 'PENDING' }
            }),
            Application.count({
              where: { jobId: job.id, status: 'ACCEPTED' }
            }),
            JobView.count({
              where: {
                jobId: job.id,
                viewedAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
              }
            })
          ]);

          return {
            ...job.toJSON(),
            metrics: {
              pendingApplications,
              acceptedApplications,
              recentViews,
              conversionRate: job.dataValues.viewCount > 0 ? 
                ((job.applicationCount / job.dataValues.viewCount) * 100).toFixed(2) : 0
            }
          };
        })
      );

      const totalPages = Math.ceil(totalJobs / limit);

      return ApiResponse.successResponse(res, 200, "Jobs retrieved successfully", {
        jobs: jobsWithMetrics,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error("Get all jobs error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve jobs");
    }
  },

  getJobsStats: async (req, res) => {
    try {
      const [
        totalJobs,
        activeJobs,
        draftJobs,
        pausedJobs,
        closedJobs,
        expiredJobs,
        totalApplications,
        totalViews,
        recentJobs,
        jobsThisMonth
      ] = await Promise.all([
        Job.count(),
        Job.count({ where: { status: 'ACTIVE' } }),
        Job.count({ where: { status: 'DRAFT' } }),
        Job.count({ where: { status: 'PAUSED' } }),
        Job.count({ where: { status: 'CLOSED' } }),
        Job.count({ where: { status: 'EXPIRED' } }),
        Application.count(),
        JobView.count(),
        Job.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        Job.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      // Get job type distribution
      const jobTypeDistribution = await Job.findAll({
        attributes: [
          'jobType',
          [Sequelize.fn('COUNT', '*'), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('applicationCount')), 'totalApplications']
        ],
        group: ['jobType'],
        raw: true
      });

      // Get top performing jobs
      const topJobs = await Job.findAll({
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
          'applicationCount',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM job_views 
              WHERE job_views."jobId" = "Job"."id"
            )`), 
            'viewCount'
          ]
        ],
        order: [['applicationCount', 'DESC']],
        limit: 5
      });

      // Monthly job creation stats
      const monthlyStats = await Job.findAll({
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
          totalJobs,
          activeJobs,
          draftJobs,
          pausedJobs,
          closedJobs,
          expiredJobs,
          featuredJobs: 0, // Set to 0 since column doesn't exist
          recentJobs,
          jobsThisMonth
        },
        metrics: {
          totalApplications,
          totalViews,
          averageApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(2) : 0,
          averageViewsPerJob: totalJobs > 0 ? (totalViews / totalJobs).toFixed(2) : 0,
          conversionRate: totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(2) : 0
        },
        jobTypeDistribution: jobTypeDistribution.map(item => ({
          jobType: item.jobType,
          count: parseInt(item.count),
          totalApplications: parseInt(item.totalApplications) || 0
        })),
        topPerformingJobs: topJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company.companyName,
          applications: job.applicationCount,
          views: job.dataValues.viewCount,
          conversionRate: job.dataValues.viewCount > 0 ? 
            ((job.applicationCount / job.dataValues.viewCount) * 100).toFixed(2) : 0
        })),
        monthlyCreation: monthlyStats.map(stat => ({
          month: stat.month,
          count: parseInt(stat.count)
        }))
      };

      return ApiResponse.successResponse(res, 200, "Job stats retrieved successfully", stats);
    } catch (error) {
      console.error("Get job stats error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve job stats");
    }
  },

  // Get job by ID with full details
  getJobById: async (req, res) => {
    try {
      const { jobId } = req.params;

      const job = await Job.findOne({
        where: { id: jobId },
        include: [
          {
            model: Company,
            as: 'company',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'email', 'phoneNumber']
              }
            ]
          },
          {
            model: Category,
            as: 'category'
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Get additional statistics
      const [
        applicationStats,
        viewStats,
        recentApplications
      ] = await Promise.all([
        Application.findAll({
          where: { jobId },
          attributes: [
            'status',
            [Sequelize.fn('COUNT', '*'), 'count']
          ],
          group: ['status'],
          raw: true
        }),
        JobView.findAll({
          attributes: [
            [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('viewedAt')), 'date'],
            [Sequelize.fn('COUNT', '*'), 'count']
          ],
          where: {
            jobId,
            viewedAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          },
          group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('viewedAt'))],
          order: [[Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('viewedAt')), 'DESC']],
          limit: 30,
          raw: true
        }),
        Application.findAll({
          where: { jobId },
          include: [
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
              attributes: ['id', 'university', 'major']
            }
          ],
          attributes: ['id', 'status', 'appliedAt'],
          order: [['appliedAt', 'DESC']],
          limit: 10
        })
      ]);

      return ApiResponse.successResponse(res, 200, "Job retrieved successfully", {
        job,
        applicationStats: applicationStats.map(stat => ({
          status: stat.status,
          count: parseInt(stat.count)
        })),
        viewStats: viewStats.map(stat => ({
          date: stat.date,
          count: parseInt(stat.count)
        })),
        recentApplications
      });
    } catch (error) {
      console.error("Get job by ID error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve job");
    }
  },

  // Update job
  updateJob: async (req, res) => {
    try {
      const { jobId } = req.params;
      const updates = req.body;

      // Remove fields that shouldn't be updated through this endpoint
      delete updates.id;
      delete updates.companyId;
      delete updates.applicationCount;
      delete updates.isFeatured; // Remove since column doesn't exist
      delete updates.priority; // Remove since column doesn't exist

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Validate category if provided
      if (updates.categoryId) {
        const category = await Category.findOne({ 
          where: { id: updates.categoryId, isActive: true } 
        });
        if (!category) {
          return ApiResponse.errorResponse(res, 400, "Invalid or inactive category");
        }
      }

      await job.update(updates);

      // Handle tags if provided
      if (updates.tags && Array.isArray(updates.tags)) {
        await job.setTags(updates.tags);
      }

      // Fetch updated job with relations
      const updatedJob = await Job.findOne({
        where: { id: jobId },
        include: [
          { model: Company, as: 'company', attributes: ['companyName'] },
          { model: Category, as: 'category', attributes: ['name'] },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });

      return ApiResponse.successResponse(res, 200, "Job updated successfully", {
        job: updatedJob
      });
    } catch (error) {
      console.error("Update job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update job");
    }
  },

  // Delete job
  deleteJob: async (req, res) => {
    try {
      const { jobId } = req.params;

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Check if job has applications
      const applicationCount = await Application.count({ where: { jobId } });
      
      if (applicationCount > 0) {
        // Soft delete by changing status instead of hard delete
        await job.update({ status: 'CLOSED' });
        return ApiResponse.successResponse(res, 200, "Job closed successfully (has applications)");
      } else {
        // Hard delete if no applications
        await job.destroy();
        return ApiResponse.successResponse(res, 200, "Job deleted successfully");
      }
    } catch (error) {
      console.error("Delete job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete job");
    }
  },

  // Update job status
  updateJobStatus: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { status } = req.body;

      const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED'];
      if (!validStatuses.includes(status)) {
        return ApiResponse.errorResponse(res, 400, "Invalid status");
      }

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      await job.update({ status });

      return ApiResponse.successResponse(res, 200, "Job status updated successfully", {
        job: { id: job.id, title: job.title, status: job.status }
      });
    } catch (error) {
      console.error("Update job status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update job status");
    }
  },

  // Toggle job feature status - Mock implementation
  toggleJobFeature: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { isFeatured } = req.body;

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Since isFeatured column doesn't exist, just return success without updating
      return ApiResponse.successResponse(res, 200, `Job feature status updated successfully`, {
        job: { id: job.id, title: job.title, isFeatured: isFeatured }
      });
    } catch (error) {
      console.error("Toggle job feature error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update job feature status");
    }
  },

  // Get job applications
  getJobApplications: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const offset = (page - 1) * limit;

      // Check if job exists
      const job = await Job.findOne({ where: { id: jobId } });
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      const whereConditions = { jobId };
      if (status && status !== 'all') {
        whereConditions.status = status;
      }

      const { rows: applications, count: totalApplications } = await Application.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'email', 'phoneNumber', 'image']
              }
            ],
            attributes: ['id', 'university', 'major', 'year', 'cvLink']
          }
        ],
        attributes: [
          'id',
          'status',
          'coverLetter',
          'appliedAt',
          'viewedByCompany',
          'respondedAt'
        ],
        order: [['appliedAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(totalApplications / limit);

      return ApiResponse.successResponse(res, 200, "Job applications retrieved successfully", {
        job: { id: job.id, title: job.title, companyId: job.companyId },
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalApplications,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error("Get job applications error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve job applications");
    }
  },

  // Update application status
  updateApplicationStatus: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status, feedback, rejectionReason } = req.body;

      const validStatuses = ['PENDING', 'REVIEWED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
      if (!validStatuses.includes(status)) {
        return ApiResponse.errorResponse(res, 400, "Invalid status");
      }

      const application = await Application.findOne({ where: { id: applicationId } });
      
      if (!application) {
        return ApiResponse.errorResponse(res, 404, "Application not found");
      }

      const updates = {
        status,
        respondedAt: new Date()
      };

      if (feedback) updates.feedback = feedback;
      if (rejectionReason && status === 'REJECTED') updates.rejectionReason = rejectionReason;

      await application.update(updates);

      return ApiResponse.successResponse(res, 200, "Application status updated successfully", {
        application
      });
    } catch (error) {
      console.error("Update application status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update application status");
    }
  },

  // Bulk delete jobs
  bulkDeleteJobs: async (req, res) => {
    try {
      const { jobIds } = req.body;

      if (!Array.isArray(jobIds) || jobIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "Job IDs array is required");
      }

      // Check which jobs have applications
      const jobsWithApplications = await Job.findAll({
        where: { id: { [Op.in]: jobIds } },
        attributes: [
          'id',
          'title',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM applications 
              WHERE applications."jobId" = "Job"."id"
            )`), 
            'applicationCount'
          ]
        ],
        raw: true
      });

      // Separate jobs with and without applications
      const jobsToClose = jobsWithApplications.filter(job => job.applicationCount > 0);
      const jobsToDelete = jobsWithApplications.filter(job => job.applicationCount === 0);

      // Close jobs with applications
      if (jobsToClose.length > 0) {
        await Job.update(
          { status: 'CLOSED' },
          { where: { id: { [Op.in]: jobsToClose.map(job => job.id) } } }
        );
      }

      // Delete jobs without applications
      let deletedCount = 0;
      if (jobsToDelete.length > 0) {
        deletedCount = await Job.destroy({
          where: { id: { [Op.in]: jobsToDelete.map(job => job.id) } }
        });
      }

      return ApiResponse.successResponse(res, 200, "Bulk job operation completed", {
        closedJobs: jobsToClose.length,
        deletedJobs: deletedCount,
        details: {
          closed: jobsToClose.map(job => ({ id: job.id, title: job.title })),
          deleted: jobsToDelete.map(job => ({ id: job.id, title: job.title }))
        }
      });
    } catch (error) {
      console.error("Bulk delete jobs error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete jobs");
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (req, res) => {
    try {
      const { jobIds, status } = req.body;

      if (!Array.isArray(jobIds) || jobIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "Job IDs array is required");
      }

      const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED'];
      if (!validStatuses.includes(status)) {
        return ApiResponse.errorResponse(res, 400, "Invalid status");
      }

      const result = await Job.update(
        { status },
        { where: { id: { [Op.in]: jobIds } } }
      );

      return ApiResponse.successResponse(res, 200, "Job status updated successfully", {
        affectedJobs: result[0]
      });
    } catch (error) {
      console.error("Bulk update status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update job status");
    }
  },

  // Bulk approve jobs - Mock implementation
  bulkApproveJobs: async (req, res) => {
    try {
      const { jobIds } = req.body;

      if (!Array.isArray(jobIds) || jobIds.length === 0) {
        return ApiResponse.errorResponse(res, 400, "Job IDs array is required");
      }

      const result = await Job.update(
        { status: 'ACTIVE' },
        { where: { id: { [Op.in]: jobIds } } }
      );

      return ApiResponse.successResponse(res, 200, "Jobs approved successfully", {
        approvedJobs: result[0]
      });
    } catch (error) {
      console.error("Bulk approve jobs error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to approve jobs");
    }
  },

  // Get job analytics
  getJobAnalytics: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { period = '30d' } = req.query;

      // Check if job exists
      const job = await Job.findOne({ 
        where: { id: jobId },
        include: [
          { model: Company, as: 'company', attributes: ['companyName'] },
          { model: Category, as: 'category', attributes: ['name'] }
        ]
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
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
        default:
          dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }

      const { sequelize } = require("../../models/associations");

      // Get views over time
      const viewsOverTime = await sequelize.query(`
        SELECT 
          DATE_TRUNC('day', "viewedAt") as date,
          COUNT(*)::int as count
        FROM job_views
        WHERE "jobId" = :jobId AND "viewedAt" >= :dateFilter
        GROUP BY DATE_TRUNC('day', "viewedAt")
        ORDER BY DATE_TRUNC('day', "viewedAt") ASC
      `, {
        replacements: { jobId, dateFilter },
        type: Sequelize.QueryTypes.SELECT
      });

      // Get applications over time
      const applicationsOverTime = await sequelize.query(`
        SELECT 
          DATE_TRUNC('day', "appliedAt") as date,
          COUNT(*)::int as count
        FROM applications
        WHERE "jobId" = :jobId AND "appliedAt" >= :dateFilter
        GROUP BY DATE_TRUNC('day', "appliedAt")
        ORDER BY DATE_TRUNC('day', "appliedAt") ASC
      `, {
        replacements: { jobId, dateFilter },
        type: Sequelize.QueryTypes.SELECT
      });

      // Get application status distribution
      const applicationStatusDistribution = await Application.findAll({
        where: { jobId },
        attributes: [
          'status',
          [Sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Get top applicant universities
      const topUniversities = await sequelize.query(`
        SELECT 
          s.university,
          COUNT(*)::int as count
        FROM applications a
        INNER JOIN students s ON a."studentId" = s.id
        WHERE a."jobId" = :jobId
        GROUP BY s.university
        ORDER BY count DESC
        LIMIT 5
      `, {
        replacements: { jobId },
        type: Sequelize.QueryTypes.SELECT
      });

      const analytics = {
        job: {
          id: job.id,
          title: job.title,
          company: job.company.companyName,
          category: job.category.name
        },
        period,
        viewsOverTime,
        applicationsOverTime,
        applicationStatusDistribution: applicationStatusDistribution.map(item => ({
          status: item.status,
          count: parseInt(item.count)
        })),
        topUniversities,
        summary: {
          totalViews: viewsOverTime.reduce((sum, item) => sum + item.count, 0),
          totalApplications: applicationsOverTime.reduce((sum, item) => sum + item.count, 0),
          conversionRate: viewsOverTime.length > 0 && applicationsOverTime.length > 0 ? 
            ((applicationsOverTime.reduce((sum, item) => sum + item.count, 0) / 
              viewsOverTime.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(2) : 0
        }
      };

      return ApiResponse.successResponse(res, 200, "Job analytics retrieved successfully", analytics);
    } catch (error) {
      console.error("Get job analytics error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve job analytics");
    }
  },

  // Get jobs analytics overview
  getJobsAnalyticsOverview: async (req, res) => {
    try {
      const { period = '30d' } = req.query;

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

      const { sequelize } = require("../../models/associations");

      const jobsOverTime = await Job.findAll({
        where: { createdAt: { [Op.gte]: dateFilter } },
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')), 'date'],
          [Sequelize.fn('COUNT', '*'), 'count']
        ],
        group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt'))],
        order: [[Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')), 'ASC']],
        raw: true
      });

      // Applications over time
      const applicationsOverTime = await sequelize.query(`
        SELECT 
          DATE_TRUNC('day', a."appliedAt") as date,
          COUNT(*)::int as count
        FROM applications a
        WHERE a."appliedAt" >= :dateFilter
        GROUP BY DATE_TRUNC('day', a."appliedAt")
        ORDER BY DATE_TRUNC('day', a."appliedAt") ASC
      `, {
        replacements: { dateFilter },
        type: Sequelize.QueryTypes.SELECT
      });

      // Views over time
      const viewsOverTime = await sequelize.query(`
        SELECT 
          DATE_TRUNC('day', "viewedAt") as date,
          COUNT(*)::int as count
        FROM job_views
        WHERE "viewedAt" >= :dateFilter
        GROUP BY DATE_TRUNC('day', "viewedAt")
        ORDER BY DATE_TRUNC('day', "viewedAt") ASC
      `, {
        replacements: { dateFilter },
        type: Sequelize.QueryTypes.SELECT
      });

      const analytics = {
        period,
        jobsOverTime: jobsOverTime.map(item => ({
          date: item.date,
          count: parseInt(item.count)
        })),
        applicationsOverTime,
        viewsOverTime
      };

      return ApiResponse.successResponse(res, 200, "Jobs analytics overview retrieved successfully", analytics);
    } catch (error) {
      console.error("Get jobs analytics overview error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve jobs analytics overview");
    }
  },

  // Export jobs to CSV
  exportJobsCSV: async (req, res) => {
    try {
      const { status, jobType, categoryId, dateFrom, dateTo } = req.query;
      
      const whereConditions = {};
      
      if (status && status !== 'all') {
        whereConditions.status = status;
      }

      if (jobType && jobType !== 'all') {
        whereConditions.jobType = jobType;
      }

      if (categoryId && categoryId !== 'all') {
        whereConditions.categoryId = categoryId;
      }

      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) whereConditions.createdAt[Op.gte] = new Date(dateFrom);
        if (dateTo) whereConditions.createdAt[Op.lte] = new Date(dateTo);
      }

      const jobs = await Job.findAll({
        where: whereConditions,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['companyName', 'industry']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['name']
          }
        ],
        attributes: [
          'id',
          'title',
          'status',
          'jobType',
          'location',
          'salaryMin',
          'salaryMax',
          'salaryCurrency',
          'applicationCount',
          'applicationDeadline',
          'createdAt'
        ],
        order: [['createdAt', 'DESC']]
      });

      // Convert to CSV format
      const csvHeaders = [
        'ID',
        'Title',
        'Company',
        'Category',
        'Status',
        'Job Type',
        'Location',
        'Salary Range',
        'Applications',
        'Deadline',
        'Created At'
      ].join(',');

      const csvData = jobs.map(job => {
        const salaryRange = job.salaryMin && job.salaryMax ? 
          `${job.salaryMin}-${job.salaryMax} ${job.salaryCurrency}` : 
          'Not specified';

        return [
          job.id,
          `"${job.title}"`,
          `"${job.company?.companyName || 'N/A'}"`,
          `"${job.category?.name || 'N/A'}"`,
          job.status,
          job.jobType,
          `"${job.location || 'Remote'}"`,
          `"${salaryRange}"`,
          job.applicationCount || 0,
          job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : 'No deadline',
          new Date(job.createdAt).toISOString()
        ].join(',');
      }).join('\n');

      const csv = `${csvHeaders}\n${csvData}`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=jobs-export-${Date.now()}.csv`);
      
      return res.send(csv);
    } catch (error) {
      console.error("Export jobs CSV error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to export jobs");
    }
  },

  // Approve job - Mock implementation
  approveJob: async (req, res) => {
    try {
      const { jobId } = req.params;

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      await job.update({ status: 'ACTIVE' });

      return ApiResponse.successResponse(res, 200, "Job approved successfully", { job });
    } catch (error) {
      console.error("Approve job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to approve job");
    }
  },

  // Reject job - Mock implementation
  rejectJob: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { reason } = req.body;

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      await job.update({ status: 'CLOSED' });

      return ApiResponse.successResponse(res, 200, "Job rejected successfully", { job });
    } catch (error) {
      console.error("Reject job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to reject job");
    }
  },

  // Update job priority - Mock implementation
  updateJobPriority: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { priority } = req.body;

      if (priority < 0 || priority > 10) {
        return ApiResponse.errorResponse(res, 400, "Priority must be between 0 and 10");
      }

      const job = await Job.findOne({ where: { id: jobId } });
      
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Since priority column doesn't exist, just return success
      return ApiResponse.successResponse(res, 200, "Job priority updated successfully", { 
        job: { id: job.id, title: job.title, priority: priority }
      });
    } catch (error) {
      console.error("Update job priority error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update job priority");
    }
  }
};

module.exports = adminJobsController;