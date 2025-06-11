const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  uploadQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  submitQuiz
} = require("../controllers/questionsController");

router.post(
  "/questions/upload",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  uploadQuestion
);
router.put(
  "/questions/:id",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  updateQuestion
);
router.delete("/questions/:id", deleteQuestion);

router.get('/questions', getAllQuestions);
router.post('/questions/submit', submitQuiz);

module.exports = router;
