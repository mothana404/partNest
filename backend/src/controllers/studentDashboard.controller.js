const {
  Job,
  Company,
  User,
  Category,
  Tag,
  Application,
  Student,
  SavedJob,
  JobView,
  Skill,
  Experience,
  Link
} = require("../../models/associations");
const { sequelize } = require("../config/database");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");

const studentDashboardController = {
  getDashboardData: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get student information
      const student = await Student.findOne({
        where: { userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['user_id', 'fullName', 'email', 'phoneNumber', 'location', 'image']
          }
        ]
      });

      if (!student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
      }

      // Get basic stats
      const [
        totalApplications,
        savedJobsCount,
        skillsCount,
        experienceCount,
        linksCount
      ] = await Promise.all([
        Application.count({ where: { studentId: student.id } }),
        SavedJob.count({ where: { studentId: student.id } }),
        Skill.count({ where: { userId } }),
        Experience.count({ where: { userId } }),
        Link.count({ where: { userId } })
      ]);

      // Calculate profile completeness
      const profileFields = [
        student.user.fullName,
        student.user.phoneNumber,
        student.user.location,
        student.university,
        student.major,
        student.about,
        skillsCount > 0,
        experienceCount > 0
      ];
      const filledFields = profileFields.filter(field => field).length;
      const profileCompleteness = Math.round((filledFields / profileFields.length) * 100);

      // Get application status breakdown
      const applicationStats = await Application.findAll({
        where: { studentId: student.id },
        attributes: [
          'status',
          [Sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['status'],
        raw: true
      });

      const statusBreakdown = {
        pending: 0,
        reviewed: 0,
        interviewed: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0
      };

      applicationStats.forEach(stat => {
        const status = stat.status.toLowerCase();
        if (status === 'pending') statusBreakdown.pending = parseInt(stat.count);
        else if (status === 'reviewed') statusBreakdown.reviewed = parseInt(stat.count);
        else if (status === 'interview_scheduled') statusBreakdown.interviewed = parseInt(stat.count);
        else if (status === 'accepted') statusBreakdown.accepted = parseInt(stat.count);
        else if (status === 'rejected') statusBreakdown.rejected = parseInt(stat.count);
        else if (status === 'withdrawn') statusBreakdown.withdrawn = parseInt(stat.count);
      });

      // Get recent applications
      const recentApplications = await Application.findAll({
        where: { studentId: student.id },
        include: [
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
                    attributes: ['fullName', 'image']
                  }
                ],
                attributes: ['id', 'companyName', 'industry', 'size']
              }
            ],
            attributes: ['id', 'title', 'jobType', 'location', 'salaryMin', 'salaryMax']
          }
        ],
        order: [['appliedAt', 'DESC']],
        limit: 5
      });

      // Get recent saved jobs
      const recentSavedJobs = await SavedJob.findAll({
        where: { studentId: student.id },
        include: [
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
                    attributes: ['fullName', 'image']
                  }
                ],
                attributes: ['id', 'companyName', 'industry']
              }
            ],
            attributes: ['id', 'title', 'jobType', 'location', 'salaryMin', 'salaryMax', 'createdAt']
          }
        ],
        order: [['savedAt', 'DESC']],
        limit: 5
      });

      // Get upcoming interviews
      const upcomingInterviews = await Application.findAll({
        where: {
          studentId: student.id,
          status: 'INTERVIEW_SCHEDULED',
          interviewDate: { [Op.gte]: currentDate }
        },
        include: [
          {
            model: Job,
            as: 'job',
            include: [
              {
                model: Company,
                as: 'company',
                attributes: ['companyName']
              }
            ],
            attributes: ['title']
          }
        ],
        order: [['interviewDate', 'ASC']],
        limit: 5
      });

      // Get application trend (last 30 days) using correct column names
      const applicationTrendQuery = `
        SELECT DATE("appliedAt") as date, COUNT(*) as count
        FROM applications
        WHERE "studentId" = :studentId 
          AND "appliedAt" >= :thirtyDaysAgo
        GROUP BY DATE("appliedAt")
        ORDER BY DATE("appliedAt") ASC
      `;

      const applicationTrend = await sequelize.query(applicationTrendQuery, {
        replacements: { 
          studentId: student.id, 
          thirtyDaysAgo: thirtyDaysAgo.toISOString()
        },
        type: Sequelize.QueryTypes.SELECT
      });

      // Get top companies using correct column names
      const topCompaniesQuery = `
        SELECT c."companyName" as name, COUNT(*) as application_count
        FROM applications a
        JOIN jobs j ON a."jobId" = j.id
        JOIN companies c ON j."companyId" = c.id
        WHERE a."studentId" = :studentId
        GROUP BY c."companyName"
        ORDER BY COUNT(*) DESC
        LIMIT 5
      `;

      const topCompaniesRaw = await sequelize.query(topCompaniesQuery, {
        replacements: { studentId: student.id },
        type: Sequelize.QueryTypes.SELECT
      });

      const topCompanies = topCompaniesRaw.map(company => ({
        name: company.name,
        applicationCount: parseInt(company.application_count)
      }));

      // Get job recommendations based on student preferences and major
      const whereConditions = {
        status: 'ACTIVE'
      };

      // Filter by preferred job types if available
      if (student.preferredJobTypes && student.preferredJobTypes.length > 0) {
        whereConditions.jobType = { [Op.in]: student.preferredJobTypes };
      }

      // Get jobs that student hasn't applied to yet
      const appliedJobIds = await Application.findAll({
        where: { studentId: student.id },
        attributes: ['jobId'],
        raw: true
      }).then(apps => apps.map(app => app.jobId));

      if (appliedJobIds.length > 0) {
        whereConditions.id = { [Op.notIn]: appliedJobIds };
      }

      const jobRecommendations = await Job.findAll({
        where: whereConditions,
        include: [
          {
            model: Company,
            as: 'company',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['fullName', 'image']
              }
            ],
            attributes: ['id', 'companyName', 'industry', 'size']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 6
      });

      // Format student info
      const studentInfo = {
        id: student.id,
        university: student.university,
        major: student.major,
        year: student.year,
        gpa: student.gpa,
        age: student.age,
        about: student.about,
        availability: student.availability,
        preferredJobTypes: student.preferredJobTypes || [],
        preferredLocations: student.preferredLocations || [],
        expectedSalaryMin: student.expectedSalaryMin,
        expectedSalaryMax: student.expectedSalaryMax,
        user: student.user
      };

      // Calculate average salary range for student's preferences
      let averageSalaryRange = null;
      if (student.expectedSalaryMin && student.expectedSalaryMax) {
        averageSalaryRange = {
          min: student.expectedSalaryMin,
          max: student.expectedSalaryMax,
          average: Math.round((student.expectedSalaryMin + student.expectedSalaryMax) / 2)
        };
      }

      const dashboardData = {
        stats: {
          totalApplications,
          savedJobs: savedJobsCount,
          profileCompleteness,
          skillsCount,
          experienceCount,
          linksCount
        },
        applicationStats: statusBreakdown,
        recentApplications: recentApplications.map(app => ({
          id: app.id,
          status: app.status,
          appliedAt: app.appliedAt,
          job: {
            id: app.job.id,
            title: app.job.title,
            type: app.job.jobType,
            location: app.job.location,
            salaryRange: {
              min: app.job.salaryMin,
              max: app.job.salaryMax
            }
          },
          company: {
            id: app.job.company.id,
            name: app.job.company.companyName,
            industry: app.job.company.industry,
            size: app.job.company.size,
            logo: app.job.company.user?.image
          }
        })),
        recentSavedJobs: recentSavedJobs.map(saved => ({
          id: saved.id,
          savedAt: saved.savedAt,
          job: {
            id: saved.job.id,
            title: saved.job.title,
            type: saved.job.jobType,
            location: saved.job.location,
            postedAt: saved.job.createdAt,
            salaryRange: {
              min: saved.job.salaryMin,
              max: saved.job.salaryMax
            }
          },
          company: {
            id: saved.job.company.id,
            name: saved.job.company.companyName,
            industry: saved.job.company.industry,
            logo: saved.job.company.user?.image
          }
        })),
        jobRecommendations: jobRecommendations.map(job => ({
          id: job.id,
          title: job.title,
          type: job.jobType,
          location: job.location,
          postedAt: job.createdAt,
          applicationDeadline: job.applicationDeadline,
          salaryRange: {
            min: job.salaryMin,
            max: job.salaryMax
          },
          company: {
            id: job.company.id,
            name: job.company.companyName,
            industry: job.company.industry,
            size: job.company.size,
            logo: job.company.user?.image
          },
          category: job.category?.name,
          matchScore: 85 // You can implement a more sophisticated matching algorithm
        })),
        upcomingInterviews: upcomingInterviews.map(interview => ({
          id: interview.id,
          date: interview.interviewDate,
          type: interview.interviewType,
          jobTitle: interview.job.title,
          company: interview.job.company.companyName,
          notes: interview.interviewNotes
        })),
        applicationTrend: applicationTrend.map(trend => ({
          date: trend.date,
          count: parseInt(trend.count)
        })),
        topCompanies,
        studentInfo,
        averageSalaryRange,
        gpaProgress: student.gpa ? {
          current: student.gpa,
          target: 4.0,
          percentage: (student.gpa / 4.0) * 100
        } : null
      };

      return ApiResponse.successResponse(
        res,
        200,
        "Dashboard data retrieved successfully",
        dashboardData
      );
    } catch (error) {
      console.error("Get dashboard data error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve dashboard data");
    }
  }
};

module.exports = studentDashboardController;