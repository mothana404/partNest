const express = require("express");
const adminUsersController = require("../controllers/adminUsers.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", adminUsersController.getAllUsers);
router.get("/stats", adminUsersController.getUsersStats);
router.get("/:userId", adminUsersController.getUserById);
router.put("/:userId", adminUsersController.updateUser);
router.delete("/:userId", adminUsersController.deleteUser);
router.patch("/:userId/status", adminUsersController.toggleUserStatus);
router.patch("/:userId/verifyEmail", adminUsersController.verifyUser);
router.patch("/:userId/role", adminUsersController.changeUserRole);
router.post("/:userId/reset-password", adminUsersController.resetUserPassword);

router.post("/bulk/delete", adminUsersController.bulkDeleteUsers);
router.post("/bulk/status", adminUsersController.bulkUpdateStatus);
router.post("/bulk/verify", adminUsersController.bulkVerifyUsers);

router.get("/export/csv", adminUsersController.exportUsersCSV);

module.exports = router;