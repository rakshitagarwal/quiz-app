import mongoose, { Schema } from "mongoose";

// Analytics Schema
const AnalyticsSchema = new Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true }, // Reference to the Quiz
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    score: { type: Number, required: true }, // Total score
    correctResponses: { type: Number, required: true }, // Count of correct answers
    incorrectResponses: { type: Number, required: true }, // Count of incorrect answers
    status: {
      type: String,
      enum: ["completed", "in-progress", "failed"], // Status of the quiz
      default: "completed",
      required: true,
    },
    timeTaken: { type: Number, required: true }, // Time taken in seconds
  },
  {
    timestamps: true, // Add createdAt and updatedAt
  },
);

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
