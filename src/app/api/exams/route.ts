import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { getTrack, t as tl } from "@/lib/content";
import type { Locale } from "@/lib/content";
import {
  generateStageExam,
  localGradeQuestion,
  aiBuildFullReport,
  buildLocalExamReport,
  publicQuestion,
  type ExamQuestion,
  type ExamReport,
} from "@/lib/exams";
import {
  PASS_SCORE,
  getCompletedLessonSlugs,
  getPassedStages,
  isStageExamUnlocked,
} from "@/lib/progress-gates";

const startSchema = z.object({
  trackSlug: z.string().min(1),
  stageSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
});

const submitSchema = z.object({
  attemptId: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  answers: z.record(z.string(), z.union([z.string(), z.number()])),
});

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const action = body?.action === "submit" ? "submit" : "start";

  if (action === "start") {
    const parsed = startSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const { trackSlug, stageSlug, locale } = parsed.data;
    const track = getTrack(trackSlug);
    if (!track) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const [completed, passedStages, prevAttempts] = await Promise.all([
      getCompletedLessonSlugs(session.user.id, trackSlug),
      getPassedStages(session.user.id, trackSlug),
      prisma.examAttempt.findMany({
        where: {
          userId: session.user.id,
          trackSlug,
          stageSlug,
          NOT: { feedbackJson: null },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    ]);

    if (!isStageExamUnlocked(track, stageSlug, completed, passedStages)) {
      return NextResponse.json({ error: "locked" }, { status: 403 });
    }

    // Drop unfinished drafts so retries don't pollute the avoid list
    await prisma.examAttempt.deleteMany({
      where: {
        userId: session.user.id,
        trackSlug,
        stageSlug,
        feedbackJson: null,
      },
    });

    const avoidFingerprints: string[] = [];
    const avoidTopics: string[] = [];
    for (const a of prevAttempts) {
      try {
        const fps = JSON.parse(a.fingerprintsJson) as string[];
        avoidFingerprints.push(...fps);
        const qs = JSON.parse(a.questionsJson) as ExamQuestion[];
        for (const q of qs) avoidTopics.push(q.topic);
      } catch {
        /* ignore */
      }
    }

    const generated = generateStageExam({
      trackSlug,
      stageSlug,
      avoidFingerprints,
      avoidTopics,
    });
    if (!generated) {
      return NextResponse.json({ error: "generate_failed" }, { status: 500 });
    }

    // Placeholder attempt row until submit (score -1 means in progress? use 0 and overwrite on submit)
    // Better: return questions without DB until submit, but we need attempt id for anti-cheat.
    // Store draft attempt with score 0 passed false, then update on submit.
    const attempt = await prisma.examAttempt.create({
      data: {
        userId: session.user.id,
        trackSlug,
        stageSlug,
        format: generated.format,
        score: 0,
        passed: false,
        questionsJson: JSON.stringify(generated.questions),
        answersJson: "{}",
        fingerprintsJson: JSON.stringify(
          generated.questions.map((q) => q.fingerprint),
        ),
        feedbackJson: null,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      format: generated.format,
      passScore: PASS_SCORE,
      questions: generated.questions.map((q) => publicQuestion(q, locale)),
    });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: parsed.data.attemptId },
  });
  if (!attempt || attempt.userId !== session.user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  // Prevent re-submit of already graded attempt with real answers stored
  const existingAnswers = JSON.parse(attempt.answersJson || "{}");
  if (existingAnswers && Object.keys(existingAnswers).length > 0 && attempt.feedbackJson) {
    const storedFeedback = JSON.parse(attempt.feedbackJson);
    const isLegacyFeedback = Array.isArray(storedFeedback);
    return NextResponse.json({
      score: attempt.score,
      passed: attempt.passed,
      passScore: PASS_SCORE,
      report: isLegacyFeedback ? undefined : storedFeedback,
      feedback: isLegacyFeedback ? storedFeedback : undefined,
      attemptId: attempt.id,
    });
  }

  const questions = JSON.parse(attempt.questionsJson) as ExamQuestion[];
  const locale = parsed.data.locale as Locale;
  const answers = parsed.data.answers;

  const localResults = questions.map((q) =>
    localGradeQuestion(q, answers[q.id], locale),
  );

  const track = getTrack(attempt.trackSlug);
  const stage = track?.stages.find((s) => s.slug === attempt.stageSlug);
  const lessonSlugs = Object.fromEntries(
    questions.map((question) => [
      question.id,
      stage?.lessons.find((lesson) =>
        question.topic.startsWith(`${lesson.slug} `),
      )?.slug,
    ]),
  );
  const reportOptions = {
    locale,
    stageTitle: stage ? tl(stage.title, locale) : attempt.stageSlug,
    questions,
    answers,
    localScores: localResults.map((result) => result.score),
    lessonSlugs,
  };
  const report: ExamReport =
    (await aiBuildFullReport(reportOptions)) ??
    buildLocalExamReport(reportOptions);

  const score = Math.round(
    report.items.reduce((total, item) => total + item.score, 0) /
      Math.max(1, report.items.length),
  );
  const passed = score >= PASS_SCORE;

  await prisma.examAttempt.update({
    where: { id: attempt.id },
    data: {
      score,
      passed,
      answersJson: JSON.stringify(answers),
      feedbackJson: JSON.stringify(report),
    },
  });

  return NextResponse.json({
    score,
    passed,
    passScore: PASS_SCORE,
    report,
    attemptId: attempt.id,
  });
}
