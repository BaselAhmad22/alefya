/**
 * Generates AlefYa curriculum content for all tracks.
 * Run: node scripts/generate-content.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { aspnetTrack, aspnetStages } from "./content/aspnet.mjs";
import { angularTrack, angularStages } from "./content/angular.mjs";
import { reactTrack, reactStages } from "./content/react.mjs";
import { nextjsTrack, nextjsStages } from "./content/nextjs.mjs";
import {
  reactNativeTrack,
  reactNativeStages,
} from "./content/react-native.mjs";
import { popularTrackBundles } from "./content/popular-tracks.mjs";
import { languageTrackBundles } from "./content/language-tracks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "content", "tracks");

function write(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
}

function emitTrack(track, stages) {
  const trackDir = path.join(ROOT, track.slug);
  write(path.join(trackDir, "track.json"), track);

  for (const [stageSlug, stage] of Object.entries(stages)) {
    const stageDir = path.join(trackDir, "stages", stageSlug);
    write(path.join(stageDir, "stage.json"), stage.meta);
    for (const les of stage.lessons) {
      write(path.join(stageDir, "lessons", `${les.slug}.json`), les);
    }
  }
}

function countLessons(stages) {
  return Object.values(stages).reduce((n, s) => n + s.lessons.length, 0);
}

/** Replaced by deep language-tracks */
const REPLACED = new Set(["javascript", "typescript", "python"]);

const tracks = [
  [aspnetTrack, aspnetStages],
  [angularTrack, angularStages],
  [reactTrack, reactStages],
  [nextjsTrack, nextjsStages],
  [reactNativeTrack, reactNativeStages],
  ...languageTrackBundles,
  ...popularTrackBundles.filter(([track]) => !REPLACED.has(track.slug)),
];

fs.rmSync(ROOT, { recursive: true, force: true });

const summary = [];
for (const [track, stages] of tracks) {
  emitTrack(track, stages);
  summary.push(`${track.slug} (${countLessons(stages)})`);
}

console.log(`Content generated: ${summary.join(" + ")}`);
console.log(`Total tracks: ${tracks.length}`);
