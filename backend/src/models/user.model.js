import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hidden by default so the hash never leaks; use .select("+password") when needed.
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      default: null,
      select: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    avatar: String,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
