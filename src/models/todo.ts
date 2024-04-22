import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    flag: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
