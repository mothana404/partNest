const express = require("express");
const adminApplicationsController = require("../controllers/adminApplications.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/stats/overview", adminApplicationsController.getApplicationsStats);
router.get("/analytics/status-distribution", adminApplicationsController.getStatusDistribution);
router.get("/analytics/trends", adminApplicationsController.getApplicationTrends);
router.get("/analytics/top-jobs", adminApplicationsController.getTopJobsByApplications);
router.patch("/bulk/status", adminApplicationsController.bulkUpdateStatus);
router.get("/allApplications/", adminApplicationsController.getAllApplications);
router.get("/application/:id", adminApplicationsController.getApplicationById);
router.patch("/:id/status", adminApplicationsController.updateApplicationStatus);
router.delete("/:id", adminApplicationsController.deleteApplication);

module.exports = router;