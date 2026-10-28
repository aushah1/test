import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILLS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../skills",
);

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Minimal SKILL.md parser: `--- key: value ---` header, then the Markdown body.
// Only top-level `name` and `description` are read; that is all we need.
function parseSkill(raw) {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const meta = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  if (!meta.name || !meta.description) return null;

  return {
    name: meta.name,
    description: meta.description,
    instructions: match[2].trim(),
  };
}

function loadSkills() {
  const skills = new Map();
  if (!fs.existsSync(SKILLS_DIR)) return skills;

  for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(SKILLS_DIR, entry.name, "SKILL.md");
    if (!fs.existsSync(file)) continue;

    const skill = parseSkill(fs.readFileSync(file, "utf8"));
    if (!skill || !NAME_RE.test(skill.name) || skill.name !== entry.name) {
      console.warn(`Skipping invalid skill in skills/${entry.name}`);
      continue;
    }
    skills.set(skill.name, skill);
  }
  return skills;
}

// Loaded once at startup. Restart the server after editing a SKILL.md.
const skills = loadSkills();

export const listSkills = () =>
  [...skills.values()].map(({ name, description }) => ({ name, description }));

export const getSkill = (name) => skills.get(name) ?? null;
