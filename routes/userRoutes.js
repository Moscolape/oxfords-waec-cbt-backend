const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllStudents,
  deleteSingleStudent,
  getAllAdmins,
  deleteSingleAdmin,
  getAllStaffs,
  deleteSingleStaff,
  bulkUpdateStatus
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");


router.post("/auth/register", isAuthenticated, registerUser);
router.post("/auth/login", isAuthenticated, loginUser);
router.get("/auth/getAllStudents", getAllStudents);
router.delete("/auth/deleteStudent/:id", isAuthenticated, deleteSingleStudent);
router.get("/auth/getAllAdmins", getAllAdmins);
router.delete("/auth/deleteAdmin/:id", isAuthenticated, deleteSingleAdmin);
router.get("/auth/getAllStaff", getAllStaffs);
router.delete("/auth/deleteStaff/:id", isAuthenticated, deleteSingleStaff);
router.patch("/auth/bulk-status-update/:role", bulkUpdateStatus);

module.exports = router;