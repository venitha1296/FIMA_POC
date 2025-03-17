import { connect } from "mongoose";
import { mongodb } from "./config";

export const connectDB = async () => {
  try {
    await connect(mongodb.uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};