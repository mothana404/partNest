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
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");

const studentJobsController = {
  getJobs: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        category = "ALL",
        jobType = "ALL",
        location = "ALL",
        company = "ALL",
        minSalary,
        maxSalary,
        experienceLevel = "ALL",
        sortBy = "createdAt",
        sortOrder = "desc",
        hasDeadline = "ALL",
        isRecent = false,
      } = req.query;

      const whereConditions = {
        status: "ACTIVE",
      };

      if (category !== "ALL") {
        whereConditions.categoryId = category;
      }

      if (jobType !== "ALL") {
        whereConditions.jobType = jobType;
      }

      if (location !== "ALL") {
        whereConditions.location = { [Op.iLike]: `%${location}%` };
      }

      if (company !== "ALL") {
        whereConditions.companyId = company;
      }

      if (minSalary) {
        whereConditions.salaryMin = { [Op.gte]: parseInt(minSalary) };
      }
      if (maxSalary) {
        whereConditions.salaryMax = { [Op.lte]: parseInt(maxSalary) };
      }

      if (experienceLevel !== "ALL") {
        // Map user-friendly experience levels to database values
        const experienceMap = {
          "Entry Level": ["0-1 years", "1-3 years"],
          "Mid Level": ["1-3 years", "3-5 years"],
          "Senior Level": ["3-5 years", "5+ years"],
          Executive: ["5+ years", "10+ years"],
        };

        const dbValues = experienceMap[experienceLevel];

        if (dbValues) {
          whereConditions.experienceRequired = {
            [Op.in]: dbValues,
          };
        } else {
          whereConditions.experienceRequired = {
            [Op.iLike]: `%${experienceLevel}%`,
          };
        }
      }

      if (hasDeadline !== "ALL") {
        if (hasDeadline === "true") {
          whereConditions.applicationDeadline = { [Op.ne]: null };
        } else {
          whereConditions.applicationDeadline = { [Op.is]: null };
        }
      }

      if (isRecent === "true") {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        whereConditions.createdAt = { [Op.gte]: sevenDaysAgo };
      }

      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { "$company.companyName$": { [Op.iLike]: `%${search}%` } },
          { "$tags.name$": { [Op.iLike]: `%${search}%` } },
        ];
      }

      const orderClause = [];
      switch (sortBy) {
        case "salaryMax":
          orderClause.push(["salaryMax", sortOrder.toUpperCase()]);
          break;
        case "title":
          orderClause.push(["title", sortOrder.toUpperCase()]);
          break;
        case "applicationCount":
          orderClause.push(["applicationCount", sortOrder.toUpperCase()]);
          break;
        default:
          orderClause.push(["createdAt", sortOrder.toUpperCase()]);
      }

      const offset = (page - 1) * limit;

      const { count, rows: jobs } = await Job.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Company,
            as: "company",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["fullName", "image"],
              },
            ],
            attributes: [
              "id",
              "companyName",
              "industry",
              "size",
              "website",
              "description",
              "foundedYear",
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
          {
            model: Tag,
            as: "tags",
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true,
        subQuery: false,
      });

      const pagination = {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        total: count,
        itemsPerPage: parseInt(limit),
      };

      return ApiResponse.successResponse(
        res,
        200,
        "Jobs retrieved successfully",
        {
          jobs,
          pagination,
        }
      );
    } catch (error) {
      console.error("Get jobs error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve jobs");
    }
  },

  getFilterOptions: async (req, res) => {
    try {
      const categories = await Category.findAll({
        where: { isActive: true },
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      });

      const locations = await Job.findAll({
        where: {
          status: "ACTIVE",
          location: { [Op.ne]: null },
        },
        attributes: ["location"],
        group: ["location"],
        raw: true,
      });

      const companies = await Company.findAll({
        include: [
          {
            model: Job,
            as: "jobs",
            where: { status: "ACTIVE" },
            attributes: [],
            required: true,
          },
        ],
        attributes: ["id", "companyName"],
        order: [["companyName", "ASC"]],
      });

      return ApiResponse.successResponse(
        res,
        200,
        "Filter options retrieved successfully",
        {
          categories,
          locations: locations.map((l) => l.location).filter(Boolean),
          companies,
          jobTypes: [
            "PART_TIME",
            "CONTRACT",
            "INTERNSHIP",
            "FREELANCE",
            "REMOTE",
          ],
        }
      );
    } catch (error) {
      console.error("Get filter options error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to retrieve filter options"
      );
    }
  },

  getJobById: async (req, res) => {
    try {
      const userID = req.user.user_id;
      const studentID = await Student.findOne({
        where: { userId: userID },
        attributes: ["id"],
      });

      const { id } = req.params;

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return ApiResponse.errorResponse(res, 400, "Invalid job ID format");
      }

      const job = await Job.findOne({
        where: {
          id: id,
          status: "ACTIVE",
        },
        include: [
          {
            model: Company,
            as: "company",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["fullName", "image"],
              },
            ],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
          {
            model: Tag,
            as: "tags",
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      const jobCount = await JobView.findOne({
        where: { studentId: studentID.dataValues.id, jobId: job.id },
      });

      if (!jobCount) {
        await JobView.findOrCreate({
          where: {
            studentId: studentID.id,
            jobId: job.id,
          },
        });
      }

      return ApiResponse.successResponse(
        res,
        200,
        "Job retrieved successfully",
        job
      );
    } catch (error) {
      console.error("Get job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve job");
    }
  },

  applyToJob: async (req, res) => {
    try {
      const { id: jobId } = req.params;
      const { coverLetter, customCvLink } = req.body;
      const userId = req.user.user_id;

      if (!userId) {
        return ApiResponse.errorResponse(
          res,
          403,
          "User authentication required"
        );
      }

      // Find the student record
      const student = await Student.findOne({
        where: { userId: userId },
      });

      if (!student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
      }

      const studentId = student.id; // Use student.id, not userId

      // Check if job exists and is active
      const job = await Job.findOne({
        where: {
          id: jobId,
          status: "ACTIVE",
        },
      });

      if (!job) {
        return ApiResponse.errorResponse(
          res,
          404,
          "Job not found or no longer active"
        );
      }

      // Check if application deadline has passed
      if (
        job.applicationDeadline &&
        new Date(job.applicationDeadline) < new Date()
      ) {
        return ApiResponse.errorResponse(
          res,
          400,
          "Application deadline has passed"
        );
      }

      // Check if max applications reached
      if (job.maxApplications && job.applicationCount >= job.maxApplications) {
        return ApiResponse.errorResponse(
          res,
          400,
          "Maximum applications reached for this job"
        );
      }

      // Check if student already applied
      const existingApplication = await Application.findOne({
        where: {
          jobId,
          studentId, // Now using the correct studentId
        },
      });

      if (existingApplication) {
        return ApiResponse.errorResponse(
          res,
          409,
          "You have already applied to this job"
        );
      }

      // Create application
      const application = await Application.create({
        jobId,
        studentId, // Now using the correct studentId
        coverLetter,
        customCvLink,
        status: "PENDING",
      });

      // Increment application count
      await job.increment("applicationCount");

      // Fetch application with job details for response
      const applicationWithDetails = await Application.findByPk(
        application.id,
        {
          include: [
            {
              model: Job,
              as: "job",
              include: [
                {
                  model: Company,
                  as: "company",
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: ["fullName"],
                    },
                  ],
                },
              ],
            },
          ],
        }
      );

      return ApiResponse.successResponse(
        res,
        201,
        "Application submitted successfully",
        applicationWithDetails
      );
    } catch (error) {
      console.error("Apply to job error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to submit application"
      );
    }
  },
};

module.exports = studentJobsController;
