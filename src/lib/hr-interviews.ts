import fs from "fs";
import path from "path";
import {
  chatJsonCompletion,
  cleanProse,
  cleanProseList,
  hasOpenAiKey,
} from "@/lib/openai";
import type {
  HrDifficulty,
  HrGradeResult,
  HrGradedItem,
  HrInterviewQuestion,
  HrPublicQuestion,
  HrStudyQuestion,
} from "./hr-interviews-types";
import { hrDifficultyToUi } from "./hr-interviews-types";
import {
  getHrInterviewQuestionCount,
  getHrInterviewQuestionCountByDifficulty,
} from "./interview-counts";
import { getHrTrack, type HrTrack } from "./hr-tracks";

const HR_ROOT = path.join(process.cwd(), "content", "interviews", "hr");
const bankCache = new Map<string, HrInterviewQuestion[]>();

function readBankFile(trackSlug: string): HrInterviewQuestion[] {
  const filePath = path.join(HR_ROOT, `${trackSlug}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    questions: HrInterviewQuestion[];
  };
  return raw.questions ?? [];
}

export function loadHrBank(trackSlug: string): HrInterviewQuestion[] {
  if (bankCache.has(trackSlug)) return bankCache.get(trackSlug)!;
  const bank = readBankFile(trackSlug);
  bankCache.set(trackSlug, bank);
  return bank;
}

export function clearHrBankCache(): void {
  bankCache.clear();
}

export { getHrInterviewQuestionCount, getHrInterviewQuestionCountByDifficulty };

export function getHrTrackTitle(track: HrTrack, locale: "ar" | "en"): string {
  return track.title[locale];
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function mapDifficultyFilter(
  difficulty: HrDifficulty | "mixed" | "junior" | "mid" | "senior" | "executive",
): HrDifficulty[] | null {
  if (difficulty === "mixed") return null;
  if (difficulty === "junior") return ["entry"];
  if (difficulty === "mid") return ["mid"];
  if (difficulty === "senior") return ["senior", "executive"];
  if (difficulty === "executive") return ["executive"];
  return [difficulty];
}

export function pickHrQuestions(
  trackSlug: string,
  count: number,
  seed = `${Date.now()}:${Math.random()}`,
  difficulty:
    | HrDifficulty
    | "mixed"
    | "junior"
    | "mid"
    | "senior"
    | "executive" = "mixed",
): HrInterviewQuestion[] {
  let questions = [...loadHrBank(trackSlug)];
  const filter = mapDifficultyFilter(difficulty);
  if (filter) {
    questions = questions.filter((q) => filter.includes(q.difficulty));
  }
  const random = seededRandom(hashSeed(`${trackSlug}:${difficulty}:${seed}`));
  for (let index = questions.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [questions[index], questions[target]] = [questions[target], questions[index]];
  }
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return questions.slice(0, Math.min(safeCount, questions.length));
}

export function toPublicHrQuestion(
  q: HrInterviewQuestion,
  locale: "ar" | "en",
): HrPublicQuestion {
  return {
    id: q.id,
    kind: q.kind,
    difficulty: q.difficulty,
    competency: q.competency,
    interviewStage: q.interviewStage,
    prompt: q.prompt[locale],
    options: [...q.options[locale]],
  };
}

export function toStudyHrQuestion(
  q: HrInterviewQuestion,
  locale: "ar" | "en",
): HrStudyQuestion {
  return {
    ...toPublicHrQuestion(q, locale),
    whyAsked: q.whyAsked[locale],
    recruiterIntent: q.recruiterIntent[locale],
    modelAnswer: q.modelAnswer[locale],
    redFlags: [...q.redFlags[locale]],
    passTip: q.passTip[locale],
    explanation: q.explanation[locale],
    improvement: q.improvement[locale],
    correctIndex: q.correctIndex,
  };
}

export function listHrStudyQuestions(
  trackSlug: string,
  locale: "ar" | "en",
  opts?: {
    competency?: string;
    stage?: string;
    difficulty?: HrDifficulty;
    search?: string;
  },
): HrStudyQuestion[] {
  let items = loadHrBank(trackSlug).map((q) => toStudyHrQuestion(q, locale));
  if (opts?.competency) {
    items = items.filter((q) => q.competency === opts.competency);
  }
  if (opts?.stage) {
    items = items.filter((q) => q.interviewStage === opts.stage);
  }
  if (opts?.difficulty) {
    items = items.filter((q) => q.difficulty === opts.difficulty);
  }
  if (opts?.search?.trim()) {
    const needle = opts.search.trim().toLowerCase();
    items = items.filter(
      (q) =>
        q.prompt.toLowerCase().includes(needle) ||
        q.competency.toLowerCase().includes(needle) ||
        q.modelAnswer.toLowerCase().includes(needle),
    );
  }
  return items;
}

export function gradeHrAnswers(
  trackSlug: string,
  answers: Record<string, number>,
  locale: "ar" | "en",
  questionIds?: string[],
): HrGradeResult {
  const bank = loadHrBank(trackSlug);
  const byId = new Map(bank.map((q) => [q.id, q]));
  const ids =
    questionIds && questionIds.length
      ? questionIds.filter((id) => byId.has(id))
      : Object.keys(answers).filter((id) => byId.has(id));

  const items: HrGradedItem[] = ids.map((id) => {
    const question = byId.get(id)!;
    const rawSelection = answers[id];
    const selectedIndex =
      Number.isInteger(rawSelection) && rawSelection >= 0 && rawSelection <= 3
        ? rawSelection
        : null;
    const correct = selectedIndex === question.correctIndex;
    const selectedText =
      selectedIndex !== null
        ? question.options[locale][selectedIndex] ?? ""
        : "";
    const correctText = question.options[locale][question.correctIndex] ?? "";
    const explanation = question.explanation[locale];
    return {
      id: question.id,
      kind: question.kind,
      difficulty: question.difficulty,
      competency: question.competency,
      topic: question.competency,
      interviewStage: question.interviewStage,
      prompt: question.prompt[locale],
      options: [...question.options[locale]],
      selectedIndex,
      correctIndex: question.correctIndex,
      correct,
      explanation,
      why: explanation,
      improvement: question.improvement[locale],
      whyAsked: question.whyAsked[locale],
      recruiterIntent: question.recruiterIntent[locale],
      modelAnswer: question.modelAnswer[locale],
      redFlags: [...question.redFlags[locale]],
      passTip: question.passTip[locale],
    };
  });

  const correctCount = items.filter((item) => item.correct).length;
  const total = items.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const verdict = score >= 80 ? "strong" : score >= 60 ? "ok" : "weak";

  const strengths = items
    .filter((item) => item.correct)
    .slice(0, 4)
    .map((item) =>
      locale === "ar"
        ? `أظهرت نهجاً احترافياً في «${item.competency}».`
        : `You showed a professional approach on “${item.competency}”.`,
    );
  const weaknesses = items
    .filter((item) => !item.correct)
    .slice(0, 4)
    .map((item) =>
      locale === "ar"
        ? `راجع «${item.competency}»: اقرأ نموذج STAR وpassTip قبل جولة HR التالية.`
        : `Revisit “${item.competency}”: read the STAR model and pass tip before your next HR round.`,
    );

  const verdictSummary =
    locale === "ar"
      ? verdict === "strong"
        ? "جاهز للانتقال لجولة Manager — ثبّت قصص STAR بأرقام."
        : verdict === "ok"
          ? "أداء مقبول — راجع الأعلام الحمراء قبل جولة HR الرسمية."
          : "تحتاج مراجعة — ابدأ بوضع الدراسة ثم أعد جلسة MCQ."
      : verdict === "strong"
        ? "Ready to advance to a Manager round — lock in STAR stories with metrics."
        : verdict === "ok"
          ? "Acceptable performance — review red flags before the formal HR round."
          : "Needs review — start with Study mode, then retry an MCQ session.";

  return {
    score,
    total,
    correct: correctCount,
    verdict,
    strengths: strengths.length
      ? strengths
      : [
          locale === "ar"
            ? "لم تُرصد نقاط قوة واضحة — ركز على نموذج الإجابة."
            : "No clear strengths yet — focus on the model answer structure.",
        ],
    weaknesses: weaknesses.length
      ? weaknesses
      : [
          locale === "ar"
            ? "لا فجوات بارزة — حضّر 3 قصص STAR متعددة الاستخدام."
            : "No major gaps — prepare 3 versatile STAR stories.",
        ],
    summary:
      locale === "ar"
        ? `${verdictSummary} الدرجة ${score}/100 (${correctCount}/${total}).`
        : `${verdictSummary} Score ${score}/100 (${correctCount}/${total}).`,
    items,
  };
}

export async function aiEnrichHrReport(opts: {
  locale: "ar" | "en";
  trackTitle: string;
  result: HrGradeResult;
}): Promise<HrGradeResult> {
  const { locale, trackTitle, result } = opts;
  if (!hasOpenAiKey() || !result.items.length) return result;

  const system =
    locale === "ar"
      ? `أنت Senior Recruiter في منصة ألف ياء. حلّل جلسة تدريب مقابلات HR (اختيار من متعدد).
أعد JSON فقط:
{"items":[{"id":string,"why":string,"improvement":string}],"strengths":[string],"weaknesses":[string],"summary":string}
ركّز على STAR، أعلام حمراء، وكيفية الانتقال للمرحلة التالية. لا تغيّر الدرجة.`
      : `You are AlefYa's Senior Recruiter coach. Analyze an HR interview MCQ practice session.
Return JSON only:
{"items":[{"id":string,"why":string,"improvement":string}],"strengths":[string],"weaknesses":[string],"summary":string}
Focus on STAR, red flags, and advancing to the next interview stage. Do not change the score.`;

  const parsed = await chatJsonCompletion({
    system,
    user: JSON.stringify({
      track: trackTitle,
      score: result.score,
      verdict: result.verdict,
      items: result.items.map((item) => ({
        id: item.id,
        competency: item.competency,
        selectedIndex: item.selectedIndex,
        correctIndex: item.correctIndex,
        correct: item.correct,
        modelAnswer: item.modelAnswer.slice(0, 400),
      })),
    }),
    temperature: 0.35,
    maxTokens: 6000,
  });

  if (!parsed || !Array.isArray(parsed.items)) return result;

  const aiById = new Map<string, Record<string, unknown>>();
  for (const raw of parsed.items) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const id = String(row.id || "");
    if (id) aiById.set(id, row);
  }

  const items = result.items.map((item) => {
    const ai = aiById.get(item.id);
    if (!ai) return item;
    return {
      ...item,
      why: cleanProse(ai.why) ?? item.why,
      improvement: cleanProse(ai.improvement) ?? item.improvement,
    };
  });

  const strengths = cleanProseList(parsed.strengths, 4);
  const weaknesses = cleanProseList(parsed.weaknesses, 4);
  const summary = cleanProse(parsed.summary, 600) ?? result.summary;

  return {
    ...result,
    items,
    strengths: strengths.length ? strengths : result.strengths,
    weaknesses: weaknesses.length ? weaknesses : result.weaknesses,
    summary,
  };
}

/** For tech UI compatibility when reusing InterviewSessionClient badges. */
export function hrQuestionToUiMeta(q: HrInterviewQuestion) {
  return {
    kind: q.kind === "situational" ? ("scenario" as const) : ("mcq" as const),
    difficulty: hrDifficultyToUi(q.difficulty),
    topic: q.competency,
  };
}
