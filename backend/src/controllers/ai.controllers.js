import { generateReply } from "../services/ai.service.js";
import { getSkill, listSkills } from "../services/skills.service.js";

export const listSkillsController = (req, res) => {
  res.status(200).json({ skills: listSkills() });
};

export const chatController = async (req, res) => {
  const { messages, skill } = req.body;

  try {
    const reply = await generateReply({
      messages,
      skill: skill ? getSkill(skill) : null,
    });
    res.status(200).json({ success: true, reply });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
