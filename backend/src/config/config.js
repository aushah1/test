import dotenv from "dotenv";

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  CLIENT_URL: (process.env.CLIENT_URL || "http://localhost:5173").trim(),
  MONGO_URI: process.env.MONGO_URI?.trim(),
  JWT_SECRET: process.env.JWT_SECRET?.trim(),
  CLIENT_ID: process.env.CLIENT_ID?.trim(),
  CLIENT_SECRET: process.env.CLIENT_SECRET?.trim(),
  GOOGLE_CALLBACK_URL: (
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:3000/api/auth/google/callback"
  ).trim(),
  // Gemma 4 via Google AI Studio (Gemini API). Optional on purpose: the rest of
  // the app keeps working without it and /api/ai/* answers 503 until it's set.
  GEMINI_API_KEY: process.env.GEMINI_API_KEY?.trim(),
  GEMMA_MODEL: (process.env.GEMMA_MODEL || "gemma-4-31b-it").trim(),
  // Used when the main model keeps failing on Google's side.
  GEMMA_FALLBACK_MODEL: (
    process.env.GEMMA_FALLBACK_MODEL || "gemma-4-26b-a4b-it"
  ).trim(),
};

const required = ["MONGO_URI", "JWT_SECRET", "CLIENT_ID", "CLIENT_SECRET"];
const missing = required.filter((key) => !config[key]);
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export default config;
