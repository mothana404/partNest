const { Category, User } = require("../../models/associations");
const ApiResponse = require("../utils/response");
const { Op } = require('sequelize');

const categoryController = {
  getAll: async (req, res) => {
    try {
      const { active = true } = req.query;
      
      const whereCondition = {};
      if (active !== 'all') {
        whereCondition.isActive = active === 'true';
      }

      const categories = await Category.findAll({
        // where: whereCondition,
        order: [['name', 'ASC']],
        attributes: ['id', 'name', 'isActive', 'createdAt', 'updatedAt']
      });

      return ApiResponse.successResponse(
        res,
        200,
        "Categories retrieved successfully",
        categories
      );
    } catch (error) {
      console.error("Get categories error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve categories");
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id, {
        attributes: ['id', 'name', 'isActive', 'createdAt', 'updatedAt']
      });

      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      return ApiResponse.successResponse(
        res,
        200,
        "Category retrieved successfully",
        category
      );
    } catch (error) {
      console.error("Get category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to retrieve category");
    }
  },

  add: async (req, res) => {
    try {
      const { name } = req.body;

      // Check if category name already exists
      const existingCategory = await Category.findOne({
        where: { 
          name: {
            [Op.iLike]: name.trim() // Case-insensitive search
          }
        }
      });

      if (existingCategory) {
        return ApiResponse.errorResponse(res, 409, "Category name already exists");
      }

      // Create new category
      const newCategory = await Category.create({
        name: name.trim(),
        isActive: true
      });

      return ApiResponse.successResponse(
        res,
        201,
        "Category created successfully",
        newCategory
      );
    } catch (error) {
      console.error("Create category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to create category");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;
      const userId = req.user.user_id;

      // Find category to update
      const category = await Category.findByPk(id);
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Check if new name already exists (exclude current category)
      if (name && name.trim() !== category.name) {
        const existingCategory = await Category.findOne({
          where: { 
            name: {
              [Op.iLike]: name.trim()
            },
            id: {
              [Op.ne]: id
            }
          }
        });

        if (existingCategory) {
          return ApiResponse.errorResponse(res, 409, "Category name already exists");
        }
      }

      // Update category
      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (isActive !== undefined) updateData.isActive = isActive;

      await category.update(updateData);

      return ApiResponse.successResponse(
        res,
        200,
        "Category updated successfully",
        category
      );
    } catch (error) {
      console.error("Update category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update category");
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.user_id;

      // Check if user is admin
      const adminUser = await User.findByPk(userId);
      if (!adminUser || adminUser.role !== "ADMIN") {
        return ApiResponse.errorResponse(res, 403, "Access denied. Admin role required.");
      }

      // Find category
      const category = await Category.findByPk(id);
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Check if category is being used by any jobs
      const { Job } = require("../../models/associations");
      const jobsUsingCategory = await Job.count({
        where: { categoryId: id }
      });

      if (jobsUsingCategory > 0) {
        // Soft delete - set isActive to false
        await category.update({ isActive: false });
        return ApiResponse.successResponse(
          res,
          200,
          `Category deactivated successfully. ${jobsUsingCategory} jobs are still using this category.`,
          { 
            category,
            jobsAffected: jobsUsingCategory 
          }
        );
      } else {
        // Hard delete if no jobs are using it
        await category.destroy();
        return ApiResponse.successResponse(
          res,
          200,
          "Category deleted successfully",
          { deletedCategoryId: id }
        );
      }
    } catch (error) {
      console.error("Delete category error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to delete category");
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.user_id;

      // Find category
      const category = await Category.findByPk(id);
      if (!category) {
        return ApiResponse.errorResponse(res, 404, "Category not found");
      }

      // Toggle status
      await category.update({ isActive: !category.isActive });

      return ApiResponse.successResponse(
        res,
        200,
        `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
        category
      );
    } catch (error) {
      console.error("Toggle category status error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to toggle category status");
    }
  }
};

module.exports = categoryController;