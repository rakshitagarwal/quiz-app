import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    type: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Short Answer"],
      required: true,
    },
    options: [
      {
        text: { type: String },
        isCorrect: { type: Boolean, default: false }, 
      },
    ],
  },
  { _id: false },
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: {
      type: [QuestionSchema],
      validate: [arrayLimit, "{PATH} exceeds the limit of 50"],
    },
  },
  {
    timestamps: true,
  },
);

function arrayLimit(val) {
  return val.length >= 1 && val.length <= 50;
}

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
