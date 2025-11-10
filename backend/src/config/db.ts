import mongoose from "mongoose";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
