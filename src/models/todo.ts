import { base64url } from "jose";
import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    flag: { type: String, default: "" },
    img: { type: String, default: "" },
    // file: { type: File || null, default: null },
  },
  {
    timestamps: true,
  },
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
