import { NextResponse } from "next/server";
import { z } from "zod";
import {
  aiEnrichHrReport,
  getHrInterviewQuestionCount,
  getHrTrackTitle,
  gradeHrAnswers,
  listHrStudyQuestions,
  pickHrQuestions,
  toPublicHrQuestion,
} from "@/lib/hr-interviews";
import { getHrTrack } from "@/lib/hr-tracks";

const startSchema = z.object({
  action: z.literal("start"),
  trackSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  count: z.number().int().min(5).max(40).optional(),
  difficulty: z
    .enum(["entry", "mid", "senior", "executive", "mixed", "junior"])
    .default("mixed"),
});

const submitSchema = z.object({
  action: z.literal("submit"),
  trackSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  questionIds: z.array(z.string()).min(1).max(40),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
});

const listSchema = z.object({
  action: z.literal("list"),
  trackSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  competency: z.string().optional(),
  stage: z.string().optional(),
  difficulty: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  search: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.action === "start") {
      const parsed = startSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "invalid" }, { status: 400 });
      }
      const { trackSlug, locale, count, difficulty } = parsed.data;
      const track = getHrTrack(trackSlug);
      const bankSize = getHrInterviewQuestionCount(trackSlug);
      if (!track || bankSize === 0) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      const n = Math.min(count ?? 20, bankSize);
      const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const picked = pickHrQuestions(trackSlug, n, seed, difficulty);
      if (!picked.length) {
        return NextResponse.json({ error: "empty_bank" }, { status: 404 });
      }
      return NextResponse.json({
        seed,
        count: picked.length,
        bankSize,
        difficulty,
        questions: picked.map((q) => toPublicHrQuestion(q, locale)),
      });
    }

    if (body?.action === "submit") {
      const parsed = submitSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "invalid" }, { status: 400 });
      }
      const { trackSlug, locale, questionIds, answers } = parsed.data;
      const track = getHrTrack(trackSlug);
      if (!track || getHrInterviewQuestionCount(trackSlug) === 0) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      const graded = gradeHrAnswers(trackSlug, answers, locale, questionIds);
      const result = await aiEnrichHrReport({
        locale,
        trackTitle: getHrTrackTitle(track, locale),
        result: graded,
      });
      return NextResponse.json(result);
    }

    if (body?.action === "list") {
      const parsed = listSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "invalid" }, { status: 400 });
      }
      const { trackSlug, locale, competency, stage, difficulty, search } =
        parsed.data;
      if (!getHrTrack(trackSlug) || getHrInterviewQuestionCount(trackSlug) === 0) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      const questions = listHrStudyQuestions(trackSlug, locale, {
        competency,
        stage,
        difficulty,
        search,
      });
      return NextResponse.json({
        count: questions.length,
        bankSize: getHrInterviewQuestionCount(trackSlug),
        questions,
      });
    }

    return NextResponse.json({ error: "invalid" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
