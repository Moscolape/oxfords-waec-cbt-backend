const { validationResult } = require("express-validator");
const Questions = require("../models/questions");

exports.uploadQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      subject,
      questionType,
      question,
      options,
      correctAnswer,
      points,
    } = req.body;

    if (!subject || !questionType || !correctAnswer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let prompt = "";
    if (questionType === "text") {
      if (!question) {
        return res
          .status(400)
          .json({ message: "Text question prompt is required." });
      }
      prompt = question;
    } else {
      if (!req.files || !req.files.questionImage) {
        return res
          .status(400)
          .json({ message: "Question image is required." });
      }
      prompt = req.files.questionImage[0].path.replace(/\\/g, "/");
    }

    const parsedOptions = options
      ? JSON.parse(options)
      : [];

    const newQuestion = new Questions({
      subject,
      type: "objective",
      promptType: questionType,
      prompt,
      options: parsedOptions,
      correctAnswer,
      points: Number(points) || 1,
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Question uploaded successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
