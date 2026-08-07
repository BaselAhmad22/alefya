/**
 * Generates HR interview JSON banks (≥220 questions).
 * Run: node scripts/generate-hr-interviews.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { expandPack } from "./content/hr-pack-builder.mjs";
import {
  ALL_HR_PACKS,
  HR_REMAINING,
  HR_COMM_TEMPLATES,
  HR_COMPETENCY_TEMPLATES,
  HR_CULTURE_TEMPLATES,
  HR_LEAD_TEMPLATES,
  HR_PSYCH_TEMPLATES,
  HR_SALARY_TEMPLATES,
  HR_SCREEN_TEMPLATES,
  templateToPack,
} from "./content/hr-packs-all.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "content", "interviews", "hr");

const TARGETS = {
  "hr-behavioral": 28,
  "hr-situational": 24,
  "hr-classic": 22,
  "hr-motivation": 20,
  "hr-communication": 22,
  "hr-leadership": 20,
  "hr-psychometric-style": 22,
  "hr-culture-values": 20,
  "hr-salary-negotiation": 18,
  "hr-screening-recruiter": 24,
};

function buildTrackQuestions(trackSlug) {
  if (ALL_HR_PACKS[trackSlug]) {
    const questions = [];
    for (const p of ALL_HR_PACKS[trackSlug]) {
      questions.push(...expandPack(p, 4));
    }
    return questions.slice(0, TARGETS[trackSlug]);
  }

  const meta = HR_REMAINING[trackSlug];
  if (!meta) return [];

  const templateMap = {
    "hr-motivation": HR_COMPETENCY_TEMPLATES,
    "hr-communication": HR_COMM_TEMPLATES,
    "hr-leadership": HR_LEAD_TEMPLATES,
    "hr-psychometric-style": HR_PSYCH_TEMPLATES,
    "hr-culture-values": HR_CULTURE_TEMPLATES,
    "hr-salary-negotiation": HR_SALARY_TEMPLATES,
    "hr-screening-recruiter": HR_SCREEN_TEMPLATES,
  };

  const templates = templateMap[trackSlug] ?? [];
  const packs = templates.map((t) =>
    templateToPack(trackSlug, t, meta.kind, meta.stage, "mid"),
  );
  const questions = [];
  for (const p of packs) {
    questions.push(...expandPack(p, 4));
  }
  return questions.slice(0, TARGETS[trackSlug]);
}

fs.mkdirSync(OUT, { recursive: true });

const index = { tracks: {}, total: 0 };

for (const [trackSlug, target] of Object.entries(TARGETS)) {
  const questions = buildTrackQuestions(trackSlug);
  if (questions.length < target) {
    console.warn(`Warning: ${trackSlug} has ${questions.length}/${target} questions`);
  }
  const file = path.join(OUT, `${trackSlug}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ trackSlug, count: questions.length, questions }, null, 2) + "\n",
    "utf8",
  );
  index.tracks[trackSlug] = questions.length;
  index.total += questions.length;
  console.log(`${trackSlug}: ${questions.length} questions`);
}

fs.writeFileSync(
  path.join(OUT, "index.json"),
  JSON.stringify(index, null, 2) + "\n",
  "utf8",
);

console.log(`\nTotal HR questions: ${index.total}`);
console.log(`Written to ${OUT}`);
