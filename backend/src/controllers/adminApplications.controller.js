const { Application, Student, User, Job, Company, Category } = require("../../models/associations");
const { successResponse, errorResponse, notFoundResponse } = require("../utils/response");
const { Op } = require("sequelize");

const adminApplicationsController = {
  // Get all applications with filters and pagination
  getAllApplications: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        jobId,
        studentId,
        companyId,
        search,
        dateFrom,
        dateTo,
        sortBy = 'appliedAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};
      const jobWhereClause = {};
      const studentWhereClause = {};
      const userWhereClause = {};

      // Apply filters
      if (status) {
        whereClause.status = status;
      }

      if (jobId) {
        whereClause.jobId = jobId;
      }

      if (studentId) {
        whereClause.studentId = studentId;
      }

      if (companyId) {
        jobWhereClause.companyId = companyId;
      }

      if (search) {
        userWhereClause[Op.or] = [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (dateFrom || dateTo) {
        whereClause.appliedAt = {};
        if (dateFrom) {
          whereClause.appliedAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.appliedAt[Op.lte] = new Date(dateTo);
        }
      }

      const { rows: applications, count } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            where: Object.keys(studentWhereClause).length > 0 ? studentWhereClause : undefined,
            include: [
              {
                model: User,
                as: 'user',
                where: Object.keys(userWhereClause).length > 0 ? userWhereClause : undefined,
                attributes: ['user_id', 'fullName', 'email', 'phoneNumber', 'image']
              }
            ]
          },
          {
            model: Job,
            as: 'job',
            where: Object.keys(jobWhereClause).length > 0 ? jobWhereClause : undefined,
            include: [
              {
                model: Company,
                as: 'company',
                attributes: ['id', 'companyName', 'industry'],
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['fullName', 'email']
                  }
                ]
              },
              {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true
      });

      successResponse(res, 200, "Applications retrieved successfully", {
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      errorResponse(res, 500, "Failed to fetch applications");
    }
  },

  // Get application by ID with detailed information
  getApplicationById: async (req, res) => {
    try {
      const { id } = req.params;

      const application = await Application.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['user_id', 'fullName', 'email', 'phoneNumber', 'location', 'image']
              }
            ]
          },
          {
            model: Job,
            as: 'job',
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
                as: 'category',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });

      if (!application) {
        return notFoundResponse(res, "Application not found");
      }

      successResponse(res, 200, "Application details retrieved successfully", application);
    } catch (error) {
      console.error("Error fetching application details:", error);
      errorResponse(res, 500, "Failed to fetch application details");
    }
  },

  // Update application status
  updateApplicationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, feedback, rejectionReason, interviewDate, interviewType, interviewNotes } = req.body;

      const application = await Application.findByPk(id);

      if (!application) {
        return notFoundResponse(res, "Application not found");
      }

      const updateData = { status };

      if (feedback) updateData.feedback = feedback;
      if (rejectionReason) updateData.rejectionReason = rejectionReason;
      if (interviewDate) updateData.interviewDate = interviewDate;
      if (interviewType) updateData.interviewType = interviewType;
      if (interviewNotes) updateData.interviewNotes = interviewNotes;

      // Set respondedAt when status changes from PENDING
      if (application.status === 'PENDING' && status !== 'PENDING') {
        updateData.respondedAt = new Date();
      }

      await application.update(updateData);

      successResponse(res, 200, "Application status updated successfully", {
        applicationId: id,
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      errorResponse(res, 500, "Failed to update application status");
    }
  },

  // Delete application
  deleteApplication: async (req, res) => {
    try {
      const { id } = req.params;

      const application = await Application.findByPk(id);

      if (!application) {
        return notFoundResponse(res, "Application not found");
      }

      await application.destroy();

      // Update job application count
      const job = await Job.findByPk(application.jobId);
      if (job && job.applicationCount > 0) {
        await job.update({ applicationCount: job.applicationCount - 1 });
      }

      successResponse(res, 200, "Application deleted successfully", {
        applicationId: id
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      errorResponse(res, 500, "Failed to delete application");
    }
  },

  // Get applications statistics overview
  getApplicationsStats: async (req, res) => {
    try {
      const totalApplications = await Application.count();

      const statusCounts = await Application.findAll({
        attributes: [
          'status',
          [Application.sequelize.fn('COUNT', Application.sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      // Recent applications (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const recentApplications = await Application.count({
        where: {
          appliedAt: { [Op.gte]: weekAgo }
        }
      });

      // Applications today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayApplications = await Application.count({
        where: {
          appliedAt: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });

      // Average response time (for responded applications)
      const respondedApplications = await Application.findAll({
        where: {
          respondedAt: { [Op.not]: null },
          appliedAt: { [Op.not]: null }
        },
        attributes: ['appliedAt', 'respondedAt']
      });

      let avgResponseTime = 0;
      if (respondedApplications.length > 0) {
        const totalResponseTime = respondedApplications.reduce((sum, app) => {
          const responseTime = new Date(app.respondedAt) - new Date(app.appliedAt);
          return sum + responseTime;
        }, 0);
        avgResponseTime = Math.round(totalResponseTime / respondedApplications.length / (1000 * 60 * 60 * 24)); // in days
      }

      const statusDistribution = statusCounts.map(stat => ({
        status: stat.status,
        count: parseInt(stat.dataValues.count)
      }));

      successResponse(res, 200, "Application statistics retrieved successfully", {
        overview: {
          totalApplications,
          recentApplications,
          todayApplications,
          avgResponseTime
        },
        statusDistribution
      });
    } catch (error) {
      console.error("Error fetching application statistics:", error);
      errorResponse(res, 500, "Failed to fetch application statistics");
    }
  },

  // Get status distribution
  getStatusDistribution: async (req, res) => {
    try {
      const { dateFrom, dateTo, companyId, categoryId } = req.query;

      const whereClause = {};
      const jobWhereClause = {};

      if (dateFrom || dateTo) {
        whereClause.appliedAt = {};
        if (dateFrom) whereClause.appliedAt[Op.gte] = new Date(dateFrom);
        if (dateTo) whereClause.appliedAt[Op.lte] = new Date(dateTo);
      }

      if (companyId) {
        jobWhereClause.companyId = companyId;
      }

      if (categoryId) {
        jobWhereClause.categoryId = categoryId;
      }

      const statusDistribution = await Application.findAll({
        attributes: [
          'status',
          [Application.sequelize.fn('COUNT', Application.sequelize.col('Application.id')), 'count']
        ],
        where: whereClause,
        include: Object.keys(jobWhereClause).length > 0 ? [
          {
            model: Job,
            as: 'job',
            where: jobWhereClause,
            attributes: []
          }
        ] : [],
        group: ['status'],
        order: [[Application.sequelize.fn('COUNT', Application.sequelize.col('Application.id')), 'DESC']]
      });

      const distribution = statusDistribution.map(stat => ({
        status: stat.status,
        count: parseInt(stat.dataValues.count)
      }));

      successResponse(res, 200, "Status distribution retrieved successfully", {
        distribution
      });
    } catch (error) {
      console.error("Error fetching status distribution:", error);
      errorResponse(res, 500, "Failed to fetch status distribution");
    }
  },

  // Get application trends over time
  getApplicationTrends: async (req, res) => {
    try {
      const { period = 'week', limit = 30 } = req.query;

      let dateFormat;
      let dateInterval;

      switch (period) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          dateInterval = '1 DAY';
          break;
        case 'week':
          dateFormat = '%Y-%u';
          dateInterval = '1 WEEK';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          dateInterval = '1 MONTH';
          break;
        default:
          dateFormat = '%Y-%m-%d';
          dateInterval = '1 DAY';
      }

      const trends = await Application.findAll({
        attributes: [
          [Application.sequelize.fn('DATE_FORMAT', Application.sequelize.col('appliedAt'), dateFormat), 'period'],
          [Application.sequelize.fn('COUNT', Application.sequelize.col('id')), 'count']
        ],
        where: {
          appliedAt: {
            [Op.gte]: Application.sequelize.literal(`NOW() - INTERVAL ${limit} ${period.toUpperCase()}`)
          }
        },
        group: [Application.sequelize.fn('DATE_FORMAT', Application.sequelize.col('appliedAt'), dateFormat)],
        order: [[Application.sequelize.fn('DATE_FORMAT', Application.sequelize.col('appliedAt'), dateFormat), 'ASC']],
        limit: parseInt(limit)
      });

      const trendData = trends.map(trend => ({
        period: trend.dataValues.period,
        count: parseInt(trend.dataValues.count)
      }));

      successResponse(res, 200, "Application trends retrieved successfully", {
        trends: trendData,
        period
      });
    } catch (error) {
      console.error("Error fetching application trends:", error);
      errorResponse(res, 500, "Failed to fetch application trends");
    }
  },

  // Get top jobs by application count
  getTopJobsByApplications: async (req, res) => {
    try {
      const { limit = 10 } = req.query;

      const topJobs = await Job.findAll({
        attributes: [
          'id', 
          'title', 
          'jobType', 
          'status',
          [Job.sequelize.fn('COUNT', Job.sequelize.col('applications.id')), 'applicationCount']
        ],
        include: [
          {
            model: Application,
            as: 'applications',
            attributes: []
          },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'companyName']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ],
        group: ['Job.id', 'company.id', 'category.id'],
        order: [[Job.sequelize.fn('COUNT', Job.sequelize.col('applications.id')), 'DESC']],
        limit: parseInt(limit)
      });

      const jobsWithCounts = topJobs.map(job => ({
        ...job.toJSON(),
        applicationCount: parseInt(job.dataValues.applicationCount)
      }));

      successResponse(res, 200, "Top jobs by applications retrieved successfully", {
        topJobs: jobsWithCounts
      });
    } catch (error) {
      console.error("Error fetching top jobs by applications:", error);
      errorResponse(res, 500, "Failed to fetch top jobs by applications");
    }
  },

  // Bulk update applications status
  bulkUpdateStatus: async (req, res) => {
    try {
      const { applicationIds, status, feedback, rejectionReason } = req.body;

      if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
        return errorResponse(res, 400, "Application IDs are required");
      }

      if (!status) {
        return errorResponse(res, 400, "Status is required");
      }

      const updateData = { 
        status,
        respondedAt: new Date()
      };

      if (feedback) updateData.feedback = feedback;
      if (rejectionReason) updateData.rejectionReason = rejectionReason;

      const [updatedCount] = await Application.update(updateData, {
        where: {
          id: {
            [Op.in]: applicationIds
          }
        }
      });

      successResponse(res, 200, "Applications updated successfully", {
        updatedCount,
        status
      });
    } catch (error) {
      console.error("Error bulk updating applications:", error);
      errorResponse(res, 500, "Failed to bulk update applications");
    }
  }
};

module.exports = adminApplicationsController;