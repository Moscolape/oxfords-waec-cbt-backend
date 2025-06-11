const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  testType: { type: String, required: true },
  answers: { type: Object, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestSubmissions", quizSubmissionSchema);
