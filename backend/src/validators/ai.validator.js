import { body, validationResult } from "express-validator";
import { getSkill } from "../services/skills.service.js";

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

export const validateChat = [
  body("messages")
    .isArray({ min: 1, max: 30 })
    .withMessage("messages must be a list of 1 to 30 items"),
  body("messages.*.role")
    .isIn(["user", "assistant"])
    .withMessage("Each message role must be 'user' or 'assistant'"),
  body("messages.*.content")
    .isString()
    .withMessage("Each message needs text content")
    .bail()
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage("Each message must be 1 to 4000 characters"),
  body("messages").custom((messages) => {
    if (messages[0]?.role !== "user" || messages.at(-1)?.role !== "user") {
      throw new Error("The conversation must start and end with a user message");
    }
    return true;
  }),
  body("skill")
    .optional({ values: "falsy" })
    .isString()
    .custom((name) => {
      if (!getSkill(name)) throw new Error("Unknown skill");
      return true;
    }),
  validateRequest,
];
