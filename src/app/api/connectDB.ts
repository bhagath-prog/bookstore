import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected ✔");
  } catch (error) {
    console.log("DB Error:", error);
  }
}
