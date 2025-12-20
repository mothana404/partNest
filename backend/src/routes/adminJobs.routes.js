const express = require("express");
const adminJobsController = require("../controllers/adminJobs.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize("ADMIN"));

// Job Management Routes
router.get("/", adminJobsController.getAllJobs);
router.get("/stats", adminJobsController.getJobsStats);
router.get("/:jobId", adminJobsController.getJobById);
router.put("/:jobId", adminJobsController.updateJob);
router.delete("/:jobId", adminJobsController.deleteJob);
router.patch("/:jobId/status", adminJobsController.updateJobStatus);
router.patch("/:jobId/feature", adminJobsController.toggleJobFeature);

// Job Applications Management
router.get("/:jobId/applications", adminJobsController.getJobApplications);
router.patch("/applications/:applicationId/status", adminJobsController.updateApplicationStatus);

// Bulk Operations
router.post("/bulk/delete", adminJobsController.bulkDeleteJobs);
router.post("/bulk/status", adminJobsController.bulkUpdateStatus);
router.post("/bulk/approve", adminJobsController.bulkApproveJobs);

// Job Analytics
router.get("/:jobId/analytics", adminJobsController.getJobAnalytics);
router.get("/analytics/overview", adminJobsController.getJobsAnalyticsOverview);

// Export data
router.get("/export/csv", adminJobsController.exportJobsCSV);

// Job moderation
router.post("/:jobId/approve", adminJobsController.approveJob);
router.post("/:jobId/reject", adminJobsController.rejectJob);
router.patch("/:jobId/priority", adminJobsController.updateJobPriority);

module.exports = router;