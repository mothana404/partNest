const {
  Application,
  Job,
  Company,
  User,
  Student,
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op } = require("sequelize");

const studentApplicationsController = {
  getUserApplications: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status = "ALL",
        sortBy = "appliedAt",
        sortOrder = "desc",
      } = req.query;

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

      const studentId = student.id; // Use student.id

      // Build where conditions
      const whereConditions = { studentId };

      // Status filter
      if (status !== "ALL") {
        whereConditions.status = status;
      }

      // Sorting
      const orderClause = [[sortBy, sortOrder.toUpperCase()]];

      // Pagination
      const offset = (page - 1) * limit;

      const { count, rows: applications } = await Application.findAndCountAll({
        where: whereConditions,
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
                    attributes: ["fullName", "image"],
                  },
                ],
              },
            ],
          },
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
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
        "Applications retrieved successfully",
        {
          applications,
          pagination,
        }
      );
    } catch (error) {
      console.error("Get applications error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to retrieve applications"
      );
    }
  },

  updateApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
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

      const studentId = student.id; // Use student.id

      // Validate status (only allow student to withdraw)
      if (status !== "WITHDRAWN") {
        return ApiResponse.errorResponse(
          res,
          400,
          "Students can only withdraw applications"
        );
      }

      // Find application
      const application = await Application.findOne({
        where: {
          id,
          studentId,
        },
      });

      if (!application) {
        return ApiResponse.errorResponse(res, 404, "Application not found");
      }

      // Check if application can be withdrawn
      if (
        application.status === "ACCEPTED" ||
        application.status === "REJECTED"
      ) {
        return ApiResponse.errorResponse(
          res,
          400,
          "Cannot withdraw application that has been accepted or rejected"
        );
      }

      // Update application
      await application.update({ status: "WITHDRAWN" });

      // Decrement job application count
      const job = await Job.findByPk(application.jobId);
      if (job) {
        await job.decrement("applicationCount");
      }

      return ApiResponse.successResponse(
        res,
        200,
        "Application withdrawn successfully",
        application
      );
    } catch (error) {
      console.error("Update application error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to update application"
      );
    }
  },

  withdrawApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.user_id;

      // Get the student ID
      const student = await Student.findOne({ where: { userId } });
      if (!student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
      }

      // Find the application
      const application = await Application.findOne({
        where: {
          id,
          studentId: student.id,
        },
        include: [
          {
            model: Job,
            as: "job",
            attributes: ["title"],
          },
        ],
      });

      if (!application) {
        return ApiResponse.errorResponse(res, 404, "Application not found");
      }

      // Check if application can be withdrawn
      if (application.status === "WITHDRAWN") {
        return ApiResponse.errorResponse(
          res,
          400,
          "Application is already withdrawn"
        );
      }

      if (application.status === "ACCEPTED") {
        return ApiResponse.errorResponse(
          res,
          400,
          "Cannot withdraw an accepted application"
        );
      }

      // Update application status to withdrawn
      await application.update({
        status: "WITHDRAWN",
        respondedAt: new Date(),
      });

      // Optionally decrease the application count on the job
      await Job.decrement("applicationCount", {
        where: { id: application.jobId },
      });

      return ApiResponse.successResponse(
        res,
        200,
        "Application withdrawn successfully",
        {
          applicationId: application.id,
          jobTitle: application.job.title,
          status: application.status,
          withdrawnAt: application.respondedAt,
        }
      );
    } catch (error) {
      console.error("Withdraw application error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to withdraw application"
      );
    }
  },
};

module.exports = studentApplicationsController;
