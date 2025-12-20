const {
  Job,
  Company,
  User,
  Category,
  Tag,
  Application,
  Student,
  JobView,
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");

const companyDashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      // Fix: Get company from database instead of assuming it's on req.user
      const company = await Company.findOne({ where: { userId: req.user.user_id } });
      if (!company) {
        return ApiResponse.errorResponse(res, 404, "Company profile not found");
      }
      const companyId = company.id;

      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const yesterdayStart = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      yesterdayStart.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      yesterdayEnd.setHours(23, 59, 59, 999);

      // Get comprehensive stats
      const [
        totalJobs,
        activeJobs,
        draftJobs,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        totalViews,
        monthlyApplications,
        weeklyApplications,
        yesterdayApplications,
        monthlyViews,
        weeklyViews,
        yesterdayViews,
      ] = await Promise.all([
        // Job counts
        Job.count({ where: { companyId } }),
        Job.count({ where: { companyId, status: 'ACTIVE' } }),
        Job.count({ where: { companyId, status: 'DRAFT' } }),
        
        // Application counts - Fix: Use subquery instead of include for count
        Application.count({
          where: {
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        Application.count({
          where: { 
            status: 'PENDING',
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        Application.count({
          where: { 
            status: 'ACCEPTED',
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        Application.count({
          where: { 
            status: 'REJECTED',
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        
        // View counts - Fix: Use subquery instead of include for count
        JobView.count({
          where: {
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        
        // Time-based application counts
        Application.count({
          where: { 
            appliedAt: { [Op.gte]: thirtyDaysAgo },
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        Application.count({
          where: { 
            appliedAt: { [Op.gte]: sevenDaysAgo },
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        Application.count({
          where: { 
            appliedAt: { [Op.between]: [yesterdayStart, yesterdayEnd] },
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        
        // Time-based view counts
        JobView.count({
          where: { 
            viewedAt: { [Op.gte]: thirtyDaysAgo },
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        JobView.count({
          where: { 
            viewedAt: { [Op.gte]: sevenDaysAgo },
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
        JobView.count({
          where: { 
            viewedAt: { [Op.between]: [yesterdayStart, yesterdayEnd] },
            '$job.companyId$': companyId
          },
          include: [{ model: Job, as: 'job', attributes: [] }]
        }),
      ]);

      // Calculate metrics
      const conversionRate = totalViews > 0 ? 
        ((totalApplications / totalViews) * 100).toFixed(1) : 0;

      const acceptanceRate = totalApplications > 0 ? 
        ((acceptedApplications / totalApplications) * 100).toFixed(1) : 0;

      // Get top performing jobs - Fix: Use proper subquery for viewCount
      const topJobs = await Job.findAll({
        where: { companyId, status: 'ACTIVE' },
        attributes: [
          'id',
          'title',
          'applicationCount',
          'createdAt',
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
        limit: 5,
        raw: true
      });

      // Fix: Improve growth rate calculation
      const calculateGrowthRate = (weekly, monthly) => {
        if (monthly === 0) return 0;
        const previousWeek = monthly - weekly;
        if (previousWeek === 0) return weekly > 0 ? 100 : 0;
        return (((weekly - previousWeek) / previousWeek) * 100).toFixed(1);
      };

      const applicationGrowthRate = calculateGrowthRate(weeklyApplications, monthlyApplications);
      const viewGrowthRate = calculateGrowthRate(weeklyViews, monthlyViews);

      const stats = {
        overview: {
          totalJobs,
          activeJobs,
          draftJobs,
          totalApplications,
          totalViews,
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications,
          monthly: monthlyApplications,
          weekly: weeklyApplications,
          yesterday: yesterdayApplications,
          growthRate: parseFloat(applicationGrowthRate),
        },
        views: {
          total: totalViews,
          monthly: monthlyViews,
          weekly: weeklyViews,
          yesterday: yesterdayViews,
          growthRate: parseFloat(viewGrowthRate),
        },
        metrics: {
          conversionRate: parseFloat(conversionRate),
          acceptanceRate: parseFloat(acceptanceRate),
          averageApplicationsPerJob: activeJobs > 0 ? 
            parseFloat((totalApplications / activeJobs).toFixed(1)) : 0,
        },
        topPerformingJobs: topJobs.map(job => ({
          id: job.id,
          title: job.title,
          applications: job.applicationCount || 0,
          views: parseInt(job.viewCount) || 0,
          createdAt: job.createdAt,
        }))
      };

      return ApiResponse.successResponse(
        res,
        200,
        "Dashboard stats retrieved successfully",
        stats
      );
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve dashboard stats");
    }
  },

  getAnalytics: async (req, res) => {
  try {
    // Fix: Get company from database
    const company = await Company.findOne({ where: { userId: req.user.user_id } });
    if (!company) {
      return ApiResponse.errorResponse(res, 404, "Company profile not found");
    }
    const companyId = company.id;

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

    // Get applications over time - Fix: Use proper table alias
    const applicationsOverTime = await Application.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('Application.appliedAt')), 'date'],
        [Sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        appliedAt: { [Op.gte]: dateFilter },
        '$job.companyId$': companyId
      },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: [],
          required: true
        }
      ],
      group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('Application.appliedAt'))],
      order: [[Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('Application.appliedAt')), 'ASC']],
      raw: true
    });

    // Get job views over time - Fix: Use proper table alias
    const viewsOverTime = await JobView.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('JobView.viewedAt')), 'date'],
        [Sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        viewedAt: { [Op.gte]: dateFilter },
        '$job.companyId$': companyId
      },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: [],
          required: true
        }
      ],
      group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('JobView.viewedAt'))],
      order: [[Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('JobView.viewedAt')), 'ASC']],
      raw: true
    });

    // Get application status distribution - Fix: Specify table alias for status
    const applicationStatusDistribution = await Application.findAll({
      attributes: [
        [Sequelize.col('Application.status'), 'status'], // Fix: Explicitly specify the table
        [Sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        '$job.companyId$': companyId
      },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: [],
          required: true
        }
      ],
      group: [Sequelize.col('Application.status')], // Fix: Explicitly specify the table
      raw: true
    });

    // Get job type performance
    const jobTypePerformance = await Job.findAll({
      where: { companyId },
      attributes: [
        'jobType',
        [Sequelize.fn('COUNT', '*'), 'jobCount'],
        [Sequelize.fn('SUM', Sequelize.col('applicationCount')), 'totalApplications'],
        [Sequelize.fn('AVG', Sequelize.col('applicationCount')), 'averageApplications']
      ],
      group: ['jobType'],
      raw: true
    });

    const analytics = {
      applicationsOverTime: applicationsOverTime.map(item => ({
        date: item.date,
        count: parseInt(item.count)
      })),
      viewsOverTime: viewsOverTime.map(item => ({
        date: item.date,
        count: parseInt(item.count)
      })),
      applicationStatusDistribution: applicationStatusDistribution.map(item => ({
        status: item.status,
        count: parseInt(item.count)
      })),
      jobTypePerformance: jobTypePerformance.map(item => ({
        jobType: item.jobType,
        jobCount: parseInt(item.jobCount),
        totalApplications: parseInt(item.totalApplications) || 0,
        averageApplications: parseFloat(item.averageApplications) || 0
      })),
      period
    };

    return ApiResponse.successResponse(
      res,
      200,
      "Analytics retrieved successfully",
      analytics
    );
  } catch (error) {
    console.error("Get analytics error:", error);
    return ApiResponse.errorResponse(res, 500, "Failed to retrieve analytics");
  }
},

  getRecentActivity: async (req, res) => {
    try {
      // Fix: Get company from database
      const company = await Company.findOne({ where: { userId: req.user.user_id } });
      if (!company) {
        return ApiResponse.errorResponse(res, 404, "Company profile not found");
      }
      const companyId = company.id;

      const { limit = 10 } = req.query;

      // Get recent applications
      const recentApplications = await Application.findAll({
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId },
            attributes: ['id', 'title', 'jobType'],
            required: true
          },
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'image']
              }
            ],
            attributes: ['id', 'university', 'major', 'year'],
            required: true
          }
        ],
        attributes: ['id', 'status', 'appliedAt', 'viewedByCompany'],
        order: [['appliedAt', 'DESC']],
        limit: parseInt(limit)
      });

      // Get recent job views
      const recentViews = await JobView.findAll({
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId },
            attributes: ['id', 'title', 'jobType'],
            required: true
          },
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'image']
              }
            ],
            attributes: ['id', 'university', 'major', 'year'],
            required: true
          }
        ],
        attributes: ['id', 'viewedAt'],
        order: [['viewedAt', 'DESC']],
        limit: parseInt(limit)
      });

      // Combine and sort recent activity
      const combinedActivity = [
        ...recentApplications.map(app => ({
          id: app.id,
          type: 'application',
          status: app.status,
          timestamp: app.appliedAt,
          isNew: !app.viewedByCompany,
          job: {
            id: app.job.id,
            title: app.job.title,
            type: app.job.jobType
          },
          student: {
            id: app.student.id,
            name: app.student.user.fullName,
            image: app.student.user.image,
            university: app.student.university,
            major: app.student.major,
            year: app.student.year
          }
        })),
        ...recentViews.map(view => ({
          id: view.id,
          type: 'view',
          timestamp: view.viewedAt,
          job: {
            id: view.job.id,
            title: view.job.title,
            type: view.job.jobType
          },
          student: {
            id: view.student.id,
            name: view.student.user.fullName,
            image: view.student.user.image,
            university: view.student.university,
            major: view.student.major,
            year: view.student.year
          }
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
       .slice(0, parseInt(limit));

      const activity = {
        recentActivity: combinedActivity,
        summary: {
          newApplications: recentApplications.filter(app => !app.viewedByCompany).length,
          totalApplicationsToday: recentApplications.filter(app => 
            new Date(app.appliedAt).toDateString() === new Date().toDateString()
          ).length,
          totalViewsToday: recentViews.filter(view => 
            new Date(view.viewedAt).toDateString() === new Date().toDateString()
          ).length
        }
      };

      return ApiResponse.successResponse(
        res,
        200,
        "Recent activity retrieved successfully",
        activity
      );
    } catch (error) {
      console.error("Get recent activity error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve recent activity");
    }
  }
};

module.exports = companyDashboardController;