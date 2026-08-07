/**
 * Builds HR pack objects for the interview generator.
 */
export const l = (en, ar) => ({ en, ar });

export function pack(id, trackSlug, competency, kind, stage, difficulty, prompts, best, traps, fields) {
  return { id, trackSlug, competency, kind, interviewStage: stage, difficulty, prompts, best, traps, ...fields };
}

export const STAR_DEFAULTS = {
  whyAsked: l(
    "Structured interviews use past behavior to predict future performance — this is standard HR and hiring-manager practice.",
    "المقابلات المنظمة تستخدم السلوك السابق للتنبؤ بالأداء — ممارسة HR ومدير التوظيف القياسية.",
  ),
  passTip: l(
    "End with a measurable result, then ask what the next interview stage focuses on.",
    "اختم بنتيجة قابلة للقياس، ثم اسأل عن تركيز المرحلة التالية.",
  ),
};

export function traps3(a, b, c) {
  return [l(a.en, a.ar), l(b.en, b.ar), l(c.en, c.ar)];
}

/** Expand one pack to N questions by cycling prompts and shuffling options. */
export function expandPack(p, variantCount = 4) {
  const out = [];
  for (let v = 0; v < variantCount; v++) {
    const prompt = p.prompts[v % p.prompts.length];
    const seed = v;
    const optionsEn = [p.best.en, p.traps[0].en, p.traps[1].en, p.traps[2].en];
    const optionsAr = [p.best.ar, p.traps[0].ar, p.traps[1].ar, p.traps[2].ar];
    const order = shuffleOrder(4, `${p.id}:${v}`);
    const correctIndex = order.indexOf(0);
    out.push({
      id: `${p.trackSlug}:${p.id}:v${v + 1}`,
      trackSlug: p.trackSlug,
      kind: p.kind,
      difficulty: p.difficulty,
      competency: p.competency,
      interviewStage: p.interviewStage,
      prompt,
      options: {
        en: order.map((i) => optionsEn[i]),
        ar: order.map((i) => optionsAr[i]),
      },
      correctIndex,
      whyAsked: p.whyAsked,
      recruiterIntent: p.recruiterIntent,
      modelAnswer: p.modelAnswer,
      redFlags: {
        en: p.redFlags.map((x) => x.en),
        ar: p.redFlags.map((x) => x.ar),
      },
      passTip: p.passTip,
      explanation: p.explanation,
      improvement: p.improvement,
    });
  }
  return out;
}

function shuffleOrder(n, seedStr) {
  const arr = Array.from({ length: n }, (_, i) => i);
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  for (let i = n - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function expandTrack(packs, targetCount) {
  const perPack = Math.max(1, Math.ceil(targetCount / packs.length));
  const questions = [];
  for (const p of packs) {
    questions.push(...expandPack(p, perPack));
  }
  return questions.slice(0, targetCount);
}
