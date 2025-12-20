const express = require("express");
const adminCategoriesController = require("../controllers/adminCategories.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize("ADMIN"));

// Category Management Routes
router.get("/", adminCategoriesController.getAllCategories);
router.get("/stats", adminCategoriesController.getCategoriesStats);
router.get("/:categoryId", adminCategoriesController.getCategoryById);
router.post("/", adminCategoriesController.createCategory);
router.put("/:categoryId", adminCategoriesController.updateCategory);
router.delete("/:categoryId", adminCategoriesController.deleteCategory);
router.patch("/:categoryId/status", adminCategoriesController.toggleCategoryStatus);

// Bulk Operations
router.post("/bulk/delete", adminCategoriesController.bulkDeleteCategories);
router.post("/bulk/status", adminCategoriesController.bulkUpdateStatus);

// Category Analytics
router.get("/:categoryId/jobs", adminCategoriesController.getCategoryJobs);
router.get("/:categoryId/analytics", adminCategoriesController.getCategoryAnalytics);

// Export data
router.get("/export/csv", adminCategoriesController.exportCategoriesCSV);

// Reorder categories
router.post("/reorder", adminCategoriesController.reorderCategories);

module.exports = router;