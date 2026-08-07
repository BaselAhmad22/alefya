import { createHash } from "crypto";
import type { Locale } from "@/lib/content";
import { getTrack, t as tl, type Stage, type Track } from "@/lib/content";
import {
  chatJsonCompletion,
  cleanProse,
  cleanProseList,
  hasOpenAiKey,
} from "@/lib/openai";

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
  /** Internal topic key used for overlap / avoid logic (may include both locales). */
  topic: string;
  /** Learner-facing topic name for the active UI locale. */
  topicLabel: { ar: string; en: string };
};

export type ExamReportItem = {
  id: string;
  kind: "mcq" | "written";
  prompt: string;
  userAnswer: string;
  correctAnswer: string | null;
  score: number;
  correct: boolean;
  why: string;
  improvement: string;
  lessonSlug?: string;
  topic: string;
};

export type ExamReport = {
  items: ExamReportItem[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
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

const examBankCache = new Map<string, ExamQuestion[]>();

function buildBank(track: Track, stage: Stage): ExamQuestion[] {
  const cacheKey = `${track.slug}:${stage.slug}`;
  const cached = examBankCache.get(cacheKey);
  if (cached) return cached;

  const bank: ExamQuestion[] = [];
  for (const lesson of stage.lessons) {
    const topic = `${lesson.slug} ${lesson.title.en} ${lesson.title.ar}`;
    const topicLabel = { en: lesson.title.en, ar: lesson.title.ar };
    const base = `${stage.slug}:${lesson.slug}`;

    bank.push({
      id: `${base}:mcq-core`,
      kind: "mcq",
      topic,
      topicLabel,
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
      topicLabel,
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
      topicLabel,
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
      topicLabel,
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
      topicLabel,
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
      topicLabel,
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
      topicLabel,
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
      topicLabel,
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

  const stageTopicLabel = { en: stage.title.en, ar: stage.title.ar };

  // Stage-level synthesis questions
  bank.push({
    id: `${stage.slug}:mcq-order`,
    kind: "mcq",
    topic: stage.slug,
    topicLabel: stageTopicLabel,
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
    topicLabel: stageTopicLabel,
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
    topicLabel: stageTopicLabel,
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
    topicLabel: stageTopicLabel,
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
    topicLabel: stageTopicLabel,
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
    topicLabel: stageTopicLabel,
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

  examBankCache.set(cacheKey, bank);
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

type FullReportOptions = {
  locale: Locale;
  stageTitle: string;
  questions: ExamQuestion[];
  answers: Record<string, string | number>;
  localScores: number[];
  lessonSlugs?: Record<string, string | undefined>;
};

function clampScore(value: unknown) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function answerText(
  question: ExamQuestion,
  answer: string | number | undefined,
  locale: Locale,
) {
  if (question.kind === "mcq") {
    const index = typeof answer === "number" ? answer : Number(answer);
    return question.options?.[locale]?.[index] ?? String(answer ?? "");
  }
  return String(answer ?? "");
}

function localReportItem(
  opts: FullReportOptions,
  question: ExamQuestion,
  index: number,
): ExamReportItem {
  const localScore = clampScore(opts.localScores[index]);
  const prompt = tl(question.prompt, opts.locale);
  const userAnswer = answerText(question, opts.answers[question.id], opts.locale);
  const topic = tl(question.topicLabel, opts.locale);
  const correct = localScore >= 75;

  let correctAnswer: string | null = null;
  if (question.kind === "mcq" && typeof question.correctIndex === "number") {
    correctAnswer =
      question.options?.[opts.locale]?.[question.correctIndex] ?? null;
  } else if (question.kind === "written") {
    const keys =
      question.keywords?.[opts.locale] || question.keywords?.en || [];
    correctAnswer =
      opts.locale === "ar"
        ? keys.length
          ? `إجابة نموذجية تغطي: ${keys.slice(0, 5).join("، ")}. اربط المفهوم بمثال عملي واضح ضمن موضوع «${topic}».`
          : `اشرح المفهوم الأساسي في «${topic}» بجمل واضحة، مع مثال عملي وحالة حدّية واحدة.`
        : keys.length
          ? `A model answer should cover: ${keys.slice(0, 5).join(", ")}. Tie the concept to a concrete example in “${topic}”.`
          : `Explain the core idea in “${topic}” clearly, with one practical example and one edge case.`;
  }

  return {
    id: question.id,
    kind: question.kind,
    prompt,
    userAnswer,
    correctAnswer,
    score: localScore,
    correct,
    why:
      opts.locale === "ar"
        ? correct
          ? `إجابتك («${truncateForLocal(userAnswer)}») تغطي المطلوب في السؤال حول «${topic}».`
          : `إجابتك («${truncateForLocal(userAnswer)}») لا تغطي بعد المطلوب الكامل في سؤال «${topic}».`
        : correct
          ? `Your answer (“${truncateForLocal(userAnswer)}”) covers what the question asks about “${topic}”.`
          : `Your answer (“${truncateForLocal(userAnswer)}”) does not yet fully cover what “${topic}” asks for.`,
    improvement:
      opts.locale === "ar"
        ? correct
          ? `ثبّت فهم «${topic}» بتطبيق الفكرة في مثال جديد مختلف عن إجابتك الحالية.`
          : `راجع درس «${topic}»، ثم أعد الإجابة بذكر المفهوم صراحةً وربطه بمثال عملي قصير.`
        : correct
          ? `Reinforce “${topic}” by applying the idea in a fresh example beyond your current answer.`
          : `Review the “${topic}” lesson, then answer again naming the concept explicitly and tying it to a short practical example.`,
    lessonSlug: opts.lessonSlugs?.[question.id],
    topic,
  };
}

function truncateForLocal(text: string, max = 90) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "—";
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max).trim()}…`;
}

export function buildLocalExamReport(opts: FullReportOptions): ExamReport {
  const items = opts.questions.map((question, index) =>
    localReportItem(opts, question, index),
  );
  const strengths = items
    .filter((item) => item.correct)
    .slice(0, 4)
    .map((item) =>
      opts.locale === "ar"
        ? `أظهرت فهماً جيداً في «${item.topic}» من خلال إجابتك على السؤال.`
        : `You showed solid understanding of “${item.topic}” in your answer.`,
    );
  const weaknesses = items
    .filter((item) => !item.correct)
    .slice(0, 4)
    .map((item) =>
      opts.locale === "ar"
        ? `تحتاج إلى تعزيز «${item.topic}»: راجع المفهوم ثم أعد صياغة إجابة أوضح.`
        : `Strengthen “${item.topic}”: revisit the concept, then rewrite a clearer answer.`,
    );

  return {
    items,
    strengths: strengths.length
      ? strengths
      : [
          opts.locale === "ar"
            ? "لم تُرصد بعد نقاط قوة واضحة — أكمل الإجابات وراجع التحليل التفصيلي."
            : "No clear strengths yet — complete answers and review the detailed analysis.",
        ],
    weaknesses: weaknesses.length
      ? weaknesses
      : [
          opts.locale === "ar"
            ? "لا توجد فجوات بارزة في هذه المحاولة — ثبّت الفهم بأمثلة إضافية."
            : "No major gaps in this attempt — reinforce understanding with extra examples.",
        ],
    summary:
      opts.locale === "ar"
        ? `أكملت امتحان «${opts.stageTitle}». راجع التحليل التفصيلي أدناه وثبّت نقاط القوة قبل معالجة نقاط الضعف.`
        : `You completed the “${opts.stageTitle}” exam. Review the detailed analysis below, reinforce your strengths, and address the weaker areas.`,
  };
}

export async function aiBuildFullReport(
  opts: FullReportOptions,
): Promise<ExamReport | null> {
  if (!hasOpenAiKey()) return null;

  const system =
    opts.locale === "ar"
      ? `أنت كبير المقيّمين التربويين في منصة ألف ياء. حلّل كل سؤال وإجابة بدقة وبأسلوب تعليمي واضح ومفهوم.
أعد JSON فقط بالشكل:
{"items":[{"id":string,"score":number,"why":string,"improvement":string,"correctAnswer":string|null}],"strengths":[string],"weaknesses":[string],"summary":string}

قواعد ملزمة:
1) لكل عنصر: اذكر صراحةً ما كتبه/اختاره المتعلم وما يطلبه السؤال، بحيث تكون الفكرة واضحة 100٪.
2) MCQ: localScore و localCorrect حاسمان — انسخ الدرجة كما هي. املأ why بشرح لماذا الخيار المختار صحيح أو خاطئ مقارنةً بالإجابة الصحيحة المعطاة. improvement خطوة عملية قصيرة. correctAnswer اتركه null (سيُملأ من النظام).
3) تحريري: قيّم الفهم والدقة والتطبيق 0–100. why تشخيص مرتبط بنص إجابة المستخدم. improvement خطوة قابلة للتنفيذ. correctAnswer = نموذج جواب مثالي واضح (٢–٥ جمل) مناسب لمستوى المرحلة.
4) strengths و weaknesses: ٢–٤ جمل تعليمية كاملة مبنية على أنماط إجابات هذه المحاولة (ليست أسماء دروس فقط).
5) summary: فقرة قصيرة بالعربية فقط تلخّص الأداء.
6) لغة عربية فصحى واضحة فقط — بلا خلط إنجليزي. لا تخترع حقائق خارج السؤال/الإجابة/الخيارات.`
      : `You are AlefYa's senior educational assessor. Analyze every question and answer rigorously in clear, accessible teaching language.
