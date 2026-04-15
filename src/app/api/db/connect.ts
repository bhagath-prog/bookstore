import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected ✔");
  } catch (err) {
    console.log("DB Error:", err);
  }
};
