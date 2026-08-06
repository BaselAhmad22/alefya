type InterviewKind = "mcq" | "scenario";
type InterviewDifficulty = "junior" | "mid" | "senior";

type Localized = { en: string; ar: string };
type TopicPack = {
  topic: string;
  best: Localized;
  trap: Localized;
  why: Localized;
  scenario: Localized;
};

export type VariantDef = {
  kind: InterviewKind;
  difficulty: InterviewDifficulty;
  answerMode: "best" | "trap";
  prompt: (pack: TopicPack) => Localized;
};

const l = (en: string, ar: string): Localized => ({ en, ar });

export const JUNIOR_VARIANTS: VariantDef[] = [
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which answer states the safest working principle for ${pack.topic}?`,
        `أي إجابة تذكر مبدأ العمل الأكثر أماناً لموضوع ${pack.topic}؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Which diagnosis is most likely?`,
        `${pack.scenario.ar}. أي تشخيص هو الأرجح؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which statement best describes how ${pack.topic} should work in practice?`,
        `أي عبارة تصف أفضل شكل لعمل ${pack.topic} عملياً؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `A junior teammate asks about ${pack.topic}. What should you explain first?`,
        `زميل مبتدئ يسأل عن ${pack.topic}. ماذا تشرح له أولاً؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which habit around ${pack.topic} prevents the most common beginner bugs?`,
        `أي عادة حول ${pack.topic} تمنع أكثر أخطاء المبتدئين شيوعاً؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. What is the first thing you check?`,
        `${pack.scenario.ar}. ما أول شيء تتحقق منه؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which option follows recommended guidance for ${pack.topic}?`,
        `أي خيار يتبع الإرشادات الموصى بها لـ ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `Which misconception about ${pack.topic} should a junior developer avoid?`,
        `أي فهم خاطئ حول ${pack.topic} يجب أن يتجنبه المطور المبتدئ؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "junior",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Which rookie mistake best explains this?`,
        `${pack.scenario.ar}. أي خطأ مبتدئ يفسر هذا بأفضل شكل؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `What is the core idea you must remember about ${pack.topic}?`,
        `ما الفكرة الجوهرية التي يجب تذكرها عن ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which beginner-friendly practice keeps ${pack.topic} predictable?`,
        `أي ممارسة مناسبة للمبتدئين تجعل ${pack.topic} متوقعاً؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Which fix addresses the root cause?`,
        `${pack.scenario.ar}. أي إصلاح يعالج السبب الجذري؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `When learning ${pack.topic}, which step builds the strongest foundation?`,
        `عند تعلم ${pack.topic}، أي خطوة تبني أقوى أساس؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `Which shortcut around ${pack.topic} looks easy but causes pain later?`,
        `أي اختصار حول ${pack.topic} يبدو سهلاً لكن يسبب مشاكل لاحقاً؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. What should the junior engineer do next?`,
        `${pack.scenario.ar}. ماذا يفعل المهندس المبتدئ بعد ذلك؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "junior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `What is the safest default when you are unsure about ${pack.topic}?`,
        `ما الافتراض الأكثر أماناً عندما لا تكون متأكداً من ${pack.topic}؟`,
      ),
  },
];

export const MID_VARIANTS: VariantDef[] = [
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `During code review, which recommendation best addresses ${pack.topic}?`,
        `أثناء مراجعة الكود، أي توصية تعالج ${pack.topic} بأفضل شكل؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `What is the most common real-world mistake around ${pack.topic}?`,
        `ما الخطأ الواقعي الأكثر شيوعاً حول ${pack.topic}؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. What is the best next action?`,
        `${pack.scenario.ar}. ما أفضل إجراء تالٍ؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `While refactoring, which change most improves ${pack.topic}?`,
        `أثناء إعادة الهيكلة، أي تغيير يحسّن ${pack.topic} أكثر؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which production trade-off around ${pack.topic} is usually acceptable?`,
        `أي موازنة إنتاجية حول ${pack.topic} عادةً مقبولة؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. What should the team prioritize this sprint?`,
        `${pack.scenario.ar}. ماذا يجب أن يُعطى الأولوية خلال هذه الدورة؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `Which anti-pattern shows up most often when teams ignore ${pack.topic}?`,
        `أي نمط سيء يظهر غالباً عندما يتجاهل الفريق ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `What would you flag in a pull request that touches ${pack.topic}?`,
        `ماذا تُشير إليه في pull request يلمس ${pack.topic}؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "mid",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Which mid-level oversight most likely caused this?`,
        `${pack.scenario.ar}. أي إغفال بمستوى mid غالباً سبب هذا؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which approach scales better as usage of ${pack.topic} grows?`,
        `أي نهج يتوسع أفضل مع نمو استخدام ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which design keeps ${pack.topic} easier to test and maintain?`,
        `أي تصميم يجعل ${pack.topic} أسهل للاختبار والصيانة؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. An intermittent bug appears — what is your best hypothesis?`,
        `${pack.scenario.ar}. يظهر خطأ متقطع — ما أفضل فرضية لديك؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `What is the maintenance cost of getting ${pack.topic} wrong?`,
        `ما كلفة الصيانة عند إساءة التعامل مع ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which balance between speed and safety fits ${pack.topic} in a growing product?`,
        `أي توازن بين السرعة والأمان يناسب ${pack.topic} في منتج نامٍ؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. A colleague proposes a quick patch — how do you respond?`,
        `${pack.scenario.ar}. زميل يقترح ترقيعاً سريعاً — كيف ترد؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "mid",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which documentation or contract would you require before changing ${pack.topic}?`,
        `أي توثيق أو عقد تطلبه قبل تغيير ${pack.topic}؟`,
      ),
  },
];

