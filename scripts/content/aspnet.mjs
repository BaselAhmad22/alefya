import { deepLesson, qa, concept, pitfalls } from "./builder.mjs";

export const aspnetTrack = {
  slug: "aspnet",
  order: 1,
  title: { ar: "ASP.NET Core", en: "ASP.NET Core" },
  tagline: {
    ar: "من C# حتى بناء API ومشروع حقيقي",
    en: "From C# to APIs and a real project",
  },
  description: {
    ar: "مسار دراسي متكامل يأخذك من صفر في C# و.NET حتى تبني Web API حقيقي: Minimal APIs وMVC، Entity Framework Core، المصادقة بـ JWT والسياسات، ثم مشروع تطبيقي كامل. كل درس مكتوب بالعربية والإنجليزية مع أمثلة عملية وأخطاء شائعة وتمارين داخل الموقع — بدون الحاجة لمصادر خارجية.",
    en: "A complete learning path from zero in C# and .NET to building a real Web API: Minimal APIs and MVC, Entity Framework Core, JWT auth and policies, then a full capstone project. Every lesson is bilingual with practical examples, common pitfalls, and in-site exercises — no external sites required.",
  },
  color: "#512BD4",
  estimatedHours: 120,
  stages: [
    "01-foundations",
    "02-aspnet-basics",
    "03-apis-mvc",
    "04-ef-core",
    "05-auth",
    "06-advanced",
    "07-project",
  ],
};

