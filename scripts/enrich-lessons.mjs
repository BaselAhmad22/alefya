/**
 * Appends rigorous “hard mode” study blocks to every lesson (AR + EN).
 * Idempotent: skips lessons that already contain the marker.
 * Run: node scripts/enrich-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "content", "tracks");
const MARKER = "<!-- ALEFYA_HARD_MODE -->";

function hardBlockAr(title, summary) {
  return `

${MARKER}

## نموذج ذهني صارم (احفظه)

قبل أن تنتقل، اكتب نموذجاً ذهنياً من 6–8 أسطر يجيب:

1. ما المشكلة التي يحلها «${title}» بالضبط؟
2. ما المدخلات / المخرجات؟
3. ما الحالات الحدّية الثلاث الأخطر؟
4. ما الذي ينكسر إذا أخطأت الترتيب أو تجاهلت قيداً؟
5. كيف تختبر أن فهمك صحيح دون النظر للمثال؟

> الملخص الحالي للدرس: ${summary}

## نظرية أعمق مما يُدرَّس عادة

- لا تكتفَ بتعريف سطحي. اربط المفهوم بما قبله في المسار: أي درس يمهّد له؟ وأي درس سيبني عليه؟
- فرّق بين **السلوك الظاهر** و**الآلية الداخلية**. كثير من الأخطاء تأتي من حفظ السلوك دون فهم الآلية.
- اكتب تعريفين: واحد «لشرح لزميل مبتدئ» وواحد «لشرح لمراجع كود صارم». إذا عجزت عن الثاني فأنت لم تُتقن بعد.
- ابحث داخل هذا الدرس عن أي مصطلح مبهم، واشرحه بأمثلة مضادة (مثال يعمل + مثال يفشل).

## حالات حدّية ومتقدمة (صعبة)

1. سيناريو قيمة فارغة / null / غياب بيانات — ماذا يجب أن يحدث ولماذا؟
2. سيناريو تكرار / سباق زمني / ترتيب غير متوقع — كيف تكتشفه؟
3. سيناريو حجم أكبر 100× — أي افتراض ينهار أولاً؟
4. سيناريو إدخال خبيث أو غير متوقع — أين تضع الدفاع؟
5. سيناريو فشل جزئي (نجح جزء وفشل جزء) — كيف تضمن اتساقاً؟

لكل سيناريو: اكتب النتيجة المتوقعة، ثم نفّذ أو حاكي ذهنياً، ثم قارن.

## تحديات إلزامية (لا تتخطَّ)

1. **تحدي الشرح**: اشرح «${title}» في دقيقة واحدة بدون كود، ثم في دقيقتين مع كود مصغّر من رأسك.
2. **تحدي الكسر**: عدّل المثال حتى ينكسر عمداً، ثم أصلحه بأقل تغيير صحيح.
3. **تحدي البديل الخاطئ**: اكتب حلاً يبدو صحيحاً لكنه خاطئ، واكتب جملة واحدة تكشف الخداع.
4. **تحدي الإنتاج**: اذكر فحصاً واحداً أو لوجاً أو اختباراً يمنع رجوع هذا الخطأ في الإنتاج.
5. **تحدي الربط**: اربط هذا الدرس بدرس سابق ودرس لاحق بجملة سببية لكل منهما.

## امتحان ذاتي قصير (أجب قبل الانتقال)

1. ما الفرق الجوهري بين الاستخدام الصحيح والخاطئ لهذا المفهوم؟
2. ما علامة تحذيرية في الكود/التصميم تدل أنك أخطأت؟
3. إذا ظهر سلوك غريب غداً، ما أول فرضية تفحصها؟
4. اكتب شبه كود لحل مشكلة صغيرة تستخدم فيها الفكرة إجبارياً.
5. ما السؤال الذي ما زال غامضاً لديك؟ (اكتبه — ثم اسأل AI Helper عنه)

## معيار الاجتياز (قاسٍ)

- [ ] أستطيع شرح الفكرة دون فتح الدرس
- [ ] حلّيت التحديات الخمسة كتابةً
- [ ] أجبت عن أسئلة الامتحان الذاتي
- [ ] لدي مثال فاشل + مثال ناجح
- [ ] أعرف كيف أتحقق في بيئة حقيقية (تشغيل / اختبار / ملاحظة)

إذا نقص بند واحد: **لا تنتقل**. أعد قراءة قسم المفاهيم والأخطاء الشائعة أولاً.
`;
}

function hardBlockEn(title, summary) {
  return `

${MARKER}

## Strict mental model (write it down)

Before moving on, write a 6–8 line mental model that answers:

1. What exact problem does “${title}” solve?
2. What are the inputs / outputs?
3. What are the three most dangerous edge cases?
4. What breaks if you get the order wrong or ignore a constraint?
5. How do you prove your understanding without looking at the example?

> Lesson summary: ${summary}

## Deeper theory than typical tutorials

- Don't stop at a shallow definition. Connect this idea to earlier lessons: what prepared you for it, and what will build on it?
- Separate **observed behavior** from **internal mechanism**. Most bugs come from memorizing behavior without the mechanism.
- Write two definitions: one for a beginner peer, one for a strict code reviewer. If the second is weak, you are not ready.
- For every fuzzy term in this lesson, produce a working example and a failing counter-example.

## Hard edge cases (advanced)

1. Empty / null / missing data — what must happen and why?
2. Duplication / race / unexpected ordering — how do you detect it?
3. 100× larger scale — which assumption dies first?
4. Malicious or unexpected input — where is the defense?
5. Partial failure — how do you keep consistency?

For each: write the expected result, simulate it, then compare.

## Mandatory challenges (do not skip)

1. **Explain**: teach “${title}” in one minute with no code, then two minutes with tiny code from memory.
2. **Break**: change the example until it fails on purpose, then fix it with the smallest correct change.
3. **False friend**: write a solution that looks right but is wrong, and one sentence that exposes the trap.
4. **Production**: name one check, log, or test that would stop this bug from returning.
5. **Link**: connect this lesson to one previous and one next lesson with a causal sentence each.

## Short self-exam (answer before continuing)

1. What is the core difference between correct and incorrect use of this idea?
2. What warning sign in code/design means you got it wrong?
3. If weird behavior shows up tomorrow, what is your first hypothesis?
4. Write pseudocode for a tiny problem that forces you to use this idea.
5. What is still unclear? (Write it — then ask the AI Helper.)

## Pass bar (strict)

- [ ] I can explain the idea without reopening the lesson
- [ ] I completed all five challenges in writing
- [ ] I answered the self-exam
- [ ] I have one failing + one passing example
- [ ] I know how to verify in a real environment (run / test / observe)

If any box is unchecked: **do not continue**. Re-read concepts and common mistakes first.
`;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".json") && p.includes(`${path.sep}lessons${path.sep}`)) {
      out.push(p);
    }
  }
  return out;
}

const files = walk(ROOT);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const lesson = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!lesson?.content?.ar || !lesson?.content?.en) {
    skipped++;
    continue;
  }
  if (String(lesson.content.ar).includes(MARKER)) {
    skipped++;
    continue;
  }

  const titleAr = lesson.title?.ar || lesson.slug;
  const titleEn = lesson.title?.en || lesson.slug;
  const summaryAr = lesson.summary?.ar || "";
  const summaryEn = lesson.summary?.en || "";

  lesson.content.ar = `${lesson.content.ar.trim()}${hardBlockAr(titleAr, summaryAr)}`;
  lesson.content.en = `${lesson.content.en.trim()}${hardBlockEn(titleEn, summaryEn)}`;
  // Longer study time for enriched lessons
  if (typeof lesson.duration === "number") {
    lesson.duration = Math.min(90, lesson.duration + 20);
  }

  fs.writeFileSync(file, JSON.stringify(lesson, null, 2) + "\n", "utf8");
  updated++;
}

console.log(`Enriched ${updated} lessons (skipped ${skipped}). Total scanned: ${files.length}`);
