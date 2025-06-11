const { validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinaryConfig");
const { getCloudinaryPublicId } = require("../utils/cloudinaryUtils");
const Questions = require("../models/questions");
const TestSubmissions = require("../models/submissions");

exports.uploadQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { subject, questionType, question, options, correctAnswer, points } =
      req.body;

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
        return res.status(400).json({ message: "Question image is required." });
      }
      prompt = req.files.questionImage[0].path.replace(/\\/g, "/");
    }

    const parsedOptions = options ? JSON.parse(options) : [];

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

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, questionType, question, options, correctAnswer, points } =
      req.body;

    const existingQuestion = await Questions.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (!subject || !questionType || !correctAnswer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let prompt = existingQuestion.prompt;

    if (questionType === "text") {
      if (!question) {
        return res
          .status(400)
          .json({ message: "Text question prompt is required." });
      }
      prompt = question;

      // Clean up old image if switching from image to text
      if (existingQuestion.promptType === "image") {
        const publicId = getCloudinaryPublicId(existingQuestion.prompt);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    } else {
      if (req.files && req.files.questionImage) {
        // Delete old image
        if (existingQuestion.promptType === "image") {
          const publicId = getCloudinaryPublicId(existingQuestion.prompt);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }

        prompt = req.files.questionImage[0].path.replace(/\\/g, "/");
      }
    }

    const parsedOptions = options ? JSON.parse(options) : [];

    existingQuestion.subject = subject;
    existingQuestion.promptType = questionType;
    existingQuestion.prompt = prompt;
    existingQuestion.options = parsedOptions;
    existingQuestion.correctAnswer = correctAnswer;
    existingQuestion.points = !isNaN(Number(points))
      ? Number(points)
      : existingQuestion.points;

    await existingQuestion.save();

    res.status(200).json({
      message: "Question updated successfully",
      question: existingQuestion,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Questions.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.promptType === "image") {
      const publicId = getCloudinaryPublicId(question.prompt);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const { subject, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (subject) filter.subject = subject;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 0);
    const skip = (parsedPage - 1) * parsedLimit;

    const questions = await Questions.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const totalCount = await Questions.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.status(200).json({
      message: "Questions fetched successfully",
      questions,
      totalPages,
      currentPage: parsedPage,
      totalCount,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      message: "Error retrieving questions",
      error: error.message,
    });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, subject, name, testType } = req.body;

    if (!name || !subject || !testType) {
      return res
        .status(400)
        .json({ message: "Name, subject, and test type are required" });
    }

    const questionIds = Object.keys(answers || {});
    const questions = await Questions.find({ _id: { $in: questionIds } });

    let score = 0;
    const pointsPerQuestion = 2;
    const totalPoints = 50 * pointsPerQuestion;

    for (const question of questions) {
      const userAnswer = answers[question._id];
      if (
        question.type === "objective" &&
        userAnswer === question.correctAnswer
      ) {
        score += pointsPerQuestion;
      }
    }

    const percentage = (score / totalPoints) * 100;
    const now = new Date();

    const submission = new TestSubmissions({
      name,
      subject,
      testType,
      answers,
      score,
      percentage: Math.round(percentage),
      totalPoints,
      submittedAt: now,
    });

    await submission.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      percentage: Math.round(percentage),
      totalPoints,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const submissions = await TestSubmissions.find()
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const totalCount = await TestSubmissions.countDocuments();
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.status(200).json({
      message: "Submissions fetched successfully",
      submissions,
      totalCount,
      currentPage: parsedPage,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching submissions",
      error: error.message,
    });
  }
};
