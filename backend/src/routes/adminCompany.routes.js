const express = require("express");
const adminCompaniesController = require("../controllers/adminCompanies.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/getAll/", adminCompaniesController.getAllCompanies);
router.get("/:id", adminCompaniesController.getCompanyById);
router.patch("/:id/verify", adminCompaniesController.verifyCompany);
router.patch("/:id/toggle-status", adminCompaniesController.toggleCompanyStatus);
router.delete("/:id", adminCompaniesController.deleteCompany);
router.get("/stats/overview", adminCompaniesController.getCompaniesStats);

module.exports = router;