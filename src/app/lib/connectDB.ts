import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect("mongodb://127.0.0.1:27017/book");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB connection error:", error);
  }
};
