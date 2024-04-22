import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ??
        "mongodb+srv://kadiralpcil:szNLzMBrIGazeCdu@cluster0.refdcuw.mongodb.net/todoApp",
    );
    console.log("connected mongo");
  } catch (error) {
    console.log(error);
  }
};
