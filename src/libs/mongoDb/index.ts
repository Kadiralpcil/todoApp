import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://alp:5O4juHgQMHmy6jxg@cluster0.refdcuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log("connected mongo");
  } catch (error) {
    console.log(error);
  }
};
