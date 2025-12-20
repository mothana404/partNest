const express = require("express");
const studentDashboardController = require("../controllers/studentDashboard.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);
router.use(authorize("STUDENT"));

router.get("/dashboard", studentDashboardController.getDashboardData);

module.exports = router;