export const SENIOR_VARIANTS: VariantDef[] = [
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which decision gives the most defensible production trade-off for ${pack.topic}?`,
        `أي قرار يقدم أفضل موازنة قابلة للدفاع عنها في الإنتاج لموضوع ${pack.topic}؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Under production pressure, which response fixes the underlying risk rather than masking it?`,
        `${pack.scenario.ar}. تحت ضغط الإنتاج، أي استجابة تصلح الخطر الجذري بدلاً من إخفائه؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `An interviewer asks you to reason about ${pack.topic} using this case: ${pack.scenario.en}. Which answer shows senior judgment?`,
        `يسألك المقابل أن تفكّر في ${pack.topic} عبر هذه الحالة: ${pack.scenario.ar}. أي إجابة تُظهر حكماً بمستوى senior؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which architecture choice around ${pack.topic} survives team turnover and changing requirements?`,
        `أي قرار معماري حول ${pack.topic} يصمد أمام تغيّر الفريق والمتطلبات؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. You are incident commander — what is your first systemic move?`,
        `${pack.scenario.ar}. أنت قائد الحادث — ما أول تحرك منهجي تتخذه؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "trap",
    prompt: (pack) =>
      l(
        `Which long-term risk does the tempting shortcut around ${pack.topic} create?`,
        `أي خطر طويل الأمد ينشئه الاختصار المغرٍ حول ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `How would you defend your ${pack.topic} decision to leadership under budget pressure?`,
        `كيف تدافع عن قرارك بخصوص ${pack.topic} أمام الإدارة تحت ضغط الميزانية؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Scope is cut by forty percent — what must NOT be sacrificed for ${pack.topic}?`,
        `${pack.scenario.ar}. قُطع النطاق أربعين بالمئة — ما الذي لا يجب التضحية به لـ ${pack.topic}؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which observability around ${pack.topic} catches failures before users do?`,
        `أي قابلية مراقبة حول ${pack.topic} تكشف الأعطال قبل المستخدمين؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `What is the blast radius if ${pack.topic} is designed incorrectly at platform scale?`,
        `ما نطاق الضرر إذا صُمم ${pack.topic} خطأ على نطاق المنصة؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. Conflicting product and security requirements — what is the senior call?`,
        `${pack.scenario.ar}. متطلبات منتج وأمن متعارضة — ما قرار senior؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which migration strategy for ${pack.topic} minimizes downtime and rollback risk?`,
        `أي استراتيجية ترحيل لـ ${pack.topic} تقلل التوقف ومخاطر الرجوع؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `How would you standardize ${pack.topic} practices across multiple squads?`,
        `كيف توحّد ممارسات ${pack.topic} عبر فرق متعددة؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. In the postmortem, which root-cause category applies?`,
        `${pack.scenario.ar}. في ما بعد الحادث، أي فئة سبب جذري تنطبق؟`,
      ),
  },
  {
    kind: "mcq",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `Which compliance or security angle is most relevant when evolving ${pack.topic}?`,
        `أي زاوية امتثال أو أمن هي الأكثر صلة عند تطوير ${pack.topic}؟`,
      ),
  },
  {
    kind: "scenario",
    difficulty: "senior",
    answerMode: "best",
    prompt: (pack) =>
      l(
        `${pack.scenario.en}. You must teach the trade-offs of ${pack.topic} to staff engineers — what do you emphasize?`,
        `${pack.scenario.ar}. يجب أن تشرح موازنات ${pack.topic} لمهندسين senior — ماذا تؤكد؟`,
      ),
  },
];

export const ALL_VARIANTS: VariantDef[] = [
  ...JUNIOR_VARIANTS,
  ...MID_VARIANTS,
  ...SENIOR_VARIANTS,
];

export const MIN_QUESTIONS_PER_DIFFICULTY = 128;
