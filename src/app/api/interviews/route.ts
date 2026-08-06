import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrack, t as tl } from "@/lib/content";
import {
  aiEnrichInterviewReport,
  getInterviewQuestionCount,
  gradeInterviewAnswers,
  pickInterviewQuestions,
  toPublicQuestion,
} from "@/lib/interviews";

const startSchema = z.object({
  action: z.literal("start"),
  trackSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  count: z.number().int().min(5).max(40).optional(),
  difficulty: z.enum(["junior", "mid", "senior", "mixed"]).default("mixed"),
});

const submitSchema = z.object({
  action: z.literal("submit"),
  trackSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  questionIds: z.array(z.string()).min(1).max(40),
  answers: z.record(z.string(), z.number().int().min(0).max(3)),
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
      if (!getTrack(trackSlug) || getInterviewQuestionCount(trackSlug) === 0) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      const bankSize = getInterviewQuestionCount(trackSlug);
      const n = Math.min(count ?? 20, bankSize);
      const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const picked = pickInterviewQuestions(trackSlug, n, seed, difficulty);
      if (!picked.length) {
        return NextResponse.json({ error: "empty_bank" }, { status: 404 });
      }
      return NextResponse.json({
        seed,
        count: picked.length,
        bankSize,
        difficulty,
        questions: picked.map((q) => toPublicQuestion(q, locale)),
      });
    }

    if (body?.action === "submit") {
      const parsed = submitSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "invalid" }, { status: 400 });
      }
      const { trackSlug, locale, questionIds, answers } = parsed.data;
      const track = getTrack(trackSlug);
      if (!track || getInterviewQuestionCount(trackSlug) === 0) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      const graded = gradeInterviewAnswers(
        trackSlug,
        answers,
        locale,
        questionIds,
      );
      const result = await aiEnrichInterviewReport({
        locale,
        trackTitle: tl(track.title, locale),
        result: graded,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "invalid" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
