const express = require("express");
const companyDashboardController = require("../controllers/companyDashboard.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);
router.use(authorize("COMPANY"));

router.get("/stats", companyDashboardController.getDashboardStats);
router.get("/analytics", companyDashboardController.getAnalytics);
router.get("/recent-activity", companyDashboardController.getRecentActivity);

module.exports = router;