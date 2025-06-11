const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  uploadQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  submitQuiz,
  getAllSubmissions
} = require("../controllers/questionsController");

router.post(
  "/questions/upload",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  uploadQuestion
);
router.post('/questions/submit', submitQuiz);

router.get('/questions', getAllQuestions);
router.get('/testSubmissions', getAllSubmissions);

router.put(
  "/questions/:id",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  updateQuestion
);
router.delete("/questions/:id", deleteQuestion);


module.exports = router;
