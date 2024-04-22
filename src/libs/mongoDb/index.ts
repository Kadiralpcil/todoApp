import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kadiralpcil:szNLzMBrIGazeCdu@cluster0.refdcuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log("connected mongo");
  } catch (error) {
    console.log(error);
  }
};
