import mongoose, { Schema } from "mongoose";

const loginSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  },
);

const LoginType = mongoose.models.Login || mongoose.model("Login", loginSchema);

export default LoginType;
