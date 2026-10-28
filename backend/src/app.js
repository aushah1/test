import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authRouter from "./routes/auth.routes.js";
import aiRouter from "./routes/ai.routes.js";
import env from "./config/config.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ),
);

// Throttle credential endpoints to slow down brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

// Keep AI calls well under Google's free-tier limits and stop one client
// from burning the whole quota.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "You're sending messages too fast, slow down a little" },
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRouter);
app.use("/api/ai", aiLimiter, aiRouter);

export default app;
