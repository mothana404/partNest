const { Job, Company, Category, Tag, User, Application } = require("../../models/associations");
const ContactUs = require("../../models/ContactUs");
const ApiResponse = require("../utils/response");
const { Op } = require("sequelize");

const jobController = {
  browseJobs: async (req, res) => {
    try {
      const {
        search = "",
        type = "all",
        location = "all",
        page = 1,
        limit = 10,
      } = req.query;

      const offset = (page - 1) * limit;

      const whereClause = {
        status: "ACTIVE",
      };

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (type !== "all") {
        whereClause.jobType = type.toUpperCase();
      }

      if (location === "remote") {
        whereClause.location = { [Op.iLike]: "%remote%" };
      } else if (location === "onsite") {
        whereClause.location = { [Op.notILike]: "%remote%" };
      }

      const { count, rows: jobs } = await Job.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Company,
            as: "company",
            attributes: ["id", "companyName", "industry", "website", "size"],
            include: [
              {
                model: User,
                as: "user",
                attributes: ["image"],
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
            attributes: ["id", "name", "slug"],
            through: { attributes: [] },
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const totalPages = Math.ceil(count / limit);

      return ApiResponse.successResponse(res, 200, "Jobs retrieved successfully", {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs: count,
          jobsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Browse jobs error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve jobs");
    }
  },

   getJobDetails: async (req, res) => {
    try {
      const { id } = req.params;

      const job = await Job.findOne({
        where: { id },
        include: [
          {
            model: Company,
            as: "company",
            attributes: [
              "id",
              "companyName",
              "industry",
              "description",
              "website",
              "size",
              "foundedYear",
              "address",
              "isVerified"
            ],
            include: [
              {
                model: User,
                as: "user",
                attributes: ["image", "fullName", "email"],
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
            attributes: ["id", "name", "slug"],
            through: { attributes: [] },
          },
          {
            model: Application,
            as: "applications",
            attributes: ["id", "status"],
          },
        ],
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      if (job.status !== "ACTIVE") {
        return ApiResponse.errorResponse(res, 400, "This job is no longer active");
      }

      // Check if deadline has passed
      const hasDeadlinePassed = job.applicationDeadline 
        ? new Date(job.applicationDeadline) < new Date()
        : false;

      // Check if max applications reached
      const hasReachedMaxApplications = job.maxApplications
        ? job.applicationCount >= job.maxApplications
        : false;

      // Get application statistics
      const applicationStats = {
        total: job.applicationCount,
        pending: job.applications.filter(app => app.status === 'PENDING').length,
        interviewed: job.applications.filter(app => app.status === 'INTERVIEW_SCHEDULED').length,
        accepted: job.applications.filter(app => app.status === 'ACCEPTED').length,
      };

      const jobDetails = {
        ...job.toJSON(),
        canApply: !hasDeadlinePassed && !hasReachedMaxApplications,
        hasDeadlinePassed,
        hasReachedMaxApplications,
        applicationStats,
      };

      return ApiResponse.successResponse(
        res,
        200,
        "Job details retrieved successfully",
        jobDetails
      );
    } catch (error) {
      console.error("Get job details error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve job details");
    }
  },

  submitContactForm: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      const contactMessage = await ContactUs.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'NEW'
      });

      return ApiResponse.successResponse(
        res,
        201,
        "Thank you for contacting us! We'll get back to you soon.",
        {
          id: contactMessage.id,
          submittedAt: contactMessage.createdAt
        }
      );
    } catch (error) {
      console.error("Contact form submission error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to submit your message. Please try again later."
      );
    }
  }
};

module.exports = jobController;