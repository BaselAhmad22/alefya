import { NextResponse } from "next/server";
import { z } from "zod";
import { getLesson, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";

const schema = z.object({
  question: z.string().min(2).max(2000),
  trackSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
  locale: z.enum(["ar", "en"]).default("ar"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(12)
    .optional(),
  roadmapContext: z
    .object({
      level: z.string().nullable().optional(),
      field: z.string().nullable().optional(),
      language: z.string().nullable().optional(),
      framework: z.string().nullable().optional(),
      step: z.string().optional(),
      contextTitle: z.string().optional(),
    })
    .optional(),
});

function localAnswer(
  question: string,
  lessonMarkdown: string,
  locale: Locale,
  title: string,
): string {
  const q = question.toLowerCase();
  const lines = lessonMarkdown.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let current = { heading: title, body: "" };

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line)) {
      if (current.body.trim()) sections.push(current);
      current = { heading: line.replace(/^#+\s+/, ""), body: "" };
    } else {
      current.body += `${line}\n`;
    }
  }
  if (current.body.trim()) sections.push(current);

  const scored = sections
    .map((s) => {
      const hay = `${s.heading}\n${s.body}`.toLowerCase();
      const words = q.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2);
      const score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
      return { ...s, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (locale === "ar") {
    if (scored.length === 0) {
      return `لم أجد مقطعاً مطابقاً مباشرة داخل **${title}**.\n\nجرّب تسأل بصياغة أبسط أو بكلمات من الشرح المعروض في الصفحة.`;
    }
    return [
      `بناءً على **${title}**:`,
      ...scored.map(
        (s) =>
          `### ${s.heading}\n\n${s.body.trim().slice(0, 1200)}${s.body.length > 1200 ? "…" : ""}`,
      ),
    ].join("\n\n");
  }

  if (scored.length === 0) {
    return `I couldn't find a matching section in **${title}**.\n\nTry simpler wording from the page copy.`;
  }

  return [
    `Based on **${title}**:`,
    ...scored.map(
      (s) =>
        `### ${s.heading}\n\n${s.body.trim().slice(0, 1200)}${s.body.length > 1200 ? "…" : ""}`,
    ),
  ].join("\n\n");
}

function roadmapLocalAnswer(question: string, locale: Locale, ctx: string) {
  if (locale === "ar") {
    return `سؤالك: ${question}\n\nفي مسار «ابدأ من الصفر» اختر ما يناسب هدفك:\n- الفرونت: واجهات يراها المستخدم\n- الباك: منطق وخوادم وAPI\n- الموبايل: تطبيقات الهاتف\n\nبعد اختيار المجال نختار لغة ثم إطار عمل، ونبدأ دائماً بأساسيات اللغة قبل الإطار.\n\nسياق خطوتك الحالية:\n${ctx}`;
  }
  return `Your question: ${question}\n\nOn the Start-from-zero path:\n- Frontend: UIs users see\n- Backend: servers and APIs\n- Mobile: phone apps\n\nAfter the field, pick a language then a framework. We always start with language fundamentals before the framework.\n\nCurrent step context:\n${ctx}`;
}

async function openAiAnswer(params: {
  question: string;
  locale: Locale;
  title: string;
  trackTitle: string;
  lessonMarkdown: string;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const system =
    params.locale === "ar"
      ? `أنت مساعد تعليمي داخل منصة ألف ياء (AlefYa). اشرح بالعربية الفصحى الواضحة. ساعد المبتدئين على اختيار مسار تعلّم. كن دقيقاً ومختصراً.`
      : `You are a tutoring assistant inside AlefYa. Help beginners choose a learning path. Be clear and concise.`;

  const lessonExcerpt = params.lessonMarkdown.slice(0, 12000);

  const messages = [
    { role: "system", content: system },
    {
      role: "system",
      content: `Track: ${params.trackTitle}\nLesson: ${params.title}\n\nContext:\n${lessonExcerpt}`,
    },
    ...(params.history || []).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: params.question },
  ];

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const { question, trackSlug, lessonSlug, locale, history, roadmapContext } =
      parsed.data;

    if (trackSlug === "roadmap") {
      const ctx = JSON.stringify(roadmapContext || {}, null, 2);
      const title =
        roadmapContext?.contextTitle ||
        (locale === "ar" ? "مسار المبتدئين" : "Beginner roadmap");
      const ai = await openAiAnswer({
        question,
        locale,
        title,
        trackTitle: "AlefYa Roadmap",
        lessonMarkdown: ctx,
        history,
      });
      if (ai) return NextResponse.json({ answer: ai, mode: "ai" });
      return NextResponse.json({
        answer: roadmapLocalAnswer(question, locale, ctx),
        mode: "local",
      });
    }

    const found = getLesson(trackSlug, lessonSlug);
    if (!found) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const title = tl(found.lesson.title, locale);
    const trackTitle = tl(found.track.title, locale);
    const lessonMarkdown = tl(found.lesson.content, locale);

    const ai = await openAiAnswer({
      question,
      locale,
      title,
      trackTitle,
      lessonMarkdown,
      history,
    });

    if (ai) {
      return NextResponse.json({ answer: ai, mode: "ai" });
    }

    return NextResponse.json({
      answer: localAnswer(question, lessonMarkdown, locale, title),
      mode: "local",
    });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
