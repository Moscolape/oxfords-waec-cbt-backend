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
const { isAuthenticated } = require("../middleware/auth");



router.post(
  "/questions/upload",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  isAuthenticated,
  uploadQuestion
);
router.post('/questions/submit', isAuthenticated, submitQuiz);

router.get('/questions', getAllQuestions);
router.get('/testSubmissions', getAllSubmissions);

router.put(
  "/questions/:id",
  isAuthenticated,
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  updateQuestion
);
router.delete("/questions/:id", isAuthenticated, deleteQuestion);


module.exports = router;
