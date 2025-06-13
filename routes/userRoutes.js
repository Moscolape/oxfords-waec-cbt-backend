const express = require("express");
const { registerUser, loginUser, getAllStudents, deleteSingleStudent } = require("../controllers/userController");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/getAllStudents", getAllStudents);
router.delete('/auth/deleteStudent/:id', deleteSingleStudent);

module.exports = router;