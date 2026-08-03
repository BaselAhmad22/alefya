import { deepLesson, qa, concept, pitfalls } from "./builder.mjs";

/**
 * Expands a compact topic into a full deepLesson with rich bilingual sections.
 * Keeps content self-contained for AlefYa tracks.
 */
export function makeDeep(topic) {
  const {
    slug,
    order,
    duration = 45,
    title,
    summary,
    focus,
    stack = "javascript",
    ideas,
    codeSource,
    codeExplain,
    faqs,
    nextHint,
  } = topic;

  const lang =
    stack === "tsx" || stack === "typescript"
      ? "tsx"
      : stack === "jsx"
        ? "jsx"
        : stack === "bash" ||
            stack === "dart" ||
            stack === "python" ||
            stack === "sql" ||
            stack === "yaml" ||
            stack === "dockerfile" ||
            stack === "json" ||
            stack === "csharp" ||
            stack === "cs"
          ? stack === "cs"
            ? "csharp"
            : stack
          : "javascript";

  const concepts = ideas.map((idea) =>
    concept(idea.title.ar, idea.body.ar, idea.title.en, idea.body.en),
  );

  const discussion = (faqs || defaultFaqs(title)).map((f) =>
    qa(f.q.ar, f.a.ar, f.q.en, f.a.en),
  );

  return deepLesson({
    slug,
    order,
    duration,
    title,
    summary,
    why: {
      ar: `${focus.ar}\n\nهذا الدرس جزء من خطة مرتّبة على ألف ياء: تقرأه بالترتيب، تطبّق التمارين هنا، وإذا تعثّرت تستخدم AI Helper دون مغادرة الموقع.\n\nمعيار ألف ياء قاسٍ: لا تنتقل قبل أن تكتب نموذجاً ذهنياً، ومثالاً فاشلاً، ومثالاً ناجحاً، وتجيب عن أسئلة الامتحان الذاتي في نهاية الدرس. الهدف فهم تشغيلي يصلح للإنتاج لا حفظ سطحي.`,
      en: `${focus.en}\n\nThis lesson sits in an ordered AlefYa path: read in sequence, do the exercises here, and use the AI Helper if you stall—without leaving the site.\n\nAlefYa's bar is strict: do not continue until you can write a mental model, one failing example, one passing example, and answer the self-exam at the end. Aim for production-grade understanding, not shallow memorization.`,
    },
    goals: {
      ar: [
        `تثبيت مفهوم: ${title.ar} بعمق يكفي لشرحه لمراجع كود`,
        "تمييز الحالات الصحيحة عن الأخطاء الشائعة والحدود الخطرة",
        "كتابة/قراءة مثال عملي + مثال مضاد يفشل عمداً",
        "القدرة على ربط الفكرة بالدرس السابق واللاحق",
        "اجتياز تحديات الدرس وامتحانه الذاتي قبل المتابعة",
      ],
      en: [
        `Lock in: ${title.en} deeply enough to defend it in code review`,
        "Separate correct cases from common mistakes and dangerous edges",
        "Write/read a practical example plus a deliberate failing counter-example",
        "Connect the idea to the previous and next lesson",
        "Pass the lesson challenges and self-exam before continuing",
      ],
    },
    concepts,
    steps: {
      ar: [
        `اقرأ ملخص الهدف: ${summary.ar}`,
        "مرّ على المفاهيم بالتفصيل دون تخطّي الأمثلة الذهنية",
        "انسخ المثال العملي وافهم كل سطر قبل التعديل",
        "أنشئ سيناريو فشل متعمد ثم أصلحه بأقل تغيير",
        "أجب عن أسئلة النقاش كتابةً (لا في رأسك فقط)",
        "حلّ التحديات الإلزامية في قسم الوضع الصعب",
        "أنهِ قائمة التحقق ومعيار الاجتياز قبل الانتقال",
      ],
      en: [
        `Read the goal summary: ${summary.en}`,
        "Walk the concepts without skipping mental examples",
        "Study the practical example line by line before changing it",
        "Create a deliberate failure scenario, then fix it with the smallest change",
        "Answer discussion questions in writing (not only in your head)",
        "Complete the mandatory challenges in the hard-mode section",
        "Finish the checklist and pass bar before moving on",
      ],
    },
    code: {
      ar: {
        lang,
        source: codeSource,
        explain:
          codeExplain?.ar ||
          "هذا المثال مصمّم ليُقرأ داخل الدرس: ركّز على التدفق لا على الحفظ. عدّل الأسماء والقيم وجرّب سيناريو فشل واحد على الأقل.",
      },
      en: {
        lang,
        source: codeSource,
        explain:
          codeExplain?.en ||
          "This example is meant to be read in-lesson: focus on flow, not memorization. Rename values and try at least one failing scenario.",
      },
    },
    pitfalls: pitfalls([
      {
        ar: [
          "القفز لدرس لاحق قبل إغلاق الفجوات",
          "أكمِل قائمة التحقق؛ المسارات مبنية فوق بعضها",
        ],
        en: [
          "Skipping ahead before closing gaps",
          "Finish the checklist; later lessons build on this one",
        ],
      },
      {
        ar: [
          "نسخ الكود دون تفسير",
          "اشرح كل سطر بصوت عالٍ ثم احذف سطراً وشاهد ماذا ينكسر",
        ],
        en: [
          "Copying code without explaining it",
          "Narrate each line, then delete one and watch what breaks",
        ],
      },
      {
        ar: [
          "خلط مفاهيم متشابهة بأسماء قريبة",
          "اكتب جدول مقارنة من عمودين قبل المتابعة",
        ],
        en: [
          "Mixing similar concepts with close names",
          "Write a two-column comparison before moving on",
        ],
      },
      {
        ar: [
          "تجاهل رسائل الخطأ",
          "اقرأ الخطأ من آخر سطر للأعلى واربطه بمفهوم الدرس",
        ],
        en: [
          "Ignoring error messages",
          "Read errors bottom-up and map them to this lesson's concept",
        ],
      },
    ]),
    discussion,
    exercises: {
      ar: [
        `اكتب بخمس جمل ماذا يحلّ «${title.ar}» داخل تطبيق حقيقي، ثم بجملتين ماذا يحدث إذا أسأته.`,
        "عدّل المثال ليشمل حالة حدّية (قيمة فارغة / خطأ شبكة / عنصر مفقود) واكتب النتيجة المتوقعة قبل التنفيذ.",
        "ارسم على ورقة تدفق البيانات/المكوّنات قبل وبعد التغيير، مع تسمية كل سهم.",
        "اكتب حلاً خاطئاً يبدو مقنعاً، ثم اكتب جملة واحدة تفضحه.",
        "اطرح على AI Helper سؤالاً صعباً عن الجزء الأصعب واحفظ الإجابة في ملاحظاتك مع مثالك الخاص.",
      ],
      en: [
        `In five sentences, explain what “${title.en}” unlocks in a real app, then in two sentences what fails if you misuse it.`,
        "Extend the example with an edge case (empty value / network error / missing item) and write the expected result before running.",
        "Sketch data/component flow before and after your change, labeling every arrow.",
        "Write a convincing but wrong solution, then one sentence that exposes it.",
        "Ask the AI Helper a hard question about the toughest part and save the answer with your own example.",
      ],
    },
    checklist: {
      ar: [
        "أفهم لماذا يوجد هذا المفهوم أصلاً",
        "أفرّق بينه وبين أقرب مفهوم مشابه",
        "قرأت المثال وفسّرت التدفق",
        "لدي مثال فاشل + مثال ناجح",
        "نفّذت تحديات الدرس الأساسية",
        "أعرف ماذا سيبني عليه الدرس التالي",
      ],
      en: [
        "I know why this concept exists",
        "I can separate it from the nearest lookalike",
        "I read the example and can explain the flow",
        "I have one failing + one passing example",
        "I completed the core lesson challenges",
        "I know what the next lesson builds on top of this",
      ],
    },
    nextHint: nextHint || {
      ar: "انتقل للدرس التالي في نفس المرحلة بالترتيب فقط.",
      en: "Move to the next lesson in this stage—in order only.",
    },
  });
}

