const express = require("express");
const studentJobsController = require("../controllers/studentJobs.controller");
const studentApplicationsController = require("../controllers/studentApplications.controller");
const savedJobsController = require("../controllers/savedJobs.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);
router.use(authorize("STUDENT"));

router.get("/filter-options", studentJobsController.getFilterOptions);
router.get("/applications", studentApplicationsController.getUserApplications);
router.get("/saved-jobs", savedJobsController.getSavedJobs);

router.get("/", studentJobsController.getJobs);

router.get("/getJob/:id", studentJobsController.getJobById);

router.post("/:id/apply", studentJobsController.applyToJob);
router.put("/applications/:id", studentApplicationsController.updateApplication);
router.patch("/applications/:id/withdraw", studentApplicationsController.withdrawApplication);

router.post("/saved-jobs/:id", savedJobsController.saveJob);
router.delete("/saved-jobs/:id", savedJobsController.unsaveJob);

module.exports = router;