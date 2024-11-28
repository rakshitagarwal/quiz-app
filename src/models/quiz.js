import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    answers: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    privacy: { type: Boolean, default: false }
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