export const aspnetStages = {
  "01-foundations": {
    meta: {
      slug: "01-foundations",
      order: 1,
      title: { ar: "أساسيات C# والكائنات", en: "C# & OOP Foundations" },
      description: {
        ar: "اللغة التي يُبنى عليها كل شيء في .NET — من صيغة C# إلى async/await",
        en: "The language everything in .NET is built on — from C# syntax to async/await",
      },
      lessons: [
        "01-dotnet-world.json",
        "02-csharp-syntax.json",
        "03-types-null.json",
        "04-oop-classes.json",
        "05-interfaces-generics.json",
        "06-async-await.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-dotnet-world",
        order: 1,
        duration: 45,
        title: { ar: "عالم .NET وASP.NET Core", en: "The .NET & ASP.NET Core world" },
        summary: {
          ar: "ما هو .NET؟ وما الفرق بين Runtime وSDK وASP.NET Core؟",
          en: "What is .NET? Runtime vs SDK vs ASP.NET Core.",
        },
        why: {
          ar: "قبل أن تكتب أول سطر في Web API، تحتاج خريطة ذهنية واضحة للمنظومة. .NET ليس مجرد لغة — إنه منصة تشغيل، مكتبات قياسية، أدوات بناء، وإطار ويب يعمل معاً. فهم هذا التقسيم يوفر عليك ساعات من الالتباس عند قراءة توثيق Microsoft أو رسائل الخطأ.\n\nASP.NET Core هو الطبقة التي تتعامل مع HTTP: التوجيه، Middleware، المصادقة، وربط C# بطلبات الويب. كل درس لاحق في هذا المسار يفترض أنك تعرف أين يقع كل مكوّن — لذلك نبدأ من هنا.",
          en: "Before you write your first Web API line, you need a clear mental map of the stack. .NET is not just a language — it is a runtime, standard libraries, build tools, and a web framework working together. Understanding this split saves hours of confusion when reading Microsoft docs or error messages.\n\nASP.NET Core is the layer that handles HTTP: routing, middleware, authentication, and connecting C# to web requests. Every later lesson in this track assumes you know where each piece lives — so we start here.",
        },
        goals: {
          ar: [
            "تمييز .NET Runtime عن SDK وASP.NET Core",
            "تثبيت والتحقق من أدوات dotnet CLI",
            "إنشاء وتشغيل أول مشروع webapi",
            "قراءة هيكل المشروع الناتج بثقة",
          ],
          en: [
            "Distinguish .NET Runtime, SDK, and ASP.NET Core",
            "Install and verify dotnet CLI tools",
            "Create and run your first webapi project",
            "Read the generated project structure confidently",
          ],
        },
        concepts: [
          concept(
            "منصة .NET",
            "`.NET` هي منصة مفتوحة المصدر من Microsoft تشمل: **Runtime** (CLR) لتشغيل التطبيقات، **Base Class Library (BCL)** للمجموعات والـ I/O والشبكات، و**SDK** الذي يحتوي `dotnet` CLI والمترجم. الإصدارات الحديثة (.NET 6+) موحّدة — لم يعد هناك .NET Framework منفصل للمبتدئين في المسار الحديث.",
            ".NET platform",
            "`.NET` is Microsoft's open-source platform including: the **Runtime** (CLR) to execute apps, the **Base Class Library (BCL)** for collections, I/O, and networking, and the **SDK** with the `dotnet` CLI and compiler. Modern releases (.NET 6+) are unified — beginners on the modern path no longer juggle separate .NET Framework stacks.",
          ),
          concept(
            "ASP.NET Core",
            "**ASP.NET Core** يبني فوق .NET ويضيف: Kestrel (خادم ويب)، نظام Middleware، Model Binding، DI مدمج، ودعم Minimal APIs وMVC. هو cross-platform — يعمل على Windows وLinux وmacOS. في الإنتاج غالباً يوضع خلف reverse proxy (nginx/IIS) لكن Kestrel يكفي للتطوير.",
            "ASP.NET Core",
            "**ASP.NET Core** sits on .NET and adds: Kestrel (web server), middleware pipeline, model binding, built-in DI, and Minimal APIs plus MVC. It is cross-platform — Windows, Linux, macOS. In production you often sit behind a reverse proxy (nginx/IIS) but Kestrel is enough for development.",
          ),
          concept(
            "dotnet CLI",
            "أمر `dotnet` هو بوابتك: `dotnet new` لإنشاء قوالب، `dotnet build` للبناء، `dotnet run` للتشغيل، `dotnet add package` للحزم. المشاريع تُعرّف بملف `.csproj` — قائمة مراجع وحزم NuGet. `global.json` (اختياري) يثبت إصدار SDK.",
            "dotnet CLI",
            "The `dotnet` command is your gateway: `dotnet new` for templates, `dotnet build`, `dotnet run`, `dotnet add package` for NuGet packages. Projects are defined by a `.csproj` file — references and package list. Optional `global.json` pins SDK version.",
          ),
          concept(
            "Host وPipeline",
            "عند `dotnet run`، **Generic Host** يبدأ Kestrel ويبني **Middleware pipeline** — سلسلة دوال تمرّر `HttpContext`. `Program.cs` في .NET 6+ غالباً top-level statements: `WebApplication.CreateBuilder()` ثم `app.MapGet(...)` ثم `app.Run()`. هذا هو الهيكل الذي ستراه في كل درس لاحق.",
            "Host & pipeline",
            "On `dotnet run`, the **Generic Host** starts Kestrel and builds the **middleware pipeline** — a chain of functions passing `HttpContext`. In .NET 6+, `Program.cs` often uses top-level statements: `WebApplication.CreateBuilder()`, then `app.MapGet(...)`, then `app.Run()`. This skeleton appears in every later lesson.",
          ),
        ],
        steps: {
          ar: [
            "ثبّت .NET SDK من dotnet.microsoft.com (LTS مثل .NET 8)",
            "شغّل `dotnet --version` و`dotnet --list-sdks` للتحقق",
            "أنشئ مشروع: `dotnet new webapi -n HelloApi --use-minimal-apis`",
            "افتح المجلد واقرأ `Program.cs` و`HelloApi.csproj`",
            "شغّل `dotnet run` وافتح Swagger أو `/weatherforecast`",
            "ارسم على ورقة: SDK → Build → Runtime → Kestrel → Middleware",
          ],
          en: [
            "Install .NET SDK from dotnet.microsoft.com (LTS e.g. .NET 8)",
            "Run `dotnet --version` and `dotnet --list-sdks` to verify",
            "Create: `dotnet new webapi -n HelloApi --use-minimal-apis`",
            "Open the folder and read `Program.cs` and `HelloApi.csproj`",
            "Run `dotnet run` and open Swagger or `/weatherforecast`",
            "Sketch on paper: SDK → Build → Runtime → Kestrel → Middleware",
          ],
        },
        code: {
          ar: {
            lang: "bash",
            source: `# التحقق من التثبيت
dotnet --version

# مشروع API بسيط
dotnet new webapi -n HelloApi --use-minimal-apis
cd HelloApi
dotnet run

# إضافة حزمة (مثال)
dotnet add package Serilog.AspNetCore`,
            explain:
              "الأوامر أعلاه تكفي لبدء أي مشروع في المسار. `--use-minimal-apis` ينتج `Program.cs` مختصراً بدون Controllers افتراضية — مناسب لمسارنا.",
          },
          en: {
            lang: "bash",
            source: `# Verify install
dotnet --version

# Simple API project
dotnet new webapi -n HelloApi --use-minimal-apis
cd HelloApi
dotnet run

# Add a package (example)
dotnet add package Serilog.AspNetCore`,
            explain:
              "These commands are enough to bootstrap any project in this track. `--use-minimal-apis` yields a concise `Program.cs` without default Controllers — ideal for our path.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["تثبيت Runtime فقط بدون SDK", "ثبّت SDK — بدونه لا يوجد dotnet new/build"],
            en: ["Installing Runtime only without SDK", "Install the SDK — without it there is no dotnet new/build"],
          },
          {
            ar: ["الخلط بين .NET Framework القديم و.NET الحديث", "اتبع مسار .NET 6/8+ الموحّد في هذا المسار"],
            en: ["Mixing old .NET Framework with modern .NET", "Follow unified .NET 6/8+ in this track"],
          },
          {
            ar: ["تشغيل من مجلد خاطئ", "تأكد أنك داخل مجلد .csproj قبل dotnet run"],
            en: ["Running from wrong folder", "Ensure you are inside the .csproj folder before dotnet run"],
          },
          {
            ar: ["تجاهل رسائل HTTPS في التطوير", "اقبل شهادة التطوير أو استخدم http://localhost:PORT"],
            en: ["Ignoring HTTPS dev warnings", "Trust dev certificate or use http://localhost:PORT"],
          },
        ]),
        discussion: [
          qa(
            "هل أحتاج Visual Studio أم VS Code يكفي؟",
            "كلاهما يعمل. VS Code + C# Dev Kit خفيف وسريع. Visual Studio أغنى للـ debugging المتقدم. المسار يعتمد على `dotnet` CLI — المحرر اختياري.",
            "Do I need Visual Studio or is VS Code enough?",
            "Both work. VS Code + C# Dev Kit is light and fast. Visual Studio is richer for advanced debugging. This track relies on `dotnet` CLI — editor is optional.",
          ),
          qa(
            "ما الفرق بين webapi وweb؟",
            "`webapi` يركز على JSON APIs مع Swagger. `web` قالب عام. لمسارنا `webapi` أو `--use-minimal-apis` أنسب.",
            "What's the difference between webapi and web?",
            "`webapi` focuses on JSON APIs with Swagger. `web` is a general template. For our track, `webapi` or `--use-minimal-apis` fits best.",
          ),
          qa(
            "لماذا Kestrel وليس IIS فقط؟",
            "Kestrel مدمج وcross-platform. IIS/nginx في الإنتاج كـ reverse proxy أمام Kestrel — ليس بديلاً عن فهم Kestrel.",
            "Why Kestrel and not IIS only?",
            "Kestrel is built-in and cross-platform. IIS/nginx in production act as reverse proxies in front of Kestrel — not a substitute for understanding Kestrel.",
          ),
          qa(
            "هل .NET مجاني؟",
            "نعم — .NET وASP.NET Core مفتوح المصدر تحت رخص MIT. لا رسوم ترخيص للتشغيل.",
            "Is .NET free?",
            "Yes — .NET and ASP.NET Core are open source under MIT. No runtime licensing fees.",
          ),
        ],
        exercises: {
          ar: [
            "اكتب في مذكرتك تعريفاً بجملة واحدة لكل من: Runtime، SDK، ASP.NET Core",
            "أنشئ مشروع webapi وغيّر اسم المشروع في .csproj — أعد البناء",
            "أضف endpoint يدوياً في Program.cs يرجع `{ \"message\": \"مرحباً\" }`",
            "قارن حجم مجلد bin/ بعد build الأول — ما الذي يُنسخ؟",
          ],
          en: [
            "Write one-sentence definitions for Runtime, SDK, ASP.NET Core in your notes",
            "Create a webapi project and rename it in .csproj — rebuild",
            "Add a manual endpoint in Program.cs returning `{ \"message\": \"Hello\" }`",
            "Compare bin/ folder size after first build — what gets copied?",
          ],
        },
        checklist: {
          ar: [
            "dotnet --version يعمل",
            "أنشأت مشروع webapi بنجاح",
            "فهمت دور Program.cs",
            "شغّلت API ورأيت استجابة HTTP",
            "أعرف الفرق بين .csproj وProgram.cs",
          ],
          en: [
            "dotnet --version works",
            "Created webapi project successfully",
            "Understand Program.cs role",
            "Ran API and saw HTTP response",
            "Know difference between .csproj and Program.cs",
          ],
        },
        nextHint: {
          ar: "الدرس التالي يغوص في صيغة C# — المتغيرات والدوال والتحكم بالتدفق.",
          en: "Next lesson dives into C# syntax — variables, methods, and control flow.",
        },
      }),
      deepLesson({
        slug: "02-csharp-syntax",
        order: 2,
        duration: 45,
        title: { ar: "صيغة C# الأساسية", en: "C# syntax fundamentals" },
        summary: {
          ar: "المتغيرات، الدوال، والتحكم بالتدفق — لبنة كل كود ASP.NET",
          en: "Variables, methods, and control flow — the backbone of every ASP.NET line.",
        },
        why: {
          ar: "كل endpoint في ASP.NET Core يُكتب بلغة C#. قبل أن تفهم Model Binding أو Controllers، تحتاج أن تقرأ وتكتب C# بثقة: تعريف المتغيرات، استدعاء الدوال، والتحكم في مسار التنفيذ. بدون هذه الأساسيات ستتعثر في كل درس لاحق عندما ترى lambda expressions أو async methods.\n\nصيغة C# مصممة لتكون قابلة للقراءة — `var` للاستنتاج، `string interpolation` للنصوص، و`pattern matching` الحديث يقلل التعقيد. إتقان هذه البناءات يجعلك تكتب handlers نظيفة في Minimal APIs وتفهم أمثلة Microsoft دون ترجمة ذهنية.",
          en: "Every endpoint in ASP.NET Core is written in C#. Before Model Binding or Controllers make sense, you need to read and write C# confidently: declaring variables, calling methods, and controlling execution flow. Without these basics you will stumble in every later lesson when you see lambda expressions or async methods.\n\nC# syntax is designed for readability — `var` for inference, string interpolation, and modern pattern matching reduce noise. Mastering these constructs lets you write clean Minimal API handlers and read Microsoft samples without mental translation.",
        },
        goals: {
          ar: [
            "تعريف المتغيرات بأنواع صريحة و`var`",
            "كتابة دوال بقيم إرجاع ومعاملات",
            "استخدام if/else وswitch وloops",
            "قراءة LINQ بسيط وفهم lambda expressions",
          ],
          en: [
            "Declare variables with explicit types and `var`",
            "Write methods with return values and parameters",
            "Use if/else, switch, and loops",
            "Read basic LINQ and understand lambda expressions",
          ],
        },
        concepts: [
          concept(
            "المتغيرات والأنواع",
            "في C# كل متغير له **نوع** يحدد ما يمكن تخزينه. الأنواع القيمية (`int`, `bool`, `double`) تُخزَّن على المكدس غالباً؛ المرجعية (`string`, `object`, الكائنات) على الكوم. `var` يستنتج النوع من التعبير: `var count = 10;` يعادل `int count = 10;`. استخدم `const` للثوابت وقت الترجمة. في APIs ستعرّف DTOs كـ `class` أو `record` — لكن المتغيرات المحلية تستخدم `var` كثيراً للوضوح.",
            "Variables & types",
            "In C# every variable has a **type** that defines what it can hold. Value types (`int`, `bool`, `double`) usually live on the stack; reference types (`string`, `object`, classes) on the heap. `var` infers the type from the expression: `var count = 10;` equals `int count = 10;`. Use `const` for compile-time constants. In APIs you will define DTOs as `class` or `record` — but locals often use `var` for clarity.",
          ),
          concept(
            "الدوال والمعاملات",
            "الدالة (`method`) هي وحدة قابلة لإعادة الاستخدام. التوقيع يحدد الاسم، المعاملات، ونوع الإرجاع: `public static int Add(int a, int b) => a + b;`. **Expression-bodied members** (`=>`) مختصرة للتعبيرات الواحدة. **Optional parameters** و**named arguments** تزيد المرونة. في Minimal APIs الدالة `(int id) => ...` هي lambda — نفس فكرة المعاملات لكن بدون اسم صريح.",
            "Methods & parameters",
            "A **method** is a reusable unit. The signature defines name, parameters, and return type: `public static int Add(int a, int b) => a + b;`. **Expression-bodied members** (`=>`) shorten single expressions. **Optional parameters** and **named arguments** add flexibility. In Minimal APIs `(int id) => ...` is a lambda — same parameter idea without an explicit method name.",
          ),
          concept(
            "التحكم بالتدفق",
            "`if/else` للشروط، `switch` (مع patterns في C# 9+) للفروع المتعددة، `for`/`foreach`/`while` للتكرار. `foreach` الأكثر شيوعاً على المجموعات — ستستخدمه مع `List<T>` ونتائج EF Core. **Early return** في الدوال يقلل التداخل: تحقق من الشروط وارجع مبكراً بدل if-else عميق — نمط شائع في API validation.",
            "Control flow",
            "`if/else` for conditions, `switch` (with patterns in C# 9+) for multiple branches, `for`/`foreach`/`while` for iteration. `foreach` is most common on collections — you will use it with `List<T>` and EF Core results. **Early return** in methods reduces nesting: check conditions and return early instead of deep if-else — a common API validation pattern.",
          ),
          concept(
            "Lambda وLINQ",
            "**Lambda**: `(x) => x * 2` دالة مجهولة. **LINQ** يستعلم المجموعات بشكل declarative: `items.Where(x => x.Active).OrderBy(x => x.Name)`. في ASP.NET ستجد LINQ في EF Core queries وفي middleware filters. ابدأ بـ `Where`, `Select`, `FirstOrDefault` — ثلاث عمليات تغطي 80% من الاستخدام اليومي.",
            "Lambdas & LINQ",
            "**Lambda**: `(x) => x * 2` is an anonymous function. **LINQ** queries collections declaratively: `items.Where(x => x.Active).OrderBy(x => x.Name)`. In ASP.NET you will see LINQ in EF Core queries and middleware filters. Start with `Where`, `Select`, `FirstOrDefault` — three operations cover 80% of daily use.",
          ),
        ],
        steps: {
          ar: [
            "أنشئ مشروع console: `dotnet new console -n SyntaxLab`",
            "جرّب `int`, `string`, `var`, و`const` في Main",
            "اكتب دالة `static string Greet(string name)` واستدعها",
            "طبّق if/else وforeach على `List<string>`",
            "اكتب lambda: `Func<int,int> double = x => x * 2;`",
            "جرّب LINQ: `.Where().Select().ToList()` على قائمة أرقام",
          ],
          en: [
            "Create console project: `dotnet new console -n SyntaxLab`",
            "Try `int`, `string`, `var`, and `const` in Main",
            "Write `static string Greet(string name)` and call it",
            "Apply if/else and foreach on `List<string>`",
            "Write lambda: `Func<int,int> double = x => x * 2;`",
            "Try LINQ: `.Where().Select().ToList()` on a number list",
          ],
        },
        code: {
          ar: {
            lang: "csharp",
            source: `using System;
using System.Collections.Generic;
using System.Linq;

var names = new List<string> { "أحمد", "سارة", "علي" };

foreach (var name in names.Where(n => n.Length > 3))
{
    Console.WriteLine(Greet(name));
}

static string Greet(string name) => $"مرحباً {name}!";

// lambda + LINQ
var scores = new[] { 55, 72, 88, 40 };
var passed = scores.Where(s => s >= 60).Select(s => s + 5).ToList();`,
            explain: "المثال يجمع دوال static، string interpolation، foreach، lambda، وLINQ — نفس الأنماط في handlers وخدمات API.",
          },
          en: {
            lang: "csharp",
            source: `using System;
using System.Collections.Generic;
using System.Linq;

var names = new List<string> { "Ahmad", "Sara", "Ali" };

foreach (var name in names.Where(n => n.Length > 3))
{
    Console.WriteLine(Greet(name));
}

static string Greet(string name) => $"Hello {name}!";

// lambda + LINQ
var scores = new[] { 55, 72, 88, 40 };
var passed = scores.Where(s => s >= 60).Select(s => s + 5).ToList();`,
            explain: "This sample combines static methods, string interpolation, foreach, lambdas, and LINQ — the same patterns appear in API handlers and services.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["استخدام var عندما النوع غير واضح", "استخدم var عندما النوع ظاهر من اليمين؛ وإلا اكتب النوع صراحة"],
            en: ["Using var when type is unclear", "Use var when the type is obvious from the right side; otherwise write it explicitly"],
          },
          {
            ar: ["نسيان return في دالة غير void", "المترجم يحذّر — تأكد كل مسار يرجع قيمة أو throw"],
            en: ["Forgetting return in non-void method", "Compiler warns — ensure every path returns or throws"],
          },
          {
            ar: ["مقارنة string بـ == دون فهم interning", "== يعمل للمحتوى؛ للثقافة استخدم StringComparison في APIs"],
            en: ["Comparing strings with == without understanding interning", "== works for content; in APIs prefer StringComparison for culture rules"],
          },
          {
            ar: ["LINQ يُنفَّذ مرتين على IEnumerable", "Materialize بـ ToList() إذا ستمرّ أكثر من مرة"],
            en: ["Executing LINQ twice on IEnumerable", "Materialize with ToList() if you iterate more than once"],
          },
        ]),
        discussion: [
          qa(
            "هل أستخدم var دائماً؟",
            "لا — `var` عندما النوع واضح. في APIs العامة أو المعاملات العامة اكتب النوع صراحة للقراءة.",
            "Should I always use var?",
            "No — use `var` when the type is obvious. In public APIs or parameters, write the type explicitly for readability.",
          ),
          qa(
            "ما الفرق بين static وinstance method؟",
            "static لا يحتاج كائن — مفيد للدوال المساعدة. instance تعمل على حالة الكائن — ستستخدمها في Services مع DI.",
            "Difference between static and instance methods?",
            "static needs no object — good for helpers. instance methods use object state — you will use them in DI-registered services.",
          ),
          qa(
            "هل LINQ بطيء؟",
            "Deferred execution فعّال للاستعلامات الكبيرة. Materialize (`ToList`) عند الحاجة. EF Core يترجم LINQ إلى SQL.",
            "Is LINQ slow?",
            "Deferred execution is efficient for large queries. Materialize (`ToList`) when needed. EF Core translates LINQ to SQL.",
          ),
          qa(
            "لماذا top-level statements في Program.cs؟",
            "اختصار C# 9+ — الكود في Program.cs يُلف داخل Main تلقائياً. فهم الدوال static يساعدك قراءة القوالب.",
            "Why top-level statements in Program.cs?",
            "C# 9+ sugar — Program.cs code is wrapped in Main automatically. Understanding static methods helps read templates.",
          ),
        ],
        exercises: {
          ar: [
            "اكتب دالة ترجع أكبر عدد من `int[]`",
            "حوّل for loop إلى foreach + LINQ Where",
            "اكتب switch expression (C# 8+) لتصنيف درجة",
            "أضف named argument عند استدعاء دالة Greet",
          ],
          en: [
            "Write a method returning the max from `int[]`",
            "Convert a for loop to foreach + LINQ Where",
            "Write a switch expression (C# 8+) to grade scores",
            "Add a named argument when calling Greet",
          ],
        },
        checklist: {
          ar: [
            "أستطيع تعريف متغيرات وأنواع أساسية",
            "كتبت دالة static واستدعيتها",
            "استخدمت foreach وLINQ Where/Select",
            "فهمت شكل lambda `(x) => ...`",
            "شغّلت مشروع console بنجاح",
          ],
          en: [
            "I can declare variables and basic types",
            "Wrote and called a static method",
            "Used foreach and LINQ Where/Select",
            "Understand lambda shape `(x) => ...`",
            "Ran console project successfully",
          ],
        },
        nextHint: {
          ar: "الدرس التالي يتعمّق في أنواع القيم والمراجع وNullable — أساس تجنب NullReferenceException.",
          en: "Next lesson goes deeper into value vs reference types and Nullable — key to avoiding NullReferenceException.",
        },
      }),
      deepLesson({
        slug: "03-types-null",
        order: 3,
        duration: 42,
        title: { ar: "الأنواع والقيم المرجعية وNullable", en: "Types, references & Nullable" },
        summary: { ar: "Value vs Reference، boxing، و`T?` لتجنب null في APIs", en: "Value vs reference, boxing, and `T?` to avoid null bugs in APIs." },
        why: {
          ar: "أغلب أخطاء الإنتاج في C# مرتبطة بـ null: NullReferenceException عند قراءة خاصية على كائن غير موجود، أو إرجاع null من repository دون أن يتوقعه الـ controller. فهم الفرق بين **value types** و**reference types** يشرح لماذا `int` لا يمكن أن يكون null بينما `string` يمكن — ولماذا أضاف C# **Nullable reference types** (NRT) تحذيرات compile-time.\n\nفي ASP.NET Core، Model Binding يملأ DTOs من JSON — الحقول الناقصة قد تصبح null. EF Core يرجع null من `FirstOrDefault`. إتقان `T?`, null-coalescing (`??`), وnull-conditional (`?.`) يجعل handlers آمنة قبل أن تصل لمرحلة validation الرسمية.",
          en: "Most production C# bugs involve null: NullReferenceException when reading a property on a missing object, or returning null from a repository when the controller expects data. Understanding **value types** vs **reference types** explains why `int` cannot be null while `string` can — and why C# added **Nullable reference types** (NRT) for compile-time warnings.\n\nIn ASP.NET Core, model binding fills DTOs from JSON — missing fields may become null. EF Core returns null from `FirstOrDefault`. Mastering `T?`, null-coalescing (`??`), and null-conditional (`?.`) keeps handlers safe before formal validation.",
        },
        goals: {
          ar: ["تمييز value types عن reference types", "استخدام Nullable<T> و`int?`", "تطبيق ?? و?. و??=", "تفعيل NRT warnings في المشروع"],
          en: ["Distinguish value from reference types", "Use Nullable<T> and `int?`", "Apply ??, ?., and ??=", "Enable NRT warnings in the project"],
        },
        concepts: [
          concept("Value vs Reference", "**Value types** (`struct`, `int`, `bool`, `DateTime`) تُنسخ عند الإسناد — التعديل على نسخة لا يغيّر الأصل. **Reference types** (`class`, `string`, arrays) يحمل المتغير **مرجعاً** للكائن على الكوم — نسخ المرجع يشير لنفس الكائن. `string` immutable — التعديل ينشئ string جديد. في APIs، DTOs عادة `class` (reference) — مراعاة null ضرورية.", "Value vs Reference", "**Value types** (`struct`, `int`, `bool`, `DateTime`) copy on assignment — changing a copy does not affect the original. **Reference types** (`class`, `string`, arrays) store a **reference** to heap objects — copying the reference points to the same object. `string` is immutable — mutations create new strings. API DTOs are usually `class` (reference) — null awareness is essential."),
          concept("Nullable value types", "`int?` اختصار لـ `Nullable<int>` — value type يمكن أن يحمل null أو int. مفيد للحقول الاختيارية في JSON: `{ \"age\": null }`. `.HasValue` و`.Value` للوصول — أو `.GetValueOrDefault()`. في EF Core، `int?` يترجم إلى عمود nullable في SQL.", "Nullable value types", "`int?` is shorthand for `Nullable<int>` — a value type that can hold null or an int. Useful for optional JSON fields: `{ \"age\": null }`. Use `.HasValue`, `.Value`, or `.GetValueOrDefault()`. In EF Core, `int?` maps to a nullable SQL column."),
          concept("Null-coalescing وconditional", "`??` يرجع اليمين إذا اليسار null: `name ?? \"Guest\"`. `?.` يتوقف عند null: `user?.Email`. `??=` يعيّن فقط إذا null. سلسلة `order?.Customer?.Address?.City` تمنع exceptions في APIs — لكن لا تخفِ missing data عن validation.", "Null-coalescing & conditional", "`??` returns the right side when left is null: `name ?? \"Guest\"`. `?.` short-circuits on null: `user?.Email`. `??=` assigns only when null. Chains like `order?.Customer?.Address?.City` prevent exceptions — but do not hide missing data from validation."),
          concept("Nullable Reference Types", "`<Nullable>enable</Nullable>` في `.csproj` يفعّل NRT: `string` غير nullable افتراضياً، `string?` nullable. المترجم يحذّر عند إسناد null محتمل. في ASP.NET 8+ القوالب تفعّله — استخدم `required` و`[NotNull]` حيث يلزم.", "Nullable Reference Types", "`<Nullable>enable</Nullable>` in `.csproj` enables NRT: `string` is non-nullable by default, `string?` is nullable. The compiler warns on possible null assignments. ASP.NET 8+ templates enable it — use `required` and annotations where needed."),
        ],
        steps: {
          ar: ["فعّل `<Nullable>enable</Nullable>` في .csproj", "جرّب `int? age = null` و`HasValue`", "اكتب `string? nick = null` ولاحظ التحذيرات", "استخدم `??` و`?.` في دالة تنسّق عنواناً", "أنشئ record مع `string? Bio` و`required string Name`", "اختبر JSON binding: حقل ناقص → null"],
          en: ["Enable `<Nullable>enable</Nullable>` in .csproj", "Try `int? age = null` and `HasValue`", "Write `string? nick = null` and observe warnings", "Use `??` and `?.` in an address formatter", "Create a record with `string? Bio` and `required string Name`", "Test JSON binding: missing field → null"],
        },
        code: {
          ar: { lang: "csharp", source: `public record UserDto(string Name, string? Bio, int? Age);\n\npublic static string Display(UserDto? user) =>\n    user is null\n        ? "مستخدم غير معروف"\n        : $"{user.Name} — {user.Bio ?? "بدون نبذة"} — {user.Age?.ToString() ?? "—"}";`, explain: "UserDto يمزج required string مع حقول nullable — Display آمنة بـ null checks و??." },
          en: { lang: "csharp", source: `public record UserDto(string Name, string? Bio, int? Age);\n\npublic static string Display(UserDto? user) =>\n    user is null\n        ? "Unknown user"\n        : $"{user.Name} — {user.Bio ?? "No bio"} — {user.Age?.ToString() ?? "—"}";`, explain: "UserDto mixes required string with nullable fields — Display is safe via null checks and ??." },
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
        exercises: { ar: ["اكتب دالة MaxOrNull(int? a, int? b)", "DTO بثلاثة nullable fields — اختبر JSON", "حوّل warnings NRT إلى zero", "استخدم pattern `is null`"], en: ["Write MaxOrNull(int? a, int? b)", "DTO with three nullable fields — test JSON", "Clear NRT warnings to zero", "Use `is null` pattern"] },
        checklist: { ar: ["أفرق value/reference", "أستخدم ?? و?.", "NRT مفعّل", "record DTO مع nullable", "لا .Value بدون check"], en: ["Distinguish value/reference", "Use ?? and ?.", "NRT enabled", "record DTO with nullable", "No .Value without check"] },
        nextHint: { ar: "الدرس التالي: البرمجة كائنية التوجّه — classes، inheritance، وencapsulation.", en: "Next: OOP — classes, inheritance, and encapsulation." },
      }),
      deepLesson({
        slug: "04-oop-classes",
        order: 4,
        duration: 50,
        title: { ar: "البرمجة كائنية التوجّه — Classes", en: "OOP — Classes & inheritance" },
        summary: { ar: "Classes، properties، inheritance، وvirtual methods لبناء Services", en: "Classes, properties, inheritance, and virtual methods for services." },
        why: { ar: "ASP.NET Core مبني على OOP: Controllers وServices وDbContext كلها classes. فهم **encapsulation** (إخفاء التفاصيل الداخلية) و**inheritance** (إعادة استخدام السلوك) يجعلك تنظم API layers: Domain entities، Repositories، Application services. بدون OOP ستضع كل المنطق في Program.cs — مشروع يصعب صيانته بعد 10 endpoints.\n\nProperties بدل fields عامة تعطي validation وcomputed values. `virtual`/`override` يمكّن polymorphism — مفيد في testing (mock services) وفي base controller patterns. هذا الدرس يربط C# OOP بما ستراه في DI وEF Core entities.", en: "ASP.NET Core is OOP-based: Controllers, Services, and DbContext are classes. **Encapsulation** (hiding internals) and **inheritance** (reusing behavior) help you structure API layers: domain entities, repositories, application services. Without OOP you put all logic in Program.cs — unmaintainable after 10 endpoints.\n\nProperties over public fields give validation and computed values. `virtual`/`override` enables polymorphism — useful for testing (mock services) and base controller patterns. This lesson connects C# OOP to DI and EF Core entities." },
        goals: {
          ar: ["تعريف class مع properties وconstructors", "تطبيق inheritance وoverride", "استخدام access modifiers (public/private/protected)", "بناء service class بسيط قابل للحقن"],
          en: ["Define class with properties and constructors", "Apply inheritance and override", "Use access modifiers (public/private/protected)", "Build a simple injectable service class"],
        },
        concepts: [
          concept(
            "Class وObject",
            "**Class** هو blueprint؛ **object** instance منه: `var svc = new OrderService(repo);`. الحقول `private`؛ الوصول عبر **properties** `{ get; set; }`. **Constructor** يهيّئ الحالة. في DI، ASP.NET يستدعي constructor تلقائياً — constructor injection هو النمط الأساسي.",
            "Class & Object",
            "A **class** is a blueprint; an **object** is an instance: `var svc = new OrderService(repo);`. Fields are `private`; access via **properties** `{ get; set; }`. **Constructors** initialize state. With DI, ASP.NET calls constructors automatically — constructor injection is the core pattern.",
          ),
          concept(
            "Inheritance",
            "`class PremiumCustomer : Customer` يرث members. `base(...)` يستدعي constructor الأب. **override** يخصص virtual method. لا تبالغ في inheritance — **composition** (`class OrderService { private readonly IRepo _repo; }`) أوضح في APIs.",
            "Inheritance",
            "`class PremiumCustomer : Customer` inherits members. `base(...)` calls parent constructor. **override** customizes virtual methods. Do not overuse inheritance — **composition** (`class OrderService { private readonly IRepo _repo; }`) is clearer in APIs.",
          ),
          concept(
            "Encapsulation",
            "أخفِ `_balance` واعرض `Deposit(decimal amount)` مع validation. **init-only** properties (`{ get; init; }`) للـ DTOs immutable. API layer لا يعرّض entities مباشرة — map إلى DTOs.",
            "Encapsulation",
            "Hide `_balance` and expose `Deposit(decimal amount)` with validation. **init-only** properties (`{ get; init; }`) for immutable DTOs. API layer should not expose entities directly — map to DTOs.",
          ),
          concept(
            "Polymorphism",
            "مرجع `IClock` يمكن أن يشير `SystemClock` أو `FakeClock` في tests. `virtual void Log()` في base، `override` في derived. Interface (الدرس التالي) preferred للـ DI contracts.",
            "Polymorphism",
            "An `IClock` reference can point to `SystemClock` or `FakeClock` in tests. `virtual void Log()` in base, `override` in derived. Interfaces (next lesson) are preferred for DI contracts.",
          ),
        ],
        steps: {
          ar: ["أنشئ `class Product` مع Id, Name, Price properties", "أضف constructor وmethod `ApplyDiscount(decimal pct)`", "أنشئ `class DigitalProduct : Product` مع override", "حوّل fields إلى private + public properties", "أنشئ `OrderService` يعتمد على `List<Product>`", "سجّل OrderService في DI (معاينة — المرحلة التالية)"],
          en: ["Create `class Product` with Id, Name, Price properties", "Add constructor and `ApplyDiscount(decimal pct)` method", "Create `class DigitalProduct : Product` with override", "Convert fields to private + public properties", "Create `OrderService` depending on `List<Product>`", "Register OrderService in DI (preview — next stage)"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public class Product {\n  public int Id { get; init; }\n  public string Name { get; set; } = \"\";\n  public decimal Price { get; private set; }\n  public Product(int id, string name, decimal price) => (Id, Name, Price) = (id, name, price);\n  public virtual decimal GetTotal() => Price;\n}\npublic class DigitalProduct : Product {\n  public DigitalProduct(int id, string name, decimal price) : base(id, name, price) { }\n  public override decimal GetTotal() => Price * 0.9m;\n}",
            explain: "Product مع encapsulation على Price وvirtual GetTotal — DigitalProduct يoverride للخصم.",
          },
          en: {
            lang: "csharp",
            source: "public class Product {\n  public int Id { get; init; }\n  public string Name { get; set; } = \"\";\n  public decimal Price { get; private set; }\n  public Product(int id, string name, decimal price) => (Id, Name, Price) = (id, name, price);\n  public virtual decimal GetTotal() => Price;\n}\npublic class DigitalProduct : Product {\n  public DigitalProduct(int id, string name, decimal price) : base(id, name, price) { }\n  public override decimal GetTotal() => Price * 0.9m;\n}",
            explain: "Product with encapsulated Price and virtual GetTotal — DigitalProduct overrides for discount.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["public fields everywhere", "استخدم properties مع private set حيث يلزم"],
            en: ["public fields everywhere", "Use properties with private set where needed"],
          },
          {
            ar: ["inheritance عميق جداً", "فضّل composition + interfaces"],
            en: ["Deep inheritance hierarchies", "Prefer composition + interfaces"],
          },
          {
            ar: ["entities تُرسل مباشرة للعميل", "map إلى DTOs — لا تكشف navigation loops"],
            en: ["Returning entities directly to client", "Map to DTOs — avoid navigation loops"],
          },
          {
            ar: ["نسيان base() في constructor", "المترجم يطلب constructor chain صحيح"],
            en: ["Forgetting base() in constructor", "Compiler requires valid constructor chain"],
          },
        ]),
        discussion: [
          qa(
            "record vs class؟",
            "record للبيانات immutable؛ class للسلوك والحالة المتغيرة.",
            "record vs class?",
            "record for immutable data; class for behavior and mutable state.",
          ),
          qa(
            "لماذا private set؟",
            "يمنع تعديل Price من خارج — تغيير عبر methods.",
            "Why private set?",
            "Prevents external Price mutation — change via methods.",
          ),
          qa(
            "هل Controller يجب أن يرث شيئاً؟",
            "ControllerBase في MVC — minimal APIs لا تحتاج inheritance.",
            "Must Controller inherit something?",
            "ControllerBase in MVC — minimal APIs need no inheritance.",
          ),
          qa(
            "sealed class؟",
            "يمنع inheritance — للـ security وperformance في rare cases.",
            "sealed class?",
            "Prevents inheritance — for security/performance in rare cases.",
          ),
        ],
        exercises: {
          ar: ["أضف validation في setter لName", "OrderService.Add + GetTotal", "FakeProduct لاختبار unit", "حوّل Product إلى record — قارن"],
          en: ["Add Name setter validation", "OrderService.Add + GetTotal", "FakeProduct for unit test", "Convert Product to record — compare"],
        },
        checklist: {
          ar: ["class + properties", "inheritance + override", "private fields", "constructor injection جاهز", "DTO منفصل عن entity"],
          en: ["class + properties", "inheritance + override", "private fields", "constructor injection ready", "DTO separate from entity"],
        },
        nextHint: { ar: "الدرس التالي: Interfaces وGenerics — أساس DI وRepositories.", en: "Next: Interfaces and Generics — foundation of DI and repositories." },
      }),
      deepLesson({
        slug: "05-interfaces-generics",
        order: 5,
        duration: 48,
        title: { ar: "Interfaces وGenerics", en: "Interfaces & Generics" },
        summary: { ar: "Contracts، `IEnumerable<T>`، constraints — قلب DI وEF Repositories", en: "Contracts, `IEnumerable<T>`, constraints — heart of DI and EF repos." },
        why: { ar: "Dependency Injection في ASP.NET يعتمد على **interfaces**: `builder.Services.AddScoped<IProductRepo, EfProductRepo>()`. Interface يعرّف contract بدون implementation — يسهّل testing (mock) وتبديل SQL بـ InMemory. **Generics** تكتب algorithm مرة واحدة لأي نوع: `Repository<T>` حيث `T : class`. LINQ وEF Core مليانان generics.\n\nبدون interfaces ستربط Controller مباشرة بـ SqlConnection — vendor lock-in وtests بطيئة. Generics + constraints (`where T : Entity`) تحافظ على type safety وقت compile. هذا الدرس يجهّزك لمرحلة DI وEF Core رسمياً.", en: "ASP.NET DI relies on **interfaces**: `builder.Services.AddScoped<IProductRepo, EfProductRepo>()`. An interface defines a contract without implementation — easing tests (mocks) and swapping SQL for InMemory. **Generics** let you write an algorithm once for any type: `Repository<T>` where `T : class`. LINQ and EF Core are full of generics.\n\nWithout interfaces you wire Controllers directly to SqlConnection — vendor lock-in and slow tests. Generics plus constraints (`where T : Entity`) keep compile-time type safety. This lesson prepares you for DI and EF Core formally." },
        goals: {
          ar: ["تعريف interface وتطبيقه", "كتابة generic class/method", "استخدام constraints (where T : class)", "ربط interface بـ service registration"],
          en: ["Define and implement interfaces", "Write generic class/method", "Use constraints (where T : class)", "Connect interface to service registration"],
        },
        concepts: [
          concept(
            "Interfaces",
            "`interface IEmailSender { Task SendAsync(string to, string body); }` — لا implementation. Class يimplements: `class SmtpSender : IEmailSender`. DI container يسجّل mapping.",
            "Interfaces",
            "`interface IEmailSender { Task SendAsync(string to, string body); }` — no implementation. Classes implement: `class SmtpSender : IEmailSender`. DI container registers the mapping.",
          ),
          concept(
            "Generics",
            "`List<T>`, `Dictionary<TKey,TValue>`, `Task<T>` — T هو type parameter. `public class PagedResult<T> { public IReadOnlyList<T> Items { get; init; } = []; public int Total { get; init; } }` — pattern شائع في API responses.",
            "Generics",
            "`List<T>`, `Dictionary<TKey,TValue>`, `Task<T>` — T is a type parameter. `public class PagedResult<T> { public IReadOnlyList<T> Items { get; init; } = []; public int Total { get; init; } }` — common API response pattern.",
          ),
          concept(
            "Constraints",
            "`where T : class` — reference type. `where T : struct` — value. `where T : IEntity` — implements interface. `where T : new()` — parameterless constructor. EF `DbSet<T>` where T : class.",
            "Constraints",
            "`where T : class` — reference type. `where T : struct` — value. `where T : IEntity` — implements interface. `where T : new()` — parameterless constructor. EF `DbSet<T>` where T : class.",
          ),
          concept(
            "Covariance في APIs",
            "`IEnumerable<Cat>` قابل للتمرير كـ `IEnumerable<Animal>` (covariant out). في API design، ارجع `IReadOnlyList<TDto>` بدل `List<T>`. Generic methods: `T? Find<T>(IEnumerable<T> items, Func<T,bool> pred)`.",
            "Covariance in APIs",
            "`IEnumerable<Cat>` can pass as `IEnumerable<Animal>` (covariant out). In API design, return `IReadOnlyList<TDto>` not `List<T>`. Generic methods: `T? Find<T>(IEnumerable<T> items, Func<T,bool> pred)`.",
          ),
        ],
        steps: {
          ar: ["عرّف `interface IClock { DateTime UtcNow { get; } }`", "نفّذ SystemClock وFakeClock", "اكتب `Repository<T> where T : class, IEntity`", "أضف method generic `Map<TSource,TDest>(...)`", "سجّل IClock في Program.cs AddSingleton", "اختبر swap FakeClock في dev"],
          en: ["Define `interface IClock { DateTime UtcNow { get; } }`", "Implement SystemClock and FakeClock", "Write `Repository<T> where T : class, IEntity`", "Add generic method `Map<TSource,TDest>(...)`", "Register IClock in Program.cs AddSingleton", "Test swapping FakeClock in dev"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public interface IProductRepository {\n  Task<Product?> GetByIdAsync(int id, CancellationToken ct = default);\n  Task AddAsync(Product product, CancellationToken ct = default);\n}\npublic class InMemoryProductRepository : IProductRepository {\n  private readonly List<Product> _store = new();\n  public Task<Product?> GetByIdAsync(int id, CancellationToken ct = default) =>\n    Task.FromResult(_store.FirstOrDefault(p => p.Id == id));\n  public Task AddAsync(Product product, CancellationToken ct = default) {\n    _store.Add(product); return Task.CompletedTask;\n  }\n}\n// builder.Services.AddSingleton<IProductRepository, InMemoryProductRepository>();",
            explain: "Interface + implementation + DI registration — النمط الذي ستراه في كل مشروع API.",
          },
          en: {
            lang: "csharp",
            source: "public interface IProductRepository {\n  Task<Product?> GetByIdAsync(int id, CancellationToken ct = default);\n  Task AddAsync(Product product, CancellationToken ct = default);\n}\npublic class InMemoryProductRepository : IProductRepository {\n  private readonly List<Product> _store = new();\n  public Task<Product?> GetByIdAsync(int id, CancellationToken ct = default) =>\n    Task.FromResult(_store.FirstOrDefault(p => p.Id == id));\n  public Task AddAsync(Product product, CancellationToken ct = default) {\n    _store.Add(product); return Task.CompletedTask;\n  }\n}\n// builder.Services.AddSingleton<IProductRepository, InMemoryProductRepository>();",
            explain: "Interface + implementation + DI registration — the pattern you will see in every API project.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["interface ضخم (god interface)", "قسّم لinterfaces صغيرة (ISP)"],
            en: ["Fat god interface", "Split into small interfaces (ISP)"],
          },
          {
            ar: ["generic overload بدون constraints", "constraints توضح ما مسموح"],
            en: ["Generic overload without constraints", "Constraints clarify allowed types"],
          },
          {
            ar: ["return List<T> مباشرة", "IReadOnlyList<T> أو IEnumerable<T>"],
            en: ["Returning List<T> directly", "Prefer IReadOnlyList<T> or IEnumerable<T>"],
          },
          {
            ar: ["concrete type في constructor Controller", "اعتماد على interface فقط"],
            en: ["Concrete type in Controller constructor", "Depend on interface only"],
          },
        ]),
        discussion: [
          qa(
            "interface vs abstract class؟",
            "interface multiple inheritance؛ abstract class shared code.",
            "interface vs abstract class?",
            "interface allows multiple; abstract class shared code.",
          ),
          qa(
            "AddScoped vs Singleton للrepo؟",
            "Scoped مع DbContext؛ Singleton فقط لstateless/cache.",
            "AddScoped vs Singleton for repo?",
            "Scoped with DbContext; Singleton only for stateless/cache.",
          ),
          qa(
            "default interface methods؟",
            "C# 8+ — sparingly في APIs.",
            "Default interface methods?",
            "C# 8+ — use sparingly in APIs.",
          ),
          qa(
            "Generic variance في DI؟",
            "DI لا يinject IRepo<Cat> كـ IRepo<Animal> — صمّم non-generic أو factory.",
            "Generic variance in DI?",
            "DI won't inject IRepo<Cat> as IRepo<Animal> — design non-generic or factory.",
          ),
        ],
        exercises: {
          ar: ["ICache<T> مع MemoryCache<T>", "Fake repo لtests", "PagedResult<T> generic", "قسّم IProductRepository إذا كبر"],
          en: ["ICache<T> with MemoryCache<T>", "Fake repo for tests", "PagedResult<T> generic", "Split IProductRepository if it grows"],
        },
        checklist: {
          ar: ["interface + impl", "generic class/method", "constraints where", "DI registration", "Controller يعتمد interface"],
          en: ["interface + impl", "generic class/method", "constraints where", "DI registration", "Controller depends on interface"],
        },
        nextHint: { ar: "الدرس التالي: async/await — كل I/O في ASP.NET غير متزامن.", en: "Next: async/await — all I/O in ASP.NET is asynchronous." },
      }),
      deepLesson({
        slug: "06-async-await",
        order: 6,
        duration: 52,
        title: { ar: "Async/Await وTask", en: "Async/Await & Task" },
        summary: { ar: "Task، async handlers، CancellationToken — لا blocking في APIs", en: "Task, async handlers, CancellationToken — no blocking in APIs." },
        why: { ar: "ASP.NET Core مصمم لآلاف الطلبات المتزامنة على threads محدودة. **async/await** يحرر thread أثناء I/O (DB، HTTP، files) بدل blocking. كل EF Core call الحديث `...Async()` — Minimal API handlers `async (int id) => await repo.GetAsync(id)`. استخدام `.Result` أو `.Wait()` يسبب **deadlocks** ويقتل throughput.\n\n**CancellationToken** يلغي العمل عند disconnect العميل — مهم للاستعلامات الطويلة. فهم `Task` vs `Task<T>` vs `ValueTask` يمنع anti-patterns في middleware وbackground services. هذا الدرس الأخير في Foundations — بعده تدخل ASP.NET Core مباشرة.", en: "ASP.NET Core handles thousands of concurrent requests on limited threads. **async/await** frees threads during I/O (DB, HTTP, files) instead of blocking. Modern EF Core calls use `...Async()` — Minimal API handlers use `async (int id) => await repo.GetAsync(id)`. Using `.Result` or `.Wait()` causes **deadlocks** and kills throughput.\n\n**CancellationToken** cancels work when clients disconnect — important for long queries. Understanding `Task` vs `Task<T>` vs `ValueTask` prevents anti-patterns in middleware and background services. Last Foundations lesson — next you enter ASP.NET Core directly." },
        goals: {
          ar: ["كتابة async methods ترجع Task/Task<T>", "await I/O بدون blocking", "تمرير CancellationToken للـ EF/HTTP", "تجنب async void وdeadlock patterns"],
          en: ["Write async methods returning Task/Task<T>", "await I/O without blocking", "Pass CancellationToken to EF/HTTP", "Avoid async void and deadlock patterns"],
        },
        concepts: [
          concept(
            "Task model",
            "`Task` يمثل عملاً غير متزامناً. `async Task<int> GetCountAsync()` — compiler يولّد state machine. `await` يعلّق method حتى يكتمل I/O دون حجب thread. **Thread pool** يُ reused — scalability أفضل.",
            "Task model",
            "`Task` represents asynchronous work. `async Task<int> GetCountAsync()` — compiler generates a state machine. `await` suspends the method until I/O completes without blocking the thread. **Thread pool** threads are reused — better scalability.",
          ),
          concept(
            "async في Minimal APIs",
            "`app.MapGet(\"/items\", async (IItemRepo repo, CancellationToken ct) => await repo.ListAsync(ct));` — DI + async + cancellation في signature واحد. ASP.NET يربط CancellationToken تلقائياً.",
            "async in Minimal APIs",
            "`app.MapGet(\"/items\", async (IItemRepo repo, CancellationToken ct) => await repo.ListAsync(ct));` — DI + async + cancellation in one signature. ASP.NET binds CancellationToken automatically.",
          ),
          concept(
            "ConfigureAwait",
            "في library code `await foo.ConfigureAwait(false)` — لا capture sync context. في ASP.NET Core **لا sync context** افتراضياً — optional. في UI (WPF) مهم — ليس هنا.",
            "ConfigureAwait",
            "In library code `await foo.ConfigureAwait(false)` avoids capturing sync context. ASP.NET Core has **no sync context** by default — optional. Matters in UI (WPF) — not here.",
          ),
          concept(
            "Parallel vs async",
            "`Task.WhenAll` لparallel I/O: `await Task.WhenAll(a,b,c)`. **لا** `Task.Run` لـ DB calls في request — يسرق thread pool. `Task.Run` للـ CPU-bound offload فقط.",
            "Parallel vs async",
            "`Task.WhenAll` for parallel I/O: `await Task.WhenAll(a,b,c)`. **Do not** `Task.Run` DB calls in requests — steals thread pool. `Task.Run` only for CPU-bound offload.",
          ),
        ],
        steps: {
          ar: ["اكتب `async Task<string> DownloadAsync(HttpClient http)`", "await HttpClient.GetStringAsync", "أضف CancellationToken parameter", "MapGet async handler يستدعي DownloadAsync", "جرّب Task.WhenAll لطلبين", "لاحظ الفرق — لا .Result أبداً"],
          en: ["Write `async Task<string> DownloadAsync(HttpClient http)`", "await HttpClient.GetStringAsync", "Add CancellationToken parameter", "MapGet async handler calling DownloadAsync", "Try Task.WhenAll for two requests", "Notice — never .Result"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "app.MapGet(\"/users/{id:int}\", async (int id, IUserRepo repo, CancellationToken ct) => {\n  var user = await repo.GetByIdAsync(id, ct);\n  return user is null ? Results.NotFound() : Results.Ok(user);\n});\npublic async Task<List<User>> LoadAllAsync(IUserRepo repo, CancellationToken ct) {\n  var a = repo.GetPageAsync(1, ct); var b = repo.GetPageAsync(2, ct);\n  await Task.WhenAll(a, b); return (await a).Concat(await b).ToList();\n}",
            explain: "Minimal API async + NotFound + Task.WhenAll — أنماط production شائعة.",
          },
          en: {
            lang: "csharp",
            source: "app.MapGet(\"/users/{id:int}\", async (int id, IUserRepo repo, CancellationToken ct) => {\n  var user = await repo.GetByIdAsync(id, ct);\n  return user is null ? Results.NotFound() : Results.Ok(user);\n});\npublic async Task<List<User>> LoadAllAsync(IUserRepo repo, CancellationToken ct) {\n  var a = repo.GetPageAsync(1, ct); var b = repo.GetPageAsync(2, ct);\n  await Task.WhenAll(a, b); return (await a).Concat(await b).ToList();\n}",
            explain: "Minimal API async + NotFound + Task.WhenAll — common production patterns.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: [".Result / .Wait()", "await طوال call stack"],
            en: [".Result / .Wait()", "await all the way"],
          },
          {
            ar: ["async void", "async Task فقط — async void للevent handlers UI"],
            en: ["async void", "async Task only — async void for UI events"],
          },
          {
            ar: ["نسيان await", "CS4014 warning — fire-and-forget خطير"],
            en: ["Forgetting await", "CS4014 warning — fire-and-forget is dangerous"],
          },
          {
            ar: ["Task.Run لكل DB call", "await EF async methods مباشرة"],
            en: ["Task.Run for every DB call", "await EF async methods directly"],
          },
        ]),
        discussion: [
          qa(
            "ValueTask؟",
            "لتقليل allocations عند hot paths — repositories عادية Task<T> كافية.",
            "ValueTask?",
            "Reduces allocations on hot paths — Task<T> enough for typical repos.",
          ),
          qa(
            "Sync over async في ASP.NET؟",
            "ممنوع — يسبب thread starvation.",
            "Sync over async in ASP.NET?",
            "Avoid — causes thread starvation.",
          ),
          qa(
            "HttpClient singleton؟",
            "نعم — IHttpClientFactory أفضل — الدرس المتقدم.",
            "HttpClient singleton?",
            "Yes — IHttpClientFactory is better — advanced lesson.",
          ),
          qa(
            "Exception في async؟",
            "try/catch حول await — unhandled → 500 middleware.",
            "Exception in async?",
            "try/catch around await — unhandled → 500 middleware.",
          ),
        ],
        exercises: {
          ar: ["async File.ReadAllTextAsync", "Timeout بـ CancellationTokenSource", "WhenAll 3 URLs", "Benchmark blocking vs async"],
          en: ["async File.ReadAllTextAsync", "Timeout with CancellationTokenSource", "WhenAll 3 URLs", "Benchmark blocking vs async"],
        },
        checklist: {
          ar: ["async Task methods", "await I/O", "CancellationToken", "no .Result", "WhenAll للparallel"],
          en: ["async Task methods", "await I/O", "CancellationToken", "no .Result", "WhenAll for parallel"],
        },
        nextHint: { ar: "المرحلة التالية: هيكل مشروع ASP.NET Core وProgram.cs.", en: "Next stage: ASP.NET Core project structure and Program.cs." },
      })
    ],
  },
  "02-aspnet-basics": {
    meta: {
      slug: "02-aspnet-basics",
      order: 2,
      title: { ar: "أساسيات ASP.NET Core", en: "ASP.NET Core basics" },
      description: { ar: "Host، Middleware، الإعدادات، والـ DI", en: "Host, middleware, configuration, and DI" },
      lessons: [
        "01-project-structure.json",
        "02-middleware-pipeline.json",
        "03-dependency-injection.json",
        "04-configuration.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-project-structure",
        order: 1,
        duration: 40,
        title: { ar: "هيكل مشروع Web API", en: "Web API project structure" },
        summary: { ar: "Program.cs، .csproj، appsettings، ومجلدات المشروع", en: "Program.cs, .csproj, appsettings, and project folders." },
        why: { ar: "مشروع ASP.NET Core ليس مجرد Program.cs — `.csproj` يحدد SDK والحزم، `appsettings.json` يحمل الإعدادات، و`Properties/launchSettings.json` يضبط URLs والبيئة. فهم الهيكل يساعدك إضافة EF Core، Identity، وtests دون فوضى.\n\nالتنظيم المبكر (Features/ أو Clean Architecture) يمنع spaghetti بعد 20 endpoint. في هذا الدرس تقرأ القالب الافتراضي وتعرف أين تضع Services، Models، وData — قبل الغوص في Middleware وDI.", en: "An ASP.NET Core project is not just Program.cs — `.csproj` defines SDK and packages, `appsettings.json` holds settings, and `Properties/launchSettings.json` configures URLs and environment. Understanding structure helps you add EF Core, Identity, and tests without chaos.\n\nEarly organization (Features/ or Clean Architecture) prevents spaghetti after 20 endpoints. This lesson reads the default template and shows where Services, Models, and Data live — before Middleware and DI deep dives." },
        goals: {
          ar: ["قراءة Program.cs وWebApplication builder", "فهم .csproj وPackageReference", "استخدام appsettings وlaunchSettings", "تنظيم مجلدات Services/Models/Data"],
          en: ["Read Program.cs and WebApplication builder", "Understand .csproj and PackageReference", "Use appsettings and launchSettings", "Organize Services/Models/Data folders"],
        },
        concepts: [
          concept(
            "Program.cs وHost",
            "`WebApplication.CreateBuilder(args)` هو نقطة الدخول في .NET 6+: ينشئ **Generic Host** الذي يشغّل Kestrel ويبني pipeline. `builder.Services` هو `IServiceCollection` لتسجيل DI، و`builder.Configuration` يقرأ appsettings والبيئة. بعد `builder.Build()` تحصل على `WebApplication` حيث تضيف middleware و`MapGet`/`MapControllers` ثم `app.Run()`. top-level statements تختصر `Main` — لكن المنطق نفسه.",
            "Program.cs & Host",
            "`WebApplication.CreateBuilder(args)` is the entry point in .NET 6+: it creates the **Generic Host** that runs Kestrel and builds the pipeline. `builder.Services` is the `IServiceCollection` for DI registration, and `builder.Configuration` reads appsettings and environment. After `builder.Build()` you get `WebApplication` where you add middleware and `MapGet`/`MapControllers`, then `app.Run()`. Top-level statements replace explicit `Main` — the logic is the same.",
          ),
          concept(
            "ملف .csproj",
            "ملف `.csproj` يعرّف المشروع لـ MSBuild: `Sdk=\"Microsoft.NET.Sdk.Web\"` يفعّل مراجع ASP.NET Core. `TargetFramework` (مثل `net8.0`) يحدد runtime. كل `PackageReference` هو حزمة NuGet — EF Core، Serilog، FluentValidation. `dotnet add package` يعدّل الملف تلقائياً. `Nullable` و`ImplicitUsings` يقللان boilerplate. فهم `.csproj` ضروري عند CI وعند مراجعة dependencies.",
            ".csproj file",
            "The `.csproj` file defines the project for MSBuild: `Sdk=\"Microsoft.NET.Sdk.Web\"` enables ASP.NET Core references. `TargetFramework` (e.g. `net8.0`) pins the runtime. Each `PackageReference` is a NuGet package — EF Core, Serilog, FluentValidation. `dotnet add package` edits the file automatically. `Nullable` and `ImplicitUsings` reduce boilerplate. Understanding `.csproj` matters for CI and dependency reviews.",
          ),
          concept(
            "Configuration files",
            "`appsettings.json` يحمل إعدادات افتراضية: Logging، ConnectionStrings، Jwt. `appsettings.Development.json` يُحمّل في Development و**override** القيم — مثل log level أعلى. `Properties/launchSettings.json` يضبط `applicationUrl` و`ASPNETCORE_ENVIRONMENT` عند F5 — **للتطوير فقط**، لا تُنسخ secrets للإنتاج. User Secrets (معرف UserSecretsId في csproj) يخزن مفاتيح محلياً خارج git.",
            "Configuration files",
            "`appsettings.json` holds default settings: Logging, ConnectionStrings, Jwt. `appsettings.Development.json` loads in Development and **overrides** values — e.g. higher log level. `Properties/launchSettings.json` sets `applicationUrl` and `ASPNETCORE_ENVIRONMENT` on F5 — **development only**; do not copy secrets to production. User Secrets (via `UserSecretsId` in csproj) store keys locally outside git.",
          ),
          concept(
            "تنظيم المجلدات",
            "مشروع صغير: endpoints في `Program.cs` أو مجلد `Endpoints/`. متوسط: `Features/Lessons/` (endpoint + service + DTO)، `Data/` للـ DbContext، `Models/` للentities. كبير: Clean Architecture (Domain/Application/Infrastructure). المهم **الاتساق** — الفريق يجب أن يعرف أين يضيف ملفاً جديداً. extension methods مثل `MapLessonEndpoints()` تبقي `Program.cs` قصيراً.",
            "Folder layout",
            "Small project: endpoints in `Program.cs` or an `Endpoints/` folder. Medium: `Features/Lessons/` (endpoint + service + DTO), `Data/` for DbContext, `Models/` for entities. Large: Clean Architecture layers. What matters is **consistency** — the team must know where to add new files. Extension methods like `MapLessonEndpoints()` keep `Program.cs` short.",
          ),
        ],
        steps: {
          ar: ["أنشئ webapi: `dotnet new webapi -n StudyApi --use-minimal-apis`", "اقرأ Program.cs وStudyApi.csproj", "افتح appsettings وlaunchSettings", "أنشئ مجلدات Services, Models, Data", "انقل WeatherForecast إلى Models/", "أضف README يشرح الهيكل"],
          en: ["Create webapi: `dotnet new webapi -n StudyApi --use-minimal-apis`", "Read Program.cs and StudyApi.csproj", "Open appsettings and launchSettings", "Create Services, Models, Data folders", "Move WeatherForecast to Models/", "Add README describing layout"],
        },
        code: {
          ar: {
            lang: "json",
            source: "// appsettings.json\n{\n  \"Logging\": { \"LogLevel\": { \"Default\": \"Information\" } },\n  \"ConnectionStrings\": { \"Default\": \"Server=.;Database=StudyDb;\" },\n  \"AllowedHosts\": \"*\"\n}",
            explain: "appsettings.json — مصدر Configuration الافتراضي؛ Development.json يoverride محلياً.",
          },
          en: {
            lang: "json",
            source: "// appsettings.json\n{\n  \"Logging\": { \"LogLevel\": { \"Default\": \"Information\" } },\n  \"ConnectionStrings\": { \"Default\": \"Server=.;Database=StudyDb;\" },\n  \"AllowedHosts\": \"*\"\n}",
            explain: "appsettings.json — default configuration source; Development.json overrides locally.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["كل شيء في Program.cs", "قسّم Services وendpoints extensions"],
            en: ["Everything in Program.cs", "Split services and endpoint extensions"],
          },
          {
            ar: ["secrets في appsettings committed", "User Secrets / env vars"],
            en: ["Secrets in committed appsettings", "User Secrets / env vars"],
          },
          {
            ar: ["launchSettings للإنتاج", "للتطوير فقط — Kestrel URLs"],
            en: ["launchSettings for production", "Dev only — Kestrel URLs"],
          },
          {
            ar: ["مجلدات بلا convention", "اتفق على naming مع الفريق"],
            en: ["Folders without convention", "Agree on naming with team"],
          },
        ]),
        discussion: [
          qa(
            "عند إنشاء مشروع جديد، هل أختار قالب Minimal APIs أم Controllers؟ وهل يمكنني التبديل لاحقاً؟",
            "قالب `--use-minimal-apis` أخف ومناسب لمسارنا — `Program.cs` مباشر بدون Controllers افتراضية. Controllers template يناسب فرقاً تعتمد MVC conventions. يمكنك الجمع لاحقاً: `AddControllers()` + `MapControllers()` مع Minimal routes. التبديل الكامل مكلف — اختر حسب حجم الفريق وتفضيل التنظيم من البداية.",
            "When creating a new project, should I pick Minimal APIs or Controllers? Can I switch later?",
            "The `--use-minimal-apis` template is lighter and fits our track — a direct `Program.cs` without default Controllers. The Controllers template suits teams that rely on MVC conventions. You can mix later: `AddControllers()` + `MapControllers()` alongside Minimal routes. A full switch is costly — choose based on team size and organization preference from the start.",
          ),
          qa(
            "ما فائدة ملف global.json وهل أحتاجه في مشروع تعلّم شخصي؟",
            "`global.json` يثبت إصدار SDK (مثل 8.0.100) حتى لا يبني زميلك أو CI بإصدار مختلف فيسبب اختلافات سلوك. في مشروع شخصي اختياري — `dotnet --version` يكفي غالباً. في فريق أو CI، يُنصح به لتجنب \"يعمل عندي\" بسبب SDK mismatch.",
            "What is global.json for and do I need it on a personal learning project?",
            "`global.json` pins the SDK version (e.g. 8.0.100) so a teammate or CI does not build with a different SDK and get subtle behavior differences. For a solo learning project it is optional — `dotnet --version` is usually enough. For teams or CI, it is recommended to avoid \"works on my machine\" SDK mismatches.",
          ),
          qa(
            "هل أضيف مجلدات bin و obj إلى git؟ رأيتها تتغير بعد كل build.",
            "لا — `.gitignore` الافتراضي يستثنيهما. `bin/` و`obj/` مخرجات build مؤقتة؛ حجمها كبير ولا معنى لمراجعتها. ما يُ commit: `.csproj`، الكود المصدر، `appsettings` **بدون secrets**، migrations. بعد clone، `dotnet restore` و`dotnet build` يعيدان إنشاءهما.",
            "Should I add bin and obj folders to git? They change after every build.",
            "No — the default `.gitignore` excludes them. `bin/` and `obj/` are temporary build outputs; they are large and not meaningful in version control. Commit: `.csproj`, source code, `appsettings` **without secrets**, migrations. After clone, `dotnet restore` and `dotnet build` recreate them.",
          ),
          qa(
            "متى أنشئ Solution (.sln) بدلاً من مشروع واحد فقط؟",
            "أنشئ Solution عند وجود أكثر من project: API + test project + shared library. `dotnet new sln` ثم `dotnet sln add StudyApi/StudyApi.csproj`. مشروع API واحد للتعلّم لا يحتاج sln — لكن إضافة `StudyApi.Tests` تجعل sln عملياً لربط المشاريع في IDE وCI.",
            "When should I create a Solution (.sln) instead of a single project?",
            "Create a Solution when you have more than one project: API + test project + shared library. `dotnet new sln` then `dotnet sln add StudyApi/StudyApi.csproj`. A single API for learning does not require a sln — but adding `StudyApi.Tests` makes a sln practical to wire projects in the IDE and CI.",
          ),
        ],
        exercises: {
          ar: ["Extension method MapLessonEndpoints", "User Secrets لconnection string", "net8.0 في csproj", "Properties/launchSettings URLs"],
          en: ["Extension method MapLessonEndpoints", "User Secrets for connection string", "net8.0 in csproj", "Properties/launchSettings URLs"],
        },
        checklist: {
          ar: ["فهمت Program.cs", "قرأت csproj", "appsettings + launchSettings", "مجلدات منظمة", "dotnet run يعمل"],
          en: ["Understand Program.cs", "Read csproj", "appsettings + launchSettings", "Organized folders", "dotnet run works"],
        },
        nextHint: { ar: "التالي: Middleware pipeline — كيف يمر الطلب.", en: "Next: Middleware pipeline — how requests flow." },
      }),
      deepLesson({
        slug: "02-middleware-pipeline",
        order: 2,
        duration: 45,
        title: { ar: "خطّ أنابيب Middleware", en: "The middleware pipeline" },
        summary: { ar: "RequestDelegate، ترتيب Use*، وكتابة middleware مخصص", en: "RequestDelegate, Use* order, and custom middleware." },
        why: { ar: "كل HTTP request يمر عبر **middleware pipeline** — سلسلة دوال: exception handling، HTTPS، routing، auth، endpoints. الترتيب **مهم**: `UseAuthentication` قبل `UseAuthorization`. Middleware مخصص يسجّل الطلبات أو يضيف headers.\n\nفهم Pipeline يشرح أين تضع CORS، rate limiting، وglobal exception handler. Minimal APIs تُنفّذ بعد UseRouting — بدون routing لا MapGet يعمل. هذا الدرس يبني mental model لكل `app.Use*` ستراه.", en: "Every HTTP request passes through the **middleware pipeline** — a chain: exception handling, HTTPS, routing, auth, endpoints. **Order matters**: `UseAuthentication` before `UseAuthorization`. Custom middleware logs requests or adds headers.\n\nUnderstanding the pipeline explains where CORS, rate limiting, and global exception handlers go. Minimal APIs run after UseRouting — without routing MapGet fails. This lesson builds the mental model for every `app.Use*` you will see." },
        goals: {
          ar: ["شرح RequestDelegate وHttpContext", "ترتيب UseExceptionHandler/UseHttps/UseRouting/UseAuth", "كتابة middleware inline وclass-based", "تتبع request في logs"],
          en: ["Explain RequestDelegate and HttpContext", "Order UseExceptionHandler/UseHttps/UseRouting/UseAuth", "Write inline and class-based middleware", "Trace request in logs"],
        },
        concepts: [
          concept(
            "RequestDelegate",
            "كل middleware يستقبل `RequestDelegate next` — دالة تمثل باقي pipeline. في `Invoke` تكتب منطقاً **قبل** `await next(ctx)` (inbound) و/أو **بعد** (outbound، مثل headers على response). إذا لم تستدعِ `next`، short-circuit — الطلب لا يصل للendpoint. `HttpContext` يحمل Request وResponse وItems وUser — مشترك بين كل middleware.",
            "RequestDelegate",
            "Each middleware receives `RequestDelegate next` — the rest of the pipeline. In `Invoke` you run logic **before** `await next(ctx)` (inbound) and/or **after** (outbound, e.g. headers on the response). If you never call `next`, you short-circuit — the request never reaches the endpoint. `HttpContext` holds Request, Response, Items, and User — shared across middleware.",
          ),
          concept(
            "Built-in middleware",
            "ASP.NET Core ي ship middleware جاهز: `UseDeveloperExceptionPage` (dev)، `UseExceptionHandler` (prod)، `UseHttpsRedirection`، `UseStaticFiles`، `UseRouting`، `UseAuthentication`، `UseAuthorization`، ثم terminal mapping (`MapGet`, `MapControllers`). الترتيب في `Program.cs` = ترتيب inbound. Authentication **قبل** Authorization — وإلا `[Authorize]` لن يرى user مصادق.",
            "Built-in middleware",
            "ASP.NET Core ships ready middleware: `UseDeveloperExceptionPage` (dev), `UseExceptionHandler` (prod), `UseHttpsRedirection`, `UseStaticFiles`, `UseRouting`, `UseAuthentication`, `UseAuthorization`, then terminal mapping (`MapGet`, `MapControllers`). Order in `Program.cs` is inbound order. Authentication **before** Authorization — otherwise `[Authorize]` never sees an authenticated user.",
          ),
          concept(
            "Middleware class",
            "للمنطق المعقد: class مع `InvokeAsync(HttpContext context, RequestDelegate next)` و`app.UseMiddleware<T>()`. Constructor يدعم DI — inject `ILogger`, services. أنظف من lambda طويلة. نفس قواعد `next`: await للمتابعة، short-circuit بكتابة response مباشرة.",
            "Middleware class",
            "For richer logic: a class with `InvokeAsync(HttpContext context, RequestDelegate next)` and `app.UseMiddleware<T>()`. Constructor supports DI — inject `ILogger`, services. Cleaner than a long lambda. Same `next` rules: await to continue, short-circuit by writing the response directly.",
          ),
          concept(
            "Branching",
            "`Map` و`MapWhen` ينشئان sub-pipeline لمسار أو شرط — مثلاً `/admin` middleware إضافي. `UseWhen` يطبّق middleware conditionally دون تغيير path. مفيد لـ health checks منفصلة أو API versioning branches. كل branch له pipeline مستقل جزئياً.",
            "Branching",
            "`Map` and `MapWhen` create sub-pipelines for a path or condition — e.g. extra `/admin` middleware. `UseWhen` applies middleware conditionally without changing the path. Useful for separate health checks or API versioning branches. Each branch has its own partial pipeline.",
          ),
        ],
        steps: {
          ar: ["ارسم pipeline على ورقة", "أضف inline middleware يسجّل Method+Path", "UseHttpsRedirection ثم Routing", "RequestTimingMiddleware class", "اختبر ترتيب خاطئ UseAuth", "راجع logs للترتيب"],
          en: ["Sketch pipeline on paper", "Add inline middleware logging Method+Path", "UseHttpsRedirection then Routing", "RequestTimingMiddleware class", "Test wrong UseAuth order", "Review logs for order"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "app.Use(async (ctx, next) => {\n  var sw = Stopwatch.StartNew();\n  await next(ctx);\n  sw.Stop();\n  ctx.Response.Headers[\"X-Elapsed-Ms\"] = sw.ElapsedMilliseconds.ToString();\n});\napp.UseHttpsRedirection();\napp.UseRouting();\napp.MapGet(\"/health\", () => Results.Ok(new { status = \"ok\" }));",
            explain: "Inline middleware يقيس زمن الطلب — header X-Elapsed-Ms على الاستجابة.",
          },
          en: {
            lang: "csharp",
            source: "app.Use(async (ctx, next) => {\n  var sw = Stopwatch.StartNew();\n  await next(ctx);\n  sw.Stop();\n  ctx.Response.Headers[\"X-Elapsed-Ms\"] = sw.ElapsedMilliseconds.ToString();\n});\napp.UseHttpsRedirection();\napp.UseRouting();\napp.MapGet(\"/health\", () => Results.Ok(new { status = \"ok\" }));",
            explain: "Inline middleware measures request time — X-Elapsed-Ms header on response.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["UseAuthorization قبل Authentication", "Authentication أولاً"],
            en: ["UseAuthorization before Authentication", "Authentication first"],
          },
          {
            ar: ["عدم await next", "pipeline يتوقف"],
            en: ["Not awaiting next", "Pipeline stops"],
          },
          {
            ar: ["heavy work قبل next بدون سبب", "بعد next للresponse إن أمكن"],
            en: ["Heavy work before next without reason", "After next for response when possible"],
          },
          {
            ar: ["Exception بعد بدء response", "ExceptionHandler مبكر"],
            en: ["Exception after response started", "ExceptionHandler early"],
          },
        ]),
        discussion: [
          qa(
            "ما الفرق بين Middleware وAction Filter في MVC؟ أيهما أستخدم لتسجيل الطلبات؟",
            "Middleware عام لكل الطلبات HTTP — يعمل قبل routing وقبل MVC. Action Filters خاصة بـ MVC pipeline بعد اختيار action — مناسبة لauthorization على action، model validation hooks. لتسجيل كل طلب (Method, Path, duration) استخدم Middleware مبكراً. للمنطق على controller action محدد، Filters أنسب.",
            "What is the difference between Middleware and Action Filters in MVC? Which do I use to log requests?",
            "Middleware is global for all HTTP requests — it runs before routing and before MVC. Action Filters are MVC-specific after an action is selected — good for action-level authorization and model validation hooks. To log every request (Method, Path, duration), use early Middleware. For logic on a specific controller action, Filters fit better.",
          ),
          qa(
            "لماذا يُقال إن MapGet terminal middleware؟ ماذا يحدث إذا وضعت middleware بعد MapGet؟",
            "Terminal middleware لا يستدعي `next` — يُنهي pipeline ويرسل response. `MapGet`/`MapPost` terminal للمسار المطابق. Middleware **بعد** MapGet في Program.cs لا يُنفّذ لتلك المسارات — لأن branch انتهى. ضع global middleware (logging, exception) **قبل** Map*.",
            "Why is MapGet called terminal middleware? What if I put middleware after MapGet?",
            "Terminal middleware does not call `next` — it ends the pipeline and sends a response. `MapGet`/`MapPost` are terminal for matching routes. Middleware **after** MapGet in Program.cs does not run for those routes — the branch ended. Place global middleware (logging, exception) **before** Map*.",
          ),
          qa(
            "كيف أتذكر ترتيب UseAuthentication و UseAuthorization عملياً عند كتابة Program.cs؟",
            "قاعدة: **من يُثبت الهوية أولاً، ثم من يُقرر الصلاحية**. Authentication يقرأ JWT/cookie ويملأ `HttpContext.User`. Authorization يفحص roles/policies على User. ضع أيضاً ExceptionHandler وHttpsRedirection مبكراً. ارسم pipeline على ورقة مرة — الترتيب يثبت في الذاكرة.",
            "How do I remember the order of UseAuthentication and UseAuthorization when writing Program.cs?",
            "Rule: **establish identity first, then decide permission**. Authentication reads JWT/cookie and fills `HttpContext.User`. Authorization checks roles/policies on User. Also place ExceptionHandler and HttpsRedirection early. Sketch the pipeline once on paper — the order sticks.",
          ),
          qa(
            "متى أستخدم short-circuit في middleware بدلاً من تمرير الطلب للendpoint؟",
            "عندما تريد الرد مباشرة دون تنفيذ باقي pipeline: API key خاطئ → 401، maintenance mode → 503، rate limit exceeded → 429. اكتب status code وbody ثم **لا** تستدعِ `next`. تأكد أن short-circuit لا يكسر CORS headers إذا تحتاجها — أحياناً CORS middleware يجب أن يكون قبل الفحص.",
            "When should I short-circuit in middleware instead of passing the request to the endpoint?",
            "When you respond directly without running the rest of the pipeline: bad API key → 401, maintenance mode → 503, rate limit exceeded → 429. Set status and body then **do not** call `next`. Ensure short-circuit does not break CORS headers if needed — sometimes CORS middleware must run before the check.",
          ),
        ],
        exercises: {
          ar: ["Middleware يضيف X-Request-Id", "MapWhen لـ /admin", "Exception middleware", "Compare dev vs prod exception page"],
          en: ["Middleware adding X-Request-Id", "MapWhen for /admin", "Exception middleware", "Compare dev vs prod exception page"],
        },
        checklist: {
          ar: ["أرسم pipeline", "inline middleware", "ترتيب Use* صحيح", "class middleware", "health endpoint"],
          en: ["Sketched pipeline", "inline middleware", "Correct Use* order", "class middleware", "health endpoint"],
        },
        nextHint: { ar: "التالي: Dependency Injection — تسجيل Services.", en: "Next: Dependency Injection — registering services." },
      }),
      deepLesson({
        slug: "03-dependency-injection",
        order: 3,
        duration: 48,
        title: { ar: "حقن الاعتماديات", en: "Dependency injection" },
        summary: { ar: "IServiceCollection، lifetimes، وconstructor injection", en: "IServiceCollection, lifetimes, and constructor injection." },
        why: { ar: "**DI container** مدمج في ASP.NET — `builder.Services.AddScoped<IRepo, EfRepo>()`. Constructor injection: `public LessonsController(ILessonRepo repo)`. Lifetimes: Singleton (واحد للتطبيق)، Scoped (لكل request)، Transient (كل resolve جديد).\n\nاختيار lifetime خاطئ يسبب bugs: Scoped DbContext في Singleton service = crash. DI يجعل testing سهل — swap InMemory repo. كل handler وcontroller وmiddleware class يمكن inject services.", en: "The built-in **DI container** — `builder.Services.AddScoped<IRepo, EfRepo>()`. Constructor injection: `public LessonsController(ILessonRepo repo)`. Lifetimes: Singleton (one per app), Scoped (per request), Transient (every resolve).\n\nWrong lifetime causes bugs: Scoped DbContext in Singleton service = crash. DI makes testing easy — swap InMemory repo. Every handler, controller, and middleware class can inject services." },
        goals: {
          ar: ["AddSingleton/Scoped/Transient", "constructor injection في endpoints", "IServiceProvider وIServiceScope", "تجنب service locator anti-pattern"],
          en: ["AddSingleton/Scoped/Transient", "Constructor injection in endpoints", "IServiceProvider and IServiceScope", "Avoid service locator anti-pattern"],
        },
        concepts: [
          concept(
            "Service registration",
            "تسجيل الخدمات في `builder.Services`: `AddScoped<ILessonService, LessonService>()` يربط interface بتطبيق. extension methods في `ServiceCollectionExtensions` (`AddStudyServices()`) تنظّم التسجيل. Container يحلّ التبعيات تلقائياً عند إنشاء controller أو endpoint handler. نسيان التسجيل → `InvalidOperationException` عند أول request وليس عند compile.",
            "Service registration",
            "Register services in `builder.Services`: `AddScoped<ILessonService, LessonService>()` binds interface to implementation. Extension methods in `ServiceCollectionExtensions` (`AddStudyServices()`) organize registration. The container resolves dependencies when creating a controller or endpoint handler. Forgetting registration → `InvalidOperationException` on first request, not at compile time.",
          ),
          concept(
            "Lifetimes",
            "**Singleton**: instance واحدة للتطبيق — config، cache. **Scoped**: instance لكل HTTP request — DbContext، repositories. **Transient**: instance جديدة كل resolve — helpers خفيفة. **Captive dependency** خطير: Singleton يحتفظ Scoped (DbContext) → crash أو corruption. القاعدة: dependency لا تعيش أطول من dependent.",
            "Lifetimes",
            "**Singleton**: one instance per app — config, cache. **Scoped**: one instance per HTTP request — DbContext, repositories. **Transient**: new instance every resolve — lightweight helpers. **Captive dependency** is dangerous: Singleton holding Scoped (DbContext) → crash or corruption. Rule: a dependency must not outlive its dependent.",
          ),
          concept(
            "Injection sites",
            "Constructor injection هو الأفضل — في Minimal API parameters، Controller constructors، Middleware ctor. `[FromServices]` نادر. endpoint `MapGet(\"/\", (ILessonService svc) => ...)` يعمل لأن DI يحقن parameters تلقائياً. تجنّب `HttpContext.RequestServices.GetService` (service locator) إلا في background scope.",
            "Injection sites",
            "Constructor injection is preferred — in Minimal API parameters, Controller constructors, Middleware ctor. `[FromServices]` is rare. Endpoint `MapGet(\"/\", (ILessonService svc) => ...)` works because DI injects parameters automatically. Avoid `HttpContext.RequestServices.GetService` (service locator) except in background scopes.",
          ),
          concept(
            "Testing",
            "`WebApplicationFactory` في integration tests — override services: `services.AddScoped<IRepo, FakeRepo>()`. unit tests: أنشئ service يدوياً مع mock dependencies. DI يجعل swap implementations سهلاً دون تغيير production code. Fake in-memory repo pattern شائع قبل EF InMemory.",
            "Testing",
            "`WebApplicationFactory` in integration tests — override services: `services.AddScoped<IRepo, FakeRepo>()`. Unit tests: construct the service manually with mock dependencies. DI makes swapping implementations easy without changing production code. Fake in-memory repo pattern is common before EF InMemory.",
          ),
        ],
        steps: {
          ar: ["عرّف ILessonService + impl", "AddScoped في Program.cs", "MapGet يinject ILessonService", "جرّب Transient vs Scoped counts", "Fake service في test project", "AddHttpClient للـ IHttpClientFactory preview"],
          en: ["Define ILessonService + impl", "AddScoped in Program.cs", "MapGet injects ILessonService", "Try Transient vs Scoped counts", "Fake service in test project", "AddHttpClient for IHttpClientFactory preview"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddScoped<ILessonService, LessonService>();\n\napp.MapGet(\"/lessons\", async (ILessonService svc, CancellationToken ct) =>\n    Results.Ok(await svc.ListAsync(ct)));\n\npublic interface ILessonService {\n  Task<IReadOnlyList<LessonDto>> ListAsync(CancellationToken ct);\n}",
            explain: "Scoped service يُحقن في endpoint — container ينشئ instance لكل request.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddScoped<ILessonService, LessonService>();\n\napp.MapGet(\"/lessons\", async (ILessonService svc, CancellationToken ct) =>\n    Results.Ok(await svc.ListAsync(ct)));\n\npublic interface ILessonService {\n  Task<IReadOnlyList<LessonDto>> ListAsync(CancellationToken ct);\n}",
            explain: "Scoped service injected into endpoint — container creates instance per request.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["Singleton يحتفظ DbContext", "Scoped أو IDbContextFactory"],
            en: ["Singleton holding DbContext", "Scoped or IDbContextFactory"],
          },
          {
            ar: ["service locator everywhere", "constructor injection"],
            en: ["service locator everywhere", "constructor injection"],
          },
          {
            ar: ["Transient لكل شيء", "Scoped للـ request state"],
            en: ["Transient for everything", "Scoped for request state"],
          },
          {
            ar: ["نسيان تسجيل service", "InvalidOperationException at startup"],
            en: ["Forgetting to register service", "InvalidOperationException at startup"],
          },
        ]),
        discussion: [
          qa(
            "هل أحتاج Autofac أو container خارجي بدلاً من DI المدمج في ASP.NET Core؟",
            "DI المدمج كافٍ لمعظم Web APIs — يدعم Singleton/Scoped/Transient، keyed services (.NET 8)، و`IOptions`. Autofac يُستخدم عند حاجة advanced (conditional registration معقد، decorators). للمسار والمشاريع الصغيرة/متوسطة، built-in DI أبسط وموثّق جيداً — لا تُعقّد بدون سبب.",
            "Do I need Autofac or an external container instead of built-in ASP.NET Core DI?",
            "Built-in DI is enough for most Web APIs — it supports Singleton/Scoped/Transient, keyed services (.NET 8), and `IOptions`. Autofac is used when you need advanced features (complex conditional registration, decorators). For this track and small/medium projects, built-in DI is simpler and well documented — do not add complexity without reason.",
          ),
          qa(
            "ما هي Keyed services في .NET 8 ومتى أستخدمها؟",
            "`AddKeyedSingleton<ICache, RedisCache>(\"redis\")` يسجّل أكثر من implementation لنفس interface — تحلّ بالمفتاح عند inject. مفيد عند multiple databases أو payment providers. في Minimal APIs: `[FromKeyedServices(\"redis\")] ICache cache`. بديل: factories أو interfaces منفصلة — keyed أنظف عند implementations متعددة متشابهة.",
            "What are keyed services in .NET 8 and when should I use them?",
            "`AddKeyedSingleton<ICache, RedisCache>(\"redis\")` registers multiple implementations for the same interface — resolved by key on inject. Useful for multiple databases or payment providers. In Minimal APIs: `[FromKeyedServices(\"redis\")] ICache cache`. Alternative: factories or separate interfaces — keyed is cleaner when you have several similar implementations.",
          ),
          qa(
            "كيف أحقن dependency اختيارية — مثلاً خدمة analytics قد لا تكون مُسجّلة في Development؟",
            "خيارات: parameter nullable مع `[FromServices] IAnalytics? analytics` — null إذا غير مسجّل. أو سجّل `NullAnalytics` no-op implementation دائماً. أو factory يفحص `IServiceProvider`. تجنّب try/catch حول GetService — explicit optional أو default impl أوضح للقراءة والاختبار.",
            "How do I inject an optional dependency — e.g. analytics that may not be registered in Development?",
            "Options: nullable parameter with `[FromServices] IAnalytics? analytics` — null if not registered. Or register a `NullAnalytics` no-op implementation always. Or a factory checking `IServiceProvider`. Avoid try/catch around GetService — explicit optional or default impl is clearer for reading and testing.",
          ),
          qa(
            "كيف أستخدم Scoped services مثل DbContext داخل BackgroundService؟",
            "Hosted service عادة Singleton — **لا** تحقن DbContext في constructor. استخدم `IServiceScopeFactory.CreateScope()` داخل `ExecuteAsync` لكل job/message. `using var scope = ...` ثم `GetRequiredService<StudyDbContext>()`. هذا ينشئ scoped lifetime صحيح داخل background loop — pattern أساسي للworkers.",
            "How do I use Scoped services like DbContext inside a BackgroundService?",
            "Hosted services are usually Singleton — **do not** inject DbContext in the constructor. Use `IServiceScopeFactory.CreateScope()` inside `ExecuteAsync` per job/message. `using var scope = ...` then `GetRequiredService<StudyDbContext>()`. This creates a correct scoped lifetime inside the background loop — a core worker pattern.",
          ),
        ],
        exercises: {
          ar: ["Extension AddStudyServices", "Count Scoped resolves per request", "Replace service in test", "Document lifetimes"],
          en: ["Extension AddStudyServices", "Count Scoped resolves per request", "Replace service in test", "Document lifetimes"],
        },
        checklist: {
          ar: ["AddScoped/Singleton", "constructor injection", "lifetimes واضحة", "no captive dependency", "fake في test"],
          en: ["AddScoped/Singleton", "constructor injection", "clear lifetimes", "no captive dependency", "fake in test"],
        },
        nextHint: { ar: "التالي: Configuration وEnvironments.", en: "Next: Configuration and environments." },
      }),
      deepLesson({
        slug: "04-configuration",
        order: 4,
        duration: 42,
        title: { ar: "الإعدادات وEnvironments", en: "Configuration & environments" },
        summary: { ar: "IConfiguration، options pattern، User Secrets، وEnvironment variables", en: "IConfiguration, options pattern, User Secrets, and environment variables." },
        why: { ar: "Connection strings وJWT keys وfeature flags لا تُ hardcode — **IConfiguration** يقرأ appsettings، environment variables، User Secrets، Azure Key Vault. **Options pattern** `IOptions<JwtSettings>` typed وvalidated.\n\nASPNETCORE_ENVIRONMENT=Development يفعّل appsettings.Development.json. Production secrets عبر env vars أو vault. `[Required]` على options properties يفشل startup مبكراً — أفضل من null في runtime.", en: "Connection strings, JWT keys, and feature flags should not be hardcoded — **IConfiguration** reads appsettings, environment variables, User Secrets, Azure Key Vault. **Options pattern** `IOptions<JwtSettings>` is typed and validated.\n\nASPNETCORE_ENVIRONMENT=Development enables appsettings.Development.json. Production secrets via env vars or vault. `[Required]` on options properties fails startup early — better than null at runtime." },
        goals: {
          ar: ["قراءة IConfiguration[\"Key:Sub\"]", "Configure<T> وIOptions<T>", "User Secrets في Development", "Environment variables override"],
          en: ["Read IConfiguration[\"Key:Sub\"]", "Configure<T> and IOptions<T>", "User Secrets in Development", "Environment variables override"],
        },
        concepts: [
          concept(
            "Configuration providers",
            "ASP.NET Core يبني `IConfiguration` من **providers** مرتبة — الأخير يoverride السابق. الافتراضي: `appsettings.json`، `appsettings.{Environment}.json`، environment variables، command-line args. env vars تستخدم `__` للتداخل: `ConnectionStrings__Default`. User Secrets provider يُضاف في Development. Key Vault provider للإنتاج — secrets لا تدخل git أبداً.",
            "Configuration providers",
            "ASP.NET Core builds `IConfiguration` from ordered **providers** — later overrides earlier. Defaults: `appsettings.json`, `appsettings.{Environment}.json`, environment variables, command-line args. Env vars use `__` for nesting: `ConnectionStrings__Default`. User Secrets provider is added in Development. Key Vault provider for production — secrets never enter git.",
          ),
          concept(
            "Options pattern",
            "بدلاً من `config[\"Jwt:Key\"]` stringly-typed، عرّف `JwtSettings` class و`services.Configure<JwtSettings>(config.GetSection(\"Jwt\"))`. inject `IOptions<JwtSettings>` — `.Value` للقراءة. `IOptionsSnapshot` (scoped) يreload عند تغيير config. `IOptionsMonitor` callbacks عند reload. typed + testable + IntelliSense.",
            "Options pattern",
            "Instead of stringly-typed `config[\"Jwt:Key\"]`, define a `JwtSettings` class and `services.Configure<JwtSettings>(config.GetSection(\"Jwt\"))`. Inject `IOptions<JwtSettings>` — read via `.Value`. `IOptionsSnapshot` (scoped) reloads on config change. `IOptionsMonitor` gives reload callbacks. Typed, testable, IntelliSense-friendly.",
          ),
          concept(
            "Validation",
            "`.ValidateDataAnnotations()` يطبّق `[Required]`, `[Range]` على options class. `.ValidateOnStart()` يفشل startup إذا config ناقص — **fail fast** قبل أول request. أفضل من `NullReferenceException` في middleware JWT. custom `.Validate(o => o.Key.Length >= 32, \"Key too short\")` للقواعد الإضافية.",
            "Validation",
            "`.ValidateDataAnnotations()` applies `[Required]`, `[Range]` on the options class. `.ValidateOnStart()` fails startup if config is missing — **fail fast** before the first request. Better than `NullReferenceException` in JWT middleware. Custom `.Validate(o => o.Key.Length >= 32, \"Key too short\")` for extra rules.",
          ),
          concept(
            "Environments",
            "`ASPNETCORE_ENVIRONMENT` = Development | Staging | Production. `app.Environment.IsDevelopment()` يbranch سلوك — DeveloperExceptionPage vs generic errors. launchSettings يضبط Environment محلياً. CI/CD يضبط env var على الخادم. appsettings.Production.json للقيم غير السرية — secrets من env/vault.",
            "Environments",
            "`ASPNETCORE_ENVIRONMENT` = Development | Staging | Production. `app.Environment.IsDevelopment()` branches behavior — DeveloperExceptionPage vs generic errors. launchSettings sets Environment locally. CI/CD sets the env var on the server. appsettings.Production.json for non-secret values — secrets from env/vault.",
          )
        ],
        steps: {
          ar: ["JwtSettings class + section في appsettings", "Configure<JwtSettings> + ValidateOnStart", "dotnet user-secrets set", "env var override test", "IOptions في service", "Different appsettings per environment"],
          en: ["JwtSettings class + appsettings section", "Configure<JwtSettings> + ValidateOnStart", "dotnet user-secrets set", "env var override test", "IOptions in service", "Different appsettings per environment"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public class JwtSettings {\n  public const string Section = \"Jwt\";\n  [Required] public string Issuer { get; set; } = \"\";\n  [Required] public string Key { get; set; } = \"\";\n}\nbuilder.Services.AddOptions<JwtSettings>()\n  .Bind(builder.Configuration.GetSection(JwtSettings.Section))\n  .ValidateDataAnnotations()\n  .ValidateOnStart();",
            explain: "Options pattern مع validation — startup يفشل إذا Key ناقص.",
          },
          en: {
            lang: "csharp",
            source: "public class JwtSettings {\n  public const string Section = \"Jwt\";\n  [Required] public string Issuer { get; set; } = \"\";\n  [Required] public string Key { get; set; } = \"\";\n}\nbuilder.Services.AddOptions<JwtSettings>()\n  .Bind(builder.Configuration.GetSection(JwtSettings.Section))\n  .ValidateDataAnnotations()\n  .ValidateOnStart();",
            explain: "Options pattern with validation — startup fails if Key is missing.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["secrets في git", "User Secrets / CI variables"],
            en: ["secrets in git", "User Secrets / CI variables"],
          },
          {
            ar: ["IOptions singleton mutable state", "IOptionsMonitor للreload"],
            en: ["IOptions singleton mutable state", "IOptionsMonitor for reload"],
          },
          {
            ar: ["hardcoded connection string", "Configuration + env"],
            en: ["hardcoded connection string", "Configuration + env"],
          },
          {
            ar: ["wrong env name typo", "ASPNETCORE_ENVIRONMENT exact"],
            en: ["wrong env name typo", "ASPNETCORE_ENVIRONMENT exact"],
          },
        ]),
        discussion: [
          qa(
            "متى أستخدم IOptions مقابل IOptionsSnapshot مقابل IOptionsMonitor؟",
            "`IOptions<T>` singleton snapshot عند startup — كافٍ لـ JWT settings ثابتة. `IOptionsSnapshot<T>` scoped — يreload `appsettings.json` إذا `reloadOnChange: true` — مناسب per-request config. `IOptionsMonitor<T>` للcallbacks عند تغيير config runtime. لمعظم APIs: `IOptions` + env-specific files يكفي.",
            "When should I use IOptions vs IOptionsSnapshot vs IOptionsMonitor?",
            "`IOptions<T>` is a singleton snapshot at startup — enough for static JWT settings. `IOptionsSnapshot<T>` is scoped — reloads `appsettings.json` if `reloadOnChange: true` — good for per-request config. `IOptionsMonitor<T>` for callbacks on runtime config changes. For most APIs: `IOptions` + env-specific files is enough.",
          ),
          qa(
            "هل أضع appsettings.Production.json في git مع connection string فارغ؟",
            "نعم — structure وnon-secret defaults (log levels, feature flags). **لا** secrets — connection string placeholder أو فارغ، والقيمة الحقيقية من env var `ConnectionStrings__Default` في CI/CD. نفس pattern لـ Jwt:Key. document required env vars في README للdeploy.",
            "Should I commit appsettings.Production.json with an empty connection string?",
            "Yes — structure and non-secret defaults (log levels, feature flags). **No** secrets — connection string placeholder or empty, real value from env var `ConnectionStrings__Default` in CI/CD. Same pattern for Jwt:Key. Document required env vars in README for deploy.",
          ),
          qa(
            "كيف أربط Azure Key Vault بConfiguration في مشروع حقيقي؟",
            "Package `Azure.Extensions.AspNetCore.Configuration.Secrets` — `builder.Configuration.AddAzureKeyVault(new Uri(vaultUri), new DefaultAzureCredential())`. secrets في vault تُ mapped لkeys مثل `Jwt--Key`. Managed Identity في Azure App Service — لا hardcode credentials. للتعلّم: User Secrets locally، Key Vault في production deploy.",
            "How do I wire Azure Key Vault to Configuration in a real project?",
            "Package `Azure.Extensions.AspNetCore.Configuration.Secrets` — `builder.Configuration.AddAzureKeyVault(new Uri(vaultUri), new DefaultAzureCredential())`. Vault secrets map to keys like `Jwt--Key`. Managed Identity on Azure App Service — no hardcoded credentials. For learning: User Secrets locally, Key Vault on production deploy.",
          ),
          qa(
            "ما أفضل طريقة لـ feature flags — appsettings أم package منفصل؟",
            "بسيط: `FeatureFlags:NewDashboard: true` في appsettings + `IOptions<FeatureFlags>`. متقدم: `Microsoft.FeatureManagement` — percentage rollout، filters. للمسار: appsettings section كافٍ. في production كبير: Azure App Configuration أو LaunchDarkly — out of scope هنا.",
            "What is the best approach for feature flags — appsettings or a separate package?",
            "Simple: `FeatureFlags:NewDashboard: true` in appsettings + `IOptions<FeatureFlags>`. Advanced: `Microsoft.FeatureManagement` — percentage rollout, filters. For this track: appsettings section is enough. At large production scale: Azure App Configuration or LaunchDarkly — out of scope here.",
          )
        ],
        exercises: {
          ar: ["DatabaseOptions validated", "user-secrets init", "env override ConnectionStrings", "IsDevelopment branch"],
          en: ["DatabaseOptions validated", "user-secrets init", "env override ConnectionStrings", "IsDevelopment branch"],
        },
        checklist: {
          ar: ["IConfiguration keys", "Options + ValidateOnStart", "User Secrets", "env override", "no secrets in repo"],
          en: ["IConfiguration keys", "Options + ValidateOnStart", "User Secrets", "env override", "no secrets in repo"],
        },
        nextHint: { ar: "المرحلة التالية: Minimal APIs وبناء endpoints.", en: "Next stage: Minimal APIs and building endpoints." },
      })
    ],
  },
  "03-apis-mvc": {
    meta: {
      slug: "03-apis-mvc",
      order: 3,
      title: { ar: "Minimal APIs وMVC", en: "Minimal APIs & MVC" },
      description: { ar: "بناء endpoints، التحقق، وتنظيم الـ Controllers", en: "Building endpoints, validation, and controllers" },
      lessons: [
        "01-minimal-apis.json",
        "02-routing-model-binding.json",
        "03-validation.json",
        "04-controllers.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-minimal-apis",
        order: 1,
        duration: 45,
        title: { ar: "Minimal APIs", en: "Minimal APIs" },
        summary: { ar: "MapGet/Post/Put/Delete، Results، وTypedResults", en: "MapGet/Post/Put/Delete, Results, and TypedResults." },
        why: { ar: "Minimal APIs تربط routes مباشرة بـ handlers — بدون Controller classes. `app.MapGet(\"/lessons\", () => ...)`. مناسبة microservices وAPIs صغيرة/متوسطة. **Results** و**TypedResults** تحدد status codes وcontent types.\n\nHandlers يمكن inject services، bind parameters، return `Results.Ok(dto)` أو `Results.NotFound()`. OpenAPI/Swagger يولّد docs تلقائياً. ستبني CRUD كامل في هذا الدرس قبل MVC Controllers.", en: "Minimal APIs map routes directly to handlers — no Controller classes. `app.MapGet(\"/lessons\", () => ...)`. Great for microservices and small/medium APIs. **Results** and **TypedResults** define status codes and content types.\n\nHandlers can inject services, bind parameters, return `Results.Ok(dto)` or `Results.NotFound()`. OpenAPI/Swagger generates docs automatically. You will build full CRUD in this lesson before MVC Controllers." },
        goals: {
          ar: ["MapGet/Post/Put/Delete", "Results.Ok/NotFound/BadRequest", "Route groups MapGroup", "OpenAPI annotations"],
          en: ["MapGet/Post/Put/Delete", "Results.Ok/NotFound/BadRequest", "Route groups MapGroup", "OpenAPI annotations"],
        },
        concepts: [
          concept(
            "Route mapping",
            "`app.MapGet`, `MapPost`, `MapPut`, `MapDelete` تربط HTTP verb + path بـ handler delegate. route parameters: `{id:int}`, `{slug}`, `{*catchall}`. constraints تمنع match خاطئ. handler يمكن async ويرجع `Task<IResult>`. routing يحدث بعد `UseRouting` — بدون routing لا Map* يعمل.",
            "Route mapping",
            "`app.MapGet`, `MapPost`, `MapPut`, `MapDelete` bind HTTP verb + path to a handler delegate. Route parameters: `{id:int}`, `{slug}`, `{*catchall}`. Constraints block bad matches. Handlers can be async and return `Task<IResult>`. Routing runs after `UseRouting` — without routing, Map* does not work.",
          ),
          concept(
            "Results helpers",
            "`Results.Ok(dto)` → 200 JSON. `Results.NotFound()` → 404. `Results.Created($\"/lessons/{id}\", dto)` → 201 + Location. `Results.BadRequest()`, `Results.ValidationProblem(errors)` → 400 RFC 7807. `TypedResults` (.NET 7+) يحسّن OpenAPI inference — `Results<Ok<LessonDto>, NotFound>`.",
            "Results helpers",
            "`Results.Ok(dto)` → 200 JSON. `Results.NotFound()` → 404. `Results.Created($\"/lessons/{id}\", dto)` → 201 + Location. `Results.BadRequest()`, `Results.ValidationProblem(errors)` → 400 RFC 7807. `TypedResults` (.NET 7+) improves OpenAPI inference — `Results<Ok<LessonDto>, NotFound>`.",
          ),
          concept(
            "MapGroup",
            "`var api = app.MapGroup(\"/api/v1/lessons\").WithTags(\"Lessons\");` — prefix مشترك + Swagger tag. `.RequireAuthorization()` على المجموعة. `.WithOpenApi()` للmetadata. extension `MapLessonEndpoints(this RouteGroupBuilder group)` يبقي Program.cs نظيفاً — DRY للprefix والسياسات.",
            "MapGroup",
            "`var api = app.MapGroup(\"/api/v1/lessons\").WithTags(\"Lessons\");` — shared prefix + Swagger tag. `.RequireAuthorization()` on the group. `.WithOpenApi()` for metadata. Extension `MapLessonEndpoints(this RouteGroupBuilder group)` keeps Program.cs clean — DRY for prefix and policies.",
          ),
          concept(
            "Endpoint filters",
            ".NET 7+ `AddEndpointFilter` — pipeline حول handler محدد: validation، logging، timing. `filter.InvokeAsync(context, next)` مثل mini-middleware per route. `[Validate]` (.NET 8) يشغّل DataAnnotations تلقائياً. filters لا replace middleware العام — complementary.",
            "Endpoint filters",
            ".NET 7+ `AddEndpointFilter` — pipeline around a specific handler: validation, logging, timing. `filter.InvokeAsync(context, next)` like mini-middleware per route. `[Validate]` (.NET 8) runs DataAnnotations automatically. Filters do not replace global middleware — they complement it.",
          )
        ],
        steps: {
          ar: ["MapGroup /api/lessons", "GET list + GET by id", "POST create → Created", "PUT update + DELETE", "Swagger WithOpenApi", "Extension MapLessonEndpoints"],
          en: ["MapGroup /api/lessons", "GET list + GET by id", "POST create → Created", "PUT update + DELETE", "Swagger WithOpenApi", "Extension MapLessonEndpoints"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "var lessons = app.MapGroup(\"/api/lessons\").WithTags(\"Lessons\");\nlessons.MapGet(\"/\", async (ILessonService svc, CancellationToken ct) =>\n  Results.Ok(await svc.ListAsync(ct)));\nlessons.MapGet(\"/{id:int}\", async (int id, ILessonService svc, CancellationToken ct) => {\n  var item = await svc.GetAsync(id, ct);\n  return item is null ? Results.NotFound() : Results.Ok(item);\n});",
            explain: "MapGroup + async handlers + NotFound pattern — CRUD أساس.",
          },
          en: {
            lang: "csharp",
            source: "var lessons = app.MapGroup(\"/api/lessons\").WithTags(\"Lessons\");\nlessons.MapGet(\"/\", async (ILessonService svc, CancellationToken ct) =>\n  Results.Ok(await svc.ListAsync(ct)));\nlessons.MapGet(\"/{id:int}\", async (int id, ILessonService svc, CancellationToken ct) => {\n  var item = await svc.GetAsync(id, ct);\n  return item is null ? Results.NotFound() : Results.Ok(item);\n});",
            explain: "MapGroup + async handlers + NotFound pattern — basic CRUD.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["200 على NotFound", "Results.NotFound()"],
            en: ["200 on NotFound", "Results.NotFound()"],
          },
          {
            ar: ["كل routes في Program.cs", "MapGroup extensions"],
            en: ["All routes in Program.cs", "MapGroup extensions"],
          },
          {
            ar: ["نسيان WithTags", "Swagger organization"],
            en: ["Forgetting WithTags", "Swagger organization"],
          },
          {
            ar: ["sync I/O في handler", "async await"],
            en: ["sync I/O in handler", "async await"],
          },
        ]),
        discussion: [
          qa(
            "متى أختار Minimal APIs بدلاً من Controllers لمشروع API جديد؟",
            "Minimal APIs أسرع للبدء — أقل files، routing واضح في Program.cs أو extensions. Controllers أفضل لفرق كبيرة تحتاج conventions، filters معقدة، و separation واضح. للمسار وAPIs صغيرة/متوسطة Minimal مثالي. يمكنك الجمع — Minimal للhealth/public، Controllers لadmin domains.",
            "When should I choose Minimal APIs over Controllers for a new API project?",
            "Minimal APIs are faster to start — fewer files, clear routing in Program.cs or extensions. Controllers suit large teams needing conventions, complex filters, and clear separation. For this track and small/medium APIs, Minimal is ideal. You can mix — Minimal for health/public, Controllers for admin domains.",
          ),
          qa(
            "ما فائدة TypedResults مقابل Results العادية؟",
            "TypedResults (`TypedResults.Ok(dto)`) يُرجع types محددة — OpenAPI generator يعرف response schema بدقة (200 vs 404). `Results` العامة أحياناً تُنتج `200 | 404` union أضعف في Swagger. للـ APIs documented جيداً، TypedResults investment يستحق — expecially public APIs.",
            "What is the benefit of TypedResults vs regular Results?",
            "TypedResults (`TypedResults.Ok(dto)`) return concrete types — OpenAPI generator knows response schemas precisely (200 vs 404). Generic `Results` sometimes produce weaker `200 | 404` unions in Swagger. For well-documented APIs, TypedResults are worth it — especially public APIs.",
          ),
          qa(
            "كيف أنظم API versioning مع Minimal APIs؟",
            "شائع: `MapGroup(\"/api/v1\")` و`MapGroup(\"/api/v2\")` — groups منفصلة أو extension methods per version. header versioning (`Api-Version`) ممكن via filter. URL versioning أبسط للمتعلمين والSwagger. عند breaking change: v2 جديد، v1 deprecated period — document في OpenAPI.",
            "How do I organize API versioning with Minimal APIs?",
            "Common: `MapGroup(\"/api/v1\")` and `MapGroup(\"/api/v2\")` — separate groups or extension methods per version. Header versioning (`Api-Version`) is possible via filter. URL versioning is simpler for learners and Swagger. On breaking change: new v2, v1 deprecated period — document in OpenAPI.",
          ),
          qa(
            "هل يمكنني استخدام Minimal APIs وMVC Controllers في نفس المشروع؟",
            "نعم — hybrid شائع. `builder.Services.AddControllers()` + `app.MapControllers()` alongside `MapGet`/`MapGroup`. share نفس DI وDbContext. تجنّب duplicate routes على نفس path+verb. استخدم Minimal للبسيط، Controllers للdomains التي تحتاج `[Authorize]` filters معقدة أو convention-based routing.",
            "Can I use Minimal APIs and MVC Controllers in the same project?",
            "Yes — hybrid is common. `builder.Services.AddControllers()` + `app.MapControllers()` alongside `MapGet`/`MapGroup`. Share the same DI and DbContext. Avoid duplicate routes on the same path+verb. Use Minimal for simple routes, Controllers for domains needing complex `[Authorize]` filters or convention-based routing.",
          )
        ],
        exercises: {
          ar: ["CRUD كامل InMemory", "CreatedAtRoute", "Endpoint filter log", "OpenAPI description"],
          en: ["Full InMemory CRUD", "CreatedAtRoute", "Endpoint filter log", "OpenAPI description"],
        },
        checklist: {
          ar: ["MapGroup CRUD", "Results types", "async handlers", "Swagger tags", "extension method"],
          en: ["MapGroup CRUD", "Results types", "async handlers", "Swagger tags", "extension method"],
        },
        nextHint: { ar: "التالي: Routing وModel Binding.", en: "Next: Routing and model binding." },
      }),
      deepLesson({
        slug: "02-routing-model-binding",
        order: 2,
        duration: 40,
        title: { ar: "التوجيه وModel Binding", en: "Routing & model binding" },
        summary: { ar: "Route parameters، [FromBody]، query، headers", en: "Route parameters, [FromBody], query, headers." },
        why: { ar: "Model binding يحوّل HTTP إلى C# objects: route `{id}` → `int id`، query `?page=1` → `int page`، body JSON → DTO. `[AsParameters]` يجمع query params في record. فهم binding يقلل manual parsing.\n\nRoute constraints تمنع `/lessons/abc` من matching `{id:int}`. `[FromServices]` للDI. Custom binders نادر — defaults تغطي 95%. Validation يأتي في الدرس التالي.", en: "Model binding converts HTTP to C# objects: route `{id}` → `int id`, query `?page=1` → `int page`, body JSON → DTO. `[AsParameters]` groups query params into a record. Understanding binding reduces manual parsing.\n\nRoute constraints block `/lessons/abc` from matching `{id:int}`. `[FromServices]` for DI. Custom binders are rare — defaults cover 95%. Validation comes in the next lesson." },
        goals: {
          ar: ["Route templates وconstraints", "Bind query/route/body", "AsParameters record", "Optional parameters وdefaults"],
          en: ["Route templates and constraints", "Bind query/route/body", "AsParameters record", "Optional parameters and defaults"],
        },
        concepts: [
          concept(
            "Route templates",
            "templates `{id:int}`, `{slug:minlength(3)}`, `{*filepath}` — constraints على segments. ترتيب routes matters: specific قبل generic. optional parameters `{id?}`. link generation `Results.Created($\"/api/lessons/{id}\", ...)`. routing middleware يختار best match — conflicts → ambiguous match exception.",
            "Route templates",
            "Templates `{id:int}`, `{slug:minlength(3)}`, `{*filepath}` — constraints on segments. Route order matters: specific before generic. Optional parameters `{id?}`. Link generation `Results.Created($\"/api/lessons/{id}\", ...)`. Routing middleware picks best match — conflicts → ambiguous match exception.",
          ),
          concept(
            "Binding sources",
            "ASP.NET يستنتج المصدر: route `{id}` → parameter `int id`. query `?page=1` → `int page`. POST JSON body → complex type DTO. `[FromHeader]`, `[FromForm]` explicit عند ambiguity. GET لا يجب أن يستخدم `[FromBody]` — HTTP spec discourages body on GET.",
            "Binding sources",
            "ASP.NET infers source: route `{id}` → parameter `int id`. Query `?page=1` → `int page`. POST JSON body → complex type DTO. `[FromHeader]`, `[FromForm]` explicit when ambiguous. GET should not use `[FromBody]` — HTTP spec discourages body on GET.",
          ),
          concept(
            "AsParameters",
            "`record LessonQuery(int Page = 1, int Size = 20, string? Search = null)` مع `[AsParameters]` على GET — يجمع query params في record واحد. defaults للoptional. أنظف من 5 parameters منفصلة. works مع Minimal APIs وControllers. validation على record properties via `[Validate]` أو FluentValidation.",
            "AsParameters",
            "`record LessonQuery(int Page = 1, int Size = 20, string? Search = null)` with `[AsParameters]` on GET — groups query params into one record. Defaults for optional fields. Cleaner than five separate parameters. Works with Minimal APIs and Controllers. Validate record properties via `[Validate]` or FluentValidation.",
          ),
          concept(
            "Complex types",
            "JSON body deserializes إلى DTO — System.Text.Json default. `[FromBody] CreateLessonDto dto` on POST/PUT. `[FromForm]` for multipart uploads. `[AsParameters]` **not** for body — for query/route. binding failure → automatic 400 with ProblemDetails under `[ApiController]`.",
            "Complex types",
            "JSON body deserializes to DTO — System.Text.Json default. `[FromBody] CreateLessonDto dto` on POST/PUT. `[FromForm]` for multipart uploads. `[AsParameters]` **not** for body — for query/route. Binding failure → automatic 400 with ProblemDetails under `[ApiController]`.",
          )
        ],
        steps: {
          ar: ["GET with query Page/Size", "POST [FromBody] DTO", "Route constraint guid", "AsParameters record", "Header binding", "Test wrong type → 400"],
          en: ["GET with query Page/Size", "POST [FromBody] DTO", "Route constraint guid", "AsParameters record", "Header binding", "Test wrong type → 400"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public record LessonQuery(int Page = 1, int Size = 20, string? Search = null);\n\napp.MapGet(\"/search\", ( [AsParameters] LessonQuery q, ILessonService svc) =>\n  svc.SearchAsync(q));\n\napp.MapPost(\"/\", async (CreateLessonDto dto, ILessonService svc, CancellationToken ct) => {\n  var created = await svc.CreateAsync(dto, ct);\n  return Results.Created($\"/api/lessons/{created.Id}\", created);\n});",
            explain: "AsParameters للquery + FromBody implicit على POST DTO.",
          },
          en: {
            lang: "csharp",
            source: "public record LessonQuery(int Page = 1, int Size = 20, string? Search = null);\n\napp.MapGet(\"/search\", ( [AsParameters] LessonQuery q, ILessonService svc) =>\n  svc.SearchAsync(q));\n\napp.MapPost(\"/\", async (CreateLessonDto dto, ILessonService svc, CancellationToken ct) => {\n  var created = await svc.CreateAsync(dto, ct);\n  return Results.Created($\"/api/lessons/{created.Id}\", created);\n});",
            explain: "AsParameters for query + implicit FromBody on POST DTO.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["[FromBody] على GET", "GET لا body — use query"],
            en: ["[FromBody] on GET", "GET has no body — use query"],
          },
          {
            ar: ["nullable reference binding", "required + validation"],
            en: ["nullable reference binding", "required + validation"],
          },
          {
            ar: ["route order conflicts", "specific before generic"],
            en: ["route order conflicts", "specific before generic"],
          },
          {
            ar: ["manual int.Parse", "let binding fail → 400"],
            en: ["manual int.Parse", "let binding fail → 400"],
          },
        ]),
        discussion: [
          qa(
            "متى أستخدم [FromServices] بدلاً من parameter injection العادي؟",
            "نادر — عند conflict بين route parameter name وservice type، أو binding ambiguity. `[FromServices] ILessonService svc` explicit. في Minimal APIs معظم services تُحقن بدون attribute — container recognizes them. `[FromServices]` useful في Controllers عند multiple complex parameters.",
            "When should I use [FromServices] instead of normal parameter injection?",
            "Rare — when route parameter name conflicts with service type, or binding ambiguity. `[FromServices] ILessonService svc` is explicit. In Minimal APIs most services inject without attribute — container recognizes them. `[FromServices]` is useful in Controllers with multiple complex parameters.",
          ),
          qa(
            "هل record DTOs تعمل مع model binding مثل classes؟",
            "نعم — positional records `record CreateLessonDto(string Title, int Duration)` وproperty records both bind from JSON. System.Text.Json يmatch property names case-insensitive default. required properties في C# 11 — missing → validation error. records immutable-friendly — good for API contracts.",
            "Do record DTOs work with model binding like classes?",
            "Yes — positional records `record CreateLessonDto(string Title, int Duration)` and property records both bind from JSON. System.Text.Json matches property names case-insensitively by default. C# 11 required properties — missing → validation error. Records are immutable-friendly — good for API contracts.",
          ),
          qa(
            "كيف أربط array من query parameters مثل ?ids=1&ids=2&ids=3؟",
            "parameter `int[] ids` أو `List<int> ids` — ASP.NET يجمع repeated keys. `?ids=1,2,3` also works with custom binder sometimes — repeated keys more standard. for large lists prefer POST search endpoint — URL length limits. test in Swagger query UI.",
            "How do I bind an array from query parameters like ?ids=1&ids=2&ids=3?",
            "Parameter `int[] ids` or `List<int> ids` — ASP.NET collects repeated keys. `?ids=1,2,3` also works with custom binder sometimes — repeated keys are more standard. For large lists prefer POST search endpoint — URL length limits. Test in Swagger query UI.",
          ),
          qa(
            "متى أكتب Custom ModelBinder — IModelBinder؟",
            "Last resort — when default binding fails: custom date format, composite keys, unusual query encoding. `[ModelBinder(BinderType = typeof(MyBinder))]`. most apps never need it — `[AsParameters]`, enums, `DateOnly`, `Guid` work out of box. try conventions first — custom binders add maintenance.",
            "When should I write a custom ModelBinder — IModelBinder?",
            "Last resort — when default binding fails: custom date format, composite keys, unusual query encoding. `[ModelBinder(BinderType = typeof(MyBinder))]`. Most apps never need it — `[AsParameters]`, enums, `DateOnly`, `Guid` work out of the box. Try conventions first — custom binders add maintenance.",
          )
        ],
        exercises: {
          ar: ["Paged list query", "Guid route id", "Enum binding", "DateOnly query"],
          en: ["Paged list query", "Guid route id", "Enum binding", "DateOnly query"],
        },
        checklist: {
          ar: ["route constraints", "query + body bind", "AsParameters", "400 on bad bind", "Created location"],
          en: ["route constraints", "query + body bind", "AsParameters", "400 on bad bind", "Created location"],
        },
        nextHint: { ar: "التالي: Validation — FluentValidation/DataAnnotations.", en: "Next: Validation — FluentValidation/DataAnnotations." },
      }),
      deepLesson({
        slug: "03-validation",
        order: 3,
        duration: 42,
        title: { ar: "التحقق من المدخلات", en: "Input validation" },
        summary: { ar: "DataAnnotations، FluentValidation، وValidationProblem", en: "DataAnnotations, FluentValidation, and ValidationProblem." },
        why: { ar: "Never trust client input — validate DTOs before DB. **DataAnnotations** `[Required]`, `[MaxLength]`, `[EmailAddress]`. **FluentValidation** rules أغنى وtestable. Minimal APIs: `.AddEndpointFilter<ValidationFilter>()` أو `[Validate]` (.NET 8+).\n\nReturn `Results.ValidationProblem(errors)` → 400 + RFC 7807 ProblemDetails. Server-side validation complements client — لا replace. EF Core لا يvalidate business rules — application layer does.", en: "Never trust client input — validate DTOs before DB. **DataAnnotations** `[Required]`, `[MaxLength]`, `[EmailAddress]`. **FluentValidation** richer, testable rules. Minimal APIs: `.AddEndpointFilter<ValidationFilter>()` or `[Validate]` (.NET 8+).\n\nReturn `Results.ValidationProblem(errors)` → 400 + RFC 7807 ProblemDetails. Server-side validation complements client — does not replace. EF Core does not validate business rules — application layer does." },
        goals: {
          ar: ["DataAnnotations على DTOs", "FluentValidation validator class", "ValidationProblem response", "ValidateOnStart للoptions"],
          en: ["DataAnnotations on DTOs", "FluentValidation validator class", "ValidationProblem response", "ValidateOnStart for options"],
        },
        concepts: [
          concept(
            "DataAnnotations",
            "`[Required]`, `[StringLength(200)]`, `[EmailAddress]`, `[Range(1,500)]` على DTO properties — validated by ASP.NET model validation. `IValidatableObject` لcross-field rules (EndDate > StartDate). lightweight — no extra package. `[ApiController]` returns 400 automatically. annotations on **DTOs** not EF entities.",
            "DataAnnotations",
            "`[Required]`, `[StringLength(200)]`, `[EmailAddress]`, `[Range(1,500)]` on DTO properties — validated by ASP.NET model validation. `IValidatableObject` for cross-field rules (EndDate > StartDate). Lightweight — no extra package. `[ApiController]` returns 400 automatically. Annotations on **DTOs** not EF entities.",
          ),
          concept(
            "FluentValidation",
            "`AbstractValidator<CreateLessonDto>` — `RuleFor(x => x.Title).NotEmpty().MaximumLength(200)`. rules في class منفصل — **testable** unit tests without HTTP. `AddValidatorsFromAssemblyContaining<>()`. async rules `MustAsync` for DB uniqueness. `.AspNetCore` integration auto-runs on MVC — Minimal needs filter or manual `ValidateAsync`.",
            "FluentValidation",
            "`AbstractValidator<CreateLessonDto>` — `RuleFor(x => x.Title).NotEmpty().MaximumLength(200)`. Rules in separate class — **testable** unit tests without HTTP. `AddValidatorsFromAssemblyContaining<>()`. Async rules `MustAsync` for DB uniqueness. `.AspNetCore` integration auto-runs on MVC — Minimal needs filter or manual `ValidateAsync`.",
          ),
          concept(
            "ProblemDetails",
            "RFC 7807 — `Results.ValidationProblem(errors)` → 400 JSON `{ type, title, errors: { Title: [\"...\"] } }`. consistent error shape للclients. `[ApiController]` automatic for model state. custom `ProblemDetails` factory for 404/409. Angular client can parse `errors` dictionary for form display.",
            "ProblemDetails",
            "RFC 7807 — `Results.ValidationProblem(errors)` → 400 JSON `{ type, title, errors: { Title: [\"...\"] } }`. Consistent error shape for clients. `[ApiController]` automatic for model state. Custom `ProblemDetails` factory for 404/409. Angular client can parse `errors` dictionary for form display.",
          ),
          concept(
            "Business validation",
            "rules needing DB: duplicate slug → service checks → `Results.Conflict()`. not DataAnnotations — race conditions need DB constraint too. separation: **input validation** (shape) vs **business rules** (domain). FluentValidation `MustAsync` blurs line — OK for simple uniqueness. complex domain → domain service.",
            "Business validation",
            "Rules needing DB: duplicate slug → service checks → `Results.Conflict()`. Not DataAnnotations — race conditions need DB constraint too. Separation: **input validation** (shape) vs **business rules** (domain). FluentValidation `MustAsync` blurs the line — OK for simple uniqueness. Complex domain → domain service.",
          )
        ],
        steps: {
          ar: ["Annotations على CreateLessonDto", "Install FluentValidation.AspNetCore", "Write CreateLessonValidator", "Endpoint returns ValidationProblem", "Unit test validator", "409 for duplicate slug in service"],
          en: ["Annotations on CreateLessonDto", "Install FluentValidation.AspNetCore", "Write CreateLessonValidator", "Endpoint returns ValidationProblem", "Unit test validator", "409 for duplicate slug in service"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public class CreateLessonDto {\n  [Required, StringLength(200)] public string Title { get; set; } = \"\";\n  [Range(5, 120)] public int Duration { get; set; }\n}\n\npublic class CreateLessonValidator : AbstractValidator<CreateLessonDto> {\n  public CreateLessonValidator() {\n    RuleFor(x => x.Title).NotEmpty().MaximumLength(200);\n    RuleFor(x => x.Duration).InclusiveBetween(5, 120);\n  }\n}",
            explain: "FluentValidation rules — testable independently from endpoints.",
          },
          en: {
            lang: "csharp",
            source: "public class CreateLessonDto {\n  [Required, StringLength(200)] public string Title { get; set; } = \"\";\n  [Range(5, 120)] public int Duration { get; set; }\n}\n\npublic class CreateLessonValidator : AbstractValidator<CreateLessonDto> {\n  public CreateLessonValidator() {\n    RuleFor(x => x.Title).NotEmpty().MaximumLength(200);\n    RuleFor(x => x.Duration).InclusiveBetween(5, 120);\n  }\n}",
            explain: "FluentValidation rules — testable independently from endpoints.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["validation فقط client-side", "always server-side"],
            en: ["client-only validation", "always server-side"],
          },
          {
            ar: ["500 on validation fail", "return 400 ValidationProblem"],
            en: ["500 on validation fail", "return 400 ValidationProblem"],
          },
          {
            ar: ["annotations على entities", "validate DTOs not EF entities"],
            en: ["annotations on entities", "validate DTOs not EF entities"],
          },
          {
            ar: ["duplicate rules scattered", "centralize validators"],
            en: ["duplicate rules scattered", "centralize validators"],
          },
        ]),
        discussion: [
          qa(
            "FluentValidation أم DataAnnotations — أيهما أختار لمشروع API؟",
            "DataAnnotations للـ simple required/length/range — zero dependency. FluentValidation when rules grow: conditional rules, async DB checks, readable RuleFor chains, dedicated validator tests. many teams: annotations on DTO for basics + FluentValidation for complex Create/Update DTOs. don't duplicate same rule in both.",
            "FluentValidation or DataAnnotations — which should I pick for an API project?",
            "DataAnnotations for simple required/length/range — zero dependency. FluentValidation when rules grow: conditional rules, async DB checks, readable RuleFor chains, dedicated validator tests. Many teams: annotations on DTO for basics + FluentValidation for complex Create/Update DTOs. Don't duplicate the same rule in both.",
          ),
          qa(
            "كيف أفعّل validation على Minimal API endpoints؟",
            ".NET 8+: `[Validate]` attribute on handler parameters. أو `AddEndpointFilter<ValidationFilter>` يinject `IValidator<T>` وreturn ValidationProblem. manual: `var result = await validator.ValidateAsync(dto); if (!result.IsValid) return Results.ValidationProblem(...)`. same FluentValidation validators as MVC — reuse.",
            "How do I enable validation on Minimal API endpoints?",
            ".NET 8+: `[Validate]` attribute on handler parameters. Or `AddEndpointFilter<ValidationFilter>` injects `IValidator<T>` and returns ValidationProblem. Manual: `var result = await validator.ValidateAsync(dto); if (!result.IsValid) return Results.ValidationProblem(...)`. Same FluentValidation validators as MVC — reuse.",
          ),
          qa(
            "كيف أ localize رسائل validation للعربية والإنجليزية؟",
            "FluentValidation: inject `IStringLocalizer<CreateLessonValidator>` — `WithMessage(localizer[\"TitleRequired\"])`. DataAnnotations: `[Required(ErrorMessage = \"...\")]` static — or data annotations localization via `IValidationMetadataProvider`. API often returns error **codes** keys — client translates. bilingual platform: consistent error keys in JSON.",
            "How do I localize validation messages for Arabic and English?",
            "FluentValidation: inject `IStringLocalizer<CreateLessonValidator>` — `WithMessage(localizer[\"TitleRequired\"])`. DataAnnotations: `[Required(ErrorMessage = \"...\")]` static — or data annotations localization via `IValidationMetadataProvider`. APIs often return error **codes** keys — client translates. Bilingual platform: consistent error keys in JSON.",
          ),
          qa(
            "ما معنى ValidateNever attribute ومتى أستخدمه؟",
            "`[ValidateNever]` على navigation property أو parameter — skip validation. useful for EF navigation props accidentally exposed on DTO (anti-pattern anyway). or trusted server-side populated fields. rare in well-designed DTOs — prefer separate Create/Read DTOs without navigations.",
            "What does the ValidateNever attribute mean and when should I use it?",
            "`[ValidateNever]` on navigation property or parameter — skip validation. Useful for EF navigation props accidentally exposed on DTO (anti-pattern anyway). Or trusted server-side populated fields. Rare in well-designed DTOs — prefer separate Create/Read DTOs without navigations.",
          )
        ],
        exercises: {
          ar: ["Validator unit tests", "Custom RuleFor async", "ProblemDetails shape", "IValidatableObject cross-field"],
          en: ["Validator unit tests", "Custom RuleFor async", "ProblemDetails shape", "IValidatableObject cross-field"],
        },
        checklist: {
          ar: ["DTO validated", "FluentValidation registered", "400 ProblemDetails", "business rules in service", "validator tests"],
          en: ["DTO validated", "FluentValidation registered", "400 ProblemDetails", "business rules in service", "validator tests"],
        },
        nextHint: { ar: "التالي: MVC Controllers وAction Results.", en: "Next: MVC Controllers and action results." },
      }),
      deepLesson({
        slug: "04-controllers",
        order: 4,
        duration: 48,
        title: { ar: "Controllers وAction Results", en: "Controllers & action results" },
        summary: { ar: "ControllerBase، IActionResult، ApiController attribute", en: "ControllerBase, IActionResult, ApiController attribute." },
        why: { ar: "MVC Controllers تنظم endpoints في classes — `[ApiController]`, `[Route(\"api/[controller]\")]`. `[HttpGet(\"{id}\")]` methods return `ActionResult<LessonDto>`. مفيد للفرق الكبيرة، filters، وconventions.\n\nيمكن الجمع: Minimal APIs للبسيط، Controllers للdomains مع complext filters. `ProblemDetails` automatic with `[ApiController]`. هذا الدرس ي complete صورة APIs قبل EF Core.", en: "MVC Controllers organize endpoints in classes — `[ApiController]`, `[Route(\"api/[controller]\")]`. `[HttpGet(\"{id}\")]` methods return `ActionResult<LessonDto>`. Great for large teams, filters, and conventions.\n\nYou can mix: Minimal APIs for simple routes, Controllers for domains with complex filters. `[ApiController]` enables automatic ProblemDetails. This lesson completes the API picture before EF Core." },
        goals: {
          ar: ["Create ApiController", "ActionResult<T> Ok/NotFound", "Model binding في actions", "Filters preview [Authorize]"],
          en: ["Create ApiController", "ActionResult<T> Ok/NotFound", "Model binding in actions", "Filters preview [Authorize]"],
        },
        concepts: [
          concept(
            "Controller structure",
            "`[ApiController]` `[Route(\"api/[controller]\")]` — class `LessonsController : ControllerBase`. **not** `Controller` (views). primary constructor DI (C# 12): `LessonsController(ILessonService svc)`. actions are public methods. `[controller]` token → `Lessons` from class name. version prefix: `[Route(\"api/v1/[controller]\")`.",
            "Controller structure",
            "`[ApiController]` `[Route(\"api/[controller]\")]` — class `LessonsController : ControllerBase`. **Not** `Controller` (views). Primary constructor DI (C# 12): `LessonsController(ILessonService svc)`. Actions are public methods. `[controller]` token → `Lessons` from class name. Version prefix: `[Route(\"api/v1/[controller]\")]`.",
          ),
          concept(
            "Action results",
            "`ActionResult<LessonDto>` — union typed response for OpenAPI. `return Ok(dto);` `return NotFound();` `return CreatedAtAction(nameof(Get), new { id }, dto);`. ` IActionResult` untyped — prefer generic. `Problem()` for errors. async `Task<ActionResult<T>>` — always await I/O.",
            "Action results",
            "`ActionResult<LessonDto>` — union typed response for OpenAPI. `return Ok(dto);` `return NotFound();` `return CreatedAtAction(nameof(Get), new { id }, dto);`. ` IActionResult` untyped — prefer generic. `Problem()` for errors. Async `Task<ActionResult<T>>` — always await I/O.",
          ),
          concept(
            "ApiController behavior",
            "automatic **400** on model validation failure — no manual ModelState check. binding source inference: complex type from body on POST. `[FromBody]` inferred. problem details default. attribute routing required — no conventional `{action}` routes by default. opinionated for APIs — less boilerplate.",
            "ApiController behavior",
            "Automatic **400** on model validation failure — no manual ModelState check. Binding source inference: complex type from body on POST. `[FromBody]` inferred. Problem details default. Attribute routing required — no conventional `{action}` routes by default. Opinionated for APIs — less boilerplate.",
          ),
          concept(
            "Filters",
            "Action filters (`IActionFilter`), exception filters, authorization filters — MVC pipeline after routing. `[ServiceFilter(typeof(MyFilter))]` registered in DI. `[Authorize]` is authorization filter. cross-cutting per controller/action — logging, caching. middleware = global; filters = MVC-specific granularity.",
            "Filters",
            "Action filters (`IActionFilter`), exception filters, authorization filters — MVC pipeline after routing. `[ServiceFilter(typeof(MyFilter))]` registered in DI. `[Authorize]` is authorization filter. Cross-cutting per controller/action — logging, caching. Middleware = global; filters = MVC-specific granularity.",
          )
        ],
        steps: {
          ar: ["AddControllers + MapControllers", "LessonsController CRUD", "ActionResult<T> returns", "CreatedAtAction", "Compare same CRUD Minimal vs Controller", "Swagger discovers controllers"],
          en: ["AddControllers + MapControllers", "LessonsController CRUD", "ActionResult<T> returns", "CreatedAtAction", "Compare same CRUD Minimal vs Controller", "Swagger discovers controllers"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "[ApiController]\n[Route(\"api/[controller]\")]\npublic class LessonsController(ILessonService svc) : ControllerBase {\n  [HttpGet(\"{id:int}\")]\n  public async Task<ActionResult<LessonDto>> Get(int id, CancellationToken ct) {\n    var item = await svc.GetAsync(id, ct);\n    return item is null ? NotFound() : Ok(item);\n  }\n  [HttpPost]\n  public async Task<ActionResult<LessonDto>> Create(CreateLessonDto dto, CancellationToken ct) {\n    var created = await svc.CreateAsync(dto, ct);\n    return CreatedAtAction(nameof(Get), new { id = created.Id }, created);\n  }\n}",
            explain: "Primary constructor DI + ActionResult<T> — نمط MVC API حديث.",
          },
          en: {
            lang: "csharp",
            source: "[ApiController]\n[Route(\"api/[controller]\")]\npublic class LessonsController(ILessonService svc) : ControllerBase {\n  [HttpGet(\"{id:int}\")]\n  public async Task<ActionResult<LessonDto>> Get(int id, CancellationToken ct) {\n    var item = await svc.GetAsync(id, ct);\n    return item is null ? NotFound() : Ok(item);\n  }\n  [HttpPost]\n  public async Task<ActionResult<LessonDto>> Create(CreateLessonDto dto, CancellationToken ct) {\n    var created = await svc.CreateAsync(dto, ct);\n    return CreatedAtAction(nameof(Get), new { id = created.Id }, created);\n  }\n}",
            explain: "Primary constructor DI + ActionResult<T> — modern MVC API pattern.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["Controller + Minimal duplicate routes", "choose one per resource"],
            en: ["Controller + Minimal duplicate routes", "choose one per resource"],
          },
          {
            ar: ["return entity not DTO", "map to DTO"],
            en: ["return entity not DTO", "map to DTO"],
          },
          {
            ar: ["forget [ApiController]", "lose automatic 400 behavior"],
            en: ["forget [ApiController]", "lose automatic 400 behavior"],
          },
          {
            ar: [" IActionResult without typed", "prefer ActionResult<T> for OpenAPI"],
            en: ["IActionResult without typed", "prefer ActionResult<T> for OpenAPI"],
          },
        ]),
        discussion: [
          qa(
            "في أي situation أ favor Controllers على Minimal APIs في فريق حقيقي؟",
            "Large teams: file-per-resource familiar structure, `[Authorize]` on controller level, filter pipelines, convention over configuration. many junior devs know MVC. complex content negotiation. Minimal wins for microservices and small teams wanting less ceremony. capstone: pick one style per resource area — consistency beats debate.",
            "In what situation would I favor Controllers over Minimal APIs on a real team?",
            "Large teams: file-per-resource familiar structure, `[Authorize]` at controller level, filter pipelines, convention over configuration. Many junior devs know MVC. Complex content negotiation. Minimal wins for microservices and small teams wanting less ceremony. Capstone: pick one style per resource area — consistency beats debate.",
          ),
          qa(
            "هل ControllerBase يدعم Views أم API فقط؟",
            "`ControllerBase` — API only, no View()/ViewResult helpers. `Controller` inherits ControllerBase + view support for Razor MVC. Web API projects use **ControllerBase** exclusively. mixing Razor Pages + API in one project possible — separate folders and pipeline branches.",
            "Does ControllerBase support Views or API only?",
            "`ControllerBase` — API only, no View()/ViewResult helpers. `Controller` inherits ControllerBase + view support for Razor MVC. Web API projects use **ControllerBase** exclusively. Mixing Razor Pages + API in one project is possible — separate folders and pipeline branches.",
          ),
          qa(
            "Primary constructor على Controller — هل هو best practice الآن؟",
            "C# 12 primary constructors: `public class LessonsController(ILessonService svc) : ControllerBase` — concise DI, compiler creates ctor. widely adopted in new ASP.NET templates. equivalent to explicit constructor field assignment. works with `[ApiController]` and all attributes. readable — prefer for new code.",
            "Primary constructor on Controller — is it best practice now?",
            "C# 12 primary constructors: `public class LessonsController(ILessonService svc) : ControllerBase` — concise DI, compiler creates ctor. Widely adopted in new ASP.NET templates. Equivalent to explicit constructor field assignment. Works with `[ApiController]` and all attributes. Readable — prefer for new code.",
          ),
          qa(
            "هل Minimal APIs ستحل محل MVC Controllers بالكامل؟",
            "No — coexist long-term. Microsoft invests in both. Minimal for speed and microservices; Controllers for enterprise MVC patterns, Razor integration, complex filter graphs. hybrid apps common. learn both — choose per project constraints, not hype.",
            "Will Minimal APIs completely replace MVC Controllers?",
            "No — they coexist long-term. Microsoft invests in both. Minimal for speed and microservices; Controllers for enterprise MVC patterns, Razor integration, complex filter graphs. Hybrid apps are common. Learn both — choose per project constraints, not hype.",
          )
        ],
        exercises: {
          ar: ["Full LessonsController", "CreatedAtAction", "Route on action", "Exception filter stub"],
          en: ["Full LessonsController", "CreatedAtAction", "Route on action", "Exception filter stub"],
        },
        checklist: {
          ar: ["ApiController works", "ActionResult<T>", "MapControllers", "no route clash", "Swagger OK"],
          en: ["ApiController works", "ActionResult<T>", "MapControllers", "no route clash", "Swagger OK"],
        },
        nextHint: { ar: "المرحلة التالية: Entity Framework Core.", en: "Next stage: Entity Framework Core." },
      })
    ],
  },
  "04-ef-core": {
    meta: {
      slug: "04-ef-core",
      order: 4,
      title: { ar: "Entity Framework Core", en: "Entity Framework Core" },
      description: { ar: "النماذج، DbContext، الهجرات، والاستعلامات", en: "Models, DbContext, migrations, and queries" },
      lessons: [
        "01-dbcontext.json",
        "02-migrations.json",
        "03-relationships.json",
        "04-querying.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-dbcontext",
        order: 1,
        duration: 48,
        title: { ar: "DbContext والنماذج", en: "DbContext & models" },
        summary: { ar: "DbContext، DbSet، entity classes، وDI registration", en: "DbContext, DbSet, entity classes, and DI registration." },
        why: { ar: "Entity Framework Core هو ORM — يربط C# classes بجداول SQL. **DbContext** هو session للDB: `DbSet<Lesson> Lessons`. `dotnet ef` tools للmigrations. AddDbContext في DI — Scoped per request.\n\nEntities ≠ DTOs — entities have navigation properties وEF tracking. DbContext thread-safe? **No** — one per request. InMemory provider للtests — SQL Server/SQLite للdev/prod.", en: "Entity Framework Core is the ORM — maps C# classes to SQL tables. **DbContext** is the DB session: `DbSet<Lesson> Lessons`. `dotnet ef` tools for migrations. AddDbContext in DI — Scoped per request.\n\nEntities ≠ DTOs — entities have navigation properties and EF tracking. DbContext thread-safe? **No** — one per request. InMemory provider for tests — SQL Server/SQLite for dev/prod." },
        goals: {
          ar: ["Install EF Core packages", "Define entity + DbContext", "AddDbContext SQL Server/SQLite", "First query ToListAsync"],
          en: ["Install EF Core packages", "Define entity + DbContext", "AddDbContext SQL Server/SQLite", "First query ToListAsync"],
        },
        concepts: [
          concept(
            "Entity classes",
            "POCO classes تمثل جداول — `public class Lesson { public int Id { get; set; } public string Title { get; set; } = \"\"; }`. conventions: `Id` أو `LessonId` = primary key. properties map لcolumns. navigation properties للrelationships (لاحقاً). entities **ليست** DTOs — EF tracking يضيف state. لا `[JsonIgnore]` hacks — map to DTO at API boundary.",
            "Entity classes",
            "POCO classes represent tables — `public class Lesson { public int Id { get; set; } public string Title { get; set; } = \"\"; }`. Conventions: `Id` or `LessonId` = primary key. Properties map to columns. Navigation properties for relationships (later). Entities are **not** DTOs — EF tracking adds state. No `[JsonIgnore]` hacks — map to DTO at API boundary.",
          ),
          concept(
            "DbContext",
            "`StudyDbContext : DbContext` — gateway للDB. `DbSet<Lesson> Lessons => Set<Lesson>();` — queryable table. `DbContextOptions<T>` injected via constructor. `OnModelCreating` للFluent config. **Scoped** lifetime — one per HTTP request. **not thread-safe** — never share across threads or singleton service.",
            "DbContext",
            "`StudyDbContext : DbContext` — gateway to the DB. `DbSet<Lesson> Lessons => Set<Lesson>();` — queryable table. `DbContextOptions<T>` injected via constructor. `OnModelCreating` for Fluent config. **Scoped** lifetime — one per HTTP request. **Not thread-safe** — never share across threads or singleton service.",
          ),
          concept(
            "Registration",
            "`builder.Services.AddDbContext<StudyDbContext>(o => o.UseSqlite(connectionString));` — registers Scoped. providers: SQL Server, SQLite, PostgreSQL (Npgsql), InMemory (tests). `AddDbContextPool` reuses internal state — performance for high traffic. connection string from `IConfiguration` — never hardcode.",
            "Registration",
            "`builder.Services.AddDbContext<StudyDbContext>(o => o.UseSqlite(connectionString));` — registers Scoped. Providers: SQL Server, SQLite, PostgreSQL (Npgsql), InMemory (tests). `AddDbContextPool` reuses internal state — performance for high traffic. Connection string from `IConfiguration` — never hardcode.",
          ),
          concept(
            "Fluent API preview",
            "`OnModelCreating(ModelBuilder modelBuilder)` — `entity.Property(x => x.Title).HasMaxLength(200).IsRequired();` indexes, keys, relationships. overrides conventions explicitly. migrations reflect Fluent + conventions. lesson 03-relationships expands HasOne/WithMany. data annotations on entities possible but Fluent preferred for config centralization.",
            "Fluent API preview",
            "`OnModelCreating(ModelBuilder modelBuilder)` — `entity.Property(x => x.Title).HasMaxLength(200).IsRequired();` indexes, keys, relationships. Overrides conventions explicitly. Migrations reflect Fluent + conventions. Lesson 03-relationships expands HasOne/WithMany. Data annotations on entities possible but Fluent preferred for centralized config.",
          )
        ],
        steps: {
          ar: ["dotnet add package EF Sqlite + Design", "Lesson entity + StudyDbContext", "Connection string appsettings", "AddDbContext Program.cs", "Inject context in service", "await context.Lessons.ToListAsync()"],
          en: ["dotnet add package EF Sqlite + Design", "Lesson entity + StudyDbContext", "Connection string appsettings", "AddDbContext Program.cs", "Inject context in service", "await context.Lessons.ToListAsync()"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public class StudyDbContext(DbContextOptions<StudyDbContext> options) : DbContext(options) {\n  public DbSet<Lesson> Lessons => Set<Lesson>();\n  protected override void OnModelCreating(ModelBuilder modelBuilder) {\n    modelBuilder.Entity<Lesson>(e => {\n      e.Property(x => x.Title).HasMaxLength(200).IsRequired();\n    });\n  }\n}\nbuilder.Services.AddDbContext<StudyDbContext>(o =>\n  o.UseSqlite(builder.Configuration.GetConnectionString(\"Default\")));",
            explain: "DbContext + Fluent config + SQLite — جاهز للmigrations.",
          },
          en: {
            lang: "csharp",
            source: "public class StudyDbContext(DbContextOptions<StudyDbContext> options) : DbContext(options) {\n  public DbSet<Lesson> Lessons => Set<Lesson>();\n  protected override void OnModelCreating(ModelBuilder modelBuilder) {\n    modelBuilder.Entity<Lesson>(e => {\n      e.Property(x => x.Title).HasMaxLength(200).IsRequired();\n    });\n  }\n}\nbuilder.Services.AddDbContext<StudyDbContext>(o =>\n  o.UseSqlite(builder.Configuration.GetConnectionString(\"Default\")));",
            explain: "DbContext + Fluent config + SQLite — ready for migrations.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["DbContext Singleton", "always Scoped"],
            en: ["DbContext Singleton", "always Scoped"],
          },
          {
            ar: ["expose DbContext to controllers", "repository/service layer"],
            en: ["expose DbContext to controllers", "repository/service layer"],
          },
          {
            ar: ["entity as API response", "DTO mapping"],
            en: ["entity as API response", "DTO mapping"],
          },
          {
            ar: ["forget Design package", "dotnet ef tools need it"],
            en: ["forget Design package", "dotnet ef tools need it"],
          },
        ]),
        discussion: [
          qa(
            "Dapper vs EF Core — متى أستخدم كل واحد؟",
            "EF Core: CRUD, migrations, LINQ, change tracking, relationships — default for ASP.NET APIs in this track. Dapper: micro-ORM raw SQL, max performance reports, stored procs heavy. many projects: EF for 95% + Dapper for one hot report query. don't choose Dapper to avoid learning EF migrations — different tradeoffs.",
            "Dapper vs EF Core — when should I use each?",
            "EF Core: CRUD, migrations, LINQ, change tracking, relationships — default for ASP.NET APIs in this track. Dapper: micro-ORM raw SQL, max performance reports, heavy stored procs. Many projects: EF for 95% + Dapper for one hot report query. Don't choose Dapper to avoid learning EF migrations — different tradeoffs.",
          ),
          qa(
            "ما فائدة AddDbContextPool وهل أستخدمه من البداية؟",
            "Pool reuses DbContext internal service provider — reduces allocation under load. API must not hold state on context between requests — your Scoped usage already OK. for learning/small APIs `AddDbContext` enough. switch to Pool when profiling shows allocation pressure. same configuration API.",
            "What is AddDbContextPool for and should I use it from day one?",
            "Pool reuses DbContext internal service provider — reduces allocation under load. API must not hold state on context between requests — your Scoped usage is already OK. For learning/small APIs `AddDbContext` is enough. Switch to Pool when profiling shows allocation pressure. Same configuration API.",
          ),
          qa(
            "هل أحتاج أكثر من DbContext في API واحد؟",
            "Rare in small APIs — one bounded context, one DbContext. multiple when integrating legacy databases or strict bounded contexts (DDD). each DbContext = separate migrations folder. complexity cost — start with one `StudyDbContext` until clear separation needed.",
            "Do I need more than one DbContext in a single API?",
            "Rare in small APIs — one bounded context, one DbContext. Multiple when integrating legacy databases or strict bounded contexts (DDD). Each DbContext = separate migrations folder. Complexity cost — start with one `StudyDbContext` until clear separation is needed.",
          ),
          qa(
            "Lazy loading في EF Core — هل أفعّله؟",
            "Default **off** in EF Core — explicit `Include` preferred for APIs. lazy loading needs proxies package + virtual navigations — surprise N+1 queries in JSON serialization. API pattern: eager `Include` or `Select` projection. lazy occasionally in admin apps — not recommended for public APIs.",
            "Lazy loading in EF Core — should I enable it?",
            "Default **off** in EF Core — explicit `Include` preferred for APIs. Lazy loading needs proxies package + virtual navigations — surprise N+1 queries in JSON serialization. API pattern: eager `Include` or `Select` projection. Lazy occasionally in admin apps — not recommended for public APIs.",
          )
        ],
        exercises: {
          ar: ["Seed data OnModelCreating", "InMemory for tests", "Fluent index on Slug", "Repository wraps context"],
          en: ["Seed data OnModelCreating", "InMemory for tests", "Fluent index on Slug", "Repository wraps context"],
        },
        checklist: {
          ar: ["DbContext registered", "entity + DbSet", "connection string", "async query", "Fluent config"],
          en: ["DbContext registered", "entity + DbSet", "connection string", "async query", "Fluent config"],
        },
        nextHint: { ar: "التالي: Migrations — تحديث schema.", en: "Next: Migrations — evolving schema." },
      }),
      deepLesson({
        slug: "02-migrations",
        order: 2,
        duration: 40,
        title: { ar: "الهجرات", en: "Migrations" },
        summary: { ar: "dotnet ef migrations، Update-Database، وevolving schema", en: "dotnet ef migrations, database update, and evolving schema." },
        why: { ar: "Schema يتغير — migrations تحفظ history: `dotnet ef migrations add InitialCreate`. `dotnet ef database update` تطبّق على DB. Team collaboration — migrations in git.\n\nNever edit production DB manually without migration. `__EFMigrationsHistory` table tracks applied. Rollback via `dotnet ef database update PreviousMigration`.", en: "Schema evolves — migrations preserve history: `dotnet ef migrations add InitialCreate`. `dotnet ef database update` applies to DB. Team collaboration — migrations in git.\n\nNever edit production DB manually without migration. `__EFMigrationsHistory` table tracks applied. Rollback via `dotnet ef database update PreviousMigration`." },
        goals: {
          ar: ["Install dotnet-ef tool", "Create Initial migration", "Apply database update", "Add column migration"],
          en: ["Install dotnet-ef tool", "Create Initial migration", "Apply database update", "Add column migration"],
        },
        concepts: [
          concept(
            "CLI workflow",
            "`dotnet tool install --global dotnet-ef` — global tool. `dotnet ef migrations add InitialCreate --project StudyApi` generates C# migration. `dotnet ef database update` applies pending migrations. `migrations remove` undo last **unapplied** migration. `dotnet ef database drop` dev only — destructive.",
            "CLI workflow",
            "`dotnet tool install --global dotnet-ef` — global tool. `dotnet ef migrations add InitialCreate --project StudyApi` generates C# migration. `dotnet ef database update` applies pending migrations. `migrations remove` undoes last **unapplied** migration. `dotnet ef database drop` dev only — destructive.",
          ),
          concept(
            "Migration files",
            "each migration: `{Timestamp}_Name.cs` with `Up()` and `Down()` — `MigrationBuilder` API. `{Name}.Designer.cs` snapshot model. **review** generated SQL before commit — EF sometimes surprises on renames. never edit applied migration in shared env — add new migration instead.",
            "Migration files",
            "Each migration: `{Timestamp}_Name.cs` with `Up()` and `Down()` — `MigrationBuilder` API. `{Name}.Designer.cs` snapshot model. **Review** generated SQL before commit — EF sometimes surprises on renames. Never edit applied migration in shared env — add new migration instead.",
          ),
          concept(
            "Environments",
            "dev: SQLite file `study.db` easy zero-config. prod: SQL Server/PostgreSQL — **same migrations** usually work cross-provider with care (avoid provider-specific raw SQL). connection string per environment. CI: `dotnet ef database update` in deploy pipeline or run idempotent SQL script.",
            "Environments",
            "Dev: SQLite file `study.db` easy zero-config. Prod: SQL Server/PostgreSQL — **same migrations** usually work cross-provider with care (avoid provider-specific raw SQL). Connection string per environment. CI: `dotnet ef database update` in deploy pipeline or run idempotent SQL script.",
          ),
          concept(
            "Data seeding",
            "`HasData` in `OnModelCreating` — seed in migration snapshot. or `migrationBuilder.InsertData` in Up(). must be idempotent-aware — PK conflicts on re-run. runtime seed `DbContext.Database.EnsureCreated` **not** for prod — use migrations. capstone seeds sample AlefYa track via HasData or startup seed guarded by env.",
            "Data seeding",
            "`HasData` in `OnModelCreating` — seed in migration snapshot. Or `migrationBuilder.InsertData` in Up(). Must be idempotent-aware — PK conflicts on re-run. Runtime seed `DbContext.Database.EnsureCreated` **not** for prod — use migrations. Capstone seeds sample AlefYa track via HasData or startup seed guarded by env.",
          )
        ],
        steps: {
          ar: ["dotnet ef migrations add InitialCreate", "Review Migration Up()", "dotnet ef database update", "Add Duration column + new migration", "Apply update", "Document ef commands in README"],
          en: ["dotnet ef migrations add InitialCreate", "Review Migration Up()", "dotnet ef database update", "Add Duration column + new migration", "Apply update", "Document ef commands in README"],
        },
        code: {
          ar: {
            lang: "bash",
            source: "# تثبيت الأداة\ndotnet tool install --global dotnet-ef\n\n# إنشاء وتطبيق\n dotnet ef migrations add InitialCreate --project StudyApi\n dotnet ef database update --project StudyApi\n\n# migration جديد بعد تغيير entity\n dotnet ef migrations add AddLessonDuration",
            explain: "أوامر EF CLI الأساسية — شغّلها من مجلد المشروع أو حدّد --project.",
          },
          en: {
            lang: "bash",
            source: "# Install tool\ndotnet tool install --global dotnet-ef\n\n# Create and apply\n dotnet ef migrations add InitialCreate --project StudyApi\n dotnet ef database update --project StudyApi\n\n# New migration after entity change\n dotnet ef migrations add AddLessonDuration",
            explain: "Core EF CLI commands — run from project folder or specify --project.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["edit applied migration", "add new migration instead"],
            en: ["edit applied migration", "add new migration instead"],
          },
          {
            ar: ["forget database update", "app fails table not found"],
            en: ["forget database update", "app fails table not found"],
          },
          {
            ar: ["migrations not in git", "team schema drift"],
            en: ["migrations not in git", "team schema drift"],
          },
          {
            ar: ["destructive change no plan", "backup prod before drop column"],
            en: ["destructive change no plan", "backup prod before drop column"],
          },
        ]),
        discussion: [
          qa(
            "EnsureCreated vs migrations — أيهما للتطوير السريع؟",
            "`EnsureCreated()` creates DB from model **without** migration history — no upgrade path, dev throwaway only. migrations = versioned history, team sync, production path. never EnsureCreated in prod. for quick spike OK — switch to migrations before sharing code.",
            "EnsureCreated vs migrations — which for quick development?",
            "`EnsureCreated()` creates DB from model **without** migration history — no upgrade path, dev throwaway only. Migrations = versioned history, team sync, production path. Never EnsureCreated in prod. For quick spike OK — switch to migrations before sharing code.",
          ),
          qa(
            "كيف أ export SQL script للـ DBA أو CI بدون dotnet ef على server؟",
            "`dotnet ef migrations script` — full script. `script FromMigration ToMigration` incremental. `--idempotent` safe re-run. pipe to file in CI artifact — DBA reviews. some teams SQL-only deploy — EF generates, ops applies.",
            "How do I export a SQL script for DBA or CI without dotnet ef on the server?",
            "`dotnet ef migrations script` — full script. `script FromMigration ToMigration` incremental. `--idempotent` safe re-run. Pipe to file in CI artifact — DBA reviews. Some teams SQL-only deploy — EF generates, ops applies.",
          ),
          qa(
            "مشروع فيه DbContextين — كيف أ manage migrations؟",
            "separate folders: `--context StudyDbContext --output-dir Migrations/Study`. each context own `__EFMigrationsHistory`. specify `--context` on every ef command. rare complexity — document which context owns which tables.",
            "Project with two DbContexts — how do I manage migrations?",
            "Separate folders: `--context StudyDbContext --output-dir Migrations/Study`. Each context owns `__EFMigrationsHistory`. Specify `--context` on every ef command. Rare complexity — document which context owns which tables.",
          ),
          qa(
            "Git merge conflict في migration Designer snapshot — ماذا أفعل؟",
            "coordinate with teammate — ideally one migration chain at a time. conflict: often regenerate — backup changes, remove conflicting migration if unapplied, re-add after merging model code. never half-merge Designer.cs — broken snapshot corrupts future migrations. communicate in team chat before parallel schema changes.",
            "Git merge conflict in migration Designer snapshot — what do I do?",
            "Coordinate with teammate — ideally one migration chain at a time. Conflict: often regenerate — backup changes, remove conflicting migration if unapplied, re-add after merging model code. Never half-merge Designer.cs — broken snapshot corrupts future migrations. Communicate in team chat before parallel schema changes.",
          )
        ],
        exercises: {
          ar: ["Two migrations chain", "script for deploy", "rollback one step", "HasData seed migration"],
          en: ["Two migrations chain", "script for deploy", "rollback one step", "HasData seed migration"],
        },
        checklist: {
          ar: ["dotnet-ef installed", "Initial migration", "database updated", "second migration", "migrations committed"],
          en: ["dotnet-ef installed", "Initial migration", "database updated", "second migration", "migrations committed"],
        },
        nextHint: { ar: "التالي: Relationships — one-to-many.", en: "Next: Relationships — one-to-many." },
      }),
      deepLesson({
        slug: "03-relationships",
        order: 3,
        duration: 48,
        title: { ar: "العلاقات", en: "Relationships" },
        summary: { ar: "One-to-many، FK، navigation properties، Include", en: "One-to-many, FK, navigation properties, Include." },
        why: { ar: "Track has many Lessons — `Track.Lessons` collection، `Lesson.TrackId` FK. Fluent API `HasOne/WithMany`. **Include** eager loading — avoid N+1. Delete behaviors: Cascade, Restrict, SetNull.\n\nJSON cycles if return entity with navigations — DTOs break cycles. Many-to-many في EF Core 5+ skip join entity optional.", en: "Track has many Lessons — `Track.Lessons` collection, `Lesson.TrackId` FK. Fluent API `HasOne/WithMany`. **Include** eager loading — avoid N+1. Delete behaviors: Cascade, Restrict, SetNull.\n\nJSON cycles if returning entities with navigations — DTOs break cycles. Many-to-many in EF Core 5+ can skip join entity." },
        goals: {
          ar: ["Model one-to-many Track-Lesson", "Configure FK Fluent API", "Include eager load", "Many-to-many preview"],
          en: ["Model one-to-many Track-Lesson", "Configure FK Fluent API", "Include eager load", "Many-to-many preview"],
        },
        concepts: [
          concept(
            "Navigation properties",
            "`Lesson.TrackId` FK scalar + `Lesson.Track` reference navigation + `Track.Lessons` collection navigation. EF uses for Include and cascade. bidirectional optional — configure one side minimum. required relationship: non-nullable FK. optional: `int? TrackId`.",
            "Navigation properties",
            "`Lesson.TrackId` FK scalar + `Lesson.Track` reference navigation + `Track.Lessons` collection navigation. EF uses for Include and cascade. Bidirectional optional — configure one side minimum. Required relationship: non-nullable FK. Optional: `int? TrackId`.",
          ),
          concept(
            "Fluent relationships",
            "`modelBuilder.Entity<Lesson>().HasOne(l => l.Track).WithMany(t => t.Lessons).HasForeignKey(l => l.TrackId).OnDelete(DeleteBehavior.Restrict);` — explicit when conventions insufficient. self-referencing, many-to-many (skip join entity EF5+), composite keys via Fluent.",
            "Fluent relationships",
            "`modelBuilder.Entity<Lesson>().HasOne(l => l.Track).WithMany(t => t.Lessons).HasForeignKey(l => l.TrackId).OnDelete(DeleteBehavior.Restrict);` — explicit when conventions insufficient. Self-referencing, many-to-many (skip join entity EF5+), composite keys via Fluent.",
          ),
          concept(
            "Loading",
            "`.Include(l => l.Track)` eager load — single SQL join or split. `.ThenInclude(t => t.Stages)` nested. `AsNoTracking()` read-only APIs — no change tracker cost. `AsSplitQuery()` avoids cartesian explosion multiple collection includes. explicit loading `Entry().Reference().Load()` rare in APIs.",
            "Loading",
            "`.Include(l => l.Track)` eager load — single SQL join or split. `.ThenInclude(t => t.Stages)` nested. `AsNoTracking()` read-only APIs — no change tracker cost. `AsSplitQuery()` avoids cartesian explosion with multiple collection includes. Explicit loading `Entry().Reference().Load()` rare in APIs.",
          ),
          concept(
            "Delete behaviors",
            "Cascade: delete parent deletes children. Restrict: block parent delete if children exist. SetNull: FK nullable set null. ClientSetNull similar client-side. choose Restrict for catalog data (Track with Lessons) — prevent accidental mass delete. configure explicitly for production safety.",
            "Delete behaviors",
            "Cascade: delete parent deletes children. Restrict: block parent delete if children exist. SetNull: nullable FK set null. ClientSetNull similar client-side. Choose Restrict for catalog data (Track with Lessons) — prevent accidental mass delete. Configure explicitly for production safety.",
          )
        ],
        steps: {
          ar: ["Add Track entity", "Lesson.TrackId FK", "Fluent HasOne WithMany", "Migration AddTracks", "Query with Include", "DTO without cycle"],
          en: ["Add Track entity", "Lesson.TrackId FK", "Fluent HasOne WithMany", "Migration AddTracks", "Query with Include", "DTO without cycle"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public class Track {\n  public int Id { get; set; }\n  public string Name { get; set; } = \"\";\n  public List<Lesson> Lessons { get; set; } = [];\n}\npublic class Lesson {\n  public int Id { get; set; }\n  public int TrackId { get; set; }\n  public Track Track { get; set; } = null!;\n}\n// query\nawait context.Lessons.Include(l => l.Track).AsNoTracking().ToListAsync(ct);",
            explain: "Include Track مع AsNoTracking — مناسب لقراءة API.",
          },
          en: {
            lang: "csharp",
            source: "public class Track {\n  public int Id { get; set; }\n  public string Name { get; set; } = \"\";\n  public List<Lesson> Lessons { get; set; } = [];\n}\npublic class Lesson {\n  public int Id { get; set; }\n  public int TrackId { get; set; }\n  public Track Track { get; set; } = null!;\n}\n// query\nawait context.Lessons.Include(l => l.Track).AsNoTracking().ToListAsync(ct);",
            explain: "Include Track with AsNoTracking — good for API reads.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["N+1 queries", "Include or projection"],
            en: ["N+1 queries", "Include or projection"],
          },
          {
            ar: ["JSON reference loop", "DTOs not entities"],
            en: ["JSON reference loop", "DTOs not entities"],
          },
          {
            ar: ["required FK missing", "migration fails or orphan"],
            en: ["required FK missing", "migration fails or orphan"],
          },
          {
            ar: ["lazy load surprise", "explicit Include"],
            en: ["lazy load surprise", "explicit Include"],
          },
        ]),
        discussion: [
          qa(
            "Owned types — متى أستخدمها بدلاً من table منفصل؟",
            "Owned types embed value object in same table (or separate table by convention) — `Address` on `User` without identity. no FK relationship — part of aggregate. good for value objects without independent lifecycle. not for Track-Lesson — that's aggregate root + child entity with FK.",
            "Owned types — when should I use them instead of a separate table?",
            "Owned types embed value object in same table (or separate table by convention) — `Address` on `User` without identity. No FK relationship — part of aggregate. Good for value objects without independent lifecycle. Not for Track-Lesson — that's aggregate root + child entity with FK.",
          ),
          qa(
            "AsSplitQuery — متى أحتاجها مع Include؟",
            "multiple `Include` on collections cause cartesian product — huge result set. `AsSplitQuery()` runs separate SQL per include — more round trips but smaller rows. default single query OK for 1-2 includes. profile with SQL logging when list endpoints slow.",
            "AsSplitQuery — when do I need it with Include?",
            "Multiple `Include` on collections cause cartesian product — huge result set. `AsSplitQuery()` runs separate SQL per include — more round trips but smaller rows. Default single query OK for 1-2 includes. Profile with SQL logging when list endpoints are slow.",
          ),
          qa(
            "Optional relationship — هل أجعل TrackId nullable؟",
            "nullable FK `int? TrackId` when Lesson can exist without Track — orphan lessons allowed. non-nullable when every Lesson must belong to Track — DB enforces integrity. API validation should match — don't accept null TrackId if DB required. migration handles alter column nullable.",
            "Optional relationship — should I make TrackId nullable?",
            "Nullable FK `int? TrackId` when Lesson can exist without Track — orphan lessons allowed. Non-nullable when every Lesson must belong to Track — DB enforces integrity. API validation should match — don't accept null TrackId if DB required. Migration handles alter column nullable.",
          ),
          qa(
            "Composite foreign key — هل أ س أراه في APIs؟",
            "Rare — `(TenantId, TrackId)` composite FK for multi-tenant schemas. Fluent `HasForeignKey(l => new { l.TenantId, l.TrackId })`. most learning APIs single int Id sufficient. know it exists for enterprise schemas — not capstone requirement.",
            "Composite foreign key — will I see this in APIs?",
            "Rare — `(TenantId, TrackId)` composite FK for multi-tenant schemas. Fluent `HasForeignKey(l => new { l.TenantId, l.TrackId })`. Most learning APIs single int Id sufficient. Know it exists for enterprise schemas — not capstone requirement.",
          )
        ],
        exercises: {
          ar: ["Track CRUD with lessons count", "Restrict delete track with lessons", "Project to DTO Select", "Many-to-many Tags"],
          en: ["Track CRUD with lessons count", "Restrict delete track with lessons", "Project to DTO Select", "Many-to-many Tags"],
        },
        checklist: {
          ar: ["FK configured", "migration applied", "Include works", "DTO no cycle", "AsNoTracking reads"],
          en: ["FK configured", "migration applied", "Include works", "DTO no cycle", "AsNoTracking reads"],
        },
        nextHint: { ar: "التالي: Querying وأداء LINQ.", en: "Next: Querying and LINQ performance." },
      }),
      deepLesson({
        slug: "04-querying",
        order: 4,
        duration: 50,
        title: { ar: "الاستعلامات والأداء", en: "Querying & performance" },
        summary: { ar: "LINQ to SQL، projection، pagination، AsNoTracking", en: "LINQ to SQL, projection, pagination, AsNoTracking." },
        why: { ar: "EF translates LINQ to SQL — `Where`, `OrderBy`, `Skip/Take` for pagination. **Select projection** to DTO avoids loading full entities. `AsNoTracking` faster reads. Raw SQL `FromSql` for reports.\n\nN+1, cartesian explosion, missing indexes — common perf issues. `ToListAsync` before filter in memory = bad. Compiled queries for hot paths — advanced.", en: "EF translates LINQ to SQL — `Where`, `OrderBy`, `Skip/Take` for pagination. **Select projection** to DTO avoids loading full entities. `AsNoTracking` faster reads. Raw SQL `FromSql` for reports.\n\nN+1, cartesian explosion, missing indexes — common perf issues. `ToListAsync` before filter in memory = bad. Compiled queries for hot paths — advanced." },
        goals: {
          ar: ["Filtered sorted paged queries", "Select projection to DTO", "AsNoTracking read-only", "Log SQL in Development"],
          en: ["Filtered sorted paged queries", "Select projection to DTO", "AsNoTracking read-only", "Log SQL in Development"],
        },
        concepts: [
          concept(
            "IQueryable pipeline",
            "LINQ on `DbSet` returns `IQueryable` — **deferred execution**. each `Where`/`OrderBy`/`Skip` appends expression tree. SQL generated once at `ToListAsync`, `CountAsync`, `FirstOrDefaultAsync`. compose filters in service methods — return `IQueryable` only if caller understands EF — usually execute inside service.",
            "IQueryable pipeline",
            "LINQ on `DbSet` returns `IQueryable` — **deferred execution**. Each `Where`/`OrderBy`/`Skip` appends expression tree. SQL generated once at `ToListAsync`, `CountAsync`, `FirstOrDefaultAsync`. Compose filters in service methods — return `IQueryable` only if caller understands EF — usually execute inside service.",
          ),
          concept(
            "Pagination",
            "`Skip((page-1)*size).Take(size)` — **always** `OrderBy` before Skip — undefined order otherwise. total count: separate `CountAsync` on filtered query before Skip — or window functions advanced. return `{ items, total, page, size }` envelope. max page size cap — prevent `size=100000` DoS.",
            "Pagination",
            "`Skip((page-1)*size).Take(size)` — **always** `OrderBy` before Skip — undefined order otherwise. Total count: separate `CountAsync` on filtered query before Skip — or window functions advanced. Return `{ items, total, page, size }` envelope. Max page size cap — prevent `size=100000` DoS.",
          ),
          concept(
            "Projection",
            "`.Select(l => new LessonDto(l.Id, l.Title, l.Duration))` — EF translates to SQL SELECT columns only — no full entity materialization. preferred over Include + map in memory for list APIs. anonymous types OK internally — DTO at boundary. computed fields in Select.",
            "Projection",
            "`.Select(l => new LessonDto(l.Id, l.Title, l.Duration))` — EF translates to SQL SELECT columns only — no full entity materialization. Preferred over Include + map in memory for list APIs. Anonymous types OK internally — DTO at boundary. Computed fields in Select.",
          ),
          concept(
            "Debugging SQL",
            "appsettings: `\"Microsoft.EntityFrameworkCore.Database.Command\": \"Information\"` — logs SQL to console. `LogTo(Console.WriteLine)` in OnConfiguring dev alternative. tags `# EF Core` in logs. use to catch N+1, client eval warnings, missing indexes. remove verbose logging in prod or Information only.",
            "Debugging SQL",
            "appsettings: `\"Microsoft.EntityFrameworkCore.Database.Command\": \"Information\"` — logs SQL to console. `LogTo(Console.WriteLine)` in OnConfiguring dev alternative. Tags `# EF Core` in logs. Use to catch N+1, client eval warnings, missing indexes. Remove verbose logging in prod or Information only.",
          )
        ],
        steps: {
          ar: ["Search Where Contains", "OrderBy Duration", "Skip/Take pagination", "Select DTO projection", "Enable SQL logging", "Compare Include vs Select perf"],
          en: ["Search Where Contains", "OrderBy Duration", "Skip/Take pagination", "Select DTO projection", "Enable SQL logging", "Compare Include vs Select perf"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public async Task<PagedResult<LessonDto>> SearchAsync(LessonQuery q, CancellationToken ct) {\n  var query = context.Lessons.AsNoTracking();\n  if (!string.IsNullOrWhiteSpace(q.Search))\n    query = query.Where(l => l.Title.Contains(q.Search));\n  var total = await query.CountAsync(ct);\n  var items = await query.OrderBy(l => l.Title)\n    .Skip((q.Page - 1) * q.Size).Take(q.Size)\n    .Select(l => new LessonDto(l.Id, l.Title, l.Duration)).ToListAsync(ct);\n  return new PagedResult<LessonDto> { Items = items, Total = total };\n}",
            explain: "Filter + count + page + projection — pattern قائمة API كامل.",
          },
          en: {
            lang: "csharp",
            source: "public async Task<PagedResult<LessonDto>> SearchAsync(LessonQuery q, CancellationToken ct) {\n  var query = context.Lessons.AsNoTracking();\n  if (!string.IsNullOrWhiteSpace(q.Search))\n    query = query.Where(l => l.Title.Contains(q.Search));\n  var total = await query.CountAsync(ct);\n  var items = await query.OrderBy(l => l.Title)\n    .Skip((q.Page - 1) * q.Size).Take(q.Size)\n    .Select(l => new LessonDto(l.Id, l.Title, l.Duration)).ToListAsync(ct);\n  return new PagedResult<LessonDto> { Items = items, Total = total };\n}",
            explain: "Filter + count + page + projection — full API list pattern.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["ToList before Where", "filter in IQueryable"],
            en: ["ToList before Where", "filter in IQueryable"],
          },
          {
            ar: ["tracking on read APIs", "AsNoTracking"],
            en: ["tracking on read APIs", "AsNoTracking"],
          },
          {
            ar: ["client eval Where", "method not translatable — client eval warning"],
            en: ["client eval Where", "method not translatable — client eval warning"],
          },
          {
            ar: ["no index on search column", "index Title Slug"],
            en: ["no index on search column", "index Title Slug"],
          },
        ]),
        discussion: [
          qa(
            "FromSqlRaw — متى أكتب SQL يدوياً في EF؟",
            "reports, complex aggregations, DB-specific features EF can't translate. **always parameterized** — `FromSqlRaw(\"SELECT * FROM Lessons WHERE Title LIKE {0}\", pattern)` — never string concat user input. SQL injection risk otherwise. interop with legacy stored procs. default stay LINQ until profiler says otherwise.",
            "FromSqlRaw — when should I write raw SQL in EF?",
            "Reports, complex aggregations, DB-specific features EF can't translate. **Always parameterized** — `FromSqlRaw(\"SELECT * FROM Lessons WHERE Title LIKE {0}\", pattern)` — never string concat user input. SQL injection risk otherwise. Interop with legacy stored procs. Default stay LINQ until profiler says otherwise.",
          ),
          qa(
            "ExecuteUpdate و ExecuteDelete في EF7+ — ما الفائدة؟",
            "bulk update/delete without loading entities into memory — `context.Lessons.Where(l => l.TrackId == id).ExecuteUpdateAsync(s => s.SetProperty(l => l.IsArchived, true))`. single SQL UPDATE. no change tracking events. great for admin batch ops — not for logic needing domain validation per row.",
            "ExecuteUpdate and ExecuteDelete in EF7+ — what is the benefit?",
            "Bulk update/delete without loading entities into memory — `context.Lessons.Where(l => l.TrackId == id).ExecuteUpdateAsync(s => s.SetProperty(l => l.IsArchived, true))`. Single SQL UPDATE. No change tracking events. Great for admin batch ops — not for logic needing domain validation per row.",
          ),
          qa(
            "Specification pattern — هل يستحق التعقيد في API صغير؟",
            "encapsulates reusable query logic `LessonByTrackSpec` — composable predicates. valuable when 10+ similar filters across services. small API: private methods on service `ApplyFilters(IQueryable, LessonQuery q)` enough. specification shines in DDD repositories — optional pattern here.",
            "Specification pattern — is it worth the complexity in a small API?",
            "Encapsulates reusable query logic `LessonByTrackSpec` — composable predicates. Valuable when 10+ similar filters across services. Small API: private methods on service `ApplyFilters(IQueryable, LessonQuery q)` enough. Specification shines in DDD repositories — optional pattern here.",
          ),
          qa(
            "كيف أكتشف client evaluation warning في EF Core؟",
            "log warning: query could not translate — part runs in memory after SQL. `.Where(l => SomeCustomMethod(l.Title))` — fix: translateable expression or AsEnumerable() knowingly after filter DB-side first. `ToListAsync()` before Where on IQueryable loaded entire table — classic bug. always check SQL log.",
            "How do I detect client evaluation warnings in EF Core?",
            "Log warning: query could not translate — part runs in memory after SQL. `.Where(l => SomeCustomMethod(l.Title))` — fix: translatable expression or AsEnumerable() knowingly after DB-side filter first. `ToListAsync()` before Where on IQueryable loaded entire table — classic bug. Always check SQL log.",
          )
        ],
        exercises: {
          ar: ["Paged API endpoint", "SQL log analyze", "Select vs Include benchmark", "Index migration"],
          en: ["Paged API endpoint", "SQL log analyze", "Select vs Include benchmark", "Index migration"],
        },
        checklist: {
          ar: ["pagination works", "DTO projection", "AsNoTracking", "SQL logged in dev", "no client eval"],
          en: ["pagination works", "DTO projection", "AsNoTracking", "SQL logged in dev", "no client eval"],
        },
        nextHint: { ar: "المرحلة التالية: Authentication وIdentity.", en: "Next stage: Authentication and Identity." },
      })
    ],
  },
  "05-auth": {
    meta: {
      slug: "05-auth",
      order: 5,
      title: { ar: "المصادقة والتفويض", en: "Authentication & authorization" },
      description: { ar: "Identity، JWT، والسياسات", en: "Identity, JWT, and policies" },
      lessons: [
        "01-identity-basics.json",
        "02-jwt.json",
        "03-policies-roles.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-identity-basics",
        order: 1,
        duration: 50,
        title: { ar: "ASP.NET Identity", en: "ASP.NET Identity" },
        summary: { ar: "UserManager، IdentityDbContext، register/login endpoints", en: "UserManager, IdentityDbContext, register/login endpoints." },
        why: { ar: "ASP.NET Identity manages users, passwords hashing, roles — `UserManager<ApplicationUser>`, `SignInManager`. Integrates with EF Core `IdentityDbContext`. Register/login APIs foundation before JWT.\n\nPasswords never stored plain — PBKDF2. Lockout, email confirmation hooks. For SPA/mobile APIs you'll add JWT next — Identity still stores users.", en: "ASP.NET Identity manages users, password hashing, roles — `UserManager<ApplicationUser>`, `SignInManager`. Integrates with EF Core `IdentityDbContext`. Register/login APIs foundation before JWT.\n\nPasswords never stored plain — PBKDF2. Lockout, email confirmation hooks. For SPA/mobile APIs you add JWT next — Identity still stores users." },
        goals: {
          ar: ["Add Identity packages + DbContext", "ApplicationUser entity", "Register + login endpoints", "Password validation options"],
          en: ["Add Identity packages + DbContext", "ApplicationUser entity", "Register + login endpoints", "Password validation options"],
        },
        concepts: [
          concept(
            "IdentityDbContext",
            "`IdentityDbContext<ApplicationUser>` extends your DbContext — adds AspNetUsers, AspNetRoles, AspNetUserRoles, claims, tokens tables. migration `AddIdentity` creates schema. customize ApplicationUser with extra properties (DisplayName). same connection string as app data — one DB common for learning APIs.",
            "IdentityDbContext",
            "`IdentityDbContext<ApplicationUser>` extends your DbContext — adds AspNetUsers, AspNetRoles, AspNetUserRoles, claims, tokens tables. Migration `AddIdentity` creates schema. Customize ApplicationUser with extra properties (DisplayName). Same connection string as app data — one DB common for learning APIs.",
          ),
          concept(
            "UserManager",
            "`UserManager<ApplicationUser>` — CreateAsync, FindByEmailAsync, CheckPasswordAsync, AddToRoleAsync. returns `IdentityResult` with errors — never throw on failed create. passwords hashed automatically (PBKDF2). configured via `IdentityOptions.Password` — length, complexity. inject into endpoints/services — not static.",
            "UserManager",
            "`UserManager<ApplicationUser>` — CreateAsync, FindByEmailAsync, CheckPasswordAsync, AddToRoleAsync. Returns `IdentityResult` with errors — never throw on failed create. Passwords hashed automatically (PBKDF2). Configured via `IdentityOptions.Password` — length, complexity. Inject into endpoints/services — not static.",
          ),
          concept(
            "Registration DTO",
            "RegisterDto: Email + Password + ConfirmPassword — validate server-side before UserManager. never return ApplicationUser entity to client — map to `{ id, email }`. duplicate email → IdentityError mapped to 400. rate limit register endpoint in production — prevent spam accounts.",
            "Registration DTO",
            "RegisterDto: Email + Password + ConfirmPassword — validate server-side before UserManager. Never return ApplicationUser entity to client — map to `{ id, email }`. Duplicate email → IdentityError mapped to 400. Rate limit register endpoint in production — prevent spam accounts.",
          ),
          concept(
            "SignInManager",
            "Cookie authentication for MVC/Razor — `PasswordSignInAsync`. for **APIs** in next lesson JWT replaces cookie. SignInManager still validates credentials before you issue token. lockout: `MaxFailedAccessAttempts` — security against brute force. two-factor hooks exist — advanced.",
            "SignInManager",
            "Cookie authentication for MVC/Razor — `PasswordSignInAsync`. For **APIs** next lesson JWT replaces cookie. SignInManager still validates credentials before you issue token. Lockout: `MaxFailedAccessAttempts` — security against brute force. Two-factor hooks exist — advanced.",
          )
        ],
        steps: {
          ar: ["Package Microsoft.AspNetCore.Identity.EntityFrameworkCore", "ApplicationUser : IdentityUser", "StudyDbContext : IdentityDbContext", "AddIdentity + AddEntityFrameworkStores", "POST /register", "Migration AddIdentity"],
          en: ["Package Microsoft.AspNetCore.Identity.EntityFrameworkCore", "ApplicationUser : IdentityUser", "StudyDbContext : IdentityDbContext", "AddIdentity + AddEntityFrameworkStores", "POST /register", "Migration AddIdentity"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddIdentity<ApplicationUser, IdentityRole>()\n  .AddEntityFrameworkStores<StudyDbContext>()\n  .AddDefaultTokenProviders();\n\napp.MapPost(\"/auth/register\", async (RegisterDto dto, UserManager<ApplicationUser> users) => {\n  var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };\n  var result = await users.CreateAsync(user, dto.Password);\n  return result.Succeeded ? Results.Ok() : Results.BadRequest(result.Errors);\n});",
            explain: "Identity registration — Password hashed automatically by UserManager.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddIdentity<ApplicationUser, IdentityRole>()\n  .AddEntityFrameworkStores<StudyDbContext>()\n  .AddDefaultTokenProviders();\n\napp.MapPost(\"/auth/register\", async (RegisterDto dto, UserManager<ApplicationUser> users) => {\n  var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };\n  var result = await users.CreateAsync(user, dto.Password);\n  return result.Succeeded ? Results.Ok() : Results.BadRequest(result.Errors);\n});",
            explain: "Identity registration — Password hashed automatically by UserManager.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["weak password options", "configure IdentityOptions"],
            en: ["weak password options", "configure IdentityOptions"],
          },
          {
            ar: ["return IdentityUser to client", "return safe DTO only"],
            en: ["return IdentityUser to client", "return safe DTO only"],
          },
          {
            ar: ["Identity without EF stores", "AddEntityFrameworkStores required"],
            en: ["Identity without EF stores", "AddEntityFrameworkStores required"],
          },
          {
            ar: ["duplicate UserName email", "normalize email lookup"],
            en: ["duplicate UserName email", "normalize email lookup"],
          },
        ]),
        discussion: [
          qa(
            "ASP.NET Identity vs custom Users table — ماذا أختار؟",
            "Identity saves months: hashing, lockout, roles, tokens, EF integration. customizable ApplicationUser and stores. custom table when ultra-minimal auth or legacy schema immovable. for this track and SPA APIs — Identity + JWT standard path. extending Identity beats reinventing password hash.",
            "ASP.NET Identity vs custom Users table — what should I choose?",
            "Identity saves months: hashing, lockout, roles, tokens, EF integration. Customizable ApplicationUser and stores. Custom table when ultra-minimal auth or legacy schema immovable. For this track and SPA APIs — Identity + JWT standard path. Extending Identity beats reinventing password hash.",
          ),
          qa(
            "هل أ assign roles عند التسجيل مباشرة؟",
            "default Student role on register via `await users.AddToRoleAsync(user, \"Student\")` after CreateAsync. Admin role seed separately — never self-assign Admin from public register. role claims included in JWT next lesson. seed roles in migration or startup `RoleManager.CreateAsync`.",
            "Should I assign roles immediately on registration?",
            "Default Student role on register via `await users.AddToRoleAsync(user, \"Student\")` after CreateAsync. Admin role seed separately — never self-assign Admin from public register. Role claims included in JWT next lesson. Seed roles in migration or startup `RoleManager.CreateAsync`.",
          ),
          qa(
            "External login Google/GitHub — هل هو ضمن المسار؟",
            "Out of scope for core track — `AddAuthentication().AddGoogle()` similar pattern to JWT: challenge + callback. Identity stores external login in AspNetUserLogins. worth knowing exists for production social login. focus now: email/password + JWT foundation.",
            "External login Google/GitHub — is it in the track?",
            "Out of scope for core track — `AddAuthentication().AddGoogle()` similar pattern to JWT: challenge + callback. Identity stores external login in AspNetUserLogins. Worth knowing exists for production social login. Focus now: email/password + JWT foundation.",
          ),
          qa(
            "Email confirmation — هل أفعّلها في Development؟",
            "Production: `RequireConfirmedEmail = true` + IEmailSender. Development: often disabled for fast testing — or log confirmation link to console fake sender. tokens via `UserManager.GenerateEmailConfirmationTokenAsync`. security vs DX tradeoff — document team choice.",
            "Email confirmation — should I enable it in Development?",
            "Production: `RequireConfirmedEmail = true` + IEmailSender. Development: often disabled for fast testing — or log confirmation link to console fake sender. Tokens via `UserManager.GenerateEmailConfirmationTokenAsync`. Security vs DX tradeoff — document team choice.",
          )
        ],
        exercises: {
          ar: ["Password policy config", "Login endpoint cookie", "IdentityResult errors map", "Seed Admin role"],
          en: ["Password policy config", "Login endpoint cookie", "IdentityResult errors map", "Seed Admin role"],
        },
        checklist: {
          ar: ["Identity registered", "migration applied", "register works", "password hashed", "errors handled"],
          en: ["Identity registered", "migration applied", "register works", "password hashed", "errors handled"],
        },
        nextHint: { ar: "التالي: JWT للـ APIs.", en: "Next: JWT for APIs." },
      }),
      deepLesson({
        slug: "02-jwt",
        order: 2,
        duration: 48,
        title: { ar: "JWT للـ APIs", en: "JWT for APIs" },
        summary: { ar: "Bearer tokens، JwtBearer middleware، login يصدر token", en: "Bearer tokens, JwtBearer middleware, login issuing token." },
        why: { ar: "SPAs and mobile clients use **JWT** — stateless bearer token. `AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)`. Login validates credentials → `JwtSecurityTokenHandler.CreateToken`.\n\nStore JWT secret in User Secrets — validate Issuer, Audience, Lifetime. `[Authorize]` protects endpoints. Refresh tokens — advanced pattern optional.", en: "SPAs and mobile clients use **JWT** — stateless bearer token. `AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)`. Login validates credentials → `JwtSecurityTokenHandler.CreateToken`.\n\nStore JWT secret in User Secrets — validate Issuer, Audience, Lifetime. `[Authorize]` protects endpoints. Refresh tokens — advanced pattern optional." },
        goals: {
          ar: ["Configure JwtBearer", "Issue token on login", "Authorize endpoint", "Read claims from User"],
          en: ["Configure JwtBearer", "Issue token on login", "Authorize endpoint", "Read claims from User"],
        },
        concepts: [
          concept(
            "JWT structure",
            "three Base64 parts: Header (alg), Payload (claims JSON), Signature (HMAC/RSA). claims: `sub` user id, `email`, `role`, `exp` expiry. **stateless** — server validates signature only, no session store. size grows with many claims — keep lean. never put secrets in payload — it's readable.",
            "JWT structure",
            "Three Base64 parts: Header (alg), Payload (claims JSON), Signature (HMAC/RSA). Claims: `sub` user id, `email`, `role`, `exp` expiry. **Stateless** — server validates signature only, no session store. Size grows with many claims — keep lean. Never put secrets in payload — it's readable.",
          ),
          concept(
            "JwtBearer middleware",
            "`AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)` — reads `Authorization: Bearer {token}`. `TokenValidationParameters`: Issuer, Audience, SigningKey, ValidateLifetime. failures → 401 automatic. **UseAuthentication before UseAuthorization**. same config for issuance and validation — shared JwtSettings.",
            "JwtBearer middleware",
            "`AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)` — reads `Authorization: Bearer {token}`. `TokenValidationParameters`: Issuer, Audience, SigningKey, ValidateLifetime. Failures → 401 automatic. **UseAuthentication before UseAuthorization**. Same config for issuance and validation — shared JwtSettings.",
          ),
          concept(
            "Token generation",
            "login validates password via UserManager → build `Claim[]` including roles → `JwtSecurityToken` + `JwtSecurityTokenHandler.WriteToken`. set `expires` UTC — short lived (15-60 min access). symmetric key from config User Secrets. return `{ accessToken, expiresIn }` JSON — not cookie for SPA unless BFF pattern.",
            "Token generation",
            "Login validates password via UserManager → build `Claim[]` including roles → `JwtSecurityToken` + `JwtSecurityTokenHandler.WriteToken`. Set `expires` UTC — short lived (15-60 min access). Symmetric key from config User Secrets. Return `{ accessToken, expiresIn }` JSON — not cookie for SPA unless BFF pattern.",
          ),
          concept(
            "[Authorize]",
            "`[Authorize]` on endpoint/controller — requires authenticated user. `[Authorize(Roles = \"Admin\")]` role check. `[AllowAnonymous]` override. Minimal: `.RequireAuthorization()` on group. 401 unauthenticated vs 403 authenticated but forbidden. read claims: `User.FindFirstValue(ClaimTypes.NameIdentifier)`.",
            "[Authorize]",
            "`[Authorize]` on endpoint/controller — requires authenticated user. `[Authorize(Roles = \"Admin\")]` role check. `[AllowAnonymous]` override. Minimal: `.RequireAuthorization()` on group. 401 unauthenticated vs 403 authenticated but forbidden. Read claims: `User.FindFirstValue(ClaimTypes.NameIdentifier)`.",
          )
        ],
        steps: {
          ar: ["JwtSettings in config", "AddAuthentication JwtBearer", "TokenService class", "POST /auth/login returns token", "MapGet [Authorize]", "Test Swagger Bearer"],
          en: ["JwtSettings in config", "AddAuthentication JwtBearer", "TokenService class", "POST /auth/login returns token", "MapGet [Authorize]", "Test Swagger Bearer"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)\n  .AddJwtBearer(o => {\n    o.TokenValidationParameters = new TokenValidationParameters {\n      ValidateIssuer = true, ValidIssuer = jwt.Issuer,\n      ValidateAudience = true, ValidAudience = jwt.Audience,\n      ValidateIssuerSigningKey = true,\n      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key))\n    };\n  });\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapGet(\"/me\", [Authorize] (ClaimsPrincipal user) => user.Identity?.Name);",
            explain: "JwtBearer validation + Authorize endpoint — pipeline order critical.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)\n  .AddJwtBearer(o => {\n    o.TokenValidationParameters = new TokenValidationParameters {\n      ValidateIssuer = true, ValidIssuer = jwt.Issuer,\n      ValidateAudience = true, ValidAudience = jwt.Audience,\n      ValidateIssuerSigningKey = true,\n      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key))\n    };\n  });\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapGet(\"/me\", [Authorize] (ClaimsPrincipal user) => user.Identity?.Name);",
            explain: "JwtBearer validation + Authorize endpoint — pipeline order critical.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["weak signing key", "long random secret User Secrets"],
            en: ["weak signing key", "long random secret User Secrets"],
          },
          {
            ar: ["Auth after Authorization", "UseAuthentication first"],
            en: ["Auth after Authorization", "UseAuthentication first"],
          },
          {
            ar: ["token in localStorage XSS", "httpOnly cookie alternative for web"],
            en: ["token in localStorage XSS", "httpOnly cookie alternative for web"],
          },
          {
            ar: ["no exp claim", "ValidateLifetime true"],
            en: ["no exp claim", "ValidateLifetime true"],
          },
        ]),
        discussion: [
          qa(
            "Refresh tokens — هل أحتاجها في مشروع تعلّم؟",
            "Access token short-lived + refresh token long-lived stored HttpOnly cookie or secure storage — user stays logged without re-login. requires server-side refresh token table + rotation — advanced. learning project: longish access token (1h) OK. production SPAs: refresh pattern standard.",
            "Refresh tokens — do I need them in a learning project?",
            "Short-lived access token + long-lived refresh token stored HttpOnly cookie or secure storage — user stays logged in without re-login. Requires server-side refresh token table + rotation — advanced. Learning project: longer access token (1h) OK. Production SPAs: refresh pattern is standard.",
          ),
          qa(
            "Symmetric vs RSA signing — أيهما للـ API الواحد؟",
            "Symmetric HMAC: one secret signs and validates — simple single API. RSA asymmetric: private key signs, public key validates — microservices share public key only. single Study Path API: symmetric with strong random key (32+ bytes) in User Secrets sufficient. RSA when multiple services validate same issuer.",
            "Symmetric vs RSA signing — which for a single API?",
            "Symmetric HMAC: one secret signs and validates — simple single API. RSA asymmetric: private key signs, public key validates — microservices share public key only. Single Study Path API: symmetric with strong random key (32+ bytes) in User Secrets sufficient. RSA when multiple services validate same issuer.",
          ),
          qa(
            "كيف أختبر JWT endpoints في Swagger؟",
            "`AddSecurityDefinition(\"Bearer\", new OpenApiSecurityScheme { Type = Http, Scheme = \"bearer\" ...})` + global security requirement. Swagger UI Authorize button — paste token from login response. saves manual header typing. document login endpoint returns token schema in OpenAPI.",
            "How do I test JWT endpoints in Swagger?",
            "`AddSecurityDefinition(\"Bearer\", new OpenApiSecurityScheme { Type = Http, Scheme = \"bearer\" ...})` + global security requirement. Swagger UI Authorize button — paste token from login response. Saves manual header typing. Document login endpoint returns token schema in OpenAPI.",
          ),
          qa(
            "Minimal API authorization — RequireAuthorization vs [Authorize]؟",
            "both work .NET 7+. `[Authorize]` attribute on delegate. `group.RequireAuthorization()` applies to all routes in MapGroup. policy: `.RequireAuthorization(\"AdminOnly\")`. choose group-level for DRY on `/api/admin/*`. Ensure UseAuthentication in pipeline — common startup mistake.",
            "Minimal API authorization — RequireAuthorization vs [Authorize]?",
            "Both work .NET 7+. `[Authorize]` attribute on delegate. `group.RequireAuthorization()` applies to all routes in MapGroup. Policy: `.RequireAuthorization(\"AdminOnly\")`. Choose group-level for DRY on `/api/admin/*`. Ensure UseAuthentication in pipeline — common startup mistake.",
          )
        ],
        exercises: {
          ar: ["Login returns JWT", "Role claim in token", "Swagger authorize", "401 test no header"],
          en: ["Login returns JWT", "Role claim in token", "Swagger authorize", "401 test no header"],
        },
        checklist: {
          ar: ["JwtBearer configured", "login issues token", "Authorize works", "UseAuthentication order", "secret not in git"],
          en: ["JwtBearer configured", "login issues token", "Authorize works", "UseAuthentication order", "secret not in git"],
        },
        nextHint: { ar: "التالي: Policies وRoles.", en: "Next: Policies and roles." },
      }),
      deepLesson({
        slug: "03-policies-roles",
        order: 3,
        duration: 42,
        title: { ar: "الأدوار والسياسات", en: "Roles & policies" },
        summary: { ar: "RoleManager، [Authorize(Roles)]، policy-based authorization", en: "RoleManager, [Authorize(Roles)], policy-based authorization." },
        why: { ar: "Roles (`Admin`, `Student`) — `[Authorize(Roles = \"Admin\")]`. **Policies** flexible: `options.AddPolicy(\"CanEditLesson\", p => p.RequireClaim(\"permission\", \"edit\"));`. Resource-based authorization for own-records.\n\nCombine authentication (who) + authorization (what allowed). Fail closed — default deny on protected routes. Integration tests with TestAuthHandler.", en: "Roles (`Admin`, `Student`) — `[Authorize(Roles = \"Admin\")]`. **Policies** flexible: `options.AddPolicy(\"CanEditLesson\", p => p.RequireClaim(\"permission\", \"edit\"));`. Resource-based authorization for own-records.\n\nCombine authentication (who) + authorization (what allowed). Fail closed — default deny on protected routes. Integration tests with TestAuthHandler." },
        goals: {
          ar: ["Seed Admin role", "Assign role on register", "[Authorize(Roles)]", "Custom policy RequireClaim"],
          en: ["Seed Admin role", "Assign role on register", "[Authorize(Roles)]", "Custom policy RequireClaim"],
        },
        concepts: [
          concept(
            "Roles",
            "`RoleManager<IdentityRole>`, `UserManager.AddToRoleAsync`. roles stored AspNetRoles — users linked AspNetUserRoles. `[Authorize(Roles = \"Admin\")]` checks role claim. JWT must include `ClaimTypes.Role` for each role — Identity adds on token generation. multiple roles: comma separated OR logic in attribute.",
            "Roles",
            "`RoleManager<IdentityRole>`, `UserManager.AddToRoleAsync`. Roles stored AspNetRoles — users linked AspNetUserRoles. `[Authorize(Roles = \"Admin\")]` checks role claim. JWT must include `ClaimTypes.Role` for each role — Identity adds on token generation. Multiple roles: comma separated OR logic in attribute.",
          ),
          concept(
            "Policies",
            "`builder.Services.AddAuthorization(o => o.AddPolicy(\"CanEditLesson\", p => p.RequireClaim(\"permission\", \"lessons:edit\")));` — `[Authorize(Policy = \"CanEditLesson\")]`. combine requirements: RequireRole + RequireAssertion. policies decouple endpoint from role names — change policy definition centrally.",
            "Policies",
            "`builder.Services.AddAuthorization(o => o.AddPolicy(\"CanEditLesson\", p => p.RequireClaim(\"permission\", \"lessons:edit\")));` — `[Authorize(Policy = \"CanEditLesson\")]`. Combine requirements: RequireRole + RequireAssertion. Policies decouple endpoint from role names — change policy definition centrally.",
          ),
          concept(
            "Handlers",
            "`IAuthorizationHandler` + `AuthorizationHandler<TRequirement>` for resource-based auth — \"user owns this lesson\". `context.User` vs `context.Resource`. register handler in DI. `IAuthorizationService.AuthorizeAsync(user, lesson, \"EditPolicy\")` in service. finer than role-only for multi-tenant and ownership.",
            "Handlers",
            "`IAuthorizationHandler` + `AuthorizationHandler<TRequirement>` for resource-based auth — \"user owns this lesson\". `context.User` vs `context.Resource`. Register handler in DI. `IAuthorizationService.AuthorizeAsync(user, lesson, \"EditPolicy\")` in service. Finer than role-only for multi-tenant and ownership.",
          ),
          concept(
            "Fallback policy",
            "`options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();` — default deny anonymous globally. explicit `[AllowAnonymous]` on login/register. fail closed security posture. optional — many APIs leave anonymous default and `[Authorize]` per endpoint.",
            "Fallback policy",
            "`options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();` — default deny anonymous globally. Explicit `[AllowAnonymous]` on login/register. Fail closed security posture. Optional — many APIs leave anonymous default and `[Authorize]` per endpoint.",
          )
        ],
        steps: {
          ar: ["Seed roles on startup", "Admin-only DELETE endpoint", "Policy CanManageTracks", "Resource owner check handler", "403 vs 401 behavior", "Integration test with fake auth"],
          en: ["Seed roles on startup", "Admin-only DELETE endpoint", "Policy CanManageTracks", "Resource owner check handler", "403 vs 401 behavior", "Integration test with fake auth"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddAuthorization(o => {\n  o.AddPolicy(\"AdminOnly\", p => p.RequireRole(\"Admin\"));\n  o.AddPolicy(\"CanEditLesson\", p => p.RequireClaim(\"permission\", \"lessons:edit\"));\n});\n\napp.MapDelete(\"/lessons/{id}\", [Authorize(Policy = \"AdminOnly\")] async (int id, ...) => { ... });\n\n// JWT must include role claim:\nnew Claim(ClaimTypes.Role, \"Admin\")",
            explain: "Policy + role — token must carry matching claims.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddAuthorization(o => {\n  o.AddPolicy(\"AdminOnly\", p => p.RequireRole(\"Admin\"));\n  o.AddPolicy(\"CanEditLesson\", p => p.RequireClaim(\"permission\", \"lessons:edit\"));\n});\n\napp.MapDelete(\"/lessons/{id}\", [Authorize(Policy = \"AdminOnly\")] async (int id, ...) => { ... });\n\n// JWT must include role claim:\nnew Claim(ClaimTypes.Role, \"Admin\")",
            explain: "Policy + role — token must carry matching claims.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["role claim name mismatch", "Use ClaimTypes.Role consistently"],
            en: ["role claim name mismatch", "Use ClaimTypes.Role consistently"],
          },
          {
            ar: ["authorize without authentication", "401 vs 403 confusion"],
            en: ["authorize without authentication", "401 vs 403 confusion"],
          },
          {
            ar: ["policy too coarse", "resource-based when needed"],
            en: ["policy too coarse", "resource-based when needed"],
          },
          {
            ar: ["hardcode Admin email", "seed role properly"],
            en: ["hardcode Admin email", "seed role properly"],
          },
        ]),
        discussion: [
          qa(
            "Claims vs Roles — متى أستخدم claims مباشرة؟",
            "Roles **are** claims (`ClaimTypes.Role`). fine-grained permissions as custom claims `permission: lessons:edit` — policies check claims without proliferating roles. Admin, Student roles coarse; permissions flexible. JWT carries both. avoid 50 roles — use roles for personas, claims for permissions.",
            "Claims vs Roles — when should I use claims directly?",
            "Roles **are** claims (`ClaimTypes.Role`). Fine-grained permissions as custom claims `permission: lessons:edit` — policies check claims without proliferating roles. Admin, Student roles coarse; permissions flexible. JWT carries both. Avoid 50 roles — use roles for personas, claims for permissions.",
          ),
          qa(
            "AllowAnonymous — كيف أ exempt endpoint من global authorization؟",
            "`[AllowAnonymous]` on action or endpoint — overrides controller-level `[Authorize]` or fallback policy. use on `/auth/login`, `/auth/register`, public GET tracks. missing AllowAnonymous on login when fallback policy enabled → 401 on login — classic bug.",
            "AllowAnonymous — how do I exempt an endpoint from global authorization?",
            "`[AllowAnonymous]` on action or endpoint — overrides controller-level `[Authorize]` or fallback policy. Use on `/auth/login`, `/auth/register`, public GET tracks. Missing AllowAnonymous on login when fallback policy enabled → 401 on login — classic bug.",
          ),
          qa(
            "Permission library vs built-in policies — ماذا أنصح؟",
            "Built-in policies enough for Admin/Student and few permission claims. libraries (PermissionManagement) when dynamic permissions in DB edited by admin UI. capstone: seed permissions in JWT claims at login — no dynamic library. add complexity when product demands runtime permission CRUD.",
            "Permission library vs built-in policies — what do you recommend?",
            "Built-in policies enough for Admin/Student and few permission claims. Libraries (PermissionManagement) when dynamic permissions in DB edited by admin UI. Capstone: seed permissions in JWT claims at login — no dynamic library. Add complexity when product demands runtime permission CRUD.",
          ),
          qa(
            "Integration tests مع authorization — كيف أ fake user؟",
            "`WebApplicationFactory` with `services.AddAuthentication(\"Test\").AddScheme<...>` TestAuthHandler sets `ClaimsPrincipal` with roles. or call endpoints with real JWT from test login. `[Authorize]` tested without hitting real Identity. pattern in Microsoft docs — TestAuthHandler stub.",
            "Integration tests with authorization — how do I fake a user?",
            "`WebApplicationFactory` with `services.AddAuthentication(\"Test\").AddScheme<...>` TestAuthHandler sets `ClaimsPrincipal` with roles. Or call endpoints with real JWT from test login. `[Authorize]` tested without hitting real Identity. Pattern in Microsoft docs — TestAuthHandler stub.",
          )
        ],
        exercises: {
          ar: ["Student read-only policy", "Owner can edit own lesson", "Seed Admin user", "403 test wrong role"],
          en: ["Student read-only policy", "Owner can edit own lesson", "Seed Admin user", "403 test wrong role"],
        },
        checklist: {
          ar: ["roles seeded", "JWT has role claim", "policy works", "401/403 correct", "admin endpoint protected"],
          en: ["roles seeded", "JWT has role claim", "policy works", "401/403 correct", "admin endpoint protected"],
        },
        nextHint: { ar: "المرحلة التالية: Caching وLogging.", en: "Next stage: Caching and logging." },
      })
    ],
  },
  "06-advanced": {
    meta: {
      slug: "06-advanced",
      order: 6,
      title: { ar: "مواضيع متقدمة", en: "Advanced topics" },
      description: { ar: "التخزين المؤقت، التسجيل، والخلفية", en: "Caching, logging, and background work" },
      lessons: [
        "01-caching.json",
        "02-logging-health.json",
        "03-background-services.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-caching",
        order: 1,
        duration: 40,
        title: { ar: "Caching", en: "Caching" },
        summary: { ar: "IMemoryCache، response caching، وDistributed Redis preview", en: "IMemoryCache, response caching, and distributed Redis preview." },
        why: { ar: "Expensive queries and external calls benefit from **caching**. `IMemoryCache` in-process — `cache.GetOrCreateAsync(key, factory)`. Response caching headers for GET. Redis for multi-instance — `IDistributedCache`.\n\nCache invalidation hard — TTL strategy. Never cache personalized auth responses blindly. `[ResponseCache]` attribute MVC — middleware `UseResponseCaching`.", en: "Expensive queries and external calls benefit from **caching**. `IMemoryCache` in-process — `cache.GetOrCreateAsync(key, factory)`. Response caching headers for GET. Redis for multi-instance — `IDistributedCache`.\n\nCache invalidation is hard — TTL strategy. Never cache personalized auth responses blindly. `[ResponseCache]` attribute MVC — middleware `UseResponseCaching`." },
        goals: {
          ar: ["AddMemoryCache", "GetOrCreateAsync pattern", "Cache key design", "Invalidate on update"],
          en: ["AddMemoryCache", "GetOrCreateAsync pattern", "Cache key design", "Invalidate on update"],
        },
        concepts: [
          concept(
            "IMemoryCache",
            "in-process cache — `builder.Services.AddMemoryCache()`. inject `IMemoryCache`. fast — no network. **not shared** across server instances. `MemoryCacheOptions.SizeLimit` + `entry.Size` prevent unbounded growth. Singleton service typical. data lost on app restart — acceptable for read-heavy catalog.",
            "IMemoryCache",
            "In-process cache — `builder.Services.AddMemoryCache()`. Inject `IMemoryCache`. Fast — no network. **Not shared** across server instances. `MemoryCacheOptions.SizeLimit` + `entry.Size` prevent unbounded growth. Singleton service typical. Data lost on app restart — acceptable for read-heavy catalog.",
          ),
          concept(
            "GetOrCreateAsync",
            "cache-aside pattern: check key → miss → factory loads DB → store with expiry. `AbsoluteExpirationRelativeToNow` fixed TTL. `SlidingExpiration` extends on access. **never cache DbContext or scoped services** inside Singleton cache service without scope. return immutable DTO copies.",
            "GetOrCreateAsync",
            "Cache-aside pattern: check key → miss → factory loads DB → store with expiry. `AbsoluteExpirationRelativeToNow` fixed TTL. `SlidingExpiration` extends on access. **Never cache DbContext or scoped services** inside Singleton cache service without scope. Return immutable DTO copies.",
          ),
          concept(
            "Response caching",
            "`app.UseResponseCaching()` + `[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]` — HTTP cache headers Cache-Control. client and CDN can cache. **public GET only** — never on authenticated personalized responses. VaryByQueryKeys for paged lists.",
            "Response caching",
            "`app.UseResponseCaching()` + `[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]` — HTTP cache headers Cache-Control. Client and CDN can cache. **Public GET only** — never on authenticated personalized responses. VaryByQueryKeys for paged lists.",
          ),
          concept(
            "Distributed cache",
            "`IDistributedCache` — Redis `AddStackExchangeRedisCache` or SQL Server cache. JSON serialize values. shared across app instances — consistent cache farm. slightly slower than memory — network hop. use when horizontal scale > 1 instance. HybridCache (.NET 9) combines L1+L2.",
            "Distributed cache",
            "`IDistributedCache` — Redis `AddStackExchangeRedisCache` or SQL Server cache. JSON serialize values. Shared across app instances — consistent cache farm. Slightly slower than memory — network hop. Use when horizontal scale > 1 instance. HybridCache (.NET 9) combines L1+L2.",
          )
        ],
        steps: {
          ar: ["AddMemoryCache", "Cache lesson list 60s", "Invalidate on POST/PUT", "ResponseCache on public GET", "Log cache hit/miss", "Document cache keys"],
          en: ["AddMemoryCache", "Cache lesson list 60s", "Invalidate on POST/PUT", "ResponseCache on public GET", "Log cache hit/miss", "Document cache keys"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddMemoryCache();\n\npublic class LessonService(IMemoryCache cache, StudyDbContext db) {\n  public async Task<IReadOnlyList<LessonDto>> ListAsync(CancellationToken ct) =>\n    await cache.GetOrCreateAsync(\"lessons:all\", async entry => {\n      entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60);\n      return await db.Lessons.AsNoTracking()\n        .Select(l => new LessonDto(l.Id, l.Title, l.Duration)).ToListAsync(ct);\n    }) ?? [];\n}",
            explain: "GetOrCreateAsync — DB hit only on cache miss.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddMemoryCache();\n\npublic class LessonService(IMemoryCache cache, StudyDbContext db) {\n  public async Task<IReadOnlyList<LessonDto>> ListAsync(CancellationToken ct) =>\n    await cache.GetOrCreateAsync(\"lessons:all\", async entry => {\n      entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60);\n      return await db.Lessons.AsNoTracking()\n        .Select(l => new LessonDto(l.Id, l.Title, l.Duration)).ToListAsync(ct);\n    }) ?? [];\n}",
            explain: "GetOrCreateAsync — DB hit only on cache miss.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["cache user-specific data globally", "key per user or no cache"],
            en: ["cache user-specific data globally", "key per user or no cache"],
          },
          {
            ar: ["no expiry", "memory leak stale data"],
            en: ["no expiry", "memory leak stale data"],
          },
          {
            ar: ["cache mutable objects", "return copies or immutable DTOs"],
            en: ["cache mutable objects", "return copies or immutable DTOs"],
          },
          {
            ar: ["stampede on expiry", "HybridCache .NET 9 or lock"],
            en: ["stampede on expiry", "HybridCache .NET 9 or lock"],
          },
        ]),
        discussion: [
          qa(
            "متى أنتقل من IMemoryCache إلى Redis؟",
            "single instance dev/small prod: memory enough. multiple instances behind load balancer: memory cache incoherent — user A hits server1 cache miss, server2 hit stale. Redis shared layer. also pub/sub invalidation across nodes. start memory — add Redis when deploying second instance.",
            "When should I move from IMemoryCache to Redis?",
            "Single instance dev/small prod: memory enough. Multiple instances behind load balancer: memory cache incoherent — user A hits server1 cache miss, server2 hit stale. Redis shared layer. Also pub/sub invalidation across nodes. Start memory — add Redis when deploying second instance.",
          ),
          qa(
            "Output caching في .NET 7+ — مختلف عن Response caching؟",
            "Output caching middleware — server-side stores full response by policy — `.CacheOutput()` on Minimal APIs. Response caching relies on HTTP headers client/proxy. Output cache internal — finer control policies, tags invalidation .NET 8+. both for GET public data — pick one pattern per endpoint.",
            "Output caching in .NET 7+ — different from Response caching?",
            "Output caching middleware — server-side stores full response by policy — `.CacheOutput()` on Minimal APIs. Response caching relies on HTTP headers client/proxy. Output cache internal — finer control policies, tag invalidation .NET 8+. Both for GET public data — pick one pattern per endpoint.",
          ),
          qa(
            "ETag و conditional GET — هل أحتاجها؟",
            "advanced HTTP caching — client sends If-None-Match → 304 Not Modified saves bandwidth. ASP.NET supports via manual headers or middleware. overkill for JSON APIs early stage. useful large static payloads or mobile bandwidth sensitive. catalog API with rare changes candidate.",
            "ETag and conditional GET — do I need them?",
            "Advanced HTTP caching — client sends If-None-Match → 304 Not Modified saves bandwidth. ASP.NET supports via manual headers or middleware. Overkill for JSON APIs early stage. Useful for large static payloads or mobile bandwidth sensitive. Catalog API with rare changes is a candidate.",
          ),
          qa(
            "Cache-aside vs read-through — أين GetOrCreateAsync؟",
            "GetOrCreateAsync is **cache-aside**: app manages load on miss. read-through: cache layer loads transparently — Redis doesn't do this natively. write-through: update cache on write — you `cache.Remove(key)` on POST/PUT lesson. document invalidation strategy — hardest part of caching.",
            "Cache-aside vs read-through — where does GetOrCreateAsync fit?",
            "GetOrCreateAsync is **cache-aside**: app manages load on miss. Read-through: cache layer loads transparently — Redis doesn't do this natively. Write-through: update cache on write — you `cache.Remove(key)` on POST/PUT lesson. Document invalidation strategy — hardest part of caching.",
          )
        ],
        exercises: {
          ar: ["TTL config", "Remove on update", "Cache stampede demo", "ResponseCache header"],
          en: ["TTL config", "Remove on update", "Cache stampede demo", "ResponseCache header"],
        },
        checklist: {
          ar: ["MemoryCache registered", "GetOrCreate works", "invalidation on write", "no auth response cached", "TTL set"],
          en: ["MemoryCache registered", "GetOrCreate works", "invalidation on write", "no auth response cached", "TTL set"],
        },
        nextHint: { ar: "التالي: Logging وHealth Checks.", en: "Next: Logging and health checks." },
      }),
      deepLesson({
        slug: "02-logging-health",
        order: 2,
        duration: 42,
        title: { ar: "Logging وHealth Checks", en: "Logging & health checks" },
        summary: { ar: "ILogger، structured logging، Serilog، MapHealthChecks", en: "ILogger, structured logging, Serilog, MapHealthChecks." },
        why: { ar: "**ILogger<T>** categories logs — LogInformation/Warning/Error. Structured placeholders `{LessonId}`. **Serilog** sinks to file/console/Seq. **Health checks** `/health` for k8s/load balancers — DB connectivity.\n\nNever log passwords or JWT. Correlation ID middleware traces requests. OpenTelemetry — advanced observability.", en: "**ILogger<T>** categories logs — LogInformation/Warning/Error. Structured placeholders `{LessonId}`. **Serilog** sinks to file/console/Seq. **Health checks** `/health` for k8s/load balancers — DB connectivity.\n\nNever log passwords or JWT. Correlation ID middleware traces requests. OpenTelemetry — advanced observability." },
        goals: {
          ar: ["Inject ILogger in services", "Structured log messages", "AddHealthChecks + DB check", "MapHealthChecks endpoint"],
          en: ["Inject ILogger in services", "Structured log messages", "AddHealthChecks + DB check", "MapHealthChecks endpoint"],
        },
        concepts: [
          concept(
            "ILogger",
            "`ILogger<T>` inject — category = type name. `LogTrace/Debug/Information/Warning/Error/Critical`. `LogLevel` in appsettings filters noise. **Default Information** prod, Debug dev. `ILoggerFactory` rare. Microsoft.Extensions.Logging abstractions — swap providers without code change.",
            "ILogger",
            "`ILogger<T>` inject — category = type name. `LogTrace/Debug/Information/Warning/Error/Critical`. `LogLevel` in appsettings filters noise. **Default Information** prod, Debug dev. `ILoggerFactory` rare. Microsoft.Extensions.Logging abstractions — swap providers without code change.",
          ),
          concept(
            "Structured logging",
            "`_logger.LogInformation(\"Created lesson {LessonId} for track {TrackId}\", id, trackId)` — named placeholders → searchable fields in Seq/App Insights. **never** `$\"Created {id}\"` string interp — loses structure. `@exception` in Serilog. enables queries `LessonId=42` in log viewer.",
            "Structured logging",
            "`_logger.LogInformation(\"Created lesson {LessonId} for track {TrackId}\", id, trackId)` — named placeholders → searchable fields in Seq/App Insights. **Never** `$\"Created {id}\"` string interp — loses structure. `@exception` in Serilog. Enables queries `LessonId=42` in log viewer.",
          ),
          concept(
            "Serilog",
            "`builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration))` — sinks: Console, File, Seq. enrichers: Environment, Thread. `Log.CloseAndFlush()` on shutdown. packages: Serilog.AspNetCore, Serilog.Sinks.*. replaces default provider or adds via ClearProviders.",
            "Serilog",
            "`builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration))` — sinks: Console, File, Seq. Enrichers: Environment, Thread. `Log.CloseAndFlush()` on shutdown. Packages: Serilog.AspNetCore, Serilog.Sinks.*. Replaces default provider or adds via ClearProviders.",
          ),
          concept(
            "Health checks",
            "`AddHealthChecks().AddDbContextCheck<StudyDbContext>().AddCheck(\"redis\", ...)` — `MapHealthChecks(\"/health\")` → 200 Healthy / 503 Unhealthy. k8s liveness vs readiness separate endpoints optional. **don't expose sensitive details** publicly — restrict or simple Healthy/Unhealthy JSON.",
            "Health checks",
            "`AddHealthChecks().AddDbContextCheck<StudyDbContext>().AddCheck(\"redis\", ...)` — `MapHealthChecks(\"/health\")` → 200 Healthy / 503 Unhealthy. k8s liveness vs readiness separate endpoints optional. **Don't expose sensitive details** publicly — restrict or simple Healthy/Unhealthy JSON.",
          )
        ],
        steps: {
          ar: ["ILogger in LessonService", "Adjust appsettings LogLevel", "AddHealthChecks AddDbContextCheck", "MapHealthChecks /health", "Optional Serilog package", "Test unhealthy DB"],
          en: ["ILogger in LessonService", "Adjust appsettings LogLevel", "AddHealthChecks AddDbContextCheck", "MapHealthChecks /health", "Optional Serilog package", "Test unhealthy DB"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddHealthChecks()\n  .AddDbContextCheck<StudyDbContext>();\n\napp.MapHealthChecks(\"/health\");\n\npublic class LessonService(ILogger<LessonService> logger, StudyDbContext db) {\n  public async Task CreateAsync(CreateLessonDto dto, CancellationToken ct) {\n    logger.LogInformation(\"Creating lesson {Title}\", dto.Title);\n    // ...\n  }\n}",
            explain: "Health check DB + structured log — production baseline.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddHealthChecks()\n  .AddDbContextCheck<StudyDbContext>();\n\napp.MapHealthChecks(\"/health\");\n\npublic class LessonService(ILogger<LessonService> logger, StudyDbContext db) {\n  public async Task CreateAsync(CreateLessonDto dto, CancellationToken ct) {\n    logger.LogInformation(\"Creating lesson {Title}\", dto.Title);\n    // ...\n  }\n}",
            explain: "Health check DB + structured log — production baseline.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["string concat logs", "use structured templates"],
            en: ["string concat logs", "use structured templates"],
          },
          {
            ar: ["log secrets", "redact Authorization headers"],
            en: ["log secrets", "redact Authorization headers"],
          },
          {
            ar: ["health public detailed errors", "UIResponseWriter optional restrict"],
            en: ["health public detailed errors", "UIResponseWriter optional restrict"],
          },
          {
            ar: ["Debug in production", "Information default"],
            en: ["Debug in production", "Information default"],
          },
        ]),
        discussion: [
          qa(
            "Seq vs Application Insights — أيهما للمبتدئ؟",
            "Seq: excellent local/dev structured log viewer, Docker easy, free dev tier. Application Insights: Azure integrated APM, production traces/metrics, cost scales. learning: Console + File sufficient; add Seq Docker optional. production Azure host: App Insights one-line enable.",
            "Seq vs Application Insights — which for a beginner?",
            "Seq: excellent local/dev structured log viewer, Docker easy, free dev tier. Application Insights: Azure integrated APM, production traces/metrics, cost scales. Learning: Console + File sufficient; add Seq Docker optional. Production Azure host: App Insights one-line enable.",
          ),
          qa(
            "Liveness vs Readiness probes في Kubernetes — الفرق؟",
            "Liveness: app process alive — fail → restart pod. Readiness: ready for traffic — fail → remove from load balancer temporarily (DB down). separate `/health/live` and `/health/ready` endpoints map checks. API startup migration running → readiness fails until done.",
            "Liveness vs Readiness probes in Kubernetes — what's the difference?",
            "Liveness: app process alive — fail → restart pod. Readiness: ready for traffic — fail → remove from load balancer temporarily (DB down). Separate `/health/live` and `/health/ready` endpoints map checks. API startup migration running → readiness fails until done.",
          ),
          qa(
            "Activity و distributed tracing — هل أحتاج OpenTelemetry الآن؟",
            "`System.Diagnostics.Activity` spans across HTTP and EF — OpenTelemetry exports to Jaeger/Zipkin. advanced observability beyond ILogger. capstone: correlation ID middleware enough — trace id in logs. OpenTelemetry when microservices debug latency across services.",
            "Activity and distributed tracing — do I need OpenTelemetry now?",
            "`System.Diagnostics.Activity` spans across HTTP and EF — OpenTelemetry exports to Jaeger/Zipkin. Advanced observability beyond ILogger. Capstone: correlation ID middleware enough — trace id in logs. OpenTelemetry when microservices debug latency across services.",
          ),
          qa(
            "Global exception logging — أين أضعه؟",
            "Middleware early pipeline: catch unhandled → log Error with exception → ProblemDetails response. or `IExceptionHandler` (.NET 8+). **never** double-log — filter or handler once. include correlation id in log scope. hide stack trace details from client in prod.",
            "Global exception logging — where should I put it?",
            "Middleware early pipeline: catch unhandled → log Error with exception → ProblemDetails response. Or `IExceptionHandler` (.NET 8+). **Never** double-log — filter or handler once. Include correlation id in log scope. Hide stack trace details from client in prod.",
          )
        ],
        exercises: {
          ar: ["Correlation ID middleware", "Health JSON response", "Serilog file sink", "Log level per namespace"],
          en: ["Correlation ID middleware", "Health JSON response", "Serilog file sink", "Log level per namespace"],
        },
        checklist: {
          ar: ["ILogger used", "structured messages", "/health works", "DB health check", "no secrets logged"],
          en: ["ILogger used", "structured messages", "/health works", "DB health check", "no secrets logged"],
        },
        nextHint: { ar: "التالي: Background Services.", en: "Next: Background services." },
      }),
      deepLesson({
        slug: "03-background-services",
        order: 3,
        duration: 45,
        title: { ar: "Background Services", en: "Background services" },
        summary: { ar: "IHostedService، BackgroundService، queues", en: "IHostedService, BackgroundService, and queues." },
        why: { ar: "Long work must not block HTTP — **BackgroundService** `ExecuteAsync` loop. Email sending, report generation, outbox pattern. `Channel<T>` queue between API and worker.\n\nScoped services in background — `IServiceScopeFactory.CreateScope()`. Cancellation on shutdown — respect stoppingToken. Hangfire/Quartz for cron — preview.", en: "Long work must not block HTTP — **BackgroundService** `ExecuteAsync` loop. Email sending, report generation, outbox pattern. `Channel<T>` queue between API and worker.\n\nScoped services in background — `IServiceScopeFactory.CreateScope()`. Cancellation on shutdown — respect stoppingToken. Hangfire/Quartz for cron — preview." },
        goals: {
          ar: ["BackgroundService subclass", "Channel queue worker", "IServiceScopeFactory for DbContext", "Graceful shutdown"],
          en: ["BackgroundService subclass", "Channel queue worker", "IServiceScopeFactory for DbContext", "Graceful shutdown"],
        },
        concepts: [
          concept(
            "BackgroundService",
            "abstract base implementing `IHostedService` — override `ExecuteAsync(CancellationToken stoppingToken)`. long-running loop, timer, or channel reader. registered `AddHostedService<T>()`. runs as Singleton — **scope carefully** for DbContext. respect `stoppingToken` on await — graceful shutdown k8s.",
            "BackgroundService",
            "Abstract base implementing `IHostedService` — override `ExecuteAsync(CancellationToken stoppingToken)`. Long-running loop, timer, or channel reader. Registered `AddHostedService<T>()`. Runs as Singleton — **scope carefully** for DbContext. Respect `stoppingToken` on await — graceful shutdown k8s.",
          ),
          concept(
            "Channel queue",
            "`Channel.CreateBounded<T>` — producer API writes `ChannelWriter`, worker reads `ChannelReader`. decouples HTTP from slow work — email, indexing, webhooks. backpressure when bounded full — `Wait` or `DropWrite`. thread-safe — no manual locking. better than `Task.Run` fire-forget.",
            "Channel queue",
            "`Channel.CreateBounded<T>` — producer API writes `ChannelWriter`, worker reads `ChannelReader`. Decouples HTTP from slow work — email, indexing, webhooks. Backpressure when bounded full — `Wait` or `DropWrite`. Thread-safe — no manual locking. Better than `Task.Run` fire-forget.",
          ),
          concept(
            "Scoped in hosted",
            "never inject DbContext into BackgroundService ctor. `IServiceScopeFactory.CreateScope()` per message/job — `using var scope = _scopes.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<StudyDbContext>();`. mimics request scope. IDisposable scope ends tracker flush.",
            "Scoped in hosted",
            "Never inject DbContext into BackgroundService ctor. `IServiceScopeFactory.CreateScope()` per message/job — `using var scope = _scopes.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<StudyDbContext>();`. Mimics request scope. IDisposable scope ends tracker flush.",
          ),
          concept(
            "IHostedService lifecycle",
            "`StartAsync` before app accepts requests — warm up OK. `StopAsync` on shutdown — cancel token signaled. hosted services run in same process as Kestrel — CPU heavy worker affects API latency — consider separate worker service at scale. `BackgroundService` base handles Start/Stop boilerplate.",
            "IHostedService lifecycle",
            "`StartAsync` before app accepts requests — warm up OK. `StopAsync` on shutdown — cancel token signaled. Hosted services run in same process as Kestrel — CPU heavy worker affects API latency — consider separate worker service at scale. `BackgroundService` base handles Start/Stop boilerplate.",
          )
        ],
        steps: {
          ar: ["LessonIndexWorker : BackgroundService", "Channel<LessonIndexedEvent>", "POST enqueues event", "Worker processes with scope", "Log stoppingToken cancel", "Optional periodic timer"],
          en: ["LessonIndexWorker : BackgroundService", "Channel<LessonIndexedEvent>", "POST enqueues event", "Worker processes with scope", "Log stoppingToken cancel", "Optional periodic timer"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "public class LessonIndexWorker(\n  ChannelReader<LessonIndexedEvent> reader,\n  IServiceScopeFactory scopes,\n  ILogger<LessonIndexWorker> logger) : BackgroundService {\n  protected override async Task ExecuteAsync(CancellationToken stoppingToken) {\n    await foreach (var evt in reader.ReadAllAsync(stoppingToken)) {\n      using var scope = scopes.CreateScope();\n      var db = scope.ServiceProvider.GetRequiredService<StudyDbContext>();\n      logger.LogInformation(\"Indexing lesson {Id}\", evt.LessonId);\n    }\n  }\n}",
            explain: "Channel + scope per message — safe DbContext use in background.",
          },
          en: {
            lang: "csharp",
            source: "public class LessonIndexWorker(\n  ChannelReader<LessonIndexedEvent> reader,\n  IServiceScopeFactory scopes,\n  ILogger<LessonIndexWorker> logger) : BackgroundService {\n  protected override async Task ExecuteAsync(CancellationToken stoppingToken) {\n    await foreach (var evt in reader.ReadAllAsync(stoppingToken)) {\n      using var scope = scopes.CreateScope();\n      var db = scope.ServiceProvider.GetRequiredService<StudyDbContext>();\n      logger.LogInformation(\"Indexing lesson {Id}\", evt.LessonId);\n    }\n  }\n}",
            explain: "Channel + scope per message — safe DbContext use in background.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["Scoped DbContext in hosted ctor", "scope factory"],
            en: ["Scoped DbContext in hosted ctor", "scope factory"],
          },
          {
            ar: ["unbounded queue", "BoundedChannelFullMode Wait"],
            en: ["unbounded queue", "BoundedChannelFullMode Wait"],
          },
          {
            ar: ["ignore stoppingToken", "graceful shutdown hangs"],
            en: ["ignore stoppingToken", "graceful shutdown hangs"],
          },
          {
            ar: ["fire Task without await in API", "queue instead"],
            en: ["fire Task without await in API", "queue instead"],
          },
        ]),
        discussion: [
          qa(
            "Hangfire vs BackgroundService — متى أضيف Hangfire؟",
            "BackgroundService built-in — no dashboard, manual retry logic. Hangfire: persistent jobs SQL/Redis, cron UI dashboard, automatic retry. choose Hangfire when ops wants schedule visibility and job history. learning capstone: Channel + BackgroundService demonstrates pattern without extra infra.",
            "Hangfire vs BackgroundService — when should I add Hangfire?",
            "BackgroundService built-in — no dashboard, manual retry logic. Hangfire: persistent jobs SQL/Redis, cron UI dashboard, automatic retry. Choose Hangfire when ops wants schedule visibility and job history. Learning capstone: Channel + BackgroundService demonstrates pattern without extra infra.",
          ),
          qa(
            "Azure Functions كبديل — متى؟",
            "serverless event-driven — queue trigger, timer, scale to zero. separate from API process — no shared DI. good burst workloads billing per execution. capstone API keeps worker in-process for simplicity. Functions when decouple deploy scale cost.",
            "Azure Functions as alternative — when?",
            "Serverless event-driven — queue trigger, timer, scale to zero. Separate from API process — no shared DI. Good burst workloads billing per execution. Capstone API keeps worker in-process for simplicity. Functions when decouple deploy scale cost.",
          ),
          qa(
            "Multiple workers على نفس Channel — هل هو safe؟",
            "single reader `ReadAllAsync` one consumer — scale by partitioned channels (hash userId % N) or `Channel.CreateUnbounded` multiple hosted services compete — **not** safe multiple readers one channel without coordination. for parallel: `Parallel.ForEachAsync` inside one worker or TPL Dataflow.",
            "Multiple workers on same Channel — is it safe?",
            "Single reader `ReadAllAsync` one consumer — scale by partitioned channels (hash userId % N) or `Channel.CreateUnbounded` multiple hosted services compete — **not** safe multiple readers one channel without coordination. For parallel: `Parallel.ForEachAsync` inside one worker or TPL Dataflow.",
          ),
          qa(
            "Outbox pattern مع EF — ما الفكرة؟",
            "transaction: save entity + OutboxMessage same DbContext SaveChanges — background polls outbox publishes events reliably. avoids lost message if crash after DB commit before queue send. advanced distributed systems — mention for interview depth. capstone optional bonus reading.",
            "Outbox pattern with EF — what is the idea?",
            "Transaction: save entity + OutboxMessage same DbContext SaveChanges — background polls outbox publishes events reliably. Avoids lost message if crash after DB commit before queue send. Advanced distributed systems — mention for interview depth. Capstone optional bonus reading.",
          )
        ],
        exercises: {
          ar: ["Enqueue on lesson create", "Bounded channel", "Stop host mid-work", "Timer every 5 min cleanup"],
          en: ["Enqueue on lesson create", "Bounded channel", "Stop host mid-work", "Timer every 5 min cleanup"],
        },
        checklist: {
          ar: ["BackgroundService registered", "Channel wired", "scope per job", "stoppingToken respected", "no blocking HTTP"],
          en: ["BackgroundService registered", "Channel wired", "scope per job", "stoppingToken respected", "no blocking HTTP"],
        },
        nextHint: { ar: "المرحلة الأخيرة: مشروع API كامل.", en: "Final stage: full API capstone project." },
      })
    ],
  },
  "07-project": {
    meta: {
      slug: "07-project",
      order: 7,
      title: { ar: "مشروع تطبيقي", en: "Capstone project" },
      description: { ar: "ابنِ API كامل لمسار تعلّم مصغّر", en: "Build a full API for a mini learning path" },
      lessons: [
        "01-design.json",
        "02-implement.json",
        "03-harden.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-design",
        order: 1,
        duration: 45,
        title: { ar: "تصميم الـ API", en: "API design" },
        summary: { ar: "Resources، DTOs، OpenAPI contract، ومسار AlefYa mini", en: "Resources, DTOs, OpenAPI contract, and AlefYa mini path." },
        why: { ar: "Capstone: **Study Path API** — Tracks, Stages, Lessons CRUD + progress. Design first: URLs `/api/tracks/{id}/stages`, DTOs bilingual `{ ar, en }`, error shape ProblemDetails, auth for progress write.\n\nOpenAPI spec as contract — frontend Angular track consumes it later. Versioning `/api/v1`. Pagination, filtering, idempotency on POST optional.", en: "Capstone: **Study Path API** — Tracks, Stages, Lessons CRUD + progress. Design first: URLs `/api/tracks/{id}/stages`, DTOs bilingual `{ ar, en }`, error shape ProblemDetails, auth for progress write.\n\nOpenAPI spec as contract — frontend Angular track consumes it later. Versioning `/api/v1`. Pagination, filtering, idempotency on POST optional." },
        goals: {
          ar: ["Erd + resource map", "DTO catalog bilingual", "OpenAPI draft", "Auth matrix endpoint×role"],
          en: ["ERD + resource map", "DTO catalog bilingual", "OpenAPI draft", "Auth matrix endpoint×role"],
        },
        concepts: [
          concept(
            "Resource modeling",
            "Study Path API: Track → Stages → Lessons hierarchy. Progress joins User + Lesson (completedAt). identify nouns from domain — each becomes resource collection. avoid verb URLs `/completeLesson` — prefer `POST /progress/{lessonId}`. ERD before endpoints prevents rework.",
            "Resource modeling",
            "Study Path API: Track → Stages → Lessons hierarchy. Progress joins User + Lesson (completedAt). Identify nouns from domain — each becomes resource collection. Avoid verb URLs `/completeLesson` — prefer `POST /progress/{lessonId}`. ERD before endpoints prevents rework.",
          ),
          concept(
            "DTO design",
            "CreateTrackDto (input) vs TrackReadDto (output) — no over-posting Id/CreatedAt on create. bilingual `{ title: { ar, en } }` or separate fields. records immutable-friendly. validators per Create/Update. never expose EF navigations on ReadDto — flat or nested DTOs by design.",
            "DTO design",
            "CreateTrackDto (input) vs TrackReadDto (output) — no over-posting Id/CreatedAt on create. Bilingual `{ title: { ar, en } }` or separate fields. Records immutable-friendly. Validators per Create/Update. Never expose EF navigations on ReadDto — flat or nested DTOs by design.",
          ),
          concept(
            "API conventions",
            "plural nouns `/tracks`, `/lessons`. nested moderate depth `/tracks/{id}/stages` — max 2-3 levels. HTTP verbs semantic GET read POST create PUT replace PATCH partial DELETE remove. consistent pagination query `?page=&size=`. error shape ProblemDetails all endpoints.",
            "API conventions",
            "Plural nouns `/tracks`, `/lessons`. Nested moderate depth `/tracks/{id}/stages` — max 2-3 levels. HTTP verbs semantic GET read POST create PUT replace PATCH partial DELETE remove. Consistent pagination query `?page=&size=`. Error shape ProblemDetails all endpoints.",
          ),
          concept(
            "Non-functional",
            "plan early: `/health`, structured logging, HTTPS, JWT auth matrix, rate limit placeholder, CORS Angular origin. versioning `/api/v1`. seed data story. deployment env vars documented. NFRs in design doc prevent day-before-launch scramble.",
            "Non-functional",
            "Plan early: `/health`, structured logging, HTTPS, JWT auth matrix, rate limit placeholder, CORS Angular origin. Versioning `/api/v1`. Seed data story. Deployment env vars documented. NFRs in design doc prevent day-before-launch scramble.",
          )
        ],
        steps: {
          ar: ["Sketch ERD on paper", "List endpoints table", "Define DTOs C# records", "Swagger annotation draft", "Auth: public read progress write", "Review with checklist"],
          en: ["Sketch ERD on paper", "List endpoints table", "Define DTOs C# records", "Swagger annotation draft", "Auth: public read progress write", "Review with checklist"],
        },
        code: {
          ar: {
            lang: "json",
            source: "{\n  \"paths\": {\n    \"/api/v1/tracks\": { \"get\": { \"summary\": \"List tracks\" }, \"post\": { \"summary\": \"Admin create\" } },\n    \"/api/v1/tracks/{trackId}/stages\": { \"get\": { \"summary\": \"Stages in track\" } },\n    \"/api/v1/progress/{lessonId}\": { \"post\": { \"summary\": \"Mark complete\", \"security\": [{ \"Bearer\": [] }] } }\n  }\n}",
            explain: "OpenAPI fragment — contract قبل التنفيذ.",
          },
          en: {
            lang: "json",
            source: "{\n  \"paths\": {\n    \"/api/v1/tracks\": { \"get\": { \"summary\": \"List tracks\" }, \"post\": { \"summary\": \"Admin create\" } },\n    \"/api/v1/tracks/{trackId}/stages\": { \"get\": { \"summary\": \"Stages in track\" } },\n    \"/api/v1/progress/{lessonId}\": { \"post\": { \"summary\": \"Mark complete\", \"security\": [{ \"Bearer\": [] }] } }\n  }\n}",
            explain: "OpenAPI fragment — contract before implementation.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["God endpoint", "split resources"],
            en: ["God endpoint", "split resources"],
          },
          {
            ar: ["leak entity schema", "DTO layer"],
            en: ["leak entity schema", "DTO layer"],
          },
          {
            ar: ["no error contract", "ProblemDetails everywhere"],
            en: ["no error contract", "ProblemDetails everywhere"],
          },
          {
            ar: ["skip auth design", "matrix early"],
            en: ["skip auth design", "matrix early"],
          },
        ]),
        discussion: [
          qa(
            "REST strict أم pragmatic — كيف أ decide؟",
            "Pragmatic REST wins learning and most products — nouns, verbs HTTP, consistent errors. HATEOAS links optional — skip unless hypermedia clients. GraphQL out of scope. consistency within **your** API matters more than Roy Fielding purity. document conventions in OpenAPI description.",
            "Strict REST or pragmatic — how do I decide?",
            "Pragmatic REST wins learning and most products — nouns, HTTP verbs, consistent errors. HATEOAS links optional — skip unless hypermedia clients. GraphQL out of scope. Consistency within **your** API matters more than Roy Fielding purity. Document conventions in OpenAPI description.",
          ),
          qa(
            "HATEOAS — هل أضيف links في responses؟",
            "optional `_links` `{ self, stages }` in JSON — client discovers URLs. rarely done in mobile/SPA era — clients hardcode routes from OpenAPI. capstone skip — focus CRUD + auth. know term for interviews — not required deliverable.",
            "HATEOAS — should I add links in responses?",
            "Optional `_links` `{ self, stages }` in JSON — client discovers URLs. Rarely done in mobile/SPA era — clients hardcode routes from OpenAPI. Capstone skip — focus CRUD + auth. Know term for interviews — not required deliverable.",
          ),
          qa(
            "GraphQL — لماذا out of scope للمشروع؟",
            "GraphQL flexible queries single endpoint — different paradigm, schema, resolvers, N+1 DataLoader complexity. REST capstone aligns with Angular HttpClient lessons and OpenAPI tooling. learn REST first — GraphQL additive later for flexible mobile clients.",
            "GraphQL — why out of scope for the project?",
            "GraphQL flexible queries single endpoint — different paradigm, schema, resolvers, N+1 DataLoader complexity. REST capstone aligns with Angular HttpClient lessons and OpenAPI tooling. Learn REST first — GraphQL additive later for flexible mobile clients.",
          ),
          qa(
            "Bilingual content في DB — JSON column أم حقول ar/en؟",
            "separate columns `TitleAr`, `TitleEn` — simple queries and indexes. JSON column `{ \"ar\": \"...\", \"en\": \"...\" }` — flexible nested content, EF Core JSON mapping modern. AlefYa platform bilingual — pick one pattern capstone-wide. DTO mirrors storage shape.",
            "Bilingual content in DB — JSON column or ar/en fields?",
            "Separate columns `TitleAr`, `TitleEn` — simple queries and indexes. JSON column `{ \"ar\": \"...\", \"en\": \"...\" }` — flexible nested content, EF Core JSON mapping modern. AlefYa platform bilingual — pick one pattern capstone-wide. DTO mirrors storage shape.",
          )
        ],
        exercises: {
          ar: ["Full endpoint table", "ERD diagram", "CreateTrackDto record", "Role matrix doc"],
          en: ["Full endpoint table", "ERD diagram", "CreateTrackDto record", "Role matrix doc"],
        },
        checklist: {
          ar: ["resources defined", "DTOs listed", "OpenAPI draft", "auth planned", "team review"],
          en: ["resources defined", "DTOs listed", "OpenAPI draft", "auth planned", "team review"],
        },
        nextHint: { ar: "التالي: التنفيذ الكامل.", en: "Next: full implementation." },
      }),
      deepLesson({
        slug: "02-implement",
        order: 2,
        duration: 55,
        title: { ar: "التنفيذ", en: "Implementation" },
        summary: { ar: "بناء Study Path API — EF، endpoints، JWT، tests", en: "Build Study Path API — EF, endpoints, JWT, tests." },
        why: { ar: "تجمع كل المراحل: DbContext مع Track/Stage/Lesson/Progress، Minimal API أو Controllers، Identity+JWT، validation، mapping، repository/services. مشروع runnable واحد.\n\nCommit incremental — migrations، seed AlefYa sample track، Swagger demo، integration test واحد على GET /tracks. هذا الدرس الأطول — خصص وقتاً كاملاً.", en: "You combine all stages: DbContext with Track/Stage/Lesson/Progress, Minimal API or Controllers, Identity+JWT, validation, mapping, repository/services. One runnable project.\n\nCommit incrementally — migrations, seed AlefYa sample track, Swagger demo, one integration test on GET /tracks. Longest lesson — allocate full session." },
        goals: {
          ar: ["Implement entities + migrations", "CRUD tracks/stages/lessons", "Progress endpoint authorized", "Seed aspnet+angular sample data"],
          en: ["Implement entities + migrations", "CRUD tracks/stages/lessons", "Progress endpoint authorized", "Seed aspnet+angular sample data"],
        },
        concepts: [
          concept(
            "Layering",
            "Endpoints/Controllers thin — delegate to Services (business rules) → Repositories optional (data access) → DbContext. **don't** put LINQ in endpoints. each layer testable. folder per feature optional. capstone wires all prior lessons: DI, EF, JWT, validation, mapping.",
            "Layering",
            "Endpoints/Controllers thin — delegate to Services (business rules) → Repositories optional (data access) → DbContext. **Don't** put LINQ in endpoints. Each layer testable. Folder per feature optional. Capstone wires all prior lessons: DI, EF, JWT, validation, mapping.",
          ),
          concept(
            "Mapping",
            "entity → DTO: manual `Select` in query preferred performance. or Mapster/AutoMapper `Adapt<>()` convenience — profile classes. never return EF entity from API — cycles, over-posting, tracking leak. CreateDto → entity manual or mapper in service CreateAsync.",
            "Mapping",
            "Entity → DTO: manual `Select` in query preferred performance. Or Mapster/AutoMapper `Adapt<>()` convenience — profile classes. Never return EF entity from API — cycles, over-posting, tracking leak. CreateDto → entity manual or mapper in service CreateAsync.",
          ),
          concept(
            "Seeding",
            "`HasData` in migration for fixed catalog AlefYa aspnet+angular sample tracks. or `IHostApplicationLifetime`/startup scoped seed idempotent `if (!context.Tracks.Any())`. seed Admin user + roles for demo login. README documents default credentials dev only — change prod.",
            "Seeding",
            "`HasData` in migration for fixed catalog AlefYa aspnet+angular sample tracks. Or `IHostApplicationLifetime`/startup scoped seed idempotent `if (!context.Tracks.Any())`. Seed Admin user + roles for demo login. README documents default credentials dev only — change prod.",
          ),
          concept(
            "Integration test",
            "`WebApplicationFactory<Program>` — `CreateClient()` HTTP GET `/api/v1/tracks` assert 200 + JSON. swap DbContext InMemory or SQLite test DB. optional TestAuthHandler for protected routes. one test proves wiring — expand later regression suite.",
            "Integration test",
            "`WebApplicationFactory<Program>` — `CreateClient()` HTTP GET `/api/v1/tracks` assert 200 + JSON. Swap DbContext InMemory or SQLite test DB. Optional TestAuthHandler for protected routes. One test proves wiring — expand later regression suite.",
          )
        ],
        steps: {
          ar: ["Create StudyPathApi project structure", "Entities + migrations + seed", "Register all services", "Map v1 endpoints", "JWT protect progress POST", "Write TracksIntegrationTest", "Demo Swagger end-to-end"],
          en: ["Create StudyPathApi project structure", "Entities + migrations + seed", "Register all services", "Map v1 endpoints", "JWT protect progress POST", "Write TracksIntegrationTest", "Demo Swagger end-to-end"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "var api = app.MapGroup(\"/api/v1\").RequireAuthorization();\nvar tracks = api.MapGroup(\"/tracks\");\ntracks.MapGet(\"/\", async (ITrackService svc, CancellationToken ct) =>\n  Results.Ok(await svc.ListAsync(ct)));\ntracks.MapPost(\"/\", [Authorize(Policy = \"AdminOnly\")] async (CreateTrackDto dto, ITrackService svc, CancellationToken ct) => {\n  var t = await svc.CreateAsync(dto, ct);\n  return Results.Created($\"/api/v1/tracks/{t.Id}\", t);\n});\napi.MapPost(\"/progress/{lessonId:int}\", async (int lessonId, IUserProgressService prog, ClaimsPrincipal user, CancellationToken ct) => {\n  await prog.MarkCompleteAsync(user.FindFirstValue(ClaimTypes.NameIdentifier)!, lessonId, ct);\n  return Results.NoContent();\n});",
            explain: "v1 groups + admin create + authenticated progress — capstone wiring.",
          },
          en: {
            lang: "csharp",
            source: "var api = app.MapGroup(\"/api/v1\").RequireAuthorization();\nvar tracks = api.MapGroup(\"/tracks\");\ntracks.MapGet(\"/\", async (ITrackService svc, CancellationToken ct) =>\n  Results.Ok(await svc.ListAsync(ct)));\ntracks.MapPost(\"/\", [Authorize(Policy = \"AdminOnly\")] async (CreateTrackDto dto, ITrackService svc, CancellationToken ct) => {\n  var t = await svc.CreateAsync(dto, ct);\n  return Results.Created($\"/api/v1/tracks/{t.Id}\", t);\n});\napi.MapPost(\"/progress/{lessonId:int}\", async (int lessonId, IUserProgressService prog, ClaimsPrincipal user, CancellationToken ct) => {\n  await prog.MarkCompleteAsync(user.FindFirstValue(ClaimTypes.NameIdentifier)!, lessonId, ct);\n  return Results.NoContent();\n});",
            explain: "v1 groups + admin create + authenticated progress — capstone wiring.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["big bang no tests", "incremental vertical slices"],
            en: ["big bang no tests", "incremental vertical slices"],
          },
          {
            ar: ["skip seed data", "demo empty API"],
            en: ["skip seed data", "demo empty API"],
          },
          {
            ar: ["business logic in endpoints", "move to services"],
            en: ["business logic in endpoints", "move to services"],
          },
          {
            ar: ["forget migration commit", "team cannot run"],
            en: ["forget migration commit", "team cannot run"],
          },
        ]),
        discussion: [
          qa(
            "Minimal APIs أم Controllers للمشروع النهائي؟",
            "either OK — **consistency** key. Minimal if capstone built on MapGroup extensions throughout. Controllers if team familiarity or filter-heavy admin area. hybrid acceptable documented — e.g. Minimal public reads, Controllers admin writes. pick day one implement same.",
            "Minimal APIs or Controllers for the capstone?",
            "Either OK — **consistency** key. Minimal if capstone built on MapGroup extensions throughout. Controllers if team familiarity or filter-heavy admin area. Hybrid acceptable documented — e.g. Minimal public reads, Controllers admin writes. Pick day one implement same.",
          ),
          qa(
            "AutoMapper — هل أضيفه أم manual mapping؟",
            "small capstone: manual Select + constructor mapping transparent and fast. AutoMapper/Mapster when 20+ entity/DTO pairs repetitive. package cost learning curve. capstone manual OK — mention Mapster as refactor when DTO count grows.",
            "AutoMapper — should I add it or manual mapping?",
            "Small capstone: manual Select + constructor mapping transparent and fast. AutoMapper/Mapster when 20+ entity/DTO pairs repetitive. Package cost learning curve. Capstone manual OK — mention Mapster as refactor when DTO count grows.",
          ),
          qa(
            "Dockerfile — bonus worthwhile؟",
            "optional `docker build` reproducible deploy teaches container basics — multi-stage `dotnet publish` runtime image. not required pass capstone. CI GitHub Actions `dotnet test` + build more valuable first. Docker bonus if deploying Azure Container Apps.",
            "Dockerfile — is bonus worthwhile?",
            "Optional `docker build` reproducible deploy teaches container basics — multi-stage `dotnet publish` runtime image. Not required pass capstone. CI GitHub Actions `dotnet test` + build more valuable first. Docker bonus if deploying Azure Container Apps.",
          ),
          qa(
            "ربط Angular track — ماذا ي consume من API؟",
            "Angular lessons call your `/api/v1/tracks`, JWT login, progress POST. OpenAPI export `swagger.json` for client codegen optional. CORS localhost:4200 configured lesson 03-harden. bilingual DTOs match Angular i18n. your API becomes real backend — motivation to polish.",
            "Connecting Angular track — what will consume the API?",
            "Angular lessons call your `/api/v1/tracks`, JWT login, progress POST. OpenAPI export `swagger.json` for client codegen optional. CORS localhost:4200 configured lesson 03-harden. Bilingual DTOs match Angular i18n. Your API becomes real backend — motivation to polish.",
          )
        ],
        exercises: {
          ar: ["Full CRUD demo video", "Integration test auth", "Seed 2 tracks", "README run instructions"],
          en: ["Full CRUD demo video", "Integration test auth", "Seed 2 tracks", "README run instructions"],
        },
        checklist: {
          ar: ["migrations apply", "CRUD works", "JWT progress works", "seed data", "1+ integration test"],
          en: ["migrations apply", "CRUD works", "JWT progress works", "seed data", "1+ integration test"],
        },
        nextHint: { ar: "التالي: تأمين وتحسين للإنتاج.", en: "Next: harden and polish for production." },
      }),
      deepLesson({
        slug: "03-harden",
        order: 3,
        duration: 48,
        title: { ar: "تأمين وتحسين", en: "Harden & polish" },
        summary: { ar: "Rate limiting، CORS، global exceptions، deployment checklist", en: "Rate limiting, CORS, global exceptions, deployment checklist." },
        why: { ar: "قبل الإنتاج: **Rate limiting** (.NET 7+), **CORS** for Angular origin, global exception handler → ProblemDetails, HTTPS, security headers, environment secrets, CI build+test.\n\nReview OWASP API top risks — broken auth, excessive data exposure. Performance: caching hot lists, compiled queries optional. Document API for handoff.", en: "Before production: **Rate limiting** (.NET 7+), **CORS** for Angular origin, global exception handler → ProblemDetails, HTTPS, security headers, environment secrets, CI build+test.\n\nReview OWASP API top risks — broken auth, excessive data exposure. Performance: caching hot lists, optional compiled queries. Document API for handoff." },
        goals: {
          ar: ["AddRateLimiter policy", "CORS AllowAngularDev", "Exception handler ProblemDetails", "Deployment + security checklist"],
          en: ["AddRateLimiter policy", "CORS AllowAngularDev", "Exception handler ProblemDetails", "Deployment + security checklist"],
        },
        concepts: [
          concept(
            "Rate limiting",
            ".NET 7+ `AddRateLimiter` — FixedWindow, SlidingWindow, TokenBucket policies. `RequireRateLimiting(\"api\")` on endpoints. returns **429 Too Many Requests** + Retry-After. protect login brute force stricter limit. configure per-user partition by IP or claim.",
            "Rate limiting",
            ".NET 7+ `AddRateLimiter` — FixedWindow, SlidingWindow, TokenBucket policies. `RequireRateLimiting(\"api\")` on endpoints. Returns **429 Too Many Requests** + Retry-After. Protect login brute force stricter limit. Configure per-user partition by IP or claim.",
          ),
          concept(
            "CORS",
            "`AddCors` policy `WithOrigins(\"http://localhost:4200\")` Angular dev. `AllowAnyHeader/Method` JWT APIs common. **AllowAnyOrigin incompatible with AllowCredentials**. production: explicit frontend origins only. preflight OPTIONS automatic. test browser devtools Network.",
            "CORS",
            "`AddCors` policy `WithOrigins(\"http://localhost:4200\")` Angular dev. `AllowAnyHeader/Method` JWT APIs common. **AllowAnyOrigin incompatible with AllowCredentials**. Production: explicit frontend origins only. Preflight OPTIONS automatic. Test browser devtools Network.",
          ),
          concept(
            "Exception handling",
            "`UseExceptionHandler` early pipeline — log ILogger Error, return ProblemDetails generic prod message, DeveloperExceptionPage dev only. never stack trace JSON prod — info disclosure. correlation id in extensions. filter known business exceptions → 409/404 appropriately.",
            "Exception handling",
            "`UseExceptionHandler` early pipeline — log ILogger Error, return ProblemDetails generic prod message, DeveloperExceptionPage dev only. Never stack trace JSON prod — info disclosure. Correlation id in extensions. Filter known business exceptions → 409/404 appropriately.",
          ),
          concept(
            "Deployment",
            "`dotnet publish -c Release` → folder deploy IIS/Kestrel/Linux systemd. connection strings JWT keys env vars. `dotnet ef database update` migrate step CI. health probe `/health` load balancer. HTTPS cert Let's Encrypt or Azure managed.",
            "Deployment",
            "`dotnet publish -c Release` → folder deploy IIS/Kestrel/Linux systemd. Connection strings JWT keys env vars. `dotnet ef database update` migrate step CI. Health probe `/health` load balancer. HTTPS cert Let's Encrypt or Azure managed.",
          )
        ],
        steps: {
          ar: ["AddRateLimiter 100/min", "CORS policy Angular", "Global exception middleware", "Security review checklist", "dotnet publish folder", "Document env vars"],
          en: ["AddRateLimiter 100/min", "CORS policy Angular", "Global exception middleware", "Security review checklist", "dotnet publish folder", "Document env vars"],
        },
        code: {
          ar: {
            lang: "csharp",
            source: "builder.Services.AddCors(o => o.AddPolicy(\"AngularDev\", p =>\n  p.WithOrigins(\"http://localhost:4200\").AllowAnyHeader().AllowAnyMethod()));\nbuilder.Services.AddRateLimiter(o => o.AddFixedWindowLimiter(\"api\", opt => {\n  opt.Window = TimeSpan.FromMinutes(1); opt.PermitLimit = 100;\n}));\n\napp.UseCors(\"AngularDev\");\napp.UseRateLimiter();\napp.UseExceptionHandler(err => err.Run(async ctx => {\n  ctx.Response.StatusCode = 500;\n  await ctx.Response.WriteAsJsonAsync(new { title = \"Server error\" });\n}));",
            explain: "CORS + rate limit + exception handler — production hardening baseline.",
          },
          en: {
            lang: "csharp",
            source: "builder.Services.AddCors(o => o.AddPolicy(\"AngularDev\", p =>\n  p.WithOrigins(\"http://localhost:4200\").AllowAnyHeader().AllowAnyMethod()));\nbuilder.Services.AddRateLimiter(o => o.AddFixedWindowLimiter(\"api\", opt => {\n  opt.Window = TimeSpan.FromMinutes(1); opt.PermitLimit = 100;\n}));\n\napp.UseCors(\"AngularDev\");\napp.UseRateLimiter();\napp.UseExceptionHandler(err => err.Run(async ctx => {\n  ctx.Response.StatusCode = 500;\n  await ctx.Response.WriteAsJsonAsync(new { title = \"Server error\" });\n}));",
            explain: "CORS + rate limit + exception handler — production hardening baseline.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["CORS AllowAnyOrigin + credentials", "invalid combo"],
            en: ["CORS AllowAnyOrigin + credentials", "invalid combo"],
          },
          {
            ar: ["stack trace in prod JSON", "generic message only"],
            en: ["stack trace in prod JSON", "generic message only"],
          },
          {
            ar: ["no rate limit on login", "brute force risk"],
            en: ["no rate limit on login", "brute force risk"],
          },
          {
            ar: ["publish with dev secrets", "env vars production"],
            en: ["publish with dev secrets", "env vars production"],
          },
        ]),
        discussion: [
          qa(
            "WAF Cloudflare/Azure Front Door — هل أحتاجها؟",
            "infra layer beyond app — DDoS, bot filter, geo block. app rate limit still valuable defense in depth. learning project optional. production public API recommended Cloudflare free tier minimum. not coded in ASP.NET — DNS/proxy config.",
            "WAF Cloudflare/Azure Front Door — do I need it?",
            "Infra layer beyond app — DDoS, bot filter, geo block. App rate limit still valuable defense in depth. Learning project optional. Production public API recommended Cloudflare free tier minimum. Not coded in ASP.NET — DNS/proxy config.",
          ),
          qa(
            "API versioning maintenance — متى v2؟",
            "breaking change: rename field, remove endpoint, change auth scheme → new `/api/v2` parallel period deprecate v1. non-breaking add field OK v1. document sunset header `Deprecation`. capstone v1 sufficient — plan versioning policy README for future team.",
            "API versioning maintenance — when v2?",
            "Breaking change: rename field, remove endpoint, change auth scheme → new `/api/v2` parallel period deprecate v1. Non-breaking add field OK v1. Document sunset header `Deprecation`. Capstone v1 sufficient — plan versioning policy README for future team.",
          ),
          qa(
            "Container deploy — Docker health check؟",
            "Dockerfile `HEALTHCHECK CMD curl /health` — orchestrator restarts unhealthy. same `/health` EF check. multi-stage build reduce image size. optional capstone bonus — Azure Container Apps deploy from ACR. publish trim self-contained advanced.",
            "Container deploy — Docker health check?",
            "Dockerfile `HEALTHCHECK CMD curl /health` — orchestrator restarts unhealthy. Same `/health` EF check. Multi-stage build reduce image size. Optional capstone bonus — Azure Container Apps deploy from ACR. Publish trim self-contained advanced.",
          ),
          qa(
            "What's next after completing ASP.NET track؟",
            "Angular track consumes Study Path API — real full stack. extend API: refresh tokens, admin dashboard, Azure deploy. contribute OpenAPI client gen. portfolio README demo video Swagger + Angular screenshot. you built production-shaped API — iterate features.",
            "What's next after completing the ASP.NET track?",
            "Angular track consumes Study Path API — real full stack. Extend API: refresh tokens, admin dashboard, Azure deploy. Contribute OpenAPI client gen. Portfolio README demo video Swagger + Angular screenshot. You built production-shaped API — iterate features.",
          )
        ],
        exercises: {
          ar: ["OWASP checklist review", "429 test rate limit", "CORS preflight test", "Publish to folder run"],
          en: ["OWASP checklist review", "429 test rate limit", "CORS preflight test", "Publish to folder run"],
        },
        checklist: {
          ar: ["rate limit active", "CORS configured", "exceptions safe", "publish works", "README complete"],
          en: ["rate limit active", "CORS configured", "exceptions safe", "publish works", "README complete"],
        },
        nextHint: { ar: "أكملت مسار ASP.NET Core — انتقل لمسار Angular أو وسّع API.", en: "ASP.NET Core track complete — move to Angular track or extend your API." },
      })
    ],
  }
};
