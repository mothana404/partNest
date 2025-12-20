const express = require("express");
const profilesControllers = require("../controllers/profiles.controller");
const validate = require("../middlewares/validation.middleware");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { uploadMiddleware } = require("../middlewares/upload.middleware");
const {
  studentProfileValidate,
  CompanyProfileValidate,
} = require("../validators/profile.validator");

const router = express.Router();
router.use(authenticate);

router.get(
  "/companyProfile",
  authorize("COMPANY"),
  profilesControllers.companyProfile
);
router.get(
  "/studentProfile",
  authorize("STUDENT"),
  profilesControllers.studentProfile
);
router.get(
  "/adminProfile",
  authorize("ADMIN"),
  profilesControllers.adminProfile
);

router.post(
  "/studentProfile/edit",
  uploadMiddleware("image"),
  profilesControllers.editStudent
);

router.post(
  "/companyProfile/edit",
  validate(CompanyProfileValidate),
  uploadMiddleware("image"),
  profilesControllers.editCompany
);

module.exports = router;
