import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["MCQ", "TRUE/FALSE"],
      required: true,
    },
    answers: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
  },
  { _id: false },
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    showResult: { type: Boolean, default: false },
    quizDuration: { type: Number, default: 5 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
