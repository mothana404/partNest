const express = require("express");
const router = express.Router();
const { successResponse, notFoundResponse } = require("../utils/response");
const authRoutes = require("./auth.routes");
const jobRoutes = require("./job.routes");
const categoryRoutes = require("./category.routes");
const candidateRoutes = require("./candidates.routes");
const studentRoutes = require("./student.routes");
const ProfilesRouters = require("./profiles.routes");
const companyDashboard = require("./companyDashboard.routes");
const studentDashboard = require("./studentDashboard.routes");
const adminUsersRoutes = require("./adminUsers.routes");
const adminCategoriesRoutes = require("./adminCategories.routes");
const adminJobsRoutes = require('./adminJobs.routes');
const adminApplicationsRoutes = require("./adminApplications.routes");
const adminCompanyRoutes = require("./adminCompany.routes");
const homePagesRoutes = require("./homePages.routes");

router.use("/auth", authRoutes);
router.use("/job", jobRoutes);
router.use("/category", categoryRoutes);
router.use("/candidate", candidateRoutes);
router.use("/student/job", studentRoutes);
router.use("/Profiles", ProfilesRouters);
router.use("/companyDashboard", companyDashboard);
router.use("/studentDash", studentDashboard);
router.use('/admin/users', adminUsersRoutes);
router.use('/admin/categories', adminCategoriesRoutes);
router.use('/admin/jobs', adminJobsRoutes);
router.use("/adminApplications",adminApplicationsRoutes);
router.use("/adminCompany", adminCompanyRoutes);
router.use("/home", homePagesRoutes);
router.use((req, res) =>{
  notFoundResponse(res, "API endpoint not found");
});

module.exports = router;
