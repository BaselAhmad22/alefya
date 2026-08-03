/**
 * Completes aspnet.mjs — run: node _gen-aspnet.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.join(__dirname, "aspnet.mjs");
const DATA = path.join(__dirname, "_aspnet-lessons-data.mjs");

const { REMAINING_LESSONS, STAGES } = await import(pathToFileURL(DATA).href);

function esc(s) {
  return JSON.stringify(s);
}

function serConcept(c) {
  return `concept(\n            ${esc(c.title.ar)},\n            ${esc(c.body.ar)},\n            ${esc(c.title.en)},\n            ${esc(c.body.en)},\n          )`;
}

function serQa(d) {
  return `qa(\n            ${esc(d.q.ar)},\n            ${esc(d.a.ar)},\n            ${esc(d.q.en)},\n            ${esc(d.a.en)},\n          )`;
}

function serPitfalls(items) {
  const rows = items
    .map(
      (i) =>
        `          {\n            ar: [${esc(i.ar[0])}, ${esc(i.ar[1])}],\n            en: [${esc(i.en[0])}, ${esc(i.en[1])}],\n          }`,
    )
    .join(",\n");
  return `pitfalls([\n${rows},\n        ])`;
}

function serCodeBlock(block) {
  return `{\n            lang: ${esc(block.lang)},\n            source: ${esc(block.source)},\n            explain: ${esc(block.explain)},\n          }`;
}

function serDeepLesson(s) {
  const concepts = s.concepts.map(serConcept).join(",\n          ");
  const discussion = s.discussion.map(serQa).join(",\n          ");
  return `      deepLesson({
        slug: ${esc(s.slug)},
        order: ${s.order},
        duration: ${s.duration},
        title: { ar: ${esc(s.title.ar)}, en: ${esc(s.title.en)} },
        summary: { ar: ${esc(s.summary.ar)}, en: ${esc(s.summary.en)} },
        why: { ar: ${esc(s.why.ar)}, en: ${esc(s.why.en)} },
        goals: {
          ar: [${s.goals.ar.map(esc).join(", ")}],
          en: [${s.goals.en.map(esc).join(", ")}],
        },
        concepts: [
          ${concepts},
        ],
        steps: {
          ar: [${s.steps.ar.map(esc).join(", ")}],
          en: [${s.steps.en.map(esc).join(", ")}],
        },
        code: {
          ar: ${serCodeBlock(s.code.ar)},
          en: ${serCodeBlock(s.code.en)},
        },
        pitfalls: ${serPitfalls(s.pitfalls)},
        discussion: [
          ${discussion},
        ],
        exercises: {
          ar: [${s.exercises.ar.map(esc).join(", ")}],
          en: [${s.exercises.en.map(esc).join(", ")}],
        },
        checklist: {
          ar: [${s.checklist.ar.map(esc).join(", ")}],
          en: [${s.checklist.en.map(esc).join(", ")}],
        },
        nextHint: { ar: ${esc(s.nextHint.ar)}, en: ${esc(s.nextHint.en)} },
      })`;
}

const lessonMap = Object.fromEntries(REMAINING_LESSONS.map((l) => [l.slug, l]));

const stageBlocks = STAGES.map((s) => {
  const les = s.lessonSlugs.map((slug) => {
    const l = lessonMap[slug];
    if (!l) throw new Error(`Missing lesson ${slug} for stage ${s.slug}`);
    return l;
  });
  return `  ${esc(s.slug)}: {
    meta: {
      slug: ${esc(s.slug)},
      order: ${s.order},
      title: { ar: ${esc(s.title.ar)}, en: ${esc(s.title.en)} },
      description: { ar: ${esc(s.desc.ar)}, en: ${esc(s.desc.en)} },
      lessons: [
${s.lessonSlugs.map((sl) => `        ${esc(`${sl}.json`)},`).join("\n")}
      ],
    },
    lessons: [
${les.map(serDeepLesson).join(",\n")}
    ],
  }`;
}).join(",\n");

const prefix = fs.readFileSync(TARGET, "utf8").trimEnd();
if (!prefix.endsWith("}),")) {
  throw new Error("aspnet.mjs prefix must end with }),");
}

const foundationsTail = REMAINING_LESSONS.filter((l) => l.stage === "01")
  .map(serDeepLesson)
  .join(",\n");

const suffix = [
  foundationsTail ? `,\n${foundationsTail}` : "",
  "\n    ],\n  },\n",
  stageBlocks,
  "\n};\n",
].join("");

fs.writeFileSync(TARGET, prefix + suffix, "utf8");
console.log(
  "Completed",
  TARGET,
  "| foundation lessons added:",
  REMAINING_LESSONS.filter((l) => l.stage === "01").length,
  "| stage lessons:",
  REMAINING_LESSONS.filter((l) => l.stage !== "01").length,
);
