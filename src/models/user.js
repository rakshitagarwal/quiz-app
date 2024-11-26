import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
