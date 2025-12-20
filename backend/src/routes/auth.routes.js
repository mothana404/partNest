const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middleware");
const { companySignInUp, usersSignIn, studentSignUp } = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(usersSignIn), authController.userLogin);
router.post("/companySignUp", validate(companySignInUp), authController.companySignUp);
router.post("/studentSignUp", validate(studentSignUp), authController.studentSignUp);

module.exports = router;
