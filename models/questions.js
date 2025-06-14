const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      enum: [
        "english",
        "mathematics",
        "biology",
        "chemistry",
        "physics",
        "government",
        "crs",
        "economics",
        "literature",
        "fmaths",
        "fishery",
        "civic"
      ],
    },
    type: {
      type: String,
      required: true,
      enum: ["multiple-choice", "objective", "subjective"],
    },
    promptType: {
      type: String,
      enum: ["text", "image"],
      required: true,
      default: "text",
    },
    prompt: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 1,
    },
    options: {
      type: [String],
      default: undefined,
    },
    correctAnswer: {
      type: String,
      default: undefined,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Questions", questionSchema);
