const express = require("express");
const jobController = require("../controllers/job.controller");
const validate = require("../middlewares/validation.middleware");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { createJob, updateJob } = require("../validators/job.validator");

const router = express.Router();
router.use(authenticate);

router.get("/", authorize("COMPANY"), jobController.AllJobs);
router.post("/create", validate(createJob), authorize("COMPANY"), jobController.CreateJob);
router.get("/:id", authorize("COMPANY"), jobController.GetJob);
router.put("/:id", validate(updateJob), authorize("COMPANY"), jobController.UpdateJob);
router.delete("/:id", authorize("COMPANY"), jobController.DeleteJob);

module.exports = router;