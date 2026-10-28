import mongoose from "mongoose";
import env from "./config.js";

async function connectToDatabase() {
  await mongoose.connect(env.MONGO_URI);
  console.log("Connected to MongoDB");
}

export default connectToDatabase;