function defaultFaqs(title) {
  return [
    {
      q: {
        ar: `هل لازم أحفظ كل تفاصيل «${title.ar}»؟`,
        en: `Do I need to memorize every detail of “${title.en}”?`,
      },
      a: {
        ar: "لا. احفظ النموذج الذهني والمسار الصحيح للتفكير، وارجع للمثال عند الحاجة. ألف ياء مصمّم ليكون مرجعك أثناء التعلّم.",
        en: "No. Keep the mental model and the correct thinking path; revisit the example when needed. AlefYa is meant to be your reference while learning.",
      },
    },
    {
      q: {
        ar: "إذا نسيت شيئاً من درس سابق؟",
        en: "What if I forgot something from an earlier lesson?",
      },
      a: {
        ar: "ارجع لدرس المرحلة السابقة عبر الشريط الجانبي، ولا تبنِ فوق فراغ. خمس دقائق مراجعة أوفر من ساعة Debugging لاحقاً.",
        en: "Jump back via the stage sidebar. Don't build on a hole—five minutes of review beats an hour of debugging later.",
      },
    },
    {
      q: {
        ar: "هل أحتاج مكتبات إضافية الآن؟",
        en: "Do I need extra libraries right now?",
      },
      a: {
        ar: "ليس في هذا الدرس. أتقن الأساس هنا أولاً؛ المسار سيقدّم الأدوات في وقتها.",
        en: "Not in this lesson. Master the base here first; the path introduces tools when you're ready.",
      },
    },
    {
      q: {
        ar: "كيف أعرف أنني جاهز للمتابعة؟",
        en: "How do I know I'm ready to continue?",
      },
      a: {
        ar: "إذا أنهيت قائمة التحقق ونجحت بشرح الفكرة وتمارين الحدّ الأدنى بدون نسخ أعمى، فأنت جاهز.",
        en: "If you finished the checklist and can explain the idea plus the minimum exercises without blind copying, you're ready.",
      },
    },
  ];
}

export function stage(slug, order, title, description, lessonDefs) {
  return {
    meta: {
      slug,
      order,
      title,
      description,
      lessons: lessonDefs.map((l) => `${l.slug}.json`),
    },
    lessons: lessonDefs.map((l, i) =>
      makeDeep({ ...l, order: l.order ?? i + 1 }),
    ),
  };
}
