import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ??
        "mongodb+srv://kadiralpcil:xqJiZHovNbLHFjU4@todos.rbl2lxc.mongodb.net/todoApp",
    );
  } catch (error) {
    console.log(error);
  }
};
