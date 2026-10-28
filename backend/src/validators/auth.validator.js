import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

export const validateRegisterUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .bail()
    .toLowerCase(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  validateRequest,
];

export const validateLoginUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .bail()
    .toLowerCase(),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];
