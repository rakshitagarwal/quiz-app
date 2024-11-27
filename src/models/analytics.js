import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    correctResponses: { type: Number, required: true },
    incorrectResponses: { type: Number, required: true }, 
    status: {
      type: String,
      enum: ["Pass" , "Fail"],
      default: "Fail",
      required: true,
    },
    timeTaken: { type: Number, required: false },
  },
  {
    timestamps: true,
  },
);

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
