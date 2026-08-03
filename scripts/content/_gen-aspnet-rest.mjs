/**
 * One-shot generator: appends remaining aspnet lessons and closes aspnetStages.
 * Run: node scripts/content/_gen-aspnet-rest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deepLesson, qa, concept, pitfalls } from "./builder.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, "aspnet.mjs");

function L(spec) {
  return deepLesson(spec);
}

const remaining = [
  L({
    slug: "03-types-null",
    order: 3,
    duration: 42,
    title: { ar: "الأنواع والقيم المرجعية وNullable", en: "Types, references & Nullable" },
    summary: {
      ar: "Value vs Reference، boxing، و`T?` لتجنب null في APIs",
      en: "Value vs reference, boxing, and `T?` to avoid null bugs in APIs.",
    },
    why: {
      ar: "أغلب أخطاء الإنتاج في C# مرتبطة بـ null: NullReferenceException عند قراءة خاصية على كائن غير موجود، أو إرجاع null من repository دون أن يتوقعه الـ controller. فهم الفرق بين **value types** و**reference types** يشرح لماذا `int` لا يمكن أن يكون null بينما `string` يمكن — ولماذا أضاف C# **Nullable reference types** (NRT) تحذيرات compile-time.\n\nفي ASP.NET Core، Model Binding يملأ DTOs من JSON — الحقول الناقصة قد تصبح null. EF Core يرجع null من `FirstOrDefault`. إتقان `T?`, null-coalescing (`??`), وnull-conditional (`?.`) يجعل handlers آمنة قبل أن تصل لمرحلة validation الرسمية.",
      en: "Most production C# bugs involve null: NullReferenceException when reading a property on a missing object, or returning null from a repository when the controller expects data. Understanding **value types** vs **reference types** explains why `int` cannot be null while `string` can — and why C# added **Nullable reference types** (NRT) for compile-time warnings.\n\nIn ASP.NET Core, model binding fills DTOs from JSON — missing fields may become null. EF Core returns null from `FirstOrDefault`. Mastering `T?`, null-coalescing (`??`), and null-conditional (`?.`) keeps handlers safe before formal validation.",
    },
    goals: {
      ar: ["تمييز value types عن reference types", "استخدام Nullable<T> و`int?`", "تطبيق ?? و?. و??=", "تفعيل NRT warnings في المشروع"],
      en: ["Distinguish value from reference types", "Use Nullable<T> and `int?`", "Apply ??, ?., and ??=", "Enable NRT warnings in the project"],
    },
    concepts: [
      concept(
        "Value vs Reference",
        "**Value types** (`struct`, `int`, `bool`, `DateTime`) تُنسخ عند الإسناد — التعديل على نسخة لا يغيّر الأصل. **Reference types** (`class`, `string`, arrays) يحمل المتغير **مرجعاً** للكائن على الكوم — نسخ المرجع يشير لنفس الكائن. `string` immutable — التعديل ينشئ string جديد. في APIs، DTOs عادة `class` (reference) — مراعاة null ضرورية.",
        "Value vs Reference",
        "**Value types** (`struct`, `int`, `bool`, `DateTime`) copy on assignment — changing a copy does not affect the original. **Reference types** (`class`, `string`, arrays) store a **reference** to heap objects — copying the reference points to the same object. `string` is immutable — mutations create new strings. API DTOs are usually `class` (reference) — null awareness is essential.",
      ),
      concept(
        "Nullable value types",
        "`int?` اختصار لـ `Nullable<int>` — value type يمكن أن يحمل null أو int. مفيد للحقول الاختيارية في JSON: `{ \"age\": null }`. `.HasValue` و`.Value` للوصول — أو `.GetValueOrDefault()`. في EF Core، `int?` يترجم إلى عمود nullable في SQL.",
        "Nullable value types",
        "`int?` is shorthand for `Nullable<int>` — a value type that can hold null or an int. Useful for optional JSON fields: `{ \"age\": null }`. Use `.HasValue`, `.Value`, or `.GetValueOrDefault()`. In EF Core, `int?` maps to a nullable SQL column.",
      ),
      concept(
        "Null-coalescing وconditional",
        "`??` يرجع اليمين إذا اليسار null: `name ?? \"Guest\"`. `?.` يتوقف عند null: `user?.Email`. `??=` يعيّن فقط إذا null. سلسلة `order?.Customer?.Address?.City` تمنع exceptions في APIs — لكن لا تخفِ missing data عن validation.",
        "Null-coalescing & conditional",
        "`??` returns the right side when left is null: `name ?? \"Guest\"`. `?.` short-circuits on null: `user?.Email`. `??=` assigns only when null. Chains like `order?.Customer?.Address?.City` prevent exceptions — but do not hide missing data from validation.",
      ),
      concept(
        "Nullable Reference Types",
        "`<Nullable>enable</Nullable>` في `.csproj` يفعّل NRT: `string` غير nullable افتراضياً، `string?` nullable. المترجم يحذّر عند إسناد null محتمل. في ASP.NET 8+ القوالب تفعّله — استخدم `required` و`[NotNull]` حيث يلزم. `#nullable disable` للملفات القديمة فقط.",
        "Nullable Reference Types",
        "`<Nullable>enable</Nullable>` in `.csproj` enables NRT: `string` is non-nullable by default, `string?` is nullable. The compiler warns on possible null assignments. ASP.NET 8+ templates enable it — use `required` and annotations where needed. `#nullable disable` only for legacy files.",
      ),
    ],
    steps: {
      ar: [
        "فعّل `<Nullable>enable</Nullable>` في .csproj",
        "جرّب `int? age = null` و`HasValue`",
        "اكتب `string? nick = null` ولاحظ التحذيرات",
        "استخدم `??` و`?.` في دالة تنسّق عنواناً",
        "أنشئ record مع `string? Bio` و`required string Name`",
        "اختبر JSON binding: حقل ناقص → null",
      ],
      en: [
        "Enable `<Nullable>enable</Nullable>` in .csproj",
        "Try `int? age = null` and `HasValue`",
        "Write `string? nick = null` and observe warnings",
        "Use `??` and `?.` in an address formatter",
        "Create a record with `string? Bio` and `required string Name`",
        "Test JSON binding: missing field → null",
      ],
    },
    code: {
      ar: {
        lang: "csharp",
        source: `public record UserDto(string Name, string? Bio, int? Age);

public static string Display(UserDto? user) =>
    user is null
        ? "مستخدم غير معروف"
        : $"{user.Name} — {user.Bio ?? "بدون نبذة"} — {user.Age?.ToString() ?? "—"}";`,
        explain: "UserDto يمزج required string مع حقول nullable — Display آمنة بـ null checks و??.",
      },
      en: {
        lang: "csharp",
        source: `public record UserDto(string Name, string? Bio, int? Age);

public static string Display(UserDto? user) =>
    user is null
        ? "Unknown user"
        : $"{user.Name} — {user.Bio ?? "No bio"} — {user.Age?.ToString() ?? "—"}";`,
        explain: "UserDto mixes required string with nullable fields — Display is safe via null checks and ??.",
      },
    },
    pitfalls: pitfalls([
      { ar: ["تجاهل NRT warnings", "عالج التحذيرات — null في API يسبب 500"], en: ["Ignoring NRT warnings", "Fix warnings — null in APIs causes 500s"] },
      { ar: ["استخدام .Value على null", "تحقق HasValue أو استخدم GetValueOrDefault"], en: ["Calling .Value on null", "Check HasValue or use GetValueOrDefault"] },
      { ar: ["?? يخفي missing validation", "?? للعرض؛ validation يحدد required fields"], en: ["?? hides missing validation", "?? for display; validation defines required fields"] },
      { ar: ["Boxing int في object", "تجنب boxing غير الضروري في hot paths"], en: ["Boxing int to object", "Avoid unnecessary boxing in hot paths"] },
    ]),
    discussion: [
      qa("هل string value أم reference؟", "reference type لكن immutable — سلوك يشبه value للمبتدئ.", "Is string value or reference?", "Reference type but immutable — behaves value-like for beginners."),
      qa("متى أستخدم record vs class؟", "record للـ DTOs immutable؛ class عند behavior وmutable state.", "When record vs class?", "record for immutable DTOs; class for behavior and mutable state."),
      qa("FirstOrDefault يرجع null؟", "نعم للreference types — استخدم FirstOrDefaultAsync مع null check أو throw.", "Does FirstOrDefault return null?", "Yes for reference types — use FirstOrDefaultAsync with null check or throw."),
      qa("required في C# 11؟", "يُلزم المُنشئ/binding بتوفير القيمة — ممتاز لـ API contracts.", "required in C# 11?", "Forces constructor/binding to supply value — great for API contracts."),
    ],
    exercises: {
      ar: ["اكتب دالة MaxOrNull(int? a, int? b)", "DTO بثلاثة nullable fields — اختبر JSON", "حوّل warnings NRT إلى zero", "استخدم pattern `is null`"],
      en: ["Write MaxOrNull(int? a, int? b)", "DTO with three nullable fields — test JSON", "Clear NRT warnings to zero", "Use `is null` pattern"],
    },
    checklist: {
      ar: ["أفرق value/reference", "أستخدم ?? و?.", "NRT مفعّل", "record DTO مع nullable", "لا .Value بدون check"],
      en: ["Distinguish value/reference", "Use ?? and ?.", "NRT enabled", "record DTO with nullable", "No .Value without check"],
    },
    nextHint: { ar: "الدرس التالي: البرمجة كائنية التوجّه — classes، inheritance، وencapsulation.", en: "Next: OOP — classes, inheritance, and encapsulation." },
  }),
  // Additional lessons will be appended by the main write - truncated for generator
];

// Read existing file (should end without closing braces)
let src = fs.readFileSync(target, "utf8").trimEnd();
if (!src.endsWith("}),")) {
  console.error("Unexpected file ending");
  process.exit(1);
}

// We'll output lesson strings directly - this script is a scaffold
console.log("Lessons defined:", remaining.length);
