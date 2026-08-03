/**
 * Appends remaining lessons to aspnet.mjs and closes aspnetStages.
 * Run from repo: node scripts/content/build-aspnet-full.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { qa, concept } from "./builder.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, "aspnet.mjs");

function esc(s) {
  return JSON.stringify(s);
}

function serConcept(c) {
  return `concept(\n            ${esc(c.title.ar)},\n            ${esc(c.body.ar)},\n            ${esc(c.title.en)},\n            ${esc(c.body.en)},\n          )`;
}

function serQa(d) {
  return `qa(\n            ${esc(d.q.ar)},\n            ${esc(d.a.ar)},\n            ${esc(d.q.en)},\n            ${esc(d.a.en)},\n          )`;
}

function serPitfalls(items) {
  const rows = items
    .map(
      (i) =>
        `          {\n            ar: [${esc(i.ar[0])}, ${esc(i.ar[1])}],\n            en: [${esc(i.en[0])}, ${esc(i.en[1])}],\n          }`,
    )
    .join(",\n");
  return `pitfalls([\n${rows},\n        ])`;
}

function serCodeBlock(block) {
  return `{\n            lang: ${esc(block.lang)},\n            source: ${esc(block.source)},\n            explain: ${esc(block.explain)},\n          }`;
}

function serDeepLesson(s) {
  const concepts = s.concepts.map(serConcept).join(",\n          ");
  const discussion = s.discussion.map(serQa).join(",\n          ");
  return `      deepLesson({
        slug: ${esc(s.slug)},
        order: ${s.order},
        duration: ${s.duration},
        title: { ar: ${esc(s.title.ar)}, en: ${esc(s.title.en)} },
        summary: { ar: ${esc(s.summary.ar)}, en: ${esc(s.summary.en)} },
        why: { ar: ${esc(s.why.ar)}, en: ${esc(s.why.en)} },
        goals: {
          ar: [${s.goals.ar.map(esc).join(", ")}],
          en: [${s.goals.en.map(esc).join(", ")}],
        },
        concepts: [
          ${concepts},
        ],
        steps: {
          ar: [${s.steps.ar.map(esc).join(", ")}],
          en: [${s.steps.en.map(esc).join(", ")}],
        },
        code: {
          ar: ${serCodeBlock(s.code.ar)},
          en: ${serCodeBlock(s.code.en)},
        },
        pitfalls: ${serPitfalls(s.pitfalls)},
        discussion: [
          ${discussion},
        ],
        exercises: {
          ar: [${s.exercises.ar.map(esc).join(", ")}],
          en: [${s.exercises.en.map(esc).join(", ")}],
        },
        checklist: {
          ar: [${s.checklist.ar.map(esc).join(", ")}],
          en: [${s.checklist.en.map(esc).join(", ")}],
        },
        nextHint: { ar: ${esc(s.nextHint.ar)}, en: ${esc(s.nextHint.en)} },
      })`;
}

function mk(p) {
  return p;
}

const P = (ar, en) => ({ ar, en });

const allRemaining = [
  mk({
    slug: "03-types-null",
    order: 3,
    duration: 42,
    title: P("الأنواع والقيم المرجعية وNullable", "Types, references & Nullable"),
    summary: P("Value vs Reference، boxing، و`T?` لتجنب null في APIs", "Value vs reference, boxing, and `T?` to avoid null bugs in APIs."),
    why: P(
      "أغلب أخطاء الإنتاج في C# مرتبطة بـ null: NullReferenceException عند قراءة خاصية على كائن غير موجود، أو إرجاع null من repository دون أن يتوقعه الـ controller. فهم الفرق بين **value types** و**reference types** يشرح لماذا `int` لا يمكن أن يكون null بينما `string` يمكن — ولماذا أضاف C# **Nullable reference types** (NRT) تحذيرات compile-time.\n\nفي ASP.NET Core، Model Binding يملأ DTOs من JSON — الحقول الناقصة قد تصبح null. EF Core يرجع null من `FirstOrDefault`. إتقان `T?`, null-coalescing (`??`), وnull-conditional (`?.`) يجعل handlers آمنة قبل أن تصل لمرحلة validation الرسمية.",
      "Most production C# bugs involve null: NullReferenceException when reading a property on a missing object, or returning null from a repository when the controller expects data. Understanding **value types** vs **reference types** explains why `int` cannot be null while `string` can — and why C# added **Nullable reference types** (NRT) for compile-time warnings.\n\nIn ASP.NET Core, model binding fills DTOs from JSON — missing fields may become null. EF Core returns null from `FirstOrDefault`. Mastering `T?`, null-coalescing (`??`), and null-conditional (`?.`) keeps handlers safe before formal validation.",
    ),
    goals: P(
      ["تمييز value types عن reference types", "استخدام Nullable<T> و`int?`", "تطبيق ?? و?. و??=", "تفعيل NRT warnings في المشروع"],
      ["Distinguish value from reference types", "Use Nullable<T> and `int?`", "Apply ??, ?., and ??=", "Enable NRT warnings in the project"],
    ),
    concepts: [
      concept("Value vs Reference", "**Value types** (`struct`, `int`, `bool`, `DateTime`) تُنسخ عند الإسناد — التعديل على نسخة لا يغيّر الأصل. **Reference types** (`class`, `string`, arrays) يحمل المتغير **مرجعاً** للكائن على الكوم — نسخ المرجع يشير لنفس الكائن. `string` immutable — التعديل ينشئ string جديد. في APIs، DTOs عادة `class` (reference) — مراعاة null ضرورية.", "Value vs Reference", "**Value types** (`struct`, `int`, `bool`, `DateTime`) copy on assignment — changing a copy does not affect the original. **Reference types** (`class`, `string`, arrays) store a **reference** to heap objects — copying the reference points to the same object. `string` is immutable — mutations create new strings. API DTOs are usually `class` (reference) — null awareness is essential."),
      concept("Nullable value types", "`int?` اختصار لـ `Nullable<int>` — value type يمكن أن يحمل null أو int. مفيد للحقول الاختيارية في JSON: `{ \"age\": null }`. `.HasValue` و`.Value` للوصول — أو `.GetValueOrDefault()`. في EF Core، `int?` يترجم إلى عمود nullable في SQL.", "Nullable value types", "`int?` is shorthand for `Nullable<int>` — a value type that can hold null or an int. Useful for optional JSON fields: `{ \"age\": null }`. Use `.HasValue`, `.Value`, or `.GetValueOrDefault()`. In EF Core, `int?` maps to a nullable SQL column."),
      concept("Null-coalescing وconditional", "`??` يرجع اليمين إذا اليسار null: `name ?? \"Guest\"`. `?.` يتوقف عند null: `user?.Email`. `??=` يعيّن فقط إذا null. سلسلة `order?.Customer?.Address?.City` تمنع exceptions في APIs — لكن لا تخفِ missing data عن validation.", "Null-coalescing & conditional", "`??` returns the right side when left is null: `name ?? \"Guest\"`. `?.` short-circuits on null: `user?.Email`. `??=` assigns only when null. Chains like `order?.Customer?.Address?.City` prevent exceptions — but do not hide missing data from validation."),
      concept("Nullable Reference Types", "`<Nullable>enable</Nullable>` في `.csproj` يفعّل NRT: `string` غير nullable افتراضياً، `string?` nullable. المترجم يحذّر عند إسناد null محتمل. في ASP.NET 8+ القوالب تفعّله — استخدم `required` و`[NotNull]` حيث يلزم.", "Nullable Reference Types", "`<Nullable>enable</Nullable>` in `.csproj` enables NRT: `string` is non-nullable by default, `string?` is nullable. The compiler warns on possible null assignments. ASP.NET 8+ templates enable it — use `required` and annotations where needed."),
    ],
    steps: P(
      ["فعّل `<Nullable>enable</Nullable>` في .csproj", "جرّب `int? age = null` و`HasValue`", "اكتب `string? nick = null` ولاحظ التحذيرات", "استخدم `??` و`?.` في دالة تنسّق عنواناً", "أنشئ record مع `string? Bio` و`required string Name`", "اختبر JSON binding: حقل ناقص → null"],
      ["Enable `<Nullable>enable</Nullable>` in .csproj", "Try `int? age = null` and `HasValue`", "Write `string? nick = null` and observe warnings", "Use `??` and `?.` in an address formatter", "Create a record with `string? Bio` and `required string Name`", "Test JSON binding: missing field → null"],
    ),
    code: {
      ar: { lang: "csharp", source: `public record UserDto(string Name, string? Bio, int? Age);\n\npublic static string Display(UserDto? user) =>\n    user is null\n        ? "مستخدم غير معروف"\n        : $"{user.Name} — {user.Bio ?? "بدون نبذة"} — {user.Age?.ToString() ?? "—"}";`, explain: "UserDto يمزج required string مع حقول nullable — Display آمنة بـ null checks و??." },
      en: { lang: "csharp", source: `public record UserDto(string Name, string? Bio, int? Age);\n\npublic static string Display(UserDto? user) =>\n    user is null\n        ? "Unknown user"\n        : $"{user.Name} — {user.Bio ?? "No bio"} — {user.Age?.ToString() ?? "—"}";`, explain: "UserDto mixes required string with nullable fields — Display is safe via null checks and ??." },
    },
    pitfalls: [
      { ar: ["تجاهل NRT warnings", "عالج التحذيرات — null في API يسبب 500"], en: ["Ignoring NRT warnings", "Fix warnings — null in APIs causes 500s"] },
      { ar: ["استخدام .Value على null", "تحقق HasValue أو استخدم GetValueOrDefault"], en: ["Calling .Value on null", "Check HasValue or use GetValueOrDefault"] },
      { ar: ["?? يخفي missing validation", "?? للعرض؛ validation يحدد required fields"], en: ["?? hides missing validation", "?? for display; validation defines required fields"] },
      { ar: ["Boxing int في object", "تجنب boxing غير الضروري في hot paths"], en: ["Boxing int to object", "Avoid unnecessary boxing in hot paths"] },
    ],
    discussion: [qa("هل string value أم reference؟", "reference type لكن immutable — سلوك يشبه value للمبتدئ.", "Is string value or reference?", "Reference type but immutable — behaves value-like for beginners."), qa("متى أستخدم record vs class؟", "record للـ DTOs immutable؛ class عند behavior وmutable state.", "When record vs class?", "record for immutable DTOs; class for behavior and mutable state."), qa("FirstOrDefault يرجع null؟", "نعم للreference types — استخدم FirstOrDefaultAsync مع null check أو throw.", "Does FirstOrDefault return null?", "Yes for reference types — use FirstOrDefaultAsync with null check or throw."), qa("required في C# 11؟", "يُلزم المُنشئ/binding بتوفير القيمة — ممتاز لـ API contracts.", "required in C# 11?", "Forces constructor/binding to supply value — great for API contracts.")],
    exercises: P(["اكتب دالة MaxOrNull(int? a, int? b)", "DTO بثلاثة nullable fields — اختبر JSON", "حوّل warnings NRT إلى zero", "استخدم pattern `is null`"], ["Write MaxOrNull(int? a, int? b)", "DTO with three nullable fields — test JSON", "Clear NRT warnings to zero", "Use `is null` pattern"]),
    checklist: P(["أفرق value/reference", "أستخدم ?? و?.", "NRT مفعّل", "record DTO مع nullable", "لا .Value بدون check"], ["Distinguish value/reference", "Use ?? and ?.", "NRT enabled", "record DTO with nullable", "No .Value without check"]),
    nextHint: P("الدرس التالي: البرمجة كائنية التوجّه — classes، inheritance، وencapsulation.", "Next: OOP — classes, inheritance, and encapsulation."),
  }),
  // ... more lessons follow in LESSONS array below
];

// Import remaining lessons from data module
const { stageLessons } = await import("./aspnet-lessons-data.mjs");
allRemaining.push(...stageLessons);

function serStage(key, meta, lessons) {
  return `  ${esc(key)}: {
    meta: {
      slug: ${esc(meta.slug)},
      order: ${meta.order},
      title: { ar: ${esc(meta.title.ar)}, en: ${esc(meta.title.en)} },
      description: { ar: ${esc(meta.description.ar)}, en: ${esc(meta.description.en)} },
      lessons: [${meta.lessons.map(esc).join(", ")}],
    },
    lessons: [
${lessons.map(serDeepLesson).join(",\n")}
    ],
  }`;
}

const stage02to07 = [
  ["02-aspnet-basics", { slug: "02-aspnet-basics", order: 2, title: P("أساسيات ASP.NET Core", "ASP.NET Core basics"), description: P("Host، Middleware، الإعدادات، والـ DI", "Host, middleware, configuration, and DI"), lessons: ["01-project-structure.json", "02-middleware-pipeline.json", "03-dependency-injection.json", "04-configuration.json"] }, stageLessons.filter((l) => l.stage === "02")],
  ["03-apis-mvc", { slug: "03-apis-mvc", order: 3, title: P("Minimal APIs وMVC", "Minimal APIs & MVC"), description: P("بناء endpoints، التحقق، وتنظيم الـ Controllers", "Building endpoints, validation, and controllers"), lessons: ["01-minimal-apis.json", "02-routing-model-binding.json", "03-validation.json", "04-controllers.json"] }, stageLessons.filter((l) => l.stage === "03")],
  ["04-ef-core", { slug: "04-ef-core", order: 4, title: P("Entity Framework Core", "Entity Framework Core"), description: P("النماذج، DbContext، الهجرات، والاستعلامات", "Models, DbContext, migrations, and queries"), lessons: ["01-dbcontext.json", "02-migrations.json", "03-relationships.json", "04-querying.json"] }, stageLessons.filter((l) => l.stage === "04")],
  ["05-auth", { slug: "05-auth", order: 5, title: P("المصادقة والتفويض", "Authentication & authorization"), description: P("Identity، JWT، والسياسات", "Identity, JWT, and policies"), lessons: ["01-identity-basics.json", "02-jwt.json", "03-policies-roles.json"] }, stageLessons.filter((l) => l.stage === "05")],
  ["06-advanced", { slug: "06-advanced", order: 6, title: P("مواضيع متقدمة", "Advanced topics"), description: P("التخزين المؤقت، التسجيل، والخلفية", "Caching, logging, and background work"), lessons: ["01-caching.json", "02-logging-health.json", "03-background-services.json"] }, stageLessons.filter((l) => l.stage === "06")],
  ["07-project", { slug: "07-project", order: 7, title: P("مشروع تطبيقي", "Capstone project"), description: P("ابنِ API كامل لمسار تعلّم مصغّر", "Build a full API for a mini learning path"), lessons: ["01-design.json", "02-implement.json", "03-harden.json"] }, stageLessons.filter((l) => l.stage === "07")],
];

let src = fs.readFileSync(target, "utf8").trimEnd();
if (!src.endsWith("}),")) {
  console.error("File does not end with }),");
  process.exit(1);
}

const foundationsRest = allRemaining.filter((l) => !l.stage).map(serDeepLesson).join(",\n");
const closeFoundations = `\n    ],\n  },\n`;
const otherStages = stage02to07.map(([k, m, ls]) => serStage(k, m, ls)).join(",\n");
const footer = `\n};\n`;

const out = src + ",\n" + foundationsRest + closeFoundations + otherStages + footer;
fs.writeFileSync(target, out, "utf8");
console.log("Written. Lessons added:", allRemaining.length + stageLessons.length);
