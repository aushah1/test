import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import env from "../config/config.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  secure: env.NODE_ENV === "production",
};

const setAuthCookie = (user, res) => {
  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, { ...cookieOptions, maxAge: ONE_DAY_MS });
};

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
});

const sendTokenResponse = (user, res, message) => {
  setAuthCookie(user, res);
  res.status(200).json({ message, success: true, user: publicUser(user) });
};

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isAlreadyRegistered = await userModel.findOne({ email });
    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({ username, email, password });
    sendTokenResponse(user, res, "User registered successfully");
  } catch (err) {
    // Two simultaneous sign-ups can slip past the findOne check.
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    sendTokenResponse(user, res, "User logged in successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "User logged out successfully" });
};

export const googleAuthController = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails?.[0]?.value?.toLowerCase();
  const isVerified = emails?.[0]?.verified !== false;

  if (!email || !isVerified) {
    return res.redirect(`${env.CLIENT_URL}/login?error=google`);
  }

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        username: displayName,
        email,
        googleId: id,
        provider: "google",
        avatar: photos?.[0]?.value,
      });
    } else if (!user.googleId) {
      // Existing local account with the same verified Google email: link it.
      user.googleId = id;
      if (!user.avatar && photos?.[0]?.value) user.avatar = photos[0].value;
      await user.save();
    }

    setAuthCookie(user, res);
    res.redirect(env.CLIENT_URL);
  } catch (err) {
    console.error(err);
    res.redirect(`${env.CLIENT_URL}/login?error=google`);
  }
};

export const getCurrentUserController = (req, res) => {
  // identifyUser already loaded the user (without the password hash).
  res.status(200).json({
    message: "User fetched successfully",
    user: publicUser(req.user),
  });
};
