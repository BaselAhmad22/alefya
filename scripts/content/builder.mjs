/**
 * Builds self-contained bilingual deep lessons so learners rarely need other sites.
 */

export function deepLesson(spec) {
  const {
    slug,
    order,
    duration,
    title,
    summary,
    why,
    goals,
    concepts,
    steps,
    code,
    pitfalls,
    discussion,
    exercises,
    checklist,
    nextHint,
    draft = false,
  } = spec;

  const content = {
    ar: renderAr({
      title: title.ar,
      why: why.ar,
      goals: goals.ar,
      concepts: concepts.map((c) => ({ title: c.title.ar, body: c.body.ar })),
      steps: steps.ar,
      code: code?.ar,
      pitfalls: pitfalls.ar,
      discussion: discussion.map((d) => ({ q: d.q.ar, a: d.a.ar })),
      exercises: exercises.ar,
      checklist: checklist.ar,
      nextHint: nextHint.ar,
    }),
    en: renderEn({
      title: title.en,
      why: why.en,
      goals: goals.en,
      concepts: concepts.map((c) => ({ title: c.title.en, body: c.body.en })),
      steps: steps.en,
      code: code?.en,
      pitfalls: pitfalls.en,
      discussion: discussion.map((d) => ({ q: d.q.en, a: d.a.en })),
      exercises: exercises.en,
      checklist: checklist.en,
      nextHint: nextHint.en,
    }),
  };

  return {
    slug,
    order,
    duration,
    title,
    summary,
    content,
    ...(draft ? { draft: true } : {}),
  };
}

function renderAr(d) {
  return `# ${d.title}

## لماذا هذا الدرس مهم؟

${d.why}

## ماذا ستتقن في نهايته؟

${d.goals.map((g) => `- ${g}`).join("\n")}

## المفاهيم بالتفصيل

${d.concepts.map((c) => `### ${c.title}\n\n${c.body}`).join("\n\n")}

## مسار الفهم خطوة بخطوة

${d.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

${
  d.code
    ? `## مثال عملي كامل\n\n\`\`\`${d.code.lang || "csharp"}\n${d.code.source}\n\`\`\`\n\n${d.code.explain || ""}`
    : ""
}

## أخطاء شائعة ونقاشات حولها

${d.pitfalls.map((p) => `- **${p.bad}** → ${p.good}`).join("\n")}

## نقاش / أسئلة يطرحها المتعلمون كثيراً

${d.discussion.map((qa) => `### ${qa.q}\n\n${qa.a}`).join("\n\n")}

## تمارين داخل الموقع (لا تحتاج مصدراً خارجياً)

${d.exercises.map((e, i) => `${i + 1}. ${e}`).join("\n")}

## قائمة تحقق قبل الانتقال

${d.checklist.map((c) => `- [ ] ${c}`).join("\n")}

## ماذا بعد؟

${d.nextHint}

> تذكير: إذا تعثّرت، افتح **AI Helper** في أسفل الصفحة واسأل عن الجزء غير الواضح — مع سياق هذا الدرس.
`;
}

function renderEn(d) {
  return `# ${d.title}

## Why this lesson matters

${d.why}

## What you will master

${d.goals.map((g) => `- ${g}`).join("\n")}

## Concepts in depth

${d.concepts.map((c) => `### ${c.title}\n\n${c.body}`).join("\n\n")}

## Step-by-step path

${d.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

${
  d.code
    ? `## Full practical example\n\n\`\`\`${d.code.lang || "csharp"}\n${d.code.source}\n\`\`\`\n\n${d.code.explain || ""}`
    : ""
}

## Common mistakes & how to think about them

${d.pitfalls.map((p) => `- **${p.bad}** → ${p.good}`).join("\n")}

## Discussion / frequent learner questions

${d.discussion.map((qa) => `### ${qa.q}\n\n${qa.a}`).join("\n\n")}

## In-site exercises (no external sites needed)

${d.exercises.map((e, i) => `${i + 1}. ${e}`).join("\n")}

## Checklist before moving on

${d.checklist.map((c) => `- [ ] ${c}`).join("\n")}

## What's next?

${d.nextHint}

> Tip: If you get stuck, open the **AI Helper** at the bottom and ask about the unclear part — it has this lesson's context.
`;
}

/** Quick helper to build bilingual Q/A pairs */
export function qa(arQ, arA, enQ, enA) {
  return { q: { ar: arQ, en: enQ }, a: { ar: arA, en: enA } };
}

export function concept(arT, arB, enT, enB) {
  return { title: { ar: arT, en: enT }, body: { ar: arB, en: enB } };
}

export function pit(arBad, arGood, enBad, enGood) {
  return { bad: arBad, good: arGood, /* mapped in render via locale objects */ };
}

/** pitfalls expect {bad, good} per locale in deepLesson - use this: */
export function pitfalls(items) {
  // items: [{ ar: [bad, good], en: [bad, good] }, ...]
  return {
    ar: items.map((i) => ({ bad: i.ar[0], good: i.ar[1] })),
    en: items.map((i) => ({ bad: i.en[0], good: i.en[1] })),
  };
}
