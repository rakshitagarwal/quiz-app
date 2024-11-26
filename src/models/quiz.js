import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    questionText: { type: String, required: true }, // Question text is mandatory
    type: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Short Answer"],
      required: true,
    }, // Restricts question type
    options: [
      {
        text: { type: String }, // Text of the option
        isCorrect: { type: Boolean, default: false }, // Indicates if it's the correct option
      },
    ], // Only applicable for Multiple Choice
  },
  { _id: false }, // Avoid generating separate IDs for questions
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true }, // Quiz title is mandatory
    description: { type: String }, // Optional description
    questions: {
      type: [QuestionSchema], // Embeds questions
      validate: [arrayLimit, "{PATH} exceeds the limit of 50"], // Min/max validation
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
