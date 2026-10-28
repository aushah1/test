import express from "express";
import {
  chatController,
  listSkillsController,
} from "../controllers/ai.controllers.js";
import { identifyUser } from "../middlewares/auth.middlewares.js";
import { validateChat } from "../validators/ai.validator.js";

const aiRouter = express.Router();

// Logged-in users only, so strangers can't spend your Gemini quota.
aiRouter.use(identifyUser);

aiRouter.get("/skills", listSkillsController);
aiRouter.post("/chat", validateChat, chatController);

export default aiRouter;
