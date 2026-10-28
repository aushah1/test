import express from "express";
import passport from "passport";
import {
  loginController,
  logoutController,
  registerController,
  googleAuthController,
  getCurrentUserController,
} from "../controllers/auth.controllers.js";
import { identifyUser } from "../middlewares/auth.middlewares.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validators/auth.validator.js";
import env from "../config/config.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegisterUser, registerController);
authRouter.post("/login", validateLoginUser, loginController);
authRouter.post("/logout", logoutController);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.CLIENT_URL}/login?error=google`,
  }),
  googleAuthController,
);

authRouter.get("/get-user", identifyUser, getCurrentUserController);

export default authRouter;
