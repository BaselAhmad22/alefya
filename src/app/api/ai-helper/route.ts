import { NextResponse } from "next/server";
import { z } from "zod";
import { getLesson, t as tl } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import {
  FIELDS,
  LANGUAGES_BY_FIELD,
  frameworksFor,
  type RoadmapField,
} from "@/lib/roadmap";

const schema = z.object({
  question: z.string().min(1).max(2000),
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

function locOpt(
  opts: { id: string; title: { ar: string; en: string }; summary: { ar: string; en: string } }[],
  locale: Locale,
) {
  return opts
    .map(
      (o) =>
        `- **${o.title[locale] || o.title.en}**: ${o.summary[locale] || o.summary.en}`,
    )
    .join("\n");
}

function roadmapGuide(locale: Locale, ctx: {
  level?: string | null;
  field?: string | null;
  language?: string | null;
  framework?: string | null;
  step?: string;
}) {
  const step = ctx.step || "field";
  const field = (ctx.field as RoadmapField | null) || null;

  if (locale === "ar") {
    if (step === "field") {
      return `أنت في خطوة اختيار **المجال**. الخيارات:\n${locOpt(FIELDS, "ar")}\n\nاختر حسب ما تريد بناءه: واجهات يراها المستخدم → فرونت، خوادم وAPI → باك، تطبيقات هاتف → موبايل.`;
    }
    if (step === "language" && field) {
      return `أنت في خطوة اختيار **اللغة** لمجال ${FIELDS.find((f) => f.id === field)?.title.ar || field}. الخيارات:\n${locOpt(LANGUAGES_BY_FIELD[field], "ar")}\n\nابدأ بلغة تناسب مجالك؛ الأساسيات أولاً قبل أي إطار.`;
    }
    if (step === "framework" && field && ctx.language) {
      const fws = frameworksFor(field, ctx.language);
      return `أنت في خطوة اختيار **إطار العمل** بعد لغة ${ctx.language}. الخيارات:\n${locOpt(fws, "ar")}\n\nكل خيار يرتّب مساراً: لغة أولاً ثم الإطار.`;
    }
    return "أنت في مسار «ابدأ من الصفر»: مستوى ← مجال ← لغة ← إطار ← خطة مرتّبة.";
  }

  if (step === "field") {
    return `You are choosing a **field**. Options:\n${locOpt(FIELDS, "en")}\n\nPick by what you want to build: UIs users see → frontend, servers/APIs → backend, phone apps → mobile.`;
  }
  if (step === "language" && field) {
    return `You are choosing a **language** for ${FIELDS.find((f) => f.id === field)?.title.en || field}. Options:\n${locOpt(LANGUAGES_BY_FIELD[field], "en")}\n\nStart with a language that fits your field; fundamentals before any framework.`;
  }
  if (step === "framework" && field && ctx.language) {
    const fws = frameworksFor(field, ctx.language);
    return `You are choosing a **framework** after ${ctx.language}. Options:\n${locOpt(fws, "en")}\n\nEach choice builds an ordered path: language first, then the framework.`;
  }
  return "You are on Start-from-zero: level → field → language → framework → ordered plan.";
}

function isGibberish(question: string) {
  const q = question.trim();
  if (q.length < 2) return true;
  const letters = (q.match(/\p{L}/gu) || []).length;
  if (letters < 2) return true;
  // Repeated same char / keyboard smash heuristics
  if (/^(.)\1{3,}$/u.test(q)) return true;
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length === 1 && q.length <= 8 && !/[aeiouأإآاويىئء]/i.test(q)) {
    return true;
  }
  return false;
}

function roadmapLocalAnswer(
  question: string,
  locale: Locale,
  ctx: {
    level?: string | null;
    field?: string | null;
    language?: string | null;
    framework?: string | null;
    step?: string;
  },
): string {
  const guide = roadmapGuide(locale, ctx);
  const gibberish = isGibberish(question);

  if (locale === "ar") {
    if (gibberish) {
      return [
        `### لحظة — لم أفهم السؤال`,
        `رسالتك غير واضحة كسؤال. لا بأس — أنا هنا لمساعدتك في اختيار المسار.`,
        ``,
        `### أين أنت الآن`,
        guide,
        ``,
        `### اسألني مثلاً`,
        `- ما الفرق بين الفرونت والباك؟`,
        `- أي لغة أنسب لي إذا أريد بناء متجر؟`,
        `- ليش نتعلّم اللغة قبل الإطار؟`,
        ``,
        `### خطوتك التالية`,
        `اكتب سؤالاً بجملة واحدة واضحة عن هدفك أو عن أحد الخيارات الظاهرة أمامك.`,
      ].join("\n");
    }

    const q = question.toLowerCase();
    let focus = "";
    if (/فرونت|frontend|واجهة|ui/.test(q)) {
      focus =
        "**الفرونت** يناسبك إذا هدفك صفحات ومكوّنات وتفاعل المستخدم. بعدها تختار لغة (غالباً JavaScript أو TypeScript) ثم إطار مثل React.";
    } else if (/باك|backend|خادم|api|سيرفر/.test(q)) {
      focus =
        "**الباك** يناسبك إذا هدفك منطق الخادم، قواعد البيانات، وواجهات API. تختار لغة مثل C# أو Node أو Python ثم إطار مناسب.";
    } else if (/موبايل|mobile|هاتف|ios|android/.test(q)) {
      focus =
        "**الموبايل** يناسبك لبناء تطبيقات هاتف. مسارات شائعة: JavaScript → React Native، أو Dart → Flutter.";
    } else if (/جافا سكربت|javascript|js\b/.test(q)) {
      focus =
        "**JavaScript** أساس الويب وبوابة لكثير من مسارات الفرونت والباك (Node) والموبايل (React Native).";
    } else if (/react|رياكت/.test(q)) {
      focus =
        "**React** إطار واجهات بعد أساسيات JavaScript/TypeScript. في خطتنا يأتي بعد مسار اللغة، لا قبله.";
    } else if (/فرق|difference|vs|ولا/.test(q)) {
      focus =
        "فرّق هكذا: المجال = ماذا تبني، اللغة = بأدوات أي لغة، الإطار = مكتبة/منصة تسهّل البناء بعد الأساسيات.";
    } else {
      focus =
        "اربط سؤالك بهدف عملي واحد (مثلاً: موقع، API، تطبيق هاتف)، ثم اختر المجال الأقرب لهذا الهدف.";
    }

    return [
      `### الجواب المباشر`,
      focus,
      ``,
      `### سياق خطوتك`,
      guide,
      ``,
      `### خطأ شائع`,
      `اختيار إطار قبل فهم أساسيات اللغة، أو اختيار مجال لا يخدم المشروع الذي تريد بناءه.`,
      ``,
      `### الخطوة التالية`,
      `اختر الخيار الأقرب لهدفك من البطاقات أعلاه، أو اسألني عن خيار واحد بالاسم.`,
    ].join("\n");
  }

  if (gibberish) {
    return [
      `### I didn’t catch that`,
      `Your message doesn’t look like a clear question — no problem. I’m here to help you pick a path.`,
      ``,
      `### Where you are`,
      guide,
      ``,
      `### Try asking`,
      `- What’s the difference between frontend and backend?`,
      `- Which language fits if I want to build a store?`,
      `- Why learn the language before the framework?`,
      ``,
      `### Next step`,
      `Write one clear sentence about your goal or about one of the options on screen.`,
    ].join("\n");
  }

  const q = question.toLowerCase();
  let focus = "";
  if (/front|ui|interface/.test(q)) {
    focus =
      "**Frontend** fits if you want pages, components, and user interaction. Then pick a language (usually JavaScript or TypeScript) and a framework like React.";
  } else if (/back|server|api/.test(q)) {
    focus =
      "**Backend** fits if you want server logic, databases, and APIs. Pick a language like C#, Node, or Python, then a matching framework.";
  } else if (/mobile|phone|ios|android/.test(q)) {
    focus =
      "**Mobile** fits phone apps. Common paths: JavaScript → React Native, or Dart → Flutter.";
  } else if (/javascript|\bjs\b/.test(q)) {
    focus =
      "**JavaScript** is the web’s foundation and unlocks frontend, Node backend, and React Native mobile paths.";
  } else if (/react/.test(q)) {
    focus =
      "**React** is a UI framework after JavaScript/TypeScript basics. On our plan it comes after the language track, not before.";
  } else if (/difference|vs|or /.test(q)) {
    focus =
      "Think: field = what you build, language = which language tools, framework = the toolkit after fundamentals.";
  } else {
    focus =
      "Tie your question to one practical goal (site, API, phone app), then pick the closest field.";
  }

  return [
    `### Direct answer`,
    focus,
    ``,
    `### Your current step`,
    guide,
    ``,
    `### Common mistake`,
    `Choosing a framework before language fundamentals, or a field that doesn’t match the project you want.`,
    ``,
    `### Next step`,
    `Pick the closest option on the cards above, or ask me about one option by name.`,
  ].join("\n");
}

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
      return `### المفهوم\nلا أجد في محتوى **${title}** ما يكفي للإجابة بثقة، لذلك لن أخمّن.\n\n### مثال ملموس\nأعد صياغة سؤالك باستخدام اسم المفهوم أو المصطلح كما يظهر في الدرس.\n\n### خطأ شائع\nالاعتماد على إجابة عامة غير مدعومة بمحتوى الدرس.\n\n### الخطوة التالية\nحدّد المقطع الذي حيّرك أو انسخ منه سطراً واحداً، وسأشرحه خطوة بخطوة.`;
    }
    const source = scored
      .map(
        (s) =>
          `#### ${s.heading}\n${s.body.trim().slice(0, 1000)}${s.body.length > 1000 ? "…" : ""}`,
      )
      .join("\n\n");
    return [
      `### المفهوم\nبناءً على **${title}**، هذه الأجزاء هي الأقرب لسؤالك:\n\n${source}`,
      `### مثال ملموس\nطبّق الفكرة على حالة صغيرة واحدة: حدّد المدخل، نفّذ الخطوات المذكورة في الدرس، ثم تحقّق من الناتج المتوقع.`,
      `### خطأ شائع\nنسخ الخطوات دون فهم سبب كل خطوة أو اختبار حالة مختلفة عن المثال.`,
      `### الخطوة التالية\nأعد شرح الفكرة بجملة من عندك، ثم جرّبها على مثال صغير. إذا اختلف الناتج، قارنه بشروط الدرس أعلاه.`,
    ].join("\n\n");
  }

  if (scored.length === 0) {
    return `### Concept\nI cannot find enough support in **${title}** to answer confidently, so I will not guess.\n\n### Concrete example\nRephrase your question using the concept name or terminology shown in the lesson.\n\n### Common mistake\nRelying on a generic answer that is not supported by the lesson content.\n\n### Next step\nPoint to the confusing section or paste one line from it, and I will explain it step by step.`;
  }

  const source = scored
    .map(
      (s) =>
        `#### ${s.heading}\n${s.body.trim().slice(0, 1000)}${s.body.length > 1000 ? "…" : ""}`,
    )
    .join("\n\n");
  return [
    `### Concept\nBased on **${title}**, these are the sections most relevant to your question:\n\n${source}`,
    `### Concrete example\nApply the idea to one small case: identify the input, follow the lesson's steps, then verify the expected output.`,
    `### Common mistake\nCopying the steps without understanding why each one is needed or testing a case beyond the example.`,
    `### Next step\nExplain the idea back in one sentence, then try it on a small example. If the result differs, compare it with the lesson conditions above.`,
  ].join("\n\n");
}

