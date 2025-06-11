const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  uploadQuestion,
  updateQuestion,
} = require("../controllers/questionsController");

router.post(
  "/upload",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  uploadQuestion
);
router.put(
  "/questions/:id",
  upload.fields([{ name: "questionImage", maxCount: 1 }]),
  updateQuestion
);
router.delete("/questions/:id", deleteQuestion);

module.exports = router;
