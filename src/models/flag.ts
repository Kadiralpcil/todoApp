import mongoose, { Schema } from "mongoose";

const flagSchema = new Schema(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  },
);

const flagType = mongoose.models.Flag || mongoose.model("Flag", flagSchema);

export default flagType;
