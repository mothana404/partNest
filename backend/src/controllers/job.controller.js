const {
  Job,
  Company,
  Category,
  User,
  Tag,
  JobView,
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op } = require("sequelize");

const companyController = {
  AllJobs: async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { page = 1, limit = 10, search, status } = req.query;
    
    const company = await Company.findOne({ where: { userId } });
    if (!company) {
      return ApiResponse.errorResponse(res, 404, "Company not found");
    }

    const whereConditions = {
      companyId: company.id
    };

    if (search && search.trim()) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } }
      ];
    }

    if (status && status !== 'ALL') {
      whereConditions.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count without joins (most accurate)
    const totalCount = await Job.count({
      where: whereConditions
    });

    // Get jobs with all associations including job views count
    const jobs = await Job.findAll({
      where: whereConditions,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'slug'],
          through: { attributes: [] }
        },
        {
          model: JobView,
          as: 'jobViews',
          attributes: ['id', 'studentId', 'viewedAt'],
          required: false // LEFT JOIN to include jobs with 0 views
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Add view count to each job
    const jobsWithViewCount = jobs.map(job => {
      const jobData = job.toJSON();
      jobData.viewCount = jobData.jobViews ? jobData.jobViews.length : 0;
      // Optionally remove the full jobViews array if you only need the count
      // delete jobData.jobViews;
      return jobData;
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return ApiResponse.successResponse(res, 200, "Jobs retrieved successfully", {
      jobs: jobsWithViewCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Get company jobs error:", error);
    return ApiResponse.errorResponse(res, 500, "Failed to retrieve jobs");
  }
},

  CreateJob: async (req, res) => {
    try {
      const userId = req.user.user_id;

      // Get company ID from authenticated user
      const company = await Company.findOne({ where: { userId } });
      if (!company) {
        return ApiResponse.errorResponse(res, 404, "Company not found");
      }

      // Extract tags from request body
      const { tags = [], ...jobData } = req.body;

      // Create job
      const job = await Job.create({
        ...jobData,
        companyId: company.id,
      });

      // Handle tags if provided
      if (tags && tags.length > 0) {
        // Find or create tags
        const tagInstances = await Promise.all(
          tags.map(async (tagName) => {
            const [tag] = await Tag.findOrCreate({
              where: { name: tagName },
              defaults: {
                name: tagName,
                slug: tagName.toLowerCase().replace(/\s+/g, "-"),
              },
            });
            return tag;
          })
        );

        // Associate tags with job
        await job.addTags(tagInstances);
      }

      // Fetch the complete job with associations
      const createdJob = await Job.findByPk(job.id, {
        include: [
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
      });

      return ApiResponse.successResponse(
        res,
        201,
        "Job created successfully",
        createdJob
      );
    } catch (error) {
      console.error("Create job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to create job");
    }
  },

  GetJob: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const jobId = req.params.id;

      // Get company ID from authenticated user
      const company = await Company.findOne({ where: { userId } });
      if (!company) {
        return ApiResponse.errorResponse(res, 404, "Company not found");
      }

      // Find job belonging to this company
      const job = await Job.findOne({
        where: {
          id: jobId,
          companyId: company.id,
        },
        include: [
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
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
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

  UpdateJob: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const jobId = req.params.id;

      // Get company ID from authenticated user
      const company = await Company.findOne({ where: { userId } });
      if (!company) {
        return ApiResponse.errorResponse(res, 404, "Company not found");
      }

      // Find job belonging to this company
      const job = await Job.findOne({
        where: {
          id: jobId,
          companyId: company.id,
        },
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Extract tags from request body
      const { tags = [], ...updateData } = req.body;

      // Update job
      await job.update(updateData);

      // Handle tags update if provided
      if (tags && Array.isArray(tags)) {
        // Remove existing associations
        await job.setTags([]);

        if (tags.length > 0) {
          // Find or create new tags
          const tagInstances = await Promise.all(
            tags.map(async (tagName) => {
              const [tag] = await Tag.findOrCreate({
                where: { name: tagName },
                defaults: {
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/\s+/g, "-"),
                },
              });
              return tag;
            })
          );

          // Associate new tags with job
          await job.addTags(tagInstances);
        }
      }

      // Fetch updated job with associations
      const updatedJob = await Job.findByPk(job.id, {
        include: [
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
      });

      return ApiResponse.successResponse(
        res,
        200,
        "Job updated successfully",
        updatedJob
      );
    } catch (error) {
      console.error("Update job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update job");
    }
  },

  DeleteJob: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const jobId = req.params.id;

      // Get company ID from authenticated user
      const company = await Company.findOne({ where: { userId } });
      if (!company) {
        return ApiResponse.errorResponse(res, 404, "Company not found");
      }

      // Find job belonging to this company
      const job = await Job.findOne({
        where: {
          id: jobId,
          companyId: company.id,
        },
      });

      if (!job) {
        return ApiResponse.errorResponse(res, 404, "Job not found");
      }

      // Delete job (associations will be handled by cascade)
      await job.destroy();

      return ApiResponse.successResponse(res, 200, "Job deleted successfully", {
        deletedJobId: jobId,
      });
    } catch (error) {
      console.error("Delete job error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete job");
    }
  },
};

module.exports = companyController;