async function openAiAnswer(params: {
  question: string;
  locale: Locale;
  title: string;
  trackTitle: string;
  lessonMarkdown: string;
  history?: { role: "user" | "assistant"; content: string }[];
  mode?: "lesson" | "roadmap";
}): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const system =
    params.mode === "roadmap"
      ? params.locale === "ar"
        ? `أنت مستشار مسار تعلّم داخل منصة ألف ياء. المتعلم في معالج «ابدأ من الصفر».
أجب بالعربية الفصحى الواضحة والودية. كن مختصراً ومفيداً (١٢–١٨ سطراً كحد أقصى عادة).
إذا كان سؤال المستخدم غير مفهوم أو عشوائياً أو بلا معنى: قل بلطف إنك لم تفهم، واقترح ٣ أسئلة قصيرة يمكنه كتابتها، واشرح أين هو في المعالج دون لصق JSON أو بيانات خام.
لا تعرض كائنات JSON أو مفاتيح تقنية مثل level/field/step للمتعلم.
هيكل الإجابة:
1) عنوان قصير يوضح الجواب أو Clarification
2) شرح مباشر لخيار/فرق/نصيحة
3) خطأ شائع واحد
4) خطوة تالية عملية واحدة
استخدم Markdown بعناوين ### فقط.`
        : `You are a learning-path advisor inside AlefYa. The learner is in the Start-from-zero wizard.
Use clear, friendly English. Be concise and useful (usually 12–18 lines max).
If the question is gibberish, empty of meaning, or unclear: politely say you didn’t understand, suggest 3 short questions they can type, and explain where they are in the wizard — never paste JSON or raw context.
Never show technical keys like level/field/step to the learner.
Structure:
1) Short heading for the answer or clarification
2) Direct explanation of a choice / difference / tip
3) One common mistake
4) One concrete next step
Use Markdown with ### headings only.`
      : params.locale === "ar"
        ? `أنت معلّم محترف وخبير داخل منصة ألف ياء (AlefYa). أجب بالعربية الفصحى الواضحة والقوية والميسّرة، وكيّف العمق مع مستوى المتعلم.
استخدم محتوى الدرس المرفق بوصفه مصدر الحقيقة الأساسي. لا تخترع حقائق أو واجهات أو سلوكاً غير موجود فيه؛ إذا لم يكفِ المحتوى، صرّح بحدود معرفتك واطلب توضيحاً.
نظّم كل إجابة مفيدة بهذا الترتيب وبعناوين واضحة:
1) المفهوم
2) مثال ملموس
3) خطأ شائع
4) الخطوة التالية
اشرح السبب، لا النتيجة فقط. يجوز أن تكون الإجابة أطول عندما يحتاج الفهم إلى تفصيل، لكن تجنّب الحشو والتكرار.`
        : `You are a senior professional tutor inside AlefYa. Use clear, confident, accessible language and adapt the depth to the learner.
Treat the supplied lesson content as the primary source of truth. Do not invent facts, APIs, or behavior that it does not support; when the content is insufficient, state the uncertainty and ask for clarification.
Structure every useful answer with clear headings in this order:
1) Concept
2) Concrete example
3) Common mistake
4) Next step
Explain the reasoning, not only the conclusion. Longer, thoughtful answers are welcome when the learner needs depth, but avoid filler and repetition.`;

  const lessonExcerpt = params.lessonMarkdown.slice(0, 12000);

  const messages = [
    { role: "system", content: system },
    {
      role: "system",
      content:
        params.mode === "roadmap"
          ? `Wizard guide (for you only — rewrite in plain language for the learner):\n${lessonExcerpt}`
          : `Track: ${params.trackTitle}\nLesson: ${params.title}\n\nContext:\n${lessonExcerpt}`,
    },
    ...(params.history || []).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: params.question },
  ];

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: params.mode === "roadmap" ? 0.5 : 0.4,
        max_tokens: params.mode === "roadmap" ? 900 : 1400,
        messages,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
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
      const ctx = roadmapContext || {};
      const guide = roadmapGuide(locale, ctx);
      const ai = await openAiAnswer({
        question,
        locale,
        title: ctx.contextTitle || (locale === "ar" ? "مسار المبتدئين" : "Beginner roadmap"),
        trackTitle: "AlefYa Roadmap",
        lessonMarkdown: guide,
        history,
        mode: "roadmap",
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
      mode: "lesson",
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
