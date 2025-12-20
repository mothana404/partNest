const {
  Application,
  Student,
  User,
  Job,
  Company,
  Skill,
  Experience,
  Link,
} = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op, Sequelize } = require("sequelize");

const candidatesController = {
  getCandidates: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        status = "ALL",
        university = "ALL",
        major = "ALL",
        minGpa,
        maxGpa,
        year = "ALL",
        availability = "ALL",
        minAge,
        maxAge,
        skills,
        minSalary,
        maxSalary,
        location = "ALL",
        hasExperience = "ALL",
        sortBy = "appliedAt",
        sortOrder = "desc",
      } = req.query;

      const userId = req.user.user_id;

      // Get company
      const company = await Company.findOne({
        where: { userId: userId },
        attributes: ["id"],
      });

      if (!company) {
        return ApiResponse.errorResponse(res, 403, "Company access required");
      }

      // Build where conditions
      const applicationWhereConditions = {};
      const studentWhereConditions = {};
      const userWhereConditions = {};
      const jobWhereConditions = { companyId: company.id };

      // Application status filter
      if (status !== "ALL") {
        applicationWhereConditions.status = status;
      }

      // Student filters
      if (university !== "ALL") {
        studentWhereConditions.university = { [Op.iLike]: `%${university}%` };
      }

      if (major !== "ALL") {
        studentWhereConditions.major = { [Op.iLike]: `%${major}%` };
      }

      if (year !== "ALL") {
        studentWhereConditions.year = parseInt(year);
      }

      // GPA range filter
      if (minGpa || maxGpa) {
        studentWhereConditions.gpa = {};
        if (minGpa) {
          studentWhereConditions.gpa[Op.gte] = parseFloat(minGpa);
        }
        if (maxGpa) {
          studentWhereConditions.gpa[Op.lte] = parseFloat(maxGpa);
        }
      }

      // Age range filter
      if (minAge || maxAge) {
        studentWhereConditions.age = {};
        if (minAge) {
          studentWhereConditions.age[Op.gte] = parseInt(minAge);
        }
        if (maxAge) {
          studentWhereConditions.age[Op.lte] = parseInt(maxAge);
        }
      }

      // Availability filter
      if (availability !== "ALL") {
        studentWhereConditions.availability = availability === "true";
      }

      // Expected salary filters
      if (minSalary) {
        studentWhereConditions.expectedSalaryMin = {
          [Op.gte]: parseInt(minSalary),
        };
      }
      if (maxSalary) {
        studentWhereConditions.expectedSalaryMax = {
          [Op.lte]: parseInt(maxSalary),
        };
      }

      // User location filter
      if (location !== "ALL") {
        userWhereConditions.location = { [Op.iLike]: `%${location}%` };
      }

      // Search filter
      if (search && search.trim()) {
        userWhereConditions[Op.or] = [
          { fullName: { [Op.iLike]: `%${search.trim()}%` } },
          { email: { [Op.iLike]: `%${search.trim()}%` } },
        ];
      }

      // Build order clause
      const orderClause = [];
      switch (sortBy) {
        case "gpa":
          orderClause.push([
            { model: Student, as: "student" },
            "gpa",
            sortOrder.toUpperCase(),
          ]);
          break;
        case "fullName":
          orderClause.push([
            { model: Student, as: "student" },
            { model: User, as: "user" },
            "fullName",
            sortOrder.toUpperCase(),
          ]);
          break;
        case "university":
          orderClause.push([
            { model: Student, as: "student" },
            "university",
            sortOrder.toUpperCase(),
          ]);
          break;
        default:
          orderClause.push(["appliedAt", sortOrder.toUpperCase()]);
      }

      const offset = (page - 1) * limit;

      // Build includes array
      const studentInclude = {
        model: Student,
        as: "student",
        include: [
          {
            model: User,
            as: "user",
            include: [],
            attributes: [
              "user_id",
              "fullName",
              "email",
              "phoneNumber",
              "location",
              "image",
            ],
          },
        ],
        attributes: [
          "id",
          "university",
          "major",
          "year",
          "gpa",
          "age",
          "about",
          "cvLink",
          "availability",
          "preferredJobTypes",
          "preferredLocations",
          "expectedSalaryMin",
          "expectedSalaryMax",
        ],
      };

      // Apply student filters
      if (Object.keys(studentWhereConditions).length > 0) {
        studentInclude.where = studentWhereConditions;
      }

      // Apply user filters
      if (Object.keys(userWhereConditions).length > 0) {
        studentInclude.include[0].where = userWhereConditions;
      }

      // Skills filter - add to user includes
      if (skills) {
        studentInclude.include[0].include.push({
          model: Skill,
          as: "skills",
          where: {
            name: { [Op.iLike]: `%${skills}%` },
          },
          required: true,
          attributes: ["name", "level", "yearsOfExp"],
        });
      } else {
        studentInclude.include[0].include.push({
          model: Skill,
          as: "skills",
          required: false,
          attributes: ["name", "level", "yearsOfExp"],
        });
      }

      if (hasExperience !== "ALL") {
        studentInclude.include[0].include.push({
          model: Experience,
          as: "experiences",
          required: hasExperience === "true",
          attributes: [
            "title",
            "companyName",
            "startDate",
            "endDate",
            "isCurrent",
          ],
        });
      } else {
        studentInclude.include[0].include.push({
          model: Experience,
          as: "experiences",
          required: false,
          attributes: [
            "title",
            "companyName",
            "startDate",
            "endDate",
            "isCurrent",
          ],
        });
      }

      // Add links
      studentInclude.include[0].include.push({
        model: Link,
        as: "links",
        required: false,
        attributes: ["type", "url", "label"],
      });

      // Execute query
      const { count, rows: candidates } = await Application.findAndCountAll({
        where: applicationWhereConditions,
        include: [
          {
            model: Job,
            as: "job",
            where: jobWhereConditions,
            required: true,
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
            attributes: ["id", "title", "companyId"],
          },
          studentInclude,
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
        totalItems: count,
        itemsPerPage: parseInt(limit),
      };

      return ApiResponse.successResponse(
        res,
        200,
        "Candidates retrieved successfully",
        {
          candidates,
          pagination,
        }
      );
    } catch (error) {
      console.error("Get candidates error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to retrieve candidates"
      );
    }
  },

  getFilterOptions: async (req, res) => {
    try {
      const companyId = req.user.user_id;

      if (!companyId) {
        return ApiResponse.errorResponse(res, 403, "Company access required");
      }

      // Get unique universities
      const universities = await Student.findAll({
        include: [
          {
            model: Application,
            as: "applications",
            required: true, // This ensures INNER JOIN
            include: [
              {
                model: Job,
                as: "job",
                where: { companyId },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        attributes: ["university"],
        group: ["Student.university"],
        raw: true,
      });

      // Get unique majors
      const majors = await Student.findAll({
        include: [
          {
            model: Application,
            as: "applications",
            required: true,
            include: [
              {
                model: Job,
                as: "job",
                where: { companyId },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        attributes: ["major"],
        group: ["Student.major"],
        raw: true,
      });

      // Get unique locations
      const locations = await User.findAll({
        include: [
          {
            model: Student,
            as: "student",
            required: true,
            include: [
              {
                model: Application,
                as: "applications",
                required: true,
                include: [
                  {
                    model: Job,
                    as: "job",
                    where: { companyId },
                    attributes: [],
                  },
                ],
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        where: {
          location: { [Op.ne]: null },
        },
        attributes: ["location"],
        group: ["User.location"],
        raw: true,
      });

      // Get unique skills
      const skills = await Skill.findAll({
        include: [
          {
            model: User,
            as: "user",
            required: true,
            include: [
              {
                model: Student,
                as: "student",
                required: true,
                include: [
                  {
                    model: Application,
                    as: "applications",
                    required: true,
                    include: [
                      {
                        model: Job,
                        as: "job",
                        where: { companyId },
                        attributes: [],
                      },
                    ],
                    attributes: [],
                  },
                ],
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        attributes: ["name"],
        group: ["Skill.name"],
        raw: true,
      });

      return ApiResponse.successResponse(
        res,
        200,
        "Filter options retrieved successfully",
        {
          universities: universities.map((u) => u.university).filter(Boolean),
          majors: majors.map((m) => m.major).filter(Boolean),
          locations: locations.map((l) => l.location).filter(Boolean),
          skills: skills.map((s) => s.name).filter(Boolean),
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

  exportCandidates: async (req, res) => {
    try {
      const companyId = req.user.user_id;
      if (!companyId) {
        return ApiResponse.errorResponse(res, 403, "Company access required");
      }

      // Use the same filtering logic as getCandidates but without pagination
      const {
        search = "",
        status = "ALL",
        university = "ALL",
        major = "ALL",
        minGpa,
        maxGpa,
        year = "ALL",
        availability = "ALL",
        minAge,
        maxAge,
        skills,
        minSalary,
        maxSalary,
        location = "ALL",
        hasExperience = "ALL",
      } = req.query;

      // Build where conditions (same as getCandidates)
      const whereConditions = { "$job.companyId$": companyId };
      const studentWhereConditions = {};
      const userWhereConditions = {};

      if (status !== "ALL") whereConditions.status = status;
      if (university !== "ALL") studentWhereConditions.university = university;
      if (major !== "ALL") studentWhereConditions.major = major;
      if (year !== "ALL") studentWhereConditions.year = parseInt(year);
      if (availability !== "ALL")
        studentWhereConditions.availability = availability === "true";
      if (location !== "ALL")
        userWhereConditions.location = { [Op.iLike]: `%${location}%` };

      // Add other filters as needed...

      const candidates = await Application.findAll({
        where: whereConditions,
        include: [
          {
            model: Student,
            as: "student",
            where:
              Object.keys(studentWhereConditions).length > 0
                ? studentWhereConditions
                : undefined,
            include: [
              {
                model: User,
                as: "user",
                where:
                  Object.keys(userWhereConditions).length > 0
                    ? userWhereConditions
                    : undefined,
                attributes: ["fullName", "email", "phoneNumber", "location"],
              },
            ],
          },
          {
            model: Job,
            as: "job",
            attributes: ["title"],
          },
        ],
        order: [["appliedAt", "DESC"]],
      });

      // Convert to CSV format
      const csvHeader = [
        "Name",
        "Email",
        "Phone",
        "University",
        "Major",
        "Year",
        "GPA",
        "Age",
        "Location",
        "Status",
        "Job Applied",
        "Applied Date",
        "Availability",
      ].join(",");

      const csvData = candidates.map((candidate) =>
        [
          candidate.student?.user?.fullName || "",
          candidate.student?.user?.email || "",
          candidate.student?.user?.phoneNumber || "",
          candidate.student?.university || "",
          candidate.student?.major || "",
          candidate.student?.year || "",
          candidate.student?.gpa || "",
          candidate.student?.age || "",
          candidate.student?.user?.location || "",
          candidate.status || "",
          candidate.job?.title || "",
          new Date(candidate.appliedAt).toLocaleDateString(),
          candidate.student?.availability ? "Available" : "Not Available",
        ].join(",")
      );

      const csv = [csvHeader, ...csvData].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=candidates_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      return res.send(csv);
    } catch (error) {
      console.error("Export candidates error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to export candidates");
    }
  },

  updateApplicationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // Fixed: feedback not feedBack
      const userId = req.user.user_id;

      // Get the company ID from the user
      const company = await Company.findOne({
        where: { userId },
        attributes: ["id"],
      });

      if (!company) {
        return ApiResponse.errorResponse(res, 403, "Company access required");
      }

      const companyId = company.id;

      // Validate status
      const validStatuses = [
        "PENDING",
        "INTERVIEW_SCHEDULED",
        "ACCEPTED",
        "REJECTED",
        "WITHDRAWN",
      ];

      if (status.status && !validStatuses.includes(status.status)) {
        return ApiResponse.errorResponse(res, 400, "Invalid status provided");
      }

      // Find application and verify it belongs to company
      const application = await Application.findOne({
        where: { id },
        include: [
          {
            model: Job,
            as: "job",
            where: { companyId },
            attributes: ["title", "companyId"],
          },
        ],
      });

      if (!application) {
        return ApiResponse.errorResponse(
          res,
          404,
          "Application not found or access denied"
        );
      }

      // Prepare update data
      const updateData = {};
      if (status) {
        updateData.status = status.status;
        updateData.respondedAt = new Date();
        updateData.viewedByCompany = true;
      }
      if (status.feedBack !== undefined) updateData.feedback = status.feedBack;

      // Handle interviewDate if provided
      if (status.interviewDate) {
        updateData.interviewDate = new Date(status.interviewDate);
      }

      // Update application
      await application.update(updateData);

      // Fetch updated application with student details
      const updatedApplication = await Application.findOne({
        where: { id },
        include: [
          {
            model: Student,
            as: "student",
            include: [
              {
                model: User,
                as: "user",
                attributes: [
                  "fullName",
                  "email",
                  "phoneNumber",
                  "location",
                  "image",
                ],
                include: [
                  {
                    model: Skill,
                    as: "skills",
                    attributes: ["name", "level", "yearsOfExp"],
                  },
                  {
                    model: Experience,
                    as: "experiences",
                    attributes: [
                      "title",
                      "companyName",
                      "description",
                      "location",
                      "employmentType",
                      "startDate",
                      "endDate",
                      "isCurrent",
                    ],
                    order: [["startDate", "DESC"]],
                  },
                  {
                    model: Link,
                    as: "links",
                    attributes: ["type", "url", "label"],
                  },
                ],
              },
            ],
          },
          {
            model: Job,
            as: "job",
            attributes: [
              "title",
              "jobType",
              "location",
              "salaryMin",
              "salaryMax",
              "salaryCurrency",
            ],
          },
        ],
      });

      return ApiResponse.successResponse(
        res,
        200,
        "Application updated successfully",
        updatedApplication
      );
    } catch (error) {
      console.error("Update application status error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to update application status"
      );
    }
  },

  markApplicationAsViewed: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.user_id;

      const company = await Company.findOne({
        where: { userId },
        attributes: ["id"],
      });

      if (!company) {
        return ApiResponse.errorResponse(res, 403, "Company access required");
      }

      const application = await Application.findOne({
        where: { id },
        include: [
          {
            model: Job,
            as: "job",
            where: { companyId: company.id },
            attributes: ["id"],
          },
        ],
      });

      if (!application) {
        return ApiResponse.errorResponse(res, 404, "Application not found");
      }

      // Only update if not already viewed
      if (!application.viewedAt) {
        await application.update({
          viewedByCompany: true,
          viewedAt: new Date(),
        });
      }

      return ApiResponse.successResponse(
        res,
        200,
        "Application marked as viewed"
      );
    } catch (error) {
      console.error("Mark application as viewed error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to mark as viewed");
    }
  },

  getCompanyInterviews: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { status, sort, startDate, endDate, page = 1, limit = 20 } = req.query;

      // Get company ID
      const company = await Company.findOne({
        where: { userId },
        attributes: ["id"],
      });

      if (!company) {
        return ApiResponse.errorResponse(res, 403, "Company access required");
      }

      // Build where clause
      const whereClause = {
        status: "INTERVIEW_SCHEDULED",
        interviewDate: {
          [Op.ne]: null,
        },
      };

      // Filter by date range if provided
      if (startDate && endDate) {
        whereClause.interviewDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        whereClause.interviewDate = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        whereClause.interviewDate = {
          [Op.lte]: new Date(endDate),
        };
      }

      // Determine sort order
      let order = [["interviewDate", "ASC"]]; // Default: upcoming first
      if (sort === "date_desc") {
        order = [["interviewDate", "DESC"]];
      } else if (sort === "date_asc") {
        order = [["interviewDate", "ASC"]];
      } else if (sort === "student_name") {
        order = [[{ model: Student, as: "student" }, { model: User, as: "user" }, "fullName", "ASC"]];
      }

      // Pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Fetch interviews
      const { count, rows: interviews } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: "student",
            required: true,
            include: [
              {
                model: User,
                as: "user",
                attributes: ["fullName", "email", "phoneNumber", "image", "location"],
              },
            ],
            attributes: ["id", "university", "major", "year", "gpa"],
          },
          {
            model: Job,
            as: "job",
            required: true,
            where: { companyId: company.id },
            attributes: ["id", "title", "jobType", "location"],
          },
        ],
        order,
        limit: parseInt(limit),
        offset,
        attributes: [
          "id",
          "status",
          "interviewDate",
          "feedback",
          "appliedAt",
          "viewedAt",
          "respondedAt",
        ],
      });

      // Calculate statistics
      const now = new Date();
      const upcomingInterviews = [];
      const pastInterviews = [];
      let todayCount = 0;
      let thisWeekCount = 0;

      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // Process all interviews to get counts (for statistics)
      const allInterviewsForStats = await Application.findAll({
        where: {
          status: "INTERVIEW_SCHEDULED",
          interviewDate: { [Op.ne]: null },
        },
        include: [
          {
            model: Job,
            as: "job",
            where: { companyId: company.id },
            attributes: ["id"],
          },
        ],
        attributes: ["id", "interviewDate"],
      });

      allInterviewsForStats.forEach((interview) => {
        const interviewDate = new Date(interview.interviewDate);
        
        if (interviewDate >= now) {
          if (interviewDate >= startOfDay && interviewDate <= endOfDay) {
            todayCount++;
          }
          if (interviewDate >= startOfWeek && interviewDate <= endOfWeek) {
            thisWeekCount++;
          }
        }
      });

      // Process paginated interviews
      const processedInterviews = interviews.map((interview) => {
        const interviewData = interview.toJSON();
        const interviewDate = new Date(interview.interviewDate);
        interviewData.isPast = interviewDate < new Date();
        
        if (interviewData.isPast) {
          pastInterviews.push(interviewData);
        } else {
          upcomingInterviews.push(interviewData);
        }
        
        return interviewData;
      });

      const upcomingCount = allInterviewsForStats.filter(
        (i) => new Date(i.interviewDate) >= new Date()
      ).length;
      
      const pastCount = allInterviewsForStats.length - upcomingCount;

      return ApiResponse.successResponse(res, 200, "Interviews fetched successfully", {
        interviews: processedInterviews,
        upcomingInterviews,
        pastInterviews,
        stats: {
          total: allInterviewsForStats.length,
          upcoming: upcomingCount,
          past: pastCount,
          today: todayCount,
          thisWeek: thisWeekCount,
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get company interviews error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Failed to fetch interviews"
      );
    }
  },
};

module.exports = candidatesController;
