const {
  SavedJob,
  Job,
  Company,
  User,
  Category,
  Student,
} = require("../../models/associations");
const ApiResponse = require("../utils/response");

const savedJobsController = {
  getSavedJobs: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const userId = req.user.user_id;

      // Find the student record
      const student = await Student.findOne({
        where: { userId: userId },
      });

      if (!student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
      }

      const studentId = student.id; // Use student.id

      // Pagination
      const offset = (page - 1) * limit;

      const { count, rows: savedJobs } = await SavedJob.findAndCountAll({
        where: { studentId },
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
              {
                model: Category,
                as: "category",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
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
        "Saved jobs retrieved successfully",
        {
          savedJobs,
          pagination,
        }
      );
    } catch (error) {
      console.error("Get saved jobs error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to retrieve saved jobs"
      );
    }
  },

  saveJob: async (req, res) => {
    try {
      const { id: jobId } = req.params;
      const userId = req.user.user_id;

      // Find the student record
      const student = await Student.findOne({
        where: { userId: userId },
      });

      if (!student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
      }

      // Use the student's ID, not the userId
      const studentId = student.id; // This should be student.id, not student.userId

      // Check if job exists
      const job = await Job.findByPk(jobId);
      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Check if already saved
      const existingSave = await SavedJob.findOne({
        where: { jobId, studentId },
      });

      if (existingSave) {
        return ApiResponse.errorResponse(res, 409, "Job already saved");
      }

      // Save job
      const savedJob = await SavedJob.create({
        jobId,
        studentId, // This is now the correct student ID
      });

      // Fetch saved job with details
      const savedJobWithDetails = await SavedJob.findByPk(savedJob.id, {
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
      });

      return ApiResponse.successResponse(
        res,
        201,
        "Job saved successfully",
        savedJobWithDetails
      );
    } catch (error) {
      console.error("Save job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to save job");
    }
  },

  unsaveJob: async (req, res) => {
    try {
      const { id: jobId } = req.params;
      const userId = req.user.user_id;

      // Find the student record
      const student = await Student.findOne({
        where: { userId: userId },
      });

      if (!student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
      }
      const studentId = student.id; // Use student.id, not student.userId
      console.log(studentId,jobId );
      // Find and delete saved job
      const deletedCount = await SavedJob.destroy({
        where: { jobId: jobId, studentId: studentId },
      });

      if (deletedCount === 0) {
        return ApiResponse.errorResponse(res, 404, "Saved job not found");
      }

      return ApiResponse.successResponse(res, 200, "Job unsaved successfully", {
        jobId,
      });
    } catch (error) {
      console.error("Unsave job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to unsave job");
    }
  },
};

module.exports = savedJobsController;
