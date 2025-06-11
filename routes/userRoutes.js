const express = require("express");
const { registerUser, loginUser, getAllStudents } = require("../controllers/userController");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/getAllStudents", getAllStudents)

module.exports = router;