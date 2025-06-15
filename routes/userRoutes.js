const express = require("express");
const {
  registerUser,
  loginUser,
  getAllStudents,
  deleteSingleStudent,
  getAllAdmins,
  deleteSingleAdmin,
  getAllStaffs,
  deleteSingleStaff,
} = require("../controllers/userController");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/getAllStudents", getAllStudents);
router.delete("/auth/deleteStudent/:id", deleteSingleStudent);
router.get("/auth/getAllAdmins", getAllAdmins);
router.delete("/auth/deleteAdmin/:id", deleteSingleAdmin);
router.get("/auth/getAllStaff", getAllStaffs);
router.delete("/auth/deleteStaff/:id", deleteSingleStaff);
router.patch("/auth/bulk-status-update/:role", bulkUpdateStatus);

module.exports = router;