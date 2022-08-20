/** @format */

import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/eda-post");
    console.log("[✅] Connection established.");
  } catch (error) {
    console.error("[❌ ERROR]: ", error);
  }
};
