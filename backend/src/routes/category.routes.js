const express = require("express");
const categoryController = require("../controllers/category.controller");
const validate = require("../middlewares/validation.middleware");
const { categoryName, categoryUpdate } = require("../validators/company.validator");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

router.use(authenticate);

router.post("/add", authorize("ADMIN"), validate(categoryName), categoryController.add);
router.put("/:id", authorize("ADMIN"), validate(categoryUpdate), categoryController.update);
router.delete("/:id", authorize("ADMIN"), categoryController.delete);
router.patch("/:id/toggle", categoryController.toggleStatus);

module.exports = router;