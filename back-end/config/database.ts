import { connect } from "mongoose";
import { mongodb } from "./config";

const connectDB = async () => {
  try {
    await connect(mongodb.uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;  // Exporting as CommonJS module