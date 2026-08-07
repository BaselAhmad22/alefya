/**
 * Emit Flutter track only (does not wipe other tracks).
 * Run: node scripts/emit-flutter.mjs && node scripts/enrich-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { flutterTrack, flutterStages } from "./content/flutter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "content", "tracks");
const trackDir = path.join(ROOT, flutterTrack.slug);

function write(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
}

fs.rmSync(trackDir, { recursive: true, force: true });
write(path.join(trackDir, "track.json"), flutterTrack);

let lessonCount = 0;
for (const [stageSlug, stage] of Object.entries(flutterStages)) {
  const stageDir = path.join(trackDir, "stages", stageSlug);
  write(path.join(stageDir, "stage.json"), stage.meta);
  for (const les of stage.lessons) {
    write(path.join(stageDir, "lessons", `${les.slug}.json`), les);
    lessonCount++;
  }
}

const stageCount = Object.keys(flutterStages).length;
console.log(
  `Flutter emitted: ${stageCount} stages, ${lessonCount} lessons → ${trackDir}`,
);
