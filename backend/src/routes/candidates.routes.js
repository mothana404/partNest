const express = require("express");
const candidatesController = require("../controllers/candidates.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", authorize("COMPANY"), candidatesController.getCandidates);
router.get("/filter-options", authorize("COMPANY"), candidatesController.getFilterOptions);
router.get("/export", authorize("COMPANY"), candidatesController.exportCandidates);
router.put("/applications/:id", authorize("COMPANY"), candidatesController.updateApplicationStatus);
router.put("/applications/:id/view", authorize("COMPANY"), candidatesController.markApplicationAsViewed);
router.get('/interviews', authorize("COMPANY"), candidatesController.getCompanyInterviews);

module.exports = router;