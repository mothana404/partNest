const express = require("express");
const homeController = require("../controllers/homePages.controller");

const router = express.Router();

router.get("/browse", homeController.browseJobs);
router.get("/:id", homeController.getJobDetails);
router.post("/contact", homeController.submitContactForm);

module.exports = router;