Return JSON only in this shape:
{"items":[{"id":string,"score":number,"why":string,"improvement":string,"correctAnswer":string|null}],"strengths":[string],"weaknesses":[string],"summary":string}

Mandatory rules:
1) For every item: explicitly reference what the learner chose/wrote and what the question asks, so the idea is 100% clear.
2) MCQ: localScore and localCorrect are authoritative — copy the score unchanged. Fill why by explaining why the selected option is right or wrong versus the given correctAnswer. improvement is a short actionable step. Set correctAnswer to null (the system fills it).
3) Written: score understanding, accuracy, and application 0–100. why must diagnose the learner's actual text. improvement must be a concrete next action. correctAnswer = a clear model answer (2–5 sentences) at stage level.
4) strengths and weaknesses: 2–4 full teaching sentences based on patterns in THIS attempt (not bare topic labels).
5) summary: one short English-only paragraph on overall performance.
6) English only — never mix Arabic. Do not invent facts absent from the question, answer, or options.`;

  const inputItems = opts.questions.map((question, index) => {
    const localScore = clampScore(opts.localScores[index]);
    const options = question.options?.[opts.locale] ?? [];
    return {
      id: question.id,
      kind: question.kind,
      topic: tl(question.topicLabel, opts.locale),
      prompt: tl(question.prompt, opts.locale),
      options: question.kind === "mcq" ? options : undefined,
      selectedAnswer: answerText(
        question,
        opts.answers[question.id],
        opts.locale,
      ),
      correctAnswer:
        question.kind === "mcq" && typeof question.correctIndex === "number"
          ? options[question.correctIndex] ?? null
          : null,
      localScore,
      localCorrect: localScore >= 75,
      keywords:
        question.kind === "written"
          ? question.keywords?.[opts.locale] || question.keywords?.en || []
          : undefined,
    };
  });

  const parsed = await chatJsonCompletion({
    system,
    user: JSON.stringify({
      stage: opts.stageTitle,
      locale: opts.locale,
      items: inputItems,
    }),
    temperature: 0.35,
    maxTokens: 6000,
  });

  if (!parsed || !Array.isArray(parsed.items)) return null;

  const aiItems = new Map<string, Record<string, unknown>>();
  for (const raw of parsed.items) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const id = String(row.id || "");
    if (!id) continue;
    aiItems.set(id, row);
  }

  const fallback = buildLocalExamReport(opts);
  const items = fallback.items.map((item, index) => {
    const aiItem = aiItems.get(item.id);
    const question = opts.questions[index];
    if (!aiItem) return item;

    const aiScore = clampScore(aiItem.score);
    const score =
      question.kind === "mcq"
        ? item.score
        : Math.round(aiScore * 0.75 + item.score * 0.25);

    const why = cleanProse(aiItem.why) ?? item.why;
    const improvement = cleanProse(aiItem.improvement) ?? item.improvement;

    let correctAnswer = item.correctAnswer;
    if (question.kind === "mcq") {
      correctAnswer = item.correctAnswer;
    } else {
      correctAnswer =
        cleanProse(aiItem.correctAnswer, 700) ?? item.correctAnswer;
    }

    return {
      ...item,
      score,
      correct: question.kind === "mcq" ? item.correct : score >= 75,
      why,
      improvement,
      correctAnswer,
    };
  });

  const strengths = cleanProseList(parsed.strengths, 4);
  const weaknesses = cleanProseList(parsed.weaknesses, 4);
  const summary = cleanProse(parsed.summary, 600) ?? fallback.summary;

  return {
    items,
    strengths: strengths.length ? strengths : fallback.strengths,
    weaknesses: weaknesses.length ? weaknesses : fallback.weaknesses,
    summary,
  };
}

export function publicQuestion(q: ExamQuestion, locale: Locale) {
  return {
    id: q.id,
    kind: q.kind,
    prompt: tl(q.prompt, locale),
    options: q.options ? q.options[locale] : undefined,
  };
}
