import { createHash } from "crypto";
import type { Locale } from "@/lib/content";
import { getTrack, t as tl, type Stage, type Track } from "@/lib/content";

export type ExamFormat = "mixed" | "mcq" | "written";

export const MIN_EXAM_QUESTIONS = 10;

export type ExamQuestion = {
  id: string;
  kind: "mcq" | "written";
  prompt: { ar: string; en: string };
  /** for mcq */
  options?: { ar: string[]; en: string[] };
  /** index of correct option for mcq local grading */
  correctIndex?: number;
  /** keywords for written local grading */
  keywords?: { ar: string[]; en: string[] };
  fingerprint: string;
  topic: string;
};

function fp(text: string) {
  return createHash("sha256").update(text.toLowerCase().replace(/\s+/g, " ").trim()).digest("hex").slice(0, 16);
}

function tokenize(s: string) {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 2);
}

export function similarFingerprint(a: string, b: string) {
  return a === b;
}

export function topicOverlap(a: string, b: string) {
  const ta = new Set(tokenize(a));
  const tb = tokenize(b);
  if (!tb.length) return 0;
  let hit = 0;
  for (const w of tb) if (ta.has(w)) hit++;
  return hit / tb.length;
}

function buildBank(track: Track, stage: Stage): ExamQuestion[] {
  const bank: ExamQuestion[] = [];
  for (const lesson of stage.lessons) {
    const topic = `${lesson.slug} ${lesson.title.en} ${lesson.title.ar}`;
    const base = `${stage.slug}:${lesson.slug}`;

    bank.push({
      id: `${base}:mcq-core`,
      kind: "mcq",
      topic,
      fingerprint: fp(`${base}|mcq-core|${lesson.title.en}`),
      prompt: {
        ar: `ما الهدف الأساسي من درس «${lesson.title.ar}» ضمن مرحلة «${stage.title.ar}»؟`,
        en: `What is the core goal of “${lesson.title.en}” inside stage “${stage.title.en}”?`,
      },
      options: {
        ar: [
          lesson.summary.ar,
          "تجاهل الأساسيات والقفز للإنتاج مباشرة",
          "حفظ الأسماء فقط دون تطبيق",
          "استبدال المسار بمسار عشوائي",
        ],
        en: [
          lesson.summary.en,
          "Skip foundations and jump straight to production",
          "Memorize names only with no practice",
          "Replace the path with a random track",
        ],
      },
      correctIndex: 0,
    });

    bank.push({
      id: `${base}:mcq-trap`,
      kind: "mcq",
      topic,
      fingerprint: fp(`${base}|mcq-trap|${lesson.slug}`),
      prompt: {
        ar: `أي خيار يمثل خطأ شائعاً عند تطبيق «${lesson.title.ar}»؟`,
        en: `Which option is a common mistake when applying “${lesson.title.en}”?`,
      },
      options: {
        ar: [
          "تطبيق المفهوم دون فهم الحالات الحدّية",
          "كتابة نموذج ذهني قبل الكود",
          "اختبار مثال فاشل ومثال ناجح",
          "الربط بالدرس السابق",
        ],
        en: [
          "Applying the idea without understanding edge cases",
          "Writing a mental model before coding",
          "Testing one failing and one passing example",
          "Linking to the previous lesson",
        ],
      },
      correctIndex: 0,
    });

    bank.push({
      id: `${base}:written-explain`,
      kind: "written",
      topic,
      fingerprint: fp(`${base}|written-explain|${lesson.title.en}`),
      prompt: {
        ar: `اشرح «${lesson.title.ar}» بكلماتك، واذكر مدخلاً ومخرجاً وحالة حدّية واحدة على الأقل.`,
        en: `Explain “${lesson.title.en}” in your own words, including one input, one output, and at least one edge case.`,
      },
      keywords: {
        ar: tokenize(`${lesson.title.ar} ${lesson.summary.ar}`).slice(0, 8),
        en: tokenize(`${lesson.title.en} ${lesson.summary.en}`).slice(0, 8),
      },
    });

    bank.push({
      id: `${base}:written-debug`,
      kind: "written",
      topic,
      fingerprint: fp(`${base}|written-debug|${lesson.slug}`),
      prompt: {
        ar: `صف سيناريو فشل حقيقي متعلق بـ «${lesson.title.ar}»، وكيف تكتشفه وتصلحه.`,
        en: `Describe a realistic failure scenario related to “${lesson.title.en}”, how you detect it, and how you fix it.`,
      },
      keywords: {
        ar: ["فشل", "اختبار", "حد", "إصلاح", ...tokenize(lesson.title.ar).slice(0, 4)],
        en: ["fail", "test", "edge", "fix", ...tokenize(lesson.title.en).slice(0, 4)],
      },
    });

    bank.push({
      id: `${base}:mcq-practice`,
      kind: "mcq",
      topic,
      fingerprint: fp(`${base}|mcq-practice|${lesson.slug}`),
      prompt: {
        ar: `ما أفضل خطوة تالية بعد فهم «${lesson.title.ar}»؟`,
        en: `What is the best next step after understanding “${lesson.title.en}”?`,
      },
      options: {
        ar: [
          "تطبيق صغير يختبر الفهم ثم الانتقال للدرس التالي",
          "حفظ الملخص حرفياً دون تجربة",
          "تخطي بقية المرحلة",
          "تجاهل الحالات الحدّية دائماً",
        ],
        en: [
          "A small practice that tests understanding, then move on",
          "Memorize the summary verbatim with no practice",
          "Skip the rest of the stage",
          "Always ignore edge cases",
        ],
      },
      correctIndex: 0,
    });

    bank.push({
      id: `${base}:mcq-signal`,
      kind: "mcq",
      topic,
      fingerprint: fp(`${base}|mcq-signal|${lesson.title.en}`),
      prompt: {
        ar: `أي عبارة تصف «${lesson.title.ar}» بدقة أكبر؟`,
        en: `Which statement best describes “${lesson.title.en}”?`,
      },
      options: {
        ar: [
          lesson.summary.ar,
          "مفهوم تجميلي بلا أثر على الكود",
          "بديل عن كل الدروس الأخرى في المرحلة",
          "مهارة اختيارية لا تُختبر أبداً",
        ],
        en: [
          lesson.summary.en,
          "A cosmetic idea with no effect on code",
          "A replacement for every other lesson in the stage",
          "An optional skill that is never tested",
        ],
      },
      correctIndex: 0,
    });

    bank.push({
      id: `${base}:written-steps`,
      kind: "written",
      topic,
      fingerprint: fp(`${base}|written-steps|${lesson.slug}`),
      prompt: {
        ar: `اكتب ثلاث خطوات عملية لتطبيق «${lesson.title.ar}» في مشروع صغير.`,
        en: `Write three practical steps to apply “${lesson.title.en}” in a small project.`,
      },
      keywords: {
        ar: ["خطوة", "تطبيق", "مشروع", ...tokenize(lesson.title.ar).slice(0, 5)],
        en: ["step", "apply", "project", ...tokenize(lesson.title.en).slice(0, 5)],
      },
    });

    bank.push({
      id: `${base}:written-contrast`,
      kind: "written",
      topic,
      fingerprint: fp(`${base}|written-contrast|${lesson.title.en}`),
      prompt: {
        ar: `قارن بين الاستخدام الصحيح والخاطئ لـ «${lesson.title.ar}» بجملتين لكل حالة.`,
        en: `Contrast correct vs incorrect use of “${lesson.title.en}” in two sentences each.`,
      },
      keywords: {
        ar: ["صحيح", "خاطئ", "مقارنة", ...tokenize(lesson.summary.ar).slice(0, 5)],
        en: ["correct", "incorrect", "compare", ...tokenize(lesson.summary.en).slice(0, 5)],
      },
    });
  }

  // Stage-level synthesis questions
  bank.push({
    id: `${stage.slug}:mcq-order`,
    kind: "mcq",
    topic: stage.slug,
    fingerprint: fp(`${stage.slug}|mcq-order`),
    prompt: {
      ar: `لماذا يجب إتمام دروس مرحلة «${stage.title.ar}» بالترتيب قبل الامتحان؟`,
      en: `Why must “${stage.title.en}” lessons be completed in order before the exam?`,
    },
    options: {
      ar: [
        "لأن كل درس يبني على السابق والامتحان يختبر التكامل",
        "لأن الترتيب عشوائي ولا أهمية له",
        "لأن الموقع يمنع الحفظ فقط",
        "لأن الامتحان لا علاقة له بالمرحلة",
      ],
      en: [
        "Because each lesson builds on the previous and the exam tests integration",
        "Because order is random and irrelevant",
        "Because the site only blocks memorization",
        "Because the exam is unrelated to the stage",
      ],
    },
    correctIndex: 0,
  });

  bank.push({
    id: `${stage.slug}:written-synth`,
    kind: "written",
    topic: stage.slug,
    fingerprint: fp(`${stage.slug}|written-synth|${track.slug}`),
    prompt: {
      ar: `لخّص مرحلة «${stage.title.ar}» في فقرة، واذكر مفهومين يجب أن يتقنه المتعلم قبل الانتقال.`,
      en: `Summarize stage “${stage.title.en}” in one paragraph and name two concepts a learner must master before moving on.`,
    },
    keywords: {
      ar: tokenize(`${stage.title.ar} ${stage.description.ar}`).slice(0, 8),
      en: tokenize(`${stage.title.en} ${stage.description.en}`).slice(0, 8),
    },
  });

  bank.push({
    id: `${stage.slug}:mcq-pass`,
    kind: "mcq",
    topic: stage.slug,
    fingerprint: fp(`${stage.slug}|mcq-pass`),
    prompt: {
      ar: `ما معنى النجاح في امتحان مرحلة «${stage.title.ar}»؟`,
      en: `What does passing the “${stage.title.en}” stage exam mean?`,
    },
    options: {
      ar: [
        "إثبات فهم كافٍ لمفاهيم المرحلة للانتقال بثقة",
        "إنهاء المسار بالكامل فوراً",
        "تجاوز كل الدروس دون مراجعة",
        "الحصول على شهادة خارجية تلقائياً",
      ],
      en: [
        "Enough understanding of the stage concepts to move on confidently",
        "Finishing the entire track immediately",
        "Skipping every lesson without review",
        "Automatically earning an external certificate",
      ],
    },
    correctIndex: 0,
  });

  bank.push({
    id: `${stage.slug}:mcq-review`,
    kind: "mcq",
    topic: stage.slug,
    fingerprint: fp(`${stage.slug}|mcq-review|${track.slug}`),
    prompt: {
      ar: `إذا رسبت في امتحان «${stage.title.ar}»، ما أفضل تصرف؟`,
      en: `If you fail the “${stage.title.en}” exam, what is the best move?`,
    },
    options: {
      ar: [
        "مراجعة نقاط الضعف ثم إعادة المحاولة بأسئلة مختلفة",
        "تجاهل النتيجة والانتقال للمرحلة التالية",
        "حذف الحساب والبدء من صفر دائماً",
        "حل الأسئلة عشوائياً بسرعة أكبر",
      ],
      en: [
        "Review weak points, then retry with a different question set",
        "Ignore the result and jump to the next stage",
        "Delete the account and always start from zero",
        "Answer randomly but faster",
      ],
    },
    correctIndex: 0,
  });

  bank.push({
    id: `${stage.slug}:written-map`,
    kind: "written",
    topic: stage.slug,
    fingerprint: fp(`${stage.slug}|written-map`),
    prompt: {
      ar: `ارسم بخطة قصيرة (نقاط) كيف ترتبط دروس مرحلة «${stage.title.ar}» ببعضها.`,
      en: `Outline briefly (bullet-style) how the lessons in “${stage.title.en}” connect to each other.`,
    },
    keywords: {
      ar: ["ربط", "درس", "مرحلة", ...tokenize(stage.title.ar).slice(0, 5)],
      en: ["connect", "lesson", "stage", ...tokenize(stage.title.en).slice(0, 5)],
    },
  });

  bank.push({
    id: `${stage.slug}:written-checklist`,
    kind: "written",
    topic: stage.slug,
    fingerprint: fp(`${stage.slug}|written-checklist|${track.slug}`),
    prompt: {
      ar: `اكتب قائمة تحقق من 4 بنود تثبت أنك جاهز لاجتياز امتحان «${stage.title.ar}».`,
      en: `Write a 4-item checklist proving you are ready to pass the “${stage.title.en}” exam.`,
    },
    keywords: {
      ar: ["تحقق", "جاهز", "امتحان", "بند"],
      en: ["checklist", "ready", "exam", "item"],
    },
  });

  return bank;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function rankBank(
  bank: ExamQuestion[],
  avoided: Set<string>,
  softAvoidTopics: string[],
  rng: () => number,
) {
  return [...bank].sort((a, b) => {
    const aBad = avoided.has(a.fingerprint) ? 1 : 0;
    const bBad = avoided.has(b.fingerprint) ? 1 : 0;
    if (aBad !== bBad) return aBad - bBad;
    const aTopic = softAvoidTopics.some((t) => topicOverlap(t, a.topic) > 0.45)
      ? 1
      : 0;
    const bTopic = softAvoidTopics.some((t) => topicOverlap(t, b.topic) > 0.45)
      ? 1
      : 0;
    if (aTopic !== bTopic) return aTopic - bTopic;
    return rng() - 0.5;
  });
}

function pickFromRanked(
  ranked: ExamQuestion[],
  selected: ExamQuestion[],
  kind: "mcq" | "written",
  count: number,
  avoided: Set<string>,
  strictAvoid: boolean,
) {
  for (const q of ranked) {
    if (q.kind !== kind) continue;
    if (selected.some((s) => s.id === q.id)) continue;
    if (strictAvoid && avoided.has(q.fingerprint)) continue;
    if (selected.some((s) => similarFingerprint(s.fingerprint, q.fingerprint))) {
      continue;
    }
    selected.push(q);
    if (selected.filter((s) => s.kind === kind).length >= count) break;
  }
}

export function generateStageExam(opts: {
  trackSlug: string;
  stageSlug: string;
  avoidFingerprints: string[];
  avoidTopics: string[];
  /** @deprecated mixed exams ignore single-format preference */
  preferFormat?: ExamFormat | null;
}): { format: ExamFormat; questions: ExamQuestion[] } | null {
  const track = getTrack(opts.trackSlug);
  if (!track) return null;
  const stage = track.stages.find((s) => s.slug === opts.stageSlug);
  if (!stage) return null;

  const rng = mulberry32(Date.now() % 1_000_000_007);
  const bank = buildBank(track, stage);
  const avoided = new Set(opts.avoidFingerprints);
  const softAvoidTopics = opts.avoidTopics.map((t) => t.toLowerCase());
  const ranked = rankBank(bank, avoided, softAvoidTopics, rng);

  const targetTotal = Math.min(
    Math.max(MIN_EXAM_QUESTIONS, 10),
    bank.length,
  );
  // Aim for a balanced mix, then fill to targetTotal.
  const targetWritten = Math.min(
    Math.max(3, Math.round(targetTotal * 0.35)),
    ranked.filter((q) => q.kind === "written").length,
  );
  const targetMcq = Math.min(
    targetTotal - targetWritten,
    ranked.filter((q) => q.kind === "mcq").length,
  );

  const selected: ExamQuestion[] = [];
  pickFromRanked(ranked, selected, "mcq", targetMcq, avoided, true);
  pickFromRanked(ranked, selected, "written", targetWritten, avoided, true);

  // Fill remaining slots with either kind, still preferring unused fingerprints.
  if (selected.length < targetTotal) {
    for (const q of ranked) {
      if (selected.some((s) => s.id === q.id)) continue;
      if (avoided.has(q.fingerprint)) continue;
      if (selected.some((s) => similarFingerprint(s.fingerprint, q.fingerprint))) {
        continue;
      }
      selected.push(q);
      if (selected.length >= targetTotal) break;
    }
  }

  // Soften avoidance if we still cannot reach 10.
  if (selected.length < targetTotal) {
    for (const q of ranked) {
      if (selected.some((s) => s.id === q.id)) continue;
      selected.push(q);
      if (selected.length >= targetTotal) break;
    }
  }

  shuffleInPlace(selected, rng);

  // Shuffle options for mcq
  for (const q of selected) {
    if (q.kind === "mcq" && q.options && typeof q.correctIndex === "number") {
      const pairsAr = q.options.ar.map((text, i) => ({ text, i }));
      const pairsEn = q.options.en.map((text, i) => ({ text, i }));
      for (let i = pairsAr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [pairsAr[i], pairsAr[j]] = [pairsAr[j], pairsAr[i]];
        [pairsEn[i], pairsEn[j]] = [pairsEn[j], pairsEn[i]];
      }
      const newCorrect = pairsAr.findIndex((p) => p.i === q.correctIndex);
      q.options = {
        ar: pairsAr.map((p) => p.text),
        en: pairsEn.map((p) => p.text),
      };
      q.correctIndex = newCorrect;
    }
  }

  return { format: "mixed", questions: selected };
}

export function localGradeQuestion(
  q: ExamQuestion,
  answer: string | number | null | undefined,
  locale: Locale,
): { score: number; feedback: string } {
  if (q.kind === "mcq") {
    const idx = typeof answer === "number" ? answer : Number(answer);
    const ok = idx === q.correctIndex;
    return {
      score: ok ? 100 : 0,
      feedback:
        locale === "ar"
          ? ok
            ? "إجابة صحيحة."
            : "إجابة غير صحيحة — راجع ملخص الدرس المرتبط."
          : ok
            ? "Correct."
            : "Incorrect — revisit the related lesson summary.",
    };
  }

  const text = String(answer || "");
  const words = tokenize(text);
  const keys = q.keywords?.[locale] || q.keywords?.en || [];
  let hits = 0;
  for (const k of keys) if (words.includes(k.toLowerCase()) || text.toLowerCase().includes(k.toLowerCase())) hits++;
  const coverage = keys.length ? hits / keys.length : 0;
  const lengthScore = Math.min(1, text.trim().length / 120);
  const score = Math.round(Math.min(100, coverage * 70 + lengthScore * 30));
  return {
    score,
    feedback:
      locale === "ar"
        ? score >= 75
          ? "إجابة مكتوبة جيدة وتغطي نقاطاً أساسية."
          : "الإجابة ناقصة — اذكر المفهوم، مثالاً، وحالة حدّية."
        : score >= 75
          ? "Solid written answer covering key points."
          : "Incomplete — include the concept, an example, and an edge case.",
  };
}

export async function aiGradeBatch(opts: {
  locale: Locale;
  stageTitle: string;
  items: { prompt: string; answer: string; kind: string }[];
}): Promise<{ scores: number[]; feedbacks: string[] } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const system =
    opts.locale === "ar"
      ? "أنت مصحح امتحانات صارم وعادل في منصة ألف ياء. لكل إجابة أعطِ درجة 0-100 وملاحظة قصيرة. أعد JSON فقط: {\"results\":[{\"score\":number,\"feedback\":string}]}"
      : "You are a strict fair exam grader for AlefYa. For each answer give 0-100 and short feedback. Return JSON only: {\"results\":[{\"score\":number,\"feedback\":string}]}";

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: JSON.stringify({
            stage: opts.stageTitle,
            items: opts.items,
          }),
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const results = parsed.results || [];
    return {
      scores: results.map((r: { score?: number }) => Math.max(0, Math.min(100, Number(r.score) || 0))),
      feedbacks: results.map((r: { feedback?: string }) => String(r.feedback || "")),
    };
  } catch {
    return null;
  }
}

export function publicQuestion(q: ExamQuestion, locale: Locale) {
  return {
    id: q.id,
    kind: q.kind,
    prompt: tl(q.prompt, locale),
    options: q.options ? q.options[locale] : undefined,
  };
}
