const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { uploadQuestion } = require("../controllers/questionController");

router.post(
  "/upload",
  upload.fields([
    { name: "questionImage", maxCount: 1 }
  ]),
  uploadQuestion
);

module.exports = router;
