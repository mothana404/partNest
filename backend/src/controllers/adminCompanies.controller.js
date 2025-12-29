const { Company, User, Job } = require("../../models/associations");
const { successResponse, errorResponse, notFoundResponse } = require("../utils/response");
const { Op } = require("sequelize");

const adminCompaniesController = {
  // Get all companies with filters and pagination
  getAllCompanies: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        isVerified,
        isActive,
        industry,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};
      const userWhereClause = {};

      if (isVerified !== undefined) {
        whereClause.isVerified = isVerified === 'true';
      }

      if (isActive !== undefined) {
        userWhereClause.isActive = isActive === 'true';
      }

      if (industry) {
        whereClause.industry = industry;
      }

      const { rows: companies, count } = await Company.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            where: userWhereClause,
            attributes: ['user_id', 'email', 'fullName', 'isActive', 'isVerified', 'createdAt', 'lastLogin']
          },
          {
            model: Job,
            as: 'jobs',
            attributes: ['id', 'title', 'status'],
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true
      });

      // Add job counts to each company
      const companiesWithStats = companies.map(company => {
        const companyData = company.toJSON();
        companyData.jobCount = companyData.jobs ? companyData.jobs.length : 0;
        companyData.activeJobCount = companyData.jobs ? 
          companyData.jobs.filter(job => job.status === 'ACTIVE').length : 0;
        return companyData;
      });

      successResponse(res, 200, "Companies retrieved successfully", {
        companies: companiesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
      errorResponse(res, 500, "Failed to fetch companies");
    }
  },

  // Get company by ID
  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['user_id', 'email', 'fullName', 'phoneNumber', 'location', 'image', 'isActive', 'isVerified', 'createdAt', 'lastLogin']
          },
          {
            model: Job,
            as: 'jobs',
            attributes: ['id', 'title', 'status', 'createdAt']
          }
        ]
      });

      if (!company) {
        return notFoundResponse(res, "Company not found");
      }

      successResponse(res, 200, "Company details retrieved successfully", company);
    } catch (error) {
      console.error("Error fetching company details:", error);
      errorResponse(res, 500, "Failed to fetch company details");
    }
  },

  // Verify/unverify company
  verifyCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;

      const company = await Company.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });

      if (!company) {
        return notFoundResponse(res, "Company not found");
      }

      await company.update({ isVerified });

      successResponse(res, 200, `Company ${isVerified ? 'verified' : 'unverified'} successfully`, {
        companyId: id,
        isVerified
      });
    } catch (error) {
      console.error("Error updating company verification:", error);
      errorResponse(res, 500, "Failed to update company verification");
    }
  },

  // Toggle company active status
  toggleCompanyStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });

      if (!company) {
        return notFoundResponse(res, "Company not found");
      }

      const newStatus = !company.user.isActive;
      await company.user.update({ isActive: newStatus });

      successResponse(res, 200, `Company ${newStatus ? 'activated' : 'deactivated'} successfully`, {
        companyId: id,
        isActive: newStatus
      });
    } catch (error) {
      console.error("Error toggling company status:", error);
      errorResponse(res, 500, "Failed to toggle company status");
    }
  },

  // Delete company (soft delete by deactivating)
  deleteCompany: async (req, res) => {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });

      if (!company) {
        return notFoundResponse(res, "Company not found");
      }

      // Soft delete by deactivating the user
      await company.user.update({ isActive: false });

      // Also set all company jobs to closed status
      await Job.update(
        { status: 'CLOSED' },
        { where: { companyId: id } }
      );

      successResponse(res, 200, "Company deleted successfully", {
        companyId: id
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      errorResponse(res, 500, "Failed to delete company");
    }
  },

  // Get companies statistics overview
  getCompaniesStats: async (req, res) => {
    try {
      const totalCompanies = await Company.count({
        include: [{ model: User, as: 'user', where: { role: 'COMPANY' } }]
      });

      const activeCompanies = await Company.count({
        include: [{ model: User, as: 'user', where: { isActive: true, role: 'COMPANY' } }]
      });

      const verifiedCompanies = await Company.count({
        where: { isVerified: true },
        include: [{ model: User, as: 'user', where: { role: 'COMPANY' } }]
      });

      const pendingVerification = await Company.count({
        where: { isVerified: false },
        include: [{ model: User, as: 'user', where: { isActive: true, role: 'COMPANY' } }]
      });

      // Recent companies (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const recentCompanies = await Company.count({
        include: [{ 
          model: User, 
          as: 'user', 
          where: { 
            createdAt: { [Op.gte]: weekAgo },
            role: 'COMPANY'
          } 
        }]
      });

      successResponse(res, 200, "Company statistics retrieved successfully", {
        totalCompanies,
        activeCompanies,
        verifiedCompanies,
        pendingVerification,
        recentCompanies
      });
    } catch (error) {
      console.error("Error fetching company statistics:", error);
      errorResponse(res, 500, "Failed to fetch company statistics");
    }
  }
};

module.exports = adminCompaniesController;