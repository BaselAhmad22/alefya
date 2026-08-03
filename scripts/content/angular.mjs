import { deepLesson, qa, concept, pitfalls } from "./builder.mjs";

export const angularTrack = {
  slug: "angular",
  order: 2,
  title: { ar: "Angular", en: "Angular" },
  tagline: {
    ar: "من TypeScript حتى تطبيق واجهة احترافي",
    en: "From TypeScript to a production-ready UI",
  },
  description: {
    ar: "مسار Angular متكامل يبدأ من TypeScript — اللغة التي يُكتب بها الإطار — ثم ينتقل إلى CLI وبنية التطبيق، المكوّنات، RxJS وSignals، التوجيه، النماذج، HttpClient وإدارة الحالة، مواضيع متقدمة مثل Change Detection والاختبار وSSR، وينتهي بمشروع تطبيقي لواجهة متعلّم. كل درس ثنائي اللغة ومكتفي بذاته: شرح، أمثلة، أخطاء شائعة، تمارين، وقائمة تحقق.",
    en: "A complete Angular path starting with TypeScript — the language the framework is written in — then CLI and app structure, components, RxJS and Signals, routing, forms, HttpClient and state management, advanced topics like change detection, testing, and SSR, ending with a capstone learner UI project. Every lesson is bilingual and self-contained: explanation, examples, common mistakes, exercises, and a checklist.",
  },
  color: "#DD0031",
  estimatedHours: 110,
  stages: [
    "01-typescript",
    "02-fundamentals",
    "03-components",
    "04-rxjs",
    "05-routing",
    "06-forms",
    "07-http-state",
    "08-advanced",
    "09-project",
  ],
};

export const angularStages = {
  "01-typescript": {
    meta: {
      slug: "01-typescript",
      order: 1,
      title: { ar: "أساسيات TypeScript", en: "TypeScript foundations" },
      description: { ar: "اللغة التي يُكتب بها Angular", en: "The language Angular is written in" },
      lessons: [
        "01-why-typescript.json",
        "02-types-interfaces.json",
        "03-classes-modules.json",
        "04-generics-utility.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-why-typescript",
        order: 1,
        duration: 40,
        title: { ar: "لماذا TypeScript مع Angular؟", en: "Why TypeScript with Angular?" },
        summary: { ar: "فهم العلاقة بين Angular وTypeScript ولماذا الأنواع ضرورية في مشاريع الواجهة الكبيرة.", en: "Understand why Angular is TypeScript-first and why types matter in large front-end codebases." },
        why: { ar: "Angular مبني رسمياً على TypeScript وليس JavaScript العادي. الفريق صمّم الإطار ليعتمد على الأنواع في حقن التبعيات، قوالب المكوّنات، والتحقق من صحة الإدخالات. عندما تكتب `@Component` أو `@Injectable`، TypeScript يضمن أن البيانات متسقة قبل التشغيل — مثلاً أن `@Input() lesson` يستقبل كائناً يطابق `Lesson` وليس `undefined` بصمت.\n\nبدون TypeScript، مشروع Angular يتحول بسرعة إلى ملفات يصعب تتبع شكل البيانات فيها. المحرّر يفقد الإكمال التلقائي وRefactoring يصبح مخاطرة. Angular Language Service يربط `.html` بالكلاس — بدون types يختفي هذا الجسر. في هذا الدرس تبني الأساس: Angular منظومة types-first وليست JS مع decorators فقط.", en: "Angular is officially built on TypeScript, not plain JavaScript. The framework relies on types for dependency injection, component templates, and input validation. When you write `@Component` or `@Injectable`, TypeScript ensures consistency before runtime — e.g. `@Input() lesson` receives an object matching `Lesson`, not silently `undefined`.\n\nWithout TypeScript, an Angular project becomes files where data shapes are hard to trace. Editors lose autocomplete and refactoring gets risky. Angular Language Service links `.html` to the class — without types that bridge disappears. Here you build the foundation: Angular is a types-first system, not just JS with decorators." },
        goals: {
          ar: ["شرح لماذا Angular يعتمد TypeScript افتراضياً", "تمييز فوائد الأنواع: IDE، refactoring، واكتشاف الأخطاء", "كتابة interfaces ودوال typed لنماذج AlefYa", "ربط TypeScript بمسار Angular الكامل"],
          en: ["Explain why Angular defaults to TypeScript", "Identify type benefits: IDE, refactoring, early errors", "Write interfaces and typed functions for AlefYa models", "Connect TypeScript to the full Angular track"],
        },
        concepts: [
          concept(
            "TypeScript = JavaScript + أنواع ثابتة",
            "TypeScript يترجم إلى JavaScript — المتصفح لا يرى الأنواع. annotations مثل `name: string` و`duration: number` تُفحص عند الترجمة (`tsc`). في Angular `@Input({ required: true }) lesson!: Lesson` يحمي القالب: إذا مرّرت `{ slug: 1 }` يفشل البناء قبل `ng serve`. **Structural typing** يعني أن أي كائن يطابق الشكل مقبول — لا حاجة لـ `implements` صريح في كل مكان.",
            "TypeScript = JavaScript + static types",
            "TypeScript compiles to JavaScript — browsers never see types. Annotations like `name: string` and `duration: number` are checked at compile time (`tsc`). In Angular `@Input({ required: true }) lesson!: Lesson` protects templates: passing `{ slug: 1 }` fails the build before `ng serve`. **Structural typing** means any object matching the shape is accepted — no explicit `implements` everywhere.",
          ),
          concept(
            "Angular CLI وبيئة التطوير",
            "Angular CLI ينشئ `tsconfig.json` مع `strict` افتراضياً في المشاريع الحديثة. **Angular Language Service** يحلل القالب: ينبهك إذا استخدمت `lesson.titel` بدل `title`. **Schematics** (`ng generate component`) تنتج ملفات typed. بدون TypeScript تفقد هذه الأدوات 80% من قيمتها — وتعود لأخطاء runtime في المتصفح.",
            "Angular CLI & dev tooling",
            "Angular CLI scaffolds `tsconfig.json` with `strict` by default in modern projects. **Angular Language Service** analyzes templates: it warns if you write `lesson.titel` instead of `title`. **Schematics** (`ng generate component`) emit typed files. Without TypeScript these tools lose most of their value — and runtime errors return to the browser.",
          ),
          concept(
            "Strict mode والأمان",
            "`\"strict\": true` في tsconfig يفعّل `strictNullChecks` و`noImplicitAny`. صارم لكنه يمنع `Cannot read property of undefined` في القوالب. في AlefYa، `title: Record<Locale, string>` مع strict يمنع نسيان `en` أو `ar`. ابدأ strict من اليوم الأول — إضافته لاحقاً على codebase كبير مكلف.",
            "Strict mode & safety",
            "`\"strict\": true` in tsconfig enables `strictNullChecks` and `noImplicitAny`. Strict but prevents `Cannot read property of undefined` in templates. In AlefYa, `title: Record<Locale, string>` with strict blocks missing `en` or `ar`. Start strict on day one — adding it later to a large codebase is expensive.",
          ),
          concept(
            "الأنواع كتوثيق حي",
            "interface `Lesson` يصف العقد — أي مطور يقرأ الملف يفهم البيانات دون wiki خارجي. JSDoc ي complement الأنواع لكن TS ي enforce. عند تغيير API، compiler ي列出 كل المواقع المتأثرة. في teams متعددة اللغات (ar/en) هذا يقلل سوء الفهم.",
            "Types as living documentation",
            "An `Lesson` interface describes the contract — developers understand data without an external wiki. JSDoc complements types but TS enforces. When APIs change, the compiler lists every affected site. In bilingual teams (ar/en) this reduces miscommunication.",
          ),
        ],
        steps: {
          ar: ["ثبّت Node LTS (20+) وAngular CLI عبر `npm i -g @angular/cli`", "أنشئ `lesson-models.ts` بinterface `Bilingual` و`LessonMeta`", "اكتب `formatTitle(l: LessonMeta, loc: 'ar' | 'en')` ولاحظ autocomplete", "شغّل `tsc --noEmit` وعمّد خطأ typing متعمداً", "فعّل `strict: true` في tsconfig واصلح التحذيرات", "اربط الملف بفكرة `@Input() lesson!: LessonMeta` في دروس لاحقة"],
          en: ["Install Node LTS (20+) and Angular CLI via `npm i -g @angular/cli`", "Create `lesson-models.ts` with `Bilingual` and `LessonMeta` interfaces", "Write `formatTitle(l: LessonMeta, loc: 'ar' | 'en')` and notice autocomplete", "Run `tsc --noEmit` and intentionally trigger a typing error", "Enable `strict: true` in tsconfig and fix warnings", "Connect the file to `@Input() lesson!: LessonMeta` in later lessons"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "interface Bilingual { ar: string; en: string; }\ninterface LessonMeta {\n  slug: string;\n  duration: number;\n  title: Bilingual;\n}\n\nfunction formatTitle(l: LessonMeta, loc: keyof Bilingual): string {\n  return `[${l.duration}د] ${l.title[loc]}`;\n}\n\nconst sample: LessonMeta = {\n  slug: \"01-why-typescript\",\n  duration: 40,\n  title: { ar: \"لماذا TypeScript؟\", en: \"Why TypeScript?\" },\n};",
            explain: "نمط bilingual + keyof يتكرر في تطبيقات AlefYa — نفس الشكل سيظهر في @Input وHttpClient.",
          },
          en: {
            lang: "typescript",
            source: "interface Bilingual { ar: string; en: string; }\ninterface LessonMeta {\n  slug: string;\n  duration: number;\n  title: Bilingual;\n}\n\nfunction formatTitle(l: LessonMeta, loc: keyof Bilingual): string {\n  return `[${l.duration}m] ${l.title[loc]}`;\n}\n\nconst sample: LessonMeta = {\n  slug: \"01-why-typescript\",\n  duration: 40,\n  title: { ar: \"لماذا TypeScript؟\", en: \"Why TypeScript?\" },\n};",
            explain: "Bilingual + keyof pattern repeats in AlefYa apps — same shape appears in @Input and HttpClient.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["استخدام any في كل مكان", "ابق strict — any يلغي فوائد Angular tooling"],
            en: ["using any everywhere", "stay strict — any disables Angular tooling benefits"],
          },
          {
            ar: ["اعتبار TS لغة منفصلة عن JS", "TS امتداد JS — كل JS صالح تقريباً"],
            en: ["treating TS as unrelated to JS", "TS extends JS — almost all JS is valid"],
          },
          {
            ar: ["تجاهل أخطاء tsc والاعتماد على ng serve فقط", "أصلح أخطاء TS فوراً — Language Service يعتمد عليها"],
            en: ["ignoring tsc and relying only on ng serve", "fix TS errors immediately — Language Service depends on them"],
          },
          {
            ar: ["كتابة JS قديم بدون types في مشروع Angular جديد", "حوّل models إلى interfaces من البداية"],
            en: ["writing old JS without types in new Angular projects", "convert models to interfaces from day one"],
          },
        ]),
        discussion: [
          qa(
            "هل يمكن Angular بـ JavaScript فقط؟",
            "Angular CLI يدعم JS نظرياً لكن TS هو المسار الرسمي والموثّق — كل schematics وexamples typed.",
            "Can Angular use plain JavaScript?",
            "CLI supports JS theoretically but TS is the official, documented path — all schematics and examples are typed.",
          ),
          qa(
            "هل أحتاج إتقان TS كاملاً قبل Angular؟",
            "أساسيات المرحلة 01 كافية — generics وutility types في الدرس 04، ثم تطبّق أثناء Angular.",
            "Must I master TS fully before Angular?",
            "Stage 01 foundations suffice — generics in lesson 04, then apply while building Angular.",
          ),
          qa(
            "ما الفرق بين .ts و.tsx؟",
            "Angular يستخدم .ts + .html منفصلين — لا JSX. القالب في ملف template أو inline string.",
            "What's the difference between .ts and .tsx?",
            "Angular uses separate .ts + .html — no JSX. Templates live in template files or inline strings.",
          ),
          qa(
            "110 ساعة للمسار — هل واقعي؟",
            "نعم لمسار شامل: TS، RxJS، forms، HTTP، testing، ومشروع capstone — يمكن التكييف حسب خبرتك.",
            "110 hours — is that realistic?",
            "Yes for a full path: TS, RxJS, forms, HTTP, testing, capstone — adjust to your experience.",
          ),
        ],
        exercises: {
          ar: ["أضف `draft?: boolean` لـ LessonMeta واختبر Partial", "اكتب `assertDuration(n: number): asserts n is 35|40|45`", "عرّف `type Locale = 'ar' | 'en'` واستخدمه بدل keyof", "اقرأ رسالة خطأ tsc واشرحها لزميل"],
          en: ["Add `draft?: boolean` to LessonMeta and try Partial", "Write `assertDuration(n: number): asserts n is 35|40|45`", "Define `type Locale = 'ar' | 'en'` and use instead of keyof", "Read a tsc error message and explain it to a peer"],
        },
        checklist: {
          ar: ["أعرف لماذا Angular TypeScript-first", "كتبت interface + دالة typed", "قرأت خطأ مترجم وفهمته", "strict mode مفعّل", "جاهز لدرس الأنواع والواجهات"],
          en: ["Know why Angular is TypeScript-first", "Wrote interface + typed function", "Read and understood a compiler error", "strict mode enabled", "Ready for types & interfaces lesson"],
        },
        nextHint: { ar: "الدرس التالي: union types، literal types، interface مقابل type alias.", en: "Next: union types, literal types, interface vs type alias." },
      }),
      deepLesson({
        slug: "02-types-interfaces",
        order: 2,
        duration: 45,
        title: { ar: "الأنواع والواجهات", en: "Types & interfaces" },
        summary: { ar: "union types، literal types، interface وtype alias — لبنات نماذج Angular.", en: "Union types, literals, interfaces, and type aliases — building blocks for Angular models." },
        why: { ar: "في Angular كل `@Input()` و`FormControl<string>` واستجابة `HttpClient.get<Lesson[]>()` تحتاج شكل بيانات واضح. union `'ar' | 'en'` يمنع locale خاطئ في runtime. interfaces تصف `Lesson` و`Track` — نفس الكائنات في القالب والخدمة والـ API.\n\nالفرق بين interface وtype alias يظهر عند التوسيع والاتحادات. `Record<Locale, string>` لخرائط العناوين ثنائية اللغة. `Partial<Lesson>` لمسودات التحرير. Generics في الدرس التالي — لكن union وliteral أساس كل نموذج Angular.", en: "In Angular every `@Input()`, `FormControl<string>`, and `HttpClient.get<Lesson[]>()` response needs a clear shape. Union `'ar' | 'en'` blocks invalid locales at compile time. Interfaces describe `Lesson` and `Track` — same objects in template, service, and API.\n\nInterface vs type alias matters for extension and unions. `Record<Locale, string>` for bilingual title maps. `Partial<Lesson>` for edit drafts. Generics come next — but unions and literals underpin every Angular model." },
        goals: {
          ar: ["كتابة union وliteral types للقيم المحدودة", "اختيار interface أو type alias بوعي", "استخدام Record وPartial وReadonly للنماذج", "تطبيق نموذج Lesson كامل لـ AlefYa"],
          en: ["Write union and literal types for fixed sets", "Choose interface or type alias deliberately", "Use Record, Partial, and Readonly for models", "Apply a full Lesson model for AlefYa"],
        },
        concepts: [
          concept(
            "Union وLiteral types",
            "`type Locale = 'ar' | 'en'` يقبل قيمتين فقط — IDE autocomplete يعرضهما. `type StageSlug = '01-typescript' | '02-fundamentals'` يمنع typo في routes. **Discriminated unions** مثل `{ kind: 'lesson'; slug: string } | { kind: 'track'; id: string }` تسهّل switch في services.",
            "Union & literal types",
            "`type Locale = 'ar' | 'en'` accepts only two values — IDE autocomplete lists them. `type StageSlug = '01-typescript' | '02-fundamentals'` prevents route typos. **Discriminated unions** like `{ kind: 'lesson'; slug: string } | { kind: 'track'; id: string }` simplify service switches.",
          ),
          concept(
            "Interfaces للكائنات",
            "interface `Lesson` قابل للـ `extends` و**declaration merging** (نادر في Angular). مفضل لـ DTOs و`@Input()` models. `interface Track { slug: string; stages: StageSlug[] }` يوثّق API contract.",
            "Interfaces for objects",
            "interface `Lesson` supports `extends` and **declaration merging** (rare in Angular). Prefer for DTOs and `@Input()` models. `interface Track { slug: string; stages: StageSlug[] }` documents API contracts.",
          ),
          concept(
            "Type aliases للتحويلات",
            "type `LessonId = string` للوضوح. type `LessonOrTrack = Lesson | Track` للاتحادات. type aliases لا تدعم merging — أفضل لل unions وmapped types لاحقاً.",
            "Type aliases for transforms",
            "type `LessonId = string` for clarity. type `LessonOrTrack = Lesson | Track` for unions. Type aliases don't support merging — better for unions and later mapped types.",
          ),
          concept(
            "Record وPartial وReadonly",
            "`Record<Locale, string>` لخرائط `{ ar: '...', en: '...' }`. `Partial<Lesson>` كل الحقول optional — مفيد لـ PATCH forms. `Readonly<Lesson>` يمنع mutation في OnPush components.",
            "Record, Partial & Readonly",
            "`Record<Locale, string>` for `{ ar: '...', en: '...' }` maps. `Partial<Lesson>` makes all fields optional — useful for PATCH forms. `Readonly<Lesson>` prevents mutation in OnPush components.",
          ),
        ],
        steps: {
          ar: ["عرّف `type Locale = 'ar' | 'en'`", "أنشئ `interface Lesson` مع `title: Record<Locale, string>`", "type alias `LessonId = string`", "اكتب `type LessonDraft = Partial<Lesson>`", "اختبر خطأ: `title: { ar: 'x' }` بدون en", "اربط Lesson بفكرة HttpClient.get<Lesson[]>()"],
          en: ["Define `type Locale = 'ar' | 'en'`", "Create `interface Lesson` with `title: Record<Locale, string>`", "type alias `LessonId = string`", "Write `type LessonDraft = Partial<Lesson>`", "Test error: `title: { ar: 'x' }` without en", "Connect Lesson to HttpClient.get<Lesson[]>() idea"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "type Locale = \"ar\" | \"en\";\n\ninterface Lesson {\n  slug: string;\n  duration: number;\n  title: Record<Locale, string>;\n  completed?: boolean;\n}\n\ntype LessonDraft = Partial<Lesson>;\n\nfunction displayTitle(l: Lesson, loc: Locale): string {\n  return l.title[loc];\n}\n\nconst draft: LessonDraft = { slug: \"draft-lesson\" };",
            explain: "Lesson + Locale + Partial — نموذج AlefYa يُستخدم في services وforms لاحقاً.",
          },
          en: {
            lang: "typescript",
            source: "type Locale = \"ar\" | \"en\";\n\ninterface Lesson {\n  slug: string;\n  duration: number;\n  title: Record<Locale, string>;\n  completed?: boolean;\n}\n\ntype LessonDraft = Partial<Lesson>;\n\nfunction displayTitle(l: Lesson, loc: Locale): string {\n  return l.title[loc];\n}\n\nconst draft: LessonDraft = { slug: \"draft-lesson\" };",
            explain: "Lesson + Locale + Partial — AlefYa model used in services and forms later.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["string بدل union للقيم المحدودة", "استخدم literal union — compiler يصيد typos"],
            en: ["string instead of union for fixed sets", "use literal union — compiler catches typos"],
          },
          {
            ar: ["interface وtype مكرران لنفس الشكل", "اختر واحداً للفريق — وثّق في style guide"],
            en: ["duplicate interface and type for same shape", "pick one per team — document in style guide"],
          },
          {
            ar: ["Partial للحقول الإلزامية في API", "استخدم Required<Pick<>> أو validation منفصل"],
            en: ["Partial for required API fields", "use Required<Pick<>> or separate validation"],
          },
          {
            ar: ["Record<string, any>", "typed keys: Record<Locale, string>"],
            en: ["Record<string, any>", "typed keys: Record<Locale, string>"],
          },
        ]),
        discussion: [
          qa(
            "interface أم type للـ DTOs؟",
            "interface للكائنات القابلة للتوسيع؛ type لل unions والـ utility transforms.",
            "interface or type for DTOs?",
            "interface for extensible objects; type for unions and utility transforms.",
          ),
          qa(
            "متى readonly على الحقول؟",
            "للكائنات التي لا تُعدّل بعد fetch — يحمي OnPush من mutation غير مقصود.",
            "When readonly on fields?",
            "For objects not mutated after fetch — protects OnPush from accidental mutation.",
          ),
          qa(
            "enum أم union string؟",
            "union string أفضل في Angular — tree-shaking أفضل ولا runtime object.",
            "enum or string union?",
            "string union is better in Angular — better tree-shaking, no runtime object.",
          ),
          qa(
            "Pick وOmit؟",
            "في الدرس 04 مع generics — Omit<Lesson,'content'> لقائمة مختصرة.",
            "Pick and Omit?",
            "In lesson 04 with generics — Omit<Lesson,'content'> for summary lists.",
          ),
        ],
        exercises: {
          ar: ["interface Track بـ stages: StageSlug[]", "Omit<Lesson, 'duration'> لعرض بطاقة", "أخطئ في locale — اقرأ الخطأ", "merge واجهتين بـ extends"],
          en: ["Track interface with stages: StageSlug[]", "Omit<Lesson, 'duration'> for card display", "Break locale — read the error", "merge interfaces with extends"],
        },
        checklist: {
          ar: ["union type Locale", "interface Lesson كامل", "Partial وRecord", "فهمت interface vs type", "جاهز classes وmodules"],
          en: ["Locale union type", "full Lesson interface", "Partial and Record", "understand interface vs type", "ready for classes & modules"],
        },
        nextHint: { ar: "التالي: ES classes، access modifiers، export/import.", en: "Next: ES classes, access modifiers, export/import." },
      }),
      deepLesson({
        slug: "03-classes-modules",
        order: 3,
        duration: 42,
        title: { ar: "الفئات والوحدات", en: "Classes & modules" },
        summary: { ar: "ES modules، access modifiers، وclasses — أساس @Component و@Injectable.", en: "ES modules, access modifiers, and classes — foundation of @Component and @Injectable." },
        why: { ar: "كل مكوّن Angular هو export class مع decorator `@Component`. Services هي classes مع `@Injectable` وconstructor injection: `constructor(private http: HttpClient)`. **public** properties فقط تظهر في القالب — `private` لل state الداخلي.\n\nES modules (`import`/`export`) تنظم المشروع: feature folders، barrel `index.ts`، tree-shaking. فهم modules قبل CLI يجعل `ng generate` ومسارات الاستيراد منطقية. في AlefYa، `LessonService` و`TrackProgress` classes ستصبح services.", en: "Every Angular component is an export class with `@Component`. Services are classes with `@Injectable` and constructor injection: `constructor(private http: HttpClient)`. Only **public** properties appear in templates — `private` for internal state.\n\nES modules (`import`/`export`) organize the project: feature folders, barrel `index.ts`, tree-shaking. Understanding modules before CLI makes `ng generate` and import paths obvious. In AlefYa, `LessonService` and `TrackProgress` classes become services." },
        goals: {
          ar: ["كتابة classes مع public/private/protected", "استخدام constructor shorthand وreadonly", "تنظيم export/import وbarrel files", "ربط class بمكوّن Angular في الدرس التالي"],
          en: ["Write classes with public/private/protected", "Use constructor shorthand and readonly", "Organize export/import and barrel files", "Connect class to Angular component in next lesson"],
        },
        concepts: [
          concept(
            "Class syntax في TypeScript",
            "class `TrackProgress` مع constructor وmethods. Angular يستخدم classes لل state وlifecycle hooks (`ngOnInit`). **Parameter properties**: `constructor(private readonly store: Set<string>)` يعرّف وي assign في سطر واحد.",
            "Class syntax in TypeScript",
            "class `TrackProgress` with constructor and methods. Angular uses classes for state and lifecycle hooks (`ngOnInit`). **Parameter properties**: `constructor(private readonly store: Set<string>)` declares and assigns in one line.",
          ),
          concept(
            "Access modifiers والقالب",
            "القالب يرى public members فقط. `protected` للوراثة بين مكوّنات. `#field` private at runtime (ES2022) — Angular style guide ي prefer TS modifiers.",
            "Access modifiers & templates",
            "Templates see public members only. `protected` for component inheritance. `#field` is runtime-private (ES2022) — Angular style guide prefers TS modifiers.",
          ),
          concept(
            "ES modules",
            "`export class LessonService` — `import { LessonService } from './lesson.service'`. **Named exports** أوضح من default في Angular codebases. مسارات نسبية `./` vs alias `@app/` في tsconfig paths.",
            "ES modules",
            "`export class LessonService` — `import { LessonService } from './lesson.service'`. **Named exports** are clearer than default in Angular codebases. Relative `./` vs alias `@app/` in tsconfig paths.",
          ),
          concept(
            "Barrel files",
            "`index.ts` يعيد export من feature folder — `import { TrackCard, TrackList } from './tracks'`. احذر **circular imports** بين barrel وservice.",
            "Barrel files",
            "`index.ts` re-exports from a feature folder — `import { TrackCard, TrackList } from './tracks'`. Watch **circular imports** between barrels and services.",
          ),
        ],
        steps: {
          ar: ["اكتب `TrackProgress` class مع private Set<string>", "أضف public getter `count`", "export من `track-progress.ts`", "أنشئ barrel `index.ts`", "import في ملف آخر", "خطط تحويلها لـ @Injectable service"],
          en: ["Write `TrackProgress` class with private Set<string>", "Add public getter `count`", "export from `track-progress.ts`", "Create barrel `index.ts`", "import in another file", "Plan conversion to @Injectable service"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "export class TrackProgress {\n  constructor(private readonly completed = new Set<string>()) {}\n\n  mark(slug: string): void {\n    this.completed.add(slug);\n  }\n\n  isDone(slug: string): boolean {\n    return this.completed.has(slug);\n  }\n\n  get count(): number {\n    return this.completed.size;\n  }\n}",
            explain: "نمط state class — سيصبح @Injectable({ providedIn: 'root' }) مع signals لاحقاً.",
          },
          en: {
            lang: "typescript",
            source: "export class TrackProgress {\n  constructor(private readonly completed = new Set<string>()) {}\n\n  mark(slug: string): void {\n    this.completed.add(slug);\n  }\n\n  isDone(slug: string): boolean {\n    return this.completed.has(slug);\n  }\n\n  get count(): number {\n    return this.completed.size;\n  }\n}",
            explain: "State class pattern — becomes @Injectable({ providedIn: 'root' }) with signals later.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["private property في القالب", "public أو protected للقالب"],
            en: ["private property in template", "public or protected for template"],
          },
          {
            ar: ["default export لكل service", "named exports — أسهل refactor"],
            en: ["default export for every service", "named exports — easier refactor"],
          },
          {
            ar: ["circular imports بين barrels", "استورد مباشرة من source file"],
            en: ["circular imports between barrels", "import directly from source file"],
          },
          {
            ar: ["logic ثقيل في constructor", "ngOnInit للتهيئة — constructor لل DI فقط"],
            en: ["heavy logic in constructor", "ngOnInit for init — constructor for DI only"],
          },
        ]),
        discussion: [
          qa(
            "arrow methods في class؟",
            "stable `this` في callbacks — مفيد في event handlers.",
            "arrow methods in class?",
            "stable `this` in callbacks — useful in event handlers.",
          ),
          qa(
            "implements interface؟",
            "نعم للعقود — `implements OnInit` ي enforce ngOnInit.",
            "implements interface?",
            "yes for contracts — `implements OnInit` enforces ngOnInit.",
          ),
          qa(
            "abstract class؟",
            "قاعدة مشتركة للمكوّنات — نادر في Angular حديث.",
            "abstract class?",
            "shared component base — rare in modern Angular.",
          ),
          qa(
            "# private vs private?",
            "# runtime private؛ TS private compile-time only.",
            "# private vs private?",
            "# runtime private; TS private compile-time only.",
          ),
        ],
        exercises: {
          ar: ["extend TrackProgress بـ reset()", "barrel file لـ models/", "fix circular import", "readonly على completed Set"],
          en: ["extend TrackProgress with reset()", "barrel file for models/", "fix circular import", "readonly on completed Set"],
        },
        checklist: {
          ar: ["class + modifiers", "export/import يعمل", "public getter للقالب", "barrel file", "جاهز generics"],
          en: ["class + modifiers", "export/import works", "public getter for template", "barrel file", "ready for generics"],
        },
        nextHint: { ar: "التالي: generics وutility types (Partial/Pick/Omit).", en: "Next: generics and utility types (Partial/Pick/Omit)." },
      }),
      deepLesson({
        slug: "04-generics-utility",
        order: 4,
        duration: 48,
        title: { ar: "Generics والأنواع المساعدة", en: "Generics & utility types" },
        summary: { ar: "Generic functions، Partial/Pick/Omit، وربطها بـ HttpClient وReactive Forms.", en: "Generic functions, Partial/Pick/Omit, tied to HttpClient and reactive forms." },
        why: { ar: "`HttpClient.get<Lesson[]>('/api/lessons')` — generic T هو شكل JSON. بدون T ترجع `Observable<Object>` وفقدت autocomplete. Reactive forms typed: `FormGroup<{ title: FormControl<string> }>`.\n\nUtility types `Partial`, `Pick`, `Omit`, `Readonly` تختصر CRUD. `Observable<T>`, `Signal<T>`, `EventEmitter<T>` — كل Angular reactivity generics. إتقانها قبل RxJS stage يرفع جودة services.", en: "`HttpClient.get<Lesson[]>('/api/lessons')` — generic T is the JSON shape. Without T you get `Observable<Object>` and lose autocomplete. Typed reactive forms: `FormGroup<{ title: FormControl<string> }>`.\n\nUtility types `Partial`, `Pick`, `Omit`, `Readonly` shorten CRUD. `Observable<T>`, `Signal<T>`, `EventEmitter<T>` — all Angular reactivity is generic. Master them before the RxJS stage for better services." },
        goals: {
          ar: ["كتابة generic functions مع constraints", "تطبيق Partial/Pick/Omit/Readonly", "تصميم ApiResponse<T> wrapper", "ربط T بـ HttpClient.get<T>()"],
          en: ["Write generic functions with constraints", "Apply Partial/Pick/Omit/Readonly", "Design ApiResponse<T> wrapper", "Connect T to HttpClient.get<T>()"],
        },
        concepts: [
          concept(
            "Generic functions",
            "`function first<T>(items: T[]): T | undefined` — T يُستنتج من الوسيط. **Constraints**: `T extends { id: string }` يضمن وجود id.",
            "Generic functions",
            "`function first<T>(items: T[]): T | undefined` — T inferred from argument. **Constraints**: `T extends { id: string }` ensures id exists.",
          ),
          concept(
            "Generic interfaces",
            "`interface ApiResponse<T> { data: T; ok: boolean; error?: string }` — wrapper لكل API call في AlefYa.",
            "Generic interfaces",
            "`interface ApiResponse<T> { data: T; ok: boolean; error?: string }` — wrapper for every AlefYa API call.",
          ),
          concept(
            "Utility types",
            "`Pick<Lesson, 'slug' | 'title'>` لقوائم. `Omit<Lesson, 'content'>` للبطاقات. `Readonly<Track>` بعد fetch.",
            "Utility types",
            "`Pick<Lesson, 'slug' | 'title'>` for lists. `Omit<Lesson, 'content'>` for cards. `Readonly<Track>` after fetch.",
          ),
          concept(
            "Observable<T> preview",
            "RxJS `Observable<Lesson[]>` — stage 04-rxjs يوسّع. الآن: typed HttpClient returns Observable<T>.",
            "Observable<T> preview",
            "RxJS `Observable<Lesson[]>` — stage 04-rxjs expands. Now: typed HttpClient returns Observable<T>.",
          ),
        ],
        steps: {
          ar: ["اكتب `function wrap<T>(value: T)`", "ApiResponse<T> interface", "Pick<Lesson, 'slug'|'title'>", "Readonly على config", "Partial<Lesson> لمسودة", "HttpClient.get<Lesson[]> typing"],
          en: ["Write `function wrap<T>(value: T)`", "ApiResponse<T> interface", "Pick<Lesson, 'slug'|'title'>", "Readonly on config", "Partial<Lesson> for draft", "HttpClient.get<Lesson[]> typing"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "interface ApiResponse<T> {\n  data: T;\n  ok: boolean;\n}\n\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\ntype LessonCard = Pick<Lesson, \"slug\" | \"title\" | \"duration\">;\ntype LessonDraft = Partial<Lesson>;\n\n// في service لاحقاً:\n// this.http.get<ApiResponse<Lesson[]>>(\"/api/lessons\")",
            explain: "أنماط services وforms — ApiResponse wrapper موحّد.",
          },
          en: {
            lang: "typescript",
            source: "interface ApiResponse<T> {\n  data: T;\n  ok: boolean;\n}\n\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\ntype LessonCard = Pick<Lesson, \"slug\" | \"title\" | \"duration\">;\ntype LessonDraft = Partial<Lesson>;\n\n// in service later:\n// this.http.get<ApiResponse<Lesson[]>>(\"/api/lessons\")",
            explain: "Service and form patterns — unified ApiResponse wrapper.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["T = any في HttpClient", "حدّد T دائماً — get<Lesson[]>"],
            en: ["T = any in HttpClient", "always specify T — get<Lesson[]>"],
          },
          {
            ar: ["utility types overkill", "ابدأ interface — أضف Pick عند الحاجة"],
            en: ["utility type overkill", "start with interface — add Pick when needed"],
          },
          {
            ar: ["nested Partial<Partial<T>>", "explicit optional fields أو schema validation"],
            en: ["nested Partial<Partial<T>>", "explicit optional fields or schema validation"],
          },
          {
            ar: ["تجاهل generic EventEmitter", "EventEmitter<Lesson> للـ @Output"],
            en: ["ignoring generic EventEmitter", "EventEmitter<Lesson> for @Output"],
          },
        ]),
        discussion: [
          qa(
            "infer T من return؟",
            "TypeScript ي infer من args غالباً — explicit عند ambiguity.",
            "infer T from return?",
            "TS infers from args usually — explicit when ambiguous.",
          ),
          qa(
            "keyof مع Pick?",
            "Pick<T, keyof T> = T — Pick<T, 'a'|'b'> subset.",
            "keyof with Pick?",
            "Pick<T, keyof T> = T — Pick<T, 'a'|'b'> subset.",
          ),
          qa(
            "unknown vs any?",
            "unknown أفضل — force narrowing قبل use.",
            "unknown vs any?",
            "unknown is safer — forces narrowing before use.",
          ),
          qa(
            "Signal<T>؟",
            "stage 04-rxjs lesson 03.",
            "Signal<T>?",
            "stage 04-rxjs lesson 03.",
          ),
        ],
        exercises: {
          ar: ["first<T> مع constraint", "Omit<Lesson,'content'>", "Readonly<Track>", "ApiResponse<Lesson[]>"],
          en: ["first<T> with constraint", "Omit<Lesson,'content'>", "Readonly<Track>", "ApiResponse<Lesson[]>"],
        },
        checklist: {
          ar: ["generic function", "Pick/Omit/Partial", "ApiResponse<T>", "HttpClient typing", "جاهز Angular CLI"],
          en: ["generic function", "Pick/Omit/Partial", "ApiResponse<T>", "HttpClient typing", "ready for Angular CLI"],
        },
        nextHint: { ar: "التالي: Angular CLI وإنشاء workspace.", en: "Next: Angular CLI and workspace setup." },
      })
    ],
  },
  "02-fundamentals": {
    meta: {
      slug: "02-fundamentals",
      order: 2,
      title: { ar: "أساسيات Angular", en: "Angular fundamentals" },
      description: { ar: "CLI، البنية، وأول مكوّن", en: "CLI, structure, and your first component" },
      lessons: [
        "01-cli-workspace.json",
        "02-app-structure.json",
        "03-first-component.json",
        "04-standalone.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-cli-workspace",
        order: 1,
        duration: 45,
        title: { ar: "Angular CLI ومساحة العمل", en: "Angular CLI & workspace" },
        summary: { ar: "إنشاء مشروع Angular، فهم workspace، وng serve.", en: "Create an Angular project, understand the workspace, and ng serve." },
        why: { ar: "Angular CLI (`ng`) ينشئ مشروعاً موحّد البنية: `angular.json`، `tsconfig`، standalone components افتراضياً. بدون CLI تضيع ساعات في webpack/esbuild config. `ng generate component track-card` ينتج ملفات متسقة.\n\nworkspace يحتوي projects — غالباً `alefya-ui` واحد. `ng serve` يشغّل dev server مع HMR. `ng build` ينتج `dist/` للنشر. فهم `angular.json` targets يساعد في CI/CD لاحقاً.", en: "Angular CLI (`ng`) scaffolds a consistent project: `angular.json`, `tsconfig`, standalone by default. Without CLI you lose hours to webpack/esbuild config. `ng generate component track-card` emits consistent files.\n\nThe workspace holds projects — usually one `alefya-ui`. `ng serve` runs dev server with HMR. `ng build` outputs `dist/` for deploy. Understanding `angular.json` targets helps CI/CD later." },
        goals: {
          ar: ["تثبيت Angular CLI وإنشاء مشروع standalone", "قراءة angular.json وملفات الجذر", "تشغيل ng serve وفتح التطبيق", "استخدام ng generate لأول component"],
          en: ["Install Angular CLI and create standalone project", "Read angular.json and root files", "Run ng serve and open the app", "Use ng generate for first component"],
        },
        concepts: [
          concept(
            "Angular CLI commands",
            "`ng new` ينشئ مشروع — `--standalone --ssr=false` للبداية. `ng serve -o` يفتح المتصفح. `ng generate component|service|pipe` مع schematics.",
            "Angular CLI commands",
            "`ng new` creates project — `--standalone --ssr=false` for starters. `ng serve -o` opens browser. `ng generate component|service|pipe` via schematics.",
          ),
          concept(
            "angular.json workspace",
            "**projects** → builder options، assets، styles. **architect targets**: build، serve، test. تعديل `styles` لإضافة CSS global.",
            "angular.json workspace",
            "**projects** → builder options, assets, styles. **architect targets**: build, serve, test. Edit `styles` for global CSS.",
          ),
          concept(
            "مجلد src/",
            "`main.ts` bootstrap، `app/` root component، `index.html` shell. `public/` للassets ثابتة في Angular 17+.",
            "src/ folder",
            "`main.ts` bootstrap, `app/` root component, `index.html` shell. `public/` for static assets in Angular 17+.",
          ),
          concept(
            "Package scripts",
            "`npm start` → `ng serve`. lockfile يثبت `@angular/core` version — لا تخلط major versions.",
            "Package scripts",
            "`npm start` → `ng serve`. lockfile pins `@angular/core` version — don't mix major versions.",
          ),
        ],
        steps: {
          ar: ["npm i -g @angular/cli@latest", "ng new alefya-ui --standalone --ssr=false --style=css", "cd alefya-ui && ng serve -o", "افتح angular.json — locate build target", "ng generate component tracks/track-card --standalone", "راجع الملفات المُنشأة"],
          en: ["npm i -g @angular/cli@latest", "ng new alefya-ui --standalone --ssr=false --style=css", "cd alefya-ui && ng serve -o", "Open angular.json — locate build target", "ng generate component tracks/track-card --standalone", "Review generated files"],
        },
        code: {
          ar: {
            lang: "bash",
            source: "# تثبيت CLI\nnpm install -g @angular/cli\n\n# مشروع AlefYa learner UI\nng new alefya-ui --standalone --routing --ssr=false\ncd alefya-ui\n\n# تطوير\nng serve --open\n\n# أول مكوّن\nng generate component features/tracks/track-card --standalone",
            explain: "أوامر CLI الأساسية — routing مفعّل للمسارات لاحقاً.",
          },
          en: {
            lang: "bash",
            source: "# Install CLI\nnpm install -g @angular/cli\n\n# AlefYa learner UI project\nng new alefya-ui --standalone --routing --ssr=false\ncd alefya-ui\n\n# Develop\nng serve --open\n\n# First component\nng generate component features/tracks/track-card --standalone",
            explain: "Core CLI commands — routing enabled for later routes.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["global CLI قديم", "ng version — حدّث CLI وproject معاً"],
            en: ["stale global CLI", "ng version — update CLI and project together"],
          },
          {
            ar: ["تعديل node_modules يدوياً", "npm install — استخدم ng add للpackages"],
            en: ["manual node_modules edits", "npm install — use ng add for packages"],
          },
          {
            ar: ["نسيان --standalone في generate", "standalone default في Angular 19+"],
            en: ["forgetting --standalone in generate", "standalone default in Angular 19+"],
          },
          {
            ar: ["commit dist/", "dist/ في .gitignore"],
            en: ["committing dist/", "dist/ in .gitignore"],
          },
        ]),
        discussion: [
          qa(
            "npm vs pnpm vs yarn?",
            "الثلاثة تعمل — المهم lockfile consistent في الفريق.",
            "npm vs pnpm vs yarn?",
            "All work — keep lockfile consistent on the team.",
          ),
          qa(
            "SSR من البداية?",
            "لا للتعلم — stage 08 يضيف SSR.",
            "SSR from start?",
            "not for learning — stage 08 adds SSR.",
          ),
          qa(
            "Monorepo Nx?",
            "خارج نطاق المسار — CLI project كافٍ.",
            "Nx monorepo?",
            "outside this track — CLI project is enough.",
          ),
          qa(
            "ng update?",
            "لترقية major — اقرأ migration guide.",
            "ng update?",
            "for major upgrades — read migration guide.",
          ),
        ],
        exercises: {
          ar: ["ng generate service core/lesson", "أضف script npm build:prod", "غيّر title في index.html", "استكشف angular.json budgets"],
          en: ["ng generate service core/lesson", "add npm build:prod script", "change title in index.html", "explore angular.json budgets"],
        },
        checklist: {
          ar: ["CLI مثبت", "مشروع يعمل ng serve", "angular.json مفهوم", "generate component نجح", "جاهز app structure"],
          en: ["CLI installed", "project runs ng serve", "angular.json understood", "generate component works", "ready for app structure"],
        },
        nextHint: { ar: "التالي: main.ts، bootstrapApplication، app.config.", en: "Next: main.ts, bootstrapApplication, app.config." },
      }),
      deepLesson({
        slug: "02-app-structure",
        order: 2,
        duration: 40,
        title: { ar: "بنية التطبيق", en: "App structure" },
        summary: { ar: "main.ts، bootstrapApplication، app.config، وproviders.", en: "main.ts, bootstrapApplication, app.config, and providers." },
        why: { ar: "Angular 17+ ي bootstrapp بـ `bootstrapApplication(AppComponent, appConfig)` — لا NgModule root. `app.config.ts` يجمع **providers**: router، HttpClient، animations. فهم bootstrap chain يشرح أين تُسجّل services.\n\nFeature folders (`features/tracks`, `core/services`) تنظم AlefYa UI. `core/` للsingletons، `shared/` للمكوّنات الم reusable. البنية من اليوم الأول تمنع spaghetti imports.", en: "Angular 17+ bootstraps with `bootstrapApplication(AppComponent, appConfig)` — no root NgModule. `app.config.ts` collects **providers**: router, HttpClient, animations. Understanding bootstrap explains where services register.\n\nFeature folders (`features/tracks`, `core/services`) organize AlefYa UI. `core/` for singletons, `shared/` for reusable components. Structure from day one prevents spaghetti imports." },
        goals: {
          ar: ["تتبع bootstrap من main.ts إلى AppComponent", "تكوين app.config.ts providers", "فهم standalone bootstrap vs NgModule", "تنظيم feature folders"],
          en: ["Trace bootstrap from main.ts to AppComponent", "Configure app.config.ts providers", "Understand standalone bootstrap vs NgModule", "Organize feature folders"],
        },
        concepts: [
          concept(
            "bootstrapApplication",
            "`main.ts` يستدعي bootstrapApplication مع root component وApplicationConfig. **Zone.js** ي patch async لل change detection — default.",
            "bootstrapApplication",
            "`main.ts` calls bootstrapApplication with root component and ApplicationConfig. **Zone.js** patches async for change detection — default.",
          ),
          concept(
            "ApplicationConfig وproviders",
            "`provideRouter(routes)`, `provideHttpClient()`, `provideAnimations()` في app.config. **Functional providers** بديل NgModule imports.",
            "ApplicationConfig & providers",
            "`provideRouter(routes)`, `provideHttpClient()`, `provideAnimations()` in app.config. **Functional providers** replace NgModule imports.",
          ),
          concept(
            "AppComponent root",
            "selector `app-root` في index.html. `<router-outlet />` للمسارات. layout عام: header، footer.",
            "AppComponent root",
            "selector `app-root` in index.html. `<router-outlet />` for routes. Global layout: header, footer.",
          ),
          concept(
            "Feature folder structure",
            "`src/app/core/` services/interceptors. `features/learner/` pages. `shared/ui/` buttons/cards.",
            "Feature folder structure",
            "`src/app/core/` services/interceptors. `features/learner/` pages. `shared/ui/` buttons/cards.",
          ),
        ],
        steps: {
          ar: ["اقرأ main.ts سطراً سطراً", "افتح app.config.ts — list providers", "أضف provideHttpClient()", "أنشئ core/ وfeatures/ folders", "انقل AppComponent template لlayout بسيط", "أضف router-outlet placeholder"],
          en: ["Read main.ts line by line", "Open app.config.ts — list providers", "Add provideHttpClient()", "Create core/ and features/ folders", "Move AppComponent template to simple layout", "Add router-outlet placeholder"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "// main.ts\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nbootstrapApplication(AppComponent, appConfig)\n  .catch(err => console.error(err));\n\n// app.config.ts\nimport { ApplicationConfig } from \"@angular/core\";\nimport { provideRouter } from \"@angular/router\";\nimport { provideHttpClient } from \"@angular/common/http\";\nimport { routes } from \"./app.routes\";\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient(),\n  ],\n};",
            explain: "Bootstrap chain — كل provider global هنا.",
          },
          en: {
            lang: "typescript",
            source: "// main.ts\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nbootstrapApplication(AppComponent, appConfig)\n  .catch(err => console.error(err));\n\n// app.config.ts\nimport { ApplicationConfig } from \"@angular/core\";\nimport { provideRouter } from \"@angular/router\";\nimport { provideHttpClient } from \"@angular/common/http\";\nimport { routes } from \"./app.routes\";\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient(),\n  ],\n};",
            explain: "Bootstrap chain — every global provider lives here.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["providers في component", "singletons في app.config — ليس component providers إلا scoped"],
            en: ["providers on component", "singletons in app.config — not component providers unless scoped"],
          },
          {
            ar: ["import providers من feature", "core exports — تجنب circular"],
            en: ["import providers from feature", "core exports — avoid circular"],
          },
          {
            ar: ["نسيان provideHttpClient", "HttpClient injection fails"],
            en: ["forgetting provideHttpClient", "HttpClient injection fails"],
          },
          {
            ar: ["platformBrowserDynamic", "legacy — استخدم bootstrapApplication"],
            en: ["platformBrowserDynamic", "legacy — use bootstrapApplication"],
          },
        ]),
        discussion: [
          qa(
            "NgModule root legacy?",
            "نعم — standalone + app.config هو المسار الجديد.",
            "Legacy root NgModule?",
            "yes — standalone + app.config is the new path.",
          ),
          qa(
            "provideRouter options?",
            "withComponentInputBinding، withViewTransitions — لاحقاً.",
            "provideRouter options?",
            "withComponentInputBinding, withViewTransitions — later.",
          ),
          qa(
            "environment files?",
            "environment.ts لل API URL — stage 07.",
            "environment files?",
            "environment.ts for API URL — stage 07.",
          ),
          qa(
            "Zoneless?",
            "experimental — stage 08 advanced.",
            "Zoneless?",
            "experimental — stage 08 advanced.",
          ),
        ],
        exercises: {
          ar: ["أضف provideAnimations()", "folder structure diagram", "router-outlet في AppComponent", "console.log bootstrap success"],
          en: ["add provideAnimations()", "folder structure diagram", "router-outlet in AppComponent", "console.log bootstrap success"],
        },
        checklist: {
          ar: ["main.ts مفهوم", "app.config providers", "feature folders", "router-outlet موجود", "جاهز first component"],
          en: ["main.ts understood", "app.config providers", "feature folders", "router-outlet present", "ready for first component"],
        },
        nextHint: { ar: "التالي: @Component، selector، template.", en: "Next: @Component, selector, template." },
      }),
      deepLesson({
        slug: "03-first-component",
        order: 3,
        duration: 50,
        title: { ar: "أول مكوّن", en: "Your first component" },
        summary: { ar: "@Component، selector، template، وربط class بالعرض.", en: "@Component, selector, template, and binding class to view." },
        why: { ar: "المكوّن وحدة UI في Angular: class + template + styles. `@Component({ selector: 'app-hello' })` يربط `<app-hello />` بالكلاس. **Interpolation** `{{ title }}` يعرض property public.\n\nLifecycle يبدأ بـ constructor (DI) ثم ngOnInit (init logic). القالب يقرأ public state — patterns AlefYa: `{{ lesson.title[locale] }}`. أول مكوّن يثبت mental model قبل inputs/outputs.", en: "Components are Angular UI units: class + template + styles. `@Component({ selector: 'app-hello' })` maps `<app-hello />` to the class. **Interpolation** `{{ title }}` displays public properties.\n\nLifecycle starts with constructor (DI) then ngOnInit (init logic). Templates read public state — AlefYa pattern: `{{ lesson.title[locale] }}`. First component cements the mental model before inputs/outputs." },
        goals: {
          ar: ["إنشاء @Component مع selector وtemplate", "استخدام interpolation وproperty binding", "تطبيق ngOnInit للتهيئة", "style encapsulation أساسي"],
          en: ["Create @Component with selector and template", "Use interpolation and property binding", "Apply ngOnInit for initialization", "Basic style encapsulation"],
        },
        concepts: [
          concept(
            "@Component metadata",
            "selector (element)، template/templateUrl، styles/styleUrl، standalone: true. **changeDetection** default — OnPush لاحقاً.",
            "@Component metadata",
            "selector (element), template/templateUrl, styles/styleUrl, standalone: true. **changeDetection** default — OnPush later.",
          ),
          concept(
            "Template interpolation",
            "`{{ expression }}` — Angular evaluates public fields. `[title]=\"tooltip\"` property binding. `(click)=\"save()\"` event binding preview.",
            "Template interpolation",
            "`{{ expression }}` — Angular evaluates public fields. `[title]=\"tooltip\"` property binding. `(click)=\"save()\"` event binding preview.",
          ),
          concept(
            "Lifecycle ngOnInit",
            "`implements OnInit` + `ngOnInit()` لل fetch/setup — ليس constructor. AlefYa: load locale from service here.",
            "Lifecycle ngOnInit",
            "`implements OnInit` + `ngOnInit()` for fetch/setup — not constructor. AlefYa: load locale from service here.",
          ),
          concept(
            "View encapsulation",
            "Emulated default — styles scoped to component. `:host` لل root element styling.",
            "View encapsulation",
            "Emulated default — styles scoped to component. `:host` for root element styling.",
          ),
        ],
        steps: {
          ar: ["ng generate component hello --standalone", "أضف title = 'AlefYa' property", "template: h1 interpolation", "ngOnInit: console.log init", "style :host { display: block }", "import في AppComponent template"],
          en: ["ng generate component hello --standalone", "add title = 'AlefYa' property", "template: h1 interpolation", "ngOnInit: console.log init", "style :host { display: block }", "import in AppComponent template"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "import { Component, OnInit } from \"@angular/core\";\n\n@Component({\n  selector: \"app-hello\",\n  standalone: true,\n  template: `\n    <h1>{{ title }}</h1>\n    <p>{{ subtitle }}</p>\n  `,\n  styles: [`:host { display: block; padding: 1rem; }`],\n})\nexport class HelloComponent implements OnInit {\n  title = \"AlefYa\";\n  subtitle = \"من TypeScript إلى واجهة احترافية\";\n\n  ngOnInit(): void {\n    console.log(\"HelloComponent initialized\");\n  }\n}",
            explain: "مكوّن standalone minimal — نفس البنية لكل feature components.",
          },
          en: {
            lang: "typescript",
            source: "import { Component, OnInit } from \"@angular/core\";\n\n@Component({\n  selector: \"app-hello\",\n  standalone: true,\n  template: `\n    <h1>{{ title }}</h1>\n    <p>{{ subtitle }}</p>\n  `,\n  styles: [`:host { display: block; padding: 1rem; }`],\n})\nexport class HelloComponent implements OnInit {\n  title = \"AlefYa\";\n  subtitle = \"From TypeScript to production UI\";\n\n  ngOnInit(): void {\n    console.log(\"HelloComponent initialized\");\n  }\n}",
            explain: "Minimal standalone component — same structure for all feature components.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["private property في {{ }}", "public فقط للقالب"],
            en: ["private property in {{ }}", "public only in template"],
          },
          {
            ar: ["logic ثقيل في constructor", "ngOnInit لل init"],
            en: ["heavy constructor logic", "ngOnInit for init"],
          },
          {
            ar: ["selector بدون app- prefix", "style guide: app-track-card"],
            en: ["selector without app- prefix", "style guide: app-track-card"],
          },
          {
            ar: ["inline template ضخم", "templateUrl فوق ~10 lines"],
            en: ["huge inline template", "templateUrl above ~10 lines"],
          },
        ]),
        discussion: [
          qa(
            "template inline vs file?",
            "file للقراءة — inline للصغير.",
            "inline vs file template?",
            "file for readability — inline when tiny.",
          ),
          qa(
            "OnPush الآن?",
            "Default أولاً — lesson 08-advanced.",
            "OnPush now?",
            "Default first — lesson 08-advanced.",
          ),
          qa(
            "multiple selectors?",
            "element واحد — attribute نادر.",
            "multiple selectors?",
            "one element — attribute is rare.",
          ),
          qa(
            "ngOnChanges?",
            "عند @Input changes — lesson 03-components.",
            "ngOnChanges?",
            "on @Input changes — lesson 03-components.",
          ),
        ],
        exercises: {
          ar: ["أضف property duration", "[class.active] binding", "templateUrl منفصل", "import Hello في App"],
          en: ["add duration property", "[class.active] binding", "separate templateUrl", "import Hello in App"],
        },
        checklist: {
          ar: ["@Component يعمل", "interpolation", "ngOnInit", "standalone import", "جاهز standalone deep dive"],
          en: ["@Component works", "interpolation", "ngOnInit", "standalone import", "ready for standalone deep dive"],
        },
        nextHint: { ar: "التالي: Standalone — imports في @Component.", en: "Next: Standalone — imports in @Component." },
      }),
      deepLesson({
        slug: "04-standalone",
        order: 4,
        duration: 42,
        title: { ar: "Standalone Components", en: "Standalone components" },
        summary: { ar: "imports في @Component، إلغاء NgModule لل features، وtree-shaking.", en: "imports in @Component, dropping feature NgModules, and tree-shaking." },
        why: { ar: "Standalone (Angular 14+) يجعل كل component/service/pipe/directive **self-contained**: `imports: [CommonModule, RouterLink]` في @Component. لا حاجة NgModule لكل feature — أقل boilerplate، tree-shaking أفضل.\n\nAlefYa UI: TrackCard standalone ي import RouterLink وLocaleTitlePipe فقط. Lazy routes load standalone components مباشرة. NgModules legacy — افهمها للصيانة لكن build جديد standalone.", en: "Standalone (Angular 14+) makes every component/service/pipe/directive **self-contained**: `imports: [CommonModule, RouterLink]` in @Component. No NgModule per feature — less boilerplate, better tree-shaking.\n\nAlefYa UI: TrackCard standalone imports RouterLink and LocaleTitlePipe only. Lazy routes load standalone components directly. NgModules are legacy — know them for maintenance but new builds are standalone." },
        goals: {
          ar: ["تكوين imports array في @Component", "import مكوّنات standalone في standalone", "compare standalone vs NgModule mental model", "prepare لل lazy loadComponent"],
          en: ["Configure imports array in @Component", "Import standalone into standalone", "Compare standalone vs NgModule mental model", "Prepare for lazy loadComponent"],
        },
        concepts: [
          concept(
            "imports array",
            "`imports: [CommonModule, RouterLink, TrackCard]` — ما يحتاجه القالب. **exports** غير مطلوب — import مباشرة حيث تحتاج.",
            "imports array",
            "`imports: [CommonModule, RouterLink, TrackCard]` — what the template needs. No **exports** needed — import directly where used.",
          ),
          concept(
            "Standalone pipes/directives",
            "`@Pipe({ standalone: true })` — import في component. `@Directive({ standalone: true })` same.",
            "Standalone pipes/directives",
            "`@Pipe({ standalone: true })` — import in component. `@Directive({ standalone: true })` same.",
          ),
          concept(
            "bootstrap بدون AppModule",
            "`bootstrapApplication(AppComponent, { providers: [...] })` — root standalone.",
            "Bootstrap without AppModule",
            "`bootstrapApplication(AppComponent, { providers: [...] })` — root standalone.",
          ),
          concept(
            "Lazy loading standalone",
            "`loadComponent: () => import('./x').then(m => m.X)` — stage 05 routing.",
            "Lazy loading standalone",
            "`loadComponent: () => import('./x').then(m => m.X)` — stage 05 routing.",
          ),
        ],
        steps: {
          ar: ["أنشئ TrackCard standalone", "imports: [RouterLink]", "import TrackCard في TrackList", "تحقق ng build — bundle size", "اقرأ Angular standalone guide", "حذف أي NgModule experiment"],
          en: ["Create TrackCard standalone", "imports: [RouterLink]", "import TrackCard in TrackList", "check ng build — bundle size", "read Angular standalone guide", "remove any NgModule experiment"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "import { Component } from \"@angular/core\";\nimport { RouterLink } from \"@angular/router\";\nimport { NgOptimizedImage } from \"@angular/common\";\n\n@Component({\n  selector: \"app-track-card\",\n  standalone: true,\n  imports: [RouterLink, NgOptimizedImage],\n  template: `\n    <a [routerLink]=\"['/tracks', track.slug]\">\n      <img ngSrc=\"/assets/{{ track.slug }}.svg\" width=\"48\" height=\"48\" alt=\"\" />\n      <h2>{{ track.title[locale] }}</h2>\n    </a>\n  `,\n})\nexport class TrackCardComponent {\n  track = { slug: \"angular\", title: { ar: \"Angular\", en: \"Angular\" } };\n  locale: \"ar\" | \"en\" = \"ar\";\n}",
            explain: "TrackCard standalone — imports فقط ما يحتاجه القالب.",
          },
          en: {
            lang: "typescript",
            source: "import { Component } from \"@angular/core\";\nimport { RouterLink } from \"@angular/router\";\nimport { NgOptimizedImage } from \"@angular/common\";\n\n@Component({\n  selector: \"app-track-card\",\n  standalone: true,\n  imports: [RouterLink, NgOptimizedImage],\n  template: `\n    <a [routerLink]=\"['/tracks', track.slug]\">\n      <img ngSrc=\"/assets/{{ track.slug }}.svg\" width=\"48\" height=\"48\" alt=\"\" />\n      <h2>{{ track.title[locale] }}</h2>\n    </a>\n  `,\n})\nexport class TrackCardComponent {\n  track = { slug: \"angular\", title: { ar: \"Angular\", en: \"Angular\" } };\n  locale: \"ar\" | \"en\" = \"en\";\n}",
            explain: "TrackCard standalone — imports only what the template needs.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["نسيان import CommonModule/@if", "Angular 17+ control flow built-in — لكن pipes قد تحتاج CommonModule"],
            en: ["forgetting CommonModule/@if", "Angular 17+ control flow built-in — pipes may need CommonModule"],
          },
          {
            ar: ["NgModule + standalone mix بدون خطة", "prefer standalone-only للمشروع الجديد"],
            en: ["NgModule + standalone mix unplanned", "prefer standalone-only for new projects"],
          },
          {
            ar: ["import component في providers", "components في imports — services في providers"],
            en: ["import component in providers", "components in imports — services in providers"],
          },
          {
            ar: ["duplicate imports everywhere", "create shared Standalone imports array constant"],
            en: ["duplicate imports everywhere", "shared standalone imports constant"],
          },
        ]),
        discussion: [
          qa(
            "NgModule ميت؟",
            "legacy codebases — standalone للجديد.",
            "NgModule dead?",
            "legacy codebases — standalone for new.",
          ),
          qa(
            "shared Module replacement?",
            "export const UI_IMPORTS = [CommonModule, ...]",
            "shared Module replacement?",
            "export const UI_IMPORTS = [CommonModule, ...]",
          ),
          qa(
            "standalone: false?",
            "avoid — default true schematics.",
            "standalone: false?",
            "avoid — default true schematics.",
          ),
          qa(
            "SCAM pattern?",
            "obsolete with standalone.",
            "SCAM pattern?",
            "obsolete with standalone.",
          ),
        ],
        exercises: {
          ar: ["TrackList imports TrackCard", "standalone pipe import", "ng build analyze", "diagram imports tree"],
          en: ["TrackList imports TrackCard", "standalone pipe import", "ng build analyze", "diagram imports tree"],
        },
        checklist: {
          ar: ["imports array", "standalone chain", "no NgModule required", "lazy load ready", "جاهز template syntax"],
          en: ["imports array", "standalone chain", "no NgModule required", "lazy load ready", "ready for template syntax"],
        },
        nextHint: { ar: "التالي: @if، @for، binding في القوالب.", en: "Next: @if, @for, binding in templates." },
      })
    ],
  },
  "03-components": {
    meta: {
      slug: "03-components",
      order: 3,
      title: { ar: "المكوّنات والقوالب", en: "Components & templates" },
      description: { ar: "الإدخال/الإخراج، التوجيهات، والأنابيب", en: "Inputs/outputs, directives, and pipes" },
      lessons: [
        "01-template-syntax.json",
        "02-inputs-outputs.json",
        "03-directives.json",
        "04-pipes.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-template-syntax",
        order: 1,
        duration: 48,
        title: { ar: "صيغة القوالب", en: "Template syntax" },
        summary: { ar: "interpolation، property/event binding، @if و@for.", en: "Interpolation, property/event binding, @if and @for." },
        why: { ar: "قالب Angular HTML موسّع: `{{ lesson.title[locale] }}` interpolation، `[class.completed]=\"done\"` property binding، `(click)=\"markDone()\"` events. Angular 17+ **built-in control flow** `@if` `@for` `@switch` — أسرع من *ngIf structurally.\n\nAlefYa lesson list: `@for (lesson of lessons; track lesson.slug)` مع track function لل performance. `@if (loading) { spinner } @else { content }`. فهم binding يمنع mutating DOM يدوياً — Angular owns the view.", en: "Angular templates are HTML-plus: `{{ lesson.title[locale] }}` interpolation, `[class.completed]=\"done\"` property binding, `(click)=\"markDone()\"` events. Angular 17+ **built-in control flow** `@if` `@for` `@switch` — faster than structural *ngIf.\n\nAlefYa lesson list: `@for (lesson of lessons; track lesson.slug)` with track for performance. `@if (loading) { spinner } @else { content }`. Binding prevents manual DOM mutation — Angular owns the view." },
        goals: {
          ar: ["interpolation وproperty/event binding", "استخدام @if @for @else", "track expression في @for", "two-way preview [(ngModel)]"],
          en: ["interpolation and property/event binding", "use @if @for @else", "track expression in @for", "two-way preview [(ngModel)]"],
        },
        concepts: [
          concept(
            "Interpolation & binding",
            "`{{ expr }}` strings. `[disabled]=\"!valid\"` DOM properties. `(click)=\"save($event)\"` events. `[attr.aria-label]=\"label\"` attributes.",
            "Interpolation & binding",
            "`{{ expr }}` strings. `[disabled]=\"!valid\"` DOM properties. `(click)=\"save($event)\"` events. `[attr.aria-label]=\"label\"` attributes.",
          ),
          concept(
            "Control flow @if @for",
            "`@if (x) { } @else if (y) { } @else { }`. `@for (item of items; track item.id) { }` — **track** mandatory for identity.",
            "Control flow @if @for",
            "`@if (x) { } @else if (y) { } @else { }`. `@for (item of items; track item.id) { }` — **track** mandatory for identity.",
          ),
          concept(
            "Template variables",
            "#ref variables like #row capture element refs. @let total = items.length creates local template variables. @empty block in @for shows when the list is empty.",
            "Template variables",
            "#ref variables like #row capture element refs. @let total = items.length creates local template variables. @empty block in @for shows when the list is empty.",
          ),
          concept(
            "Security",
            "Angular sanitizes interpolation. `[innerHTML]` needs DomSanitizer — avoid raw HTML from users.",
            "Security",
            "Angular sanitizes interpolation. `[innerHTML]` needs DomSanitizer — avoid raw HTML from users.",
          ),
        ],
        steps: {
          ar: ["Lesson list @for مع track slug", "@if loading/@else list", "(click) toggle complete", "[class.done] binding", "@empty message", "@let count للعرض"],
          en: ["Lesson list @for with track slug", "@if loading/@else list", "(click) toggle complete", "[class.done] binding", "@empty message", "@let count display"],
        },
        code: {
          ar: {
            lang: "html",
            source: "@if (loading) {\n  <p>جاري التحميل...</p>\n} @else {\n  @for (lesson of lessons; track lesson.slug) {\n    <article [class.done]=\"lesson.completed\" (click)=\"toggle(lesson)\">\n      <h3>{{ lesson.title[locale] }}</h3>\n      <span>{{ lesson.duration }} د</span>\n    </article>\n  } @empty {\n    <p>لا دروس بعد.</p>\n  }\n}",
            explain: "قائمة دروس AlefYa — control flow حديث.",
          },
          en: {
            lang: "html",
            source: "@if (loading) {\n  <p>Loading...</p>\n} @else {\n  @for (lesson of lessons; track lesson.slug) {\n    <article [class.done]=\"lesson.completed\" (click)=\"toggle(lesson)\">\n      <h3>{{ lesson.title[locale] }}</h3>\n      <span>{{ lesson.duration }}m</span>\n    </article>\n  } @empty {\n    <p>No lessons yet.</p>\n  }\n}",
            explain: "AlefYa lesson list — modern control flow.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["@for بدون track", "always track stable id"],
            en: ["@for without track", "always track stable id"],
          },
          {
            ar: ["*ngIf mix @if", "pick one style per template"],
            en: ["*ngIf mix @if", "pick one style per template"],
          },
          {
            ar: ["DOM manipulation في component", "update data — Angular re-renders"],
            en: ["DOM manipulation in component", "update data — Angular re-renders"],
          },
          {
            ar: ["function calls heavy in {{ }}", "computed property or pipe"],
            en: ["heavy function in {{ }}", "computed property or pipe"],
          },
        ]),
        discussion: [
          qa(
            "*ngIf deprecated?",
            "still works — @if preferred new code.",
            "*ngIf deprecated?",
            "still works — @if preferred new code.",
          ),
          qa(
            "track by index?",
            "avoid — use slug/id.",
            "track by index?",
            "avoid — use slug/id.",
          ),
          qa(
            "@let scope?",
            "block scope in template.",
            "@let scope?",
            "block scope in template.",
          ),
          qa(
            "async pipe with @for?",
            "yes — lesson 04-rxjs.",
            "async pipe with @for?",
            "yes — lesson 04-rxjs.",
          ),
        ],
        exercises: {
          ar: ["@switch locale", "@empty state", "@let progress percent", "keyboard (keydown)"],
          en: ["@switch locale", "@empty state", "@let progress percent", "keyboard (keydown)"],
        },
        checklist: {
          ar: ["@if/@for", "track slug", "event binding", "@empty", "جاهز Input/Output"],
          en: ["@if/@for", "track slug", "event binding", "@empty", "ready Input/Output"],
        },
        nextHint: { ar: "التالي: @Input و@Output.", en: "Next: @Input and @Output." },
      }),
      deepLesson({
        slug: "02-inputs-outputs",
        order: 2,
        duration: 45,
        title: { ar: "Input وOutput", en: "Inputs & outputs" },
        summary: { ar: "@Input @Output EventEmitter — comunication بين المكوّنات.", en: "@Input @Output EventEmitter — component communication." },
        why: { ar: "TrackCard يستقبل `@Input({ required: true }) track!: Track` من parent. `@Output() select = new EventEmitter<string>()` يرسل slug للأب. **Smart/dumb** pattern: container ي fetch، presentational ي display.\n\nAngular 17+ **input() signal** alternative: `track = input.required<Track>()`. EventEmitter typed `EventEmitter<Lesson>`. required inputs fail compile if missing binding.", en: "TrackCard receives `@Input({ required: true }) track!: Track` from parent. `@Output() select = new EventEmitter<string>()` emits slug upward. **Smart/dumb** pattern: container fetches, presentational displays.\n\nAngular 17+ **input() signal** alternative: `track = input.required<Track>()`. Typed EventEmitter `EventEmitter<Lesson>`. required inputs fail compile if missing binding." },
        goals: {
          ar: ["@Input required وoptional", "@Output EventEmitter typed", "smart/dumb component split", "preview input() signals"],
          en: ["@Input required and optional", "@Output typed EventEmitter", "smart/dumb component split", "preview input() signals"],
        },
        concepts: [
          concept(
            "@Input decorator",
            "`@Input() locale: Locale = 'ar'`. `required: true` + definite assignment `!`. **transform** for parsing.",
            "@Input decorator",
            "`@Input() locale: Locale = 'ar'`. `required: true` + definite assignment `!`. **transform** for parsing.",
          ),
          concept(
            "@Output EventEmitter",
            "`@Output() complete = new EventEmitter<void>()`. parent `(complete)=\"onComplete()\"`. always `.emit()` not direct call.",
            "@Output EventEmitter",
            "`@Output() complete = new EventEmitter<void>()`. parent `(complete)=\"onComplete()\"`. always `.emit()` not direct call.",
          ),
          concept(
            "Signal inputs",
            "`track = input.required<Track>();` in template `track().title`. **model()** for two-way.",
            "Signal inputs",
            "`track = input.required<Track>();` template `track().title`. **model()** for two-way.",
          ),
          concept(
            "Change detection impact",
            "mutating @Input object fields may not trigger — immutable patterns or OnPush.",
            "Change detection impact",
            "mutating @Input object fields may not trigger — immutable patterns or OnPush.",
          ),
        ],
        steps: {
          ar: ["TrackCard @Input track", "TrackList passes [track]", "@Output select emit slug", "parent handles (select)", "required input compile check", "optional locale @Input"],
          en: ["TrackCard @Input track", "TrackList passes [track]", "@Output select emit slug", "parent handles (select)", "required input compile check", "optional locale @Input"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Component({ selector: \"app-lesson-row\", standalone: true, template: `\n  <button (click)=\"select.emit(lesson.slug)\">{{ lesson.title[locale] }}</button>\n` })\nexport class LessonRowComponent {\n  @Input({ required: true }) lesson!: Lesson;\n  @Input() locale: \"ar\" | \"en\" = \"ar\";\n  @Output() select = new EventEmitter<string>();\n}",
            explain: "LessonRow dumb component — AlefYa navigation.",
          },
          en: {
            lang: "typescript",
            source: "@Component({ selector: \"app-lesson-row\", standalone: true, template: `\n  <button (click)=\"select.emit(lesson.slug)\">{{ lesson.title[locale] }}</button>\n` })\nexport class LessonRowComponent {\n  @Input({ required: true }) lesson!: Lesson;\n  @Input() locale: \"ar\" | \"en\" = \"en\";\n  @Output() select = new EventEmitter<string>();\n}",
            explain: "LessonRow dumb component — AlefYa navigation.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["@Input mutate in child", "emit event — parent owns state"],
            en: ["@Input mutate in child", "emit event — parent owns state"],
          },
          {
            ar: ["EventEmitter subscribe forget", "template (output) auto-unsub"],
            en: ["EventEmitter subscribe forget", "template (output) auto-unsub"],
          },
          {
            ar: ["any on EventEmitter", "EventEmitter<Lesson>"],
            en: ["any on EventEmitter", "EventEmitter<Lesson>"],
          },
          {
            ar: ["two-way without model()", "explicit in + out pair"],
            en: ["two-way without model()", "explicit in + out pair"],
          },
        ]),
        discussion: [
          qa(
            "input() vs @Input?",
            "input() signals — migrate gradually.",
            "input() vs @Input?",
            "input() signals — migrate gradually.",
          ),
          qa(
            "ViewChild vs Input?",
            "Input parent→child; ViewChild imperative.",
            "ViewChild vs Input?",
            "Input parent→child; ViewChild imperative.",
          ),
          qa(
            "Output Observable?",
            "EventEmitter extends Subject — prefer Output.",
            "Output Observable?",
            "EventEmitter extends Subject — prefer Output.",
          ),
          qa(
            "content projection?",
            "ng-content — next patterns.",
            "content projection?",
            "ng-content — next patterns.",
          ),
        ],
        exercises: {
          ar: ["required track Input", "emit select slug", "smart TrackPage container", "input() refactor"],
          en: ["required track Input", "emit select slug", "smart TrackPage container", "input() refactor"],
        },
        checklist: {
          ar: ["@Input required", "@Output emit", "parent binding", "typed EventEmitter", "جاهز directives"],
          en: ["@Input required", "@Output emit", "parent binding", "typed EventEmitter", "ready for directives"],
        },
        nextHint: { ar: "التالي: structural وattribute directives.", en: "Next: structural and attribute directives." },
      }),
      deepLesson({
        slug: "03-directives",
        order: 3,
        duration: 42,
        title: { ar: "التوجيهات", en: "Directives" },
        summary: { ar: "structural *ngIf legacy، attribute [class]، custom directives.", en: "structural *ngIf legacy, attribute [class], custom directives." },
        why: { ar: "**Attribute directives** change appearance/behavior: `[class.active]`, `[style.color]`, `NgClass`. **Structural** add/remove DOM: *ngIf legacy, now prefer @if. **Custom** `@Directive({ selector: '[appHighlight]' })` for reusable behavior.\n\nAlefYa: `appScrollSpy` highlights active lesson in sidebar. `HostListener('click')` on directive. standalone directive imports like components.", en: "**Attribute directives** change appearance/behavior: `[class.active]`, `[style.color]`, `NgClass`. **Structural** add/remove DOM: legacy *ngIf, now prefer @if. **Custom** `@Directive({ selector: '[appHighlight]' })` for reusable behavior.\n\nAlefYa: `appScrollSpy` highlights active lesson in sidebar. `HostListener('click')` on directive. Standalone directive imports like components." },
        goals: {
          ar: ["NgClass NgStyle usage", "custom attribute directive", "HostListener HostBinding", "متى @if vs directive"],
          en: ["NgClass NgStyle usage", "custom attribute directive", "HostListener HostBinding", "when @if vs directive"],
        },
        concepts: [
          concept(
            "Built-in attribute",
            "`[ngClass]=\"{ active: selected }\"` `[ngStyle]=\"{ color: c }\"`. prefer `[class.active]` when simple.",
            "Built-in attribute",
            "`[ngClass]=\"{ active: selected }\"` `[ngStyle]=\"{ color: c }\"`. prefer `[class.active]` when simple.",
          ),
          concept(
            "Custom directive",
            "@Directive({ selector: '[appHighlight]', standalone: true }) with @HostBinding('class.highlight') toggles highlight class on the host element.",
            "Custom directive",
            "@Directive({ selector: '[appHighlight]', standalone: true }) with @HostBinding('class.highlight') toggles highlight class on the host element.",
          ),
          concept(
            "HostListener",
            "@HostListener('mouseenter') for hover and @HostListener('keydown.enter') for keyboard accessibility on interactive elements.",
            "HostListener",
            "@HostListener('mouseenter') for hover and @HostListener('keydown.enter') for keyboard accessibility on interactive elements.",
          ),
          concept(
            "Structural legacy",
            "*ngIf and *ngFor still appear in older codebases — microsyntax desugars to ng-template. Prefer @if and @for in new templates.",
            "Structural legacy",
            "*ngIf and *ngFor still appear in older codebases — microsyntax desugars to ng-template. Prefer @if and @for in new templates.",
          ),
        ],
        steps: {
          ar: ["NgClass active lesson", "custom appHighlight", "HostListener click outside", "import directive standalone", "compare @if vs *ngIf", "a11y tabindex HostBinding"],
          en: ["NgClass active lesson", "custom appHighlight", "HostListener click outside", "import directive standalone", "compare @if vs *ngIf", "a11y tabindex HostBinding"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Directive({ selector: \"[appActiveLesson]\", standalone: true })\nexport class ActiveLessonDirective {\n  @Input(\"appActiveLesson\") slug = \"\";\n  @HostBinding(\"class.active\") get isActive() {\n    return this.slug === this.current;\n  }\n  @Input() current = \"\";\n}",
            explain: "Active lesson sidebar — attribute directive.",
          },
          en: {
            lang: "typescript",
            source: "@Directive({ selector: \"[appActiveLesson]\", standalone: true })\nexport class ActiveLessonDirective {\n  @Input(\"appActiveLesson\") slug = \"\";\n  @HostBinding(\"class.active\") get isActive() {\n    return this.slug === this.current;\n  }\n  @Input() current = \"\";\n}",
            explain: "Active lesson sidebar — attribute directive.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["directive selector typo", "match attribute exactly"],
            en: ["directive selector typo", "match attribute exactly"],
          },
          {
            ar: ["heavy work in HostBinding getter", "cache in ngOnChanges"],
            en: ["heavy HostBinding getter", "cache in ngOnChanges"],
          },
          {
            ar: ["*ngIf + @if duplicate", "one control flow style"],
            en: ["*ngIf + @if duplicate", "one control flow style"],
          },
          {
            ar: ["forget standalone: true", "import directive in component"],
            en: ["forget standalone: true", "import directive in component"],
          },
        ]),
        discussion: [
          qa(
            "Component vs directive?",
            "component has template; directive augments element.",
            "Component vs directive?",
            "component has template; directive augments element.",
          ),
          qa(
            "Renderer2?",
            "DOM abstraction — rare direct use now.",
            "Renderer2?",
            "DOM abstraction — rare direct use now.",
          ),
          qa(
            "exportAs?",
            "*ngForm=\"f\" pattern — forms lesson.",
            "exportAs?",
            "*ngForm=\"f\" pattern — forms lesson.",
          ),
          qa(
            "standalone directive?",
            "yes default pattern.",
            "standalone directive?",
            "yes default pattern.",
          ),
        ],
        exercises: {
          ar: ["appHighlight primary color", "click outside close", "NgClass 3 states", "migrate *ngIf to @if"],
          en: ["appHighlight primary color", "click outside close", "NgClass 3 states", "migrate *ngIf to @if"],
        },
        checklist: {
          ar: ["NgClass", "custom directive", "HostBinding", "standalone import", "جاهز pipes"],
          en: ["NgClass", "custom directive", "HostBinding", "standalone import", "ready for pipes"],
        },
        nextHint: { ar: "التالي: DatePipe وcustom pipes.", en: "Next: DatePipe and custom pipes." },
      }),
      deepLesson({
        slug: "04-pipes",
        order: 4,
        duration: 38,
        title: { ar: "الأنابيب", en: "Pipes" },
        summary: { ar: "built-in pipes، custom pure pipe، async pipe preview.", en: "Built-in pipes, custom pure pipe, async pipe preview." },
        why: { ar: "Pipes transform template display: `{{ date | date:'short' }}`, `{{ price | currency:'SAR' }}`. **Pure pipes** re-run only when input reference changes — performant. Custom `localeTitle` pipe for AlefYa bilingual titles.\n\n`async` pipe subscribes Observable — auto-unsubscribe. Critical for RxJS lesson. Impure pipes run every CD cycle — use sparingly.", en: "Pipes transform template display: `{{ date | date:'short' }}`, `{{ price | currency:'SAR' }}`. **Pure pipes** re-run only when input reference changes — performant. Custom `localeTitle` pipe for AlefYa bilingual titles.\n\n`async` pipe subscribes Observable — auto-unsubscribe. Critical for RxJS lesson. Impure pipes run every CD cycle — use sparingly." },
        goals: {
          ar: ["DatePipe DecimalPipe CurrencyPipe", "custom pure pipe LocaleTitle", "pure vs impure", "async pipe introduction"],
          en: ["DatePipe DecimalPipe CurrencyPipe", "custom pure LocaleTitle pipe", "pure vs impure", "async pipe introduction"],
        },
        concepts: [
          concept(
            "Built-in pipes",
            "DatePipe locale aware. DecimalPipe `1.2-2`. UpperCasePipe simple. import CommonModule or pipe directly.",
            "Built-in pipes",
            "DatePipe locale aware. DecimalPipe `1.2-2`. UpperCasePipe simple. import CommonModule or pipe directly.",
          ),
          concept(
            "Custom @Pipe",
            "@Pipe({ name: 'localeTitle', standalone: true }) implements PipeTransform and returns lesson.title[locale] for bilingual display.",
            "Custom @Pipe",
            "@Pipe({ name: 'localeTitle', standalone: true }) implements PipeTransform and returns lesson.title[locale] for bilingual display.",
          ),
          concept(
            "Pure default",
            "pure: true — same input skip recompute. impure for time-dependent — prefer signals.",
            "Pure default",
            "pure: true — same input skip recompute. impure for time-dependent — prefer signals.",
          ),
          concept(
            "AsyncPipe",
            "`{{ lessons$ | async }}` — unwrap Observable/Promise. pairs with @for after async.",
            "AsyncPipe",
            "`{{ lessons$ | async }}` — unwrap Observable/Promise. pairs with @for after async.",
          ),
        ],
        steps: {
          ar: ["DatePipe on completedAt", "LocaleTitlePipe", "import pipe standalone", "duration | number", "async pipe mock Observable", "pure pipe unit test idea"],
          en: ["DatePipe on completedAt", "LocaleTitlePipe", "import pipe standalone", "duration | number", "async pipe mock Observable", "pure pipe unit test idea"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Pipe({ name: \"localeTitle\", standalone: true })\nexport class LocaleTitlePipe implements PipeTransform {\n  transform(value: { title: Record<\"ar\"|\"en\", string> }, locale: \"ar\"|\"en\"): string {\n    return value.title[locale];\n  }\n}\n// template: {{ lesson | localeTitle: locale }}",
            explain: "LocaleTitle — reusable across AlefYa cards.",
          },
          en: {
            lang: "typescript",
            source: "@Pipe({ name: \"localeTitle\", standalone: true })\nexport class LocaleTitlePipe implements PipeTransform {\n  transform(value: { title: Record<\"ar\"|\"en\", string> }, locale: \"ar\"|\"en\"): string {\n    return value.title[locale];\n  }\n}\n// template: {{ lesson | localeTitle: locale }}",
            explain: "LocaleTitle — reusable across AlefYa cards.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["impure pipe expensive", "pure + immutable data"],
            en: ["impure pipe expensive", "pure + immutable data"],
          },
          {
            ar: ["pipe في TS logic", "pipes templates only — use function in class"],
            en: ["pipe in TS logic", "pipes templates only — use function in class"],
          },
          {
            ar: ["forget import pipe", "add to component imports"],
            en: ["forget import pipe", "add to component imports"],
          },
          {
            ar: ["nested async multiple subs", "one async + @for"],
            en: ["nested async multiple subs", "one async + @for"],
          },
        ]),
        discussion: [
          qa(
            "pipe vs method?",
            "pipe pure memoization; method runs often.",
            "pipe vs method?",
            "pipe pure memoization; method runs often.",
          ),
          qa(
            "i18n pipes?",
            "DatePipe locale from LOCALE_ID.",
            "i18n pipes?",
            "DatePipe locale from LOCALE_ID.",
          ),
          qa(
            "chain pipes?",
            "{{ x | a | b }} allowed.",
            "chain pipes?",
            "{{ x | a | b }} allowed.",
          ),
          qa(
            "signal pipe?",
            "computed() often replaces pipe.",
            "signal pipe?",
            "computed() often replaces pipe.",
          ),
        ],
        exercises: {
          ar: ["DurationPipe minutes", "impure vs pure test", "async pipe lesson list", "currency SAR"],
          en: ["DurationPipe minutes", "impure vs pure test", "async pipe lesson list", "currency SAR"],
        },
        checklist: {
          ar: ["custom pipe", "pure true", "standalone import", "async preview", "جاهز Observables"],
          en: ["custom pipe", "pure true", "standalone import", "async preview", "ready for Observables"],
        },
        nextHint: { ar: "التالي: Observables وRxJS.", en: "Next: Observables and RxJS." },
      })
    ],
  },
  "04-rxjs": {
    meta: {
      slug: "04-rxjs",
      order: 4,
      title: { ar: "RxJS والتفاعلية", en: "RxJS & reactivity" },
      description: { ar: "Observables، Operators، وSignals", en: "Observables, operators, and signals" },
      lessons: [
        "01-observables.json",
        "02-operators.json",
        "03-signals.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-observables",
        order: 1,
        duration: 50,
        title: { ar: "Observables", en: "Observables" },
        summary: { ar: "Observable، Observer، subscribe، وasync pipe.", en: "Observable, Observer, subscribe, and async pipe." },
        why: { ar: "Angular HttpClient وRouter وForm events كلها **Observables** — push streams over time. `http.get<Lesson[]>()` returns `Observable` — subscribe or async pipe. Unlike Promise، Observable can emit multiple values وcancelable.\n\nAlefYa: lessons$ stream from API. **Cold observable** starts on subscribe. **Hot** shared — shareReplay later. Unsubscribe leaks memory — async pipe or takeUntilDestroyed.", en: "Angular HttpClient, Router, and form events are **Observables** — push streams over time. `http.get<Lesson[]>()` returns `Observable` — subscribe or async pipe. Unlike Promise, Observable can emit multiple values and is cancelable.\n\nAlefYa: lessons$ stream from API. **Cold observable** starts on subscribe. **Hot** shared — shareReplay later. Unsubscribe leaks memory — async pipe or takeUntilDestroyed." },
        goals: {
          ar: ["إنشاء Observable وsubscribe", "HttpClient.get as Observable", "async pipe في القالب", "unsubscribe strategies preview"],
          en: ["Create Observable and subscribe", "HttpClient.get as Observable", "async pipe in template", "unsubscribe strategies preview"],
        },
        concepts: [
          concept(
            "Observable contract",
            "Producer emits next/error/complete. Observer `{ next, error, complete }`. lazy until subscribe.",
            "Observable contract",
            "Producer emits next/error/complete. Observer `{ next, error, complete }`. lazy until subscribe.",
          ),
          concept(
            "HttpClient streams",
            "`this.http.get<Lesson[]>('/api/lessons')` — one next then complete on HTTP. typed generic.",
            "HttpClient streams",
            "`this.http.get<Lesson[]>('/api/lessons')` — one next then complete on HTTP. typed generic.",
          ),
          concept(
            "AsyncPipe",
            "`<div @for (l of lessons$ | async; track l.slug)>` — manages subscription lifecycle.",
            "AsyncPipe",
            "`<div @for (l of lessons$ | async; track l.slug)>` — manages subscription lifecycle.",
          ),
          concept(
            "Subscribe patterns",
            "imperative subscribe in service/store. components prefer async pipe or signals from toSignal.",
            "Subscribe patterns",
            "imperative subscribe in service/store. components prefer async pipe or signals from toSignal.",
          ),
        ],
        steps: {
          ar: ["of([1,2,3]) subscribe console", "HttpClient get mock", "lessons$ property", "template async pipe", "error handler error:", "complete callback log"],
          en: ["of([1,2,3]) subscribe console", "HttpClient get mock", "lessons$ property", "template async pipe", "error handler error:", "complete callback log"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Component({ standalone: true, imports: [AsyncPipe], template: `\n  @for (l of lessons$ | async; track l.slug) {\n    <p>{{ l.title.ar }}</p>\n  }\n` })\nexport class LessonListComponent {\n  private http = inject(HttpClient);\n  lessons$ = this.http.get<Lesson[]>(\"/api/lessons\");\n}",
            explain: "HttpClient + async pipe — standard AlefYa list.",
          },
          en: {
            lang: "typescript",
            source: "@Component({ standalone: true, imports: [AsyncPipe], template: `\n  @for (l of lessons$ | async; track l.slug) {\n    <p>{{ l.title.en }}</p>\n  }\n` })\nexport class LessonListComponent {\n  private http = inject(HttpClient);\n  lessons$ = this.http.get<Lesson[]>(\"/api/lessons\");\n}",
            explain: "HttpClient + async pipe — standard AlefYa list.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["nested subscribe", "pipe operators flatten"],
            en: ["nested subscribe", "pipe operators flatten"],
          },
          {
            ar: ["forget unsubscribe manual sub", "takeUntilDestroyed or async"],
            en: ["forget unsubscribe manual sub", "takeUntilDestroyed or async"],
          },
          {
            ar: ["subscribe in constructor", "ngOnInit or field init"],
            en: ["subscribe in constructor", "ngOnInit or field init"],
          },
          {
            ar: ["Observable never executes", "cold — need subscribe"],
            en: ["Observable never executes", "cold — need subscribe"],
          },
        ]),
        discussion: [
          qa(
            "Observable vs Promise?",
            "Observable multi-value cancelable lazy.",
            "Observable vs Promise?",
            "Observable multi-value cancelable lazy.",
          ),
          qa(
            "firstValueFrom?",
            "Promise bridge — use sparingly.",
            "firstValueFrom?",
            "Promise bridge — use sparingly.",
          ),
          qa(
            "rxjs global?",
            "import from 'rxjs' tree-shaken.",
            "rxjs global?",
            "import from 'rxjs' tree-shaken.",
          ),
          qa(
            "toSignal?",
            "lesson 04-rxjs signals.",
            "toSignal?",
            "lesson 04-rxjs signals.",
          ),
        ],
        exercises: {
          ar: ["of() error path", "async empty @empty", "loading flag before emit", "typed get<Track[]>"],
          en: ["of() error path", "async empty @empty", "loading flag before emit", "typed get<Track[]>"],
        },
        checklist: {
          ar: ["Observable subscribe", "HttpClient get", "async pipe", "error handler", "جاهز operators"],
          en: ["Observable subscribe", "HttpClient get", "async pipe", "error handler", "ready for operators"],
        },
        nextHint: { ar: "التالي: map، switchMap، catchError.", en: "Next: map, switchMap, catchError." },
      }),
      deepLesson({
        slug: "02-operators",
        order: 2,
        duration: 52,
        title: { ar: "Operators الأساسية", en: "Core operators" },
        summary: { ar: "map، filter، switchMap، debounceTime، catchError.", en: "map, filter, switchMap, debounceTime, catchError." },
        why: { ar: "Operators تحوّل تدفقات Observable بشكل declarative داخل `pipe()`. مثال AlefYa: `paramMap` من Router ثم `switchMap(slug => api.getLesson(slug))` يلغي طلبات قديمة عند تغيير الدرس بسرعة. حقل بحث مع `debounceTime(300)` يقلل استدعاءات API.\n\n`catchError(() => of([]))` يبقي الواجهة حية عند فشل الشبكة. `tap` للتسجيل الجانبي. فهم marbles يساعد في تصحيح loader الدروس — موضوع عملي وليس نظرياً فقط.", en: "Operators transform Observable streams declaratively inside `pipe()`. AlefYa example: Router `paramMap` then `switchMap(slug => api.getLesson(slug))` cancels stale requests when switching lessons quickly. A search field with `debounceTime(300)` reduces API calls.\n\n`catchError(() => of([]))` keeps the UI alive on network failure. `tap` for side-effect logging. Understanding marbles helps debug the lesson loader — practical, not purely theoretical." },
        goals: {
          ar: ["pipe map filter tap", "switchMap لل route params", "catchError fallback", "debounceTime search"],
          en: ["pipe map filter tap", "switchMap for route params", "catchError fallback", "debounceTime search"],
        },
        concepts: [
          concept(
            "Transformation",
            "map transforms value. filter skips. pluck deprecated — map.",
            "Transformation",
            "map transforms value. filter skips. pluck deprecated — map.",
          ),
          concept(
            "Flattening",
            "switchMap cancels prior inner — route changes. mergeMap concurrent — use carefully.",
            "Flattening",
            "switchMap cancels prior inner — route changes. mergeMap concurrent — use carefully.",
          ),
          concept(
            "Error handling",
            "catchError returns fallback Observable. throwError rethrow after log.",
            "Error handling",
            "catchError returns fallback Observable. throwError rethrow after log.",
          ),
          concept(
            "Utility",
            "debounceTime distinctUntilChanged for search. finalize cleanup loading flag.",
            "Utility",
            "debounceTime distinctUntilChanged for search. finalize cleanup loading flag.",
          ),
        ],
        steps: {
          ar: ["map slug to Lesson", "switchMap getLesson", "catchError empty lesson", "debounce search input", "tap log emissions", "combine route+query"],
          en: ["map slug to Lesson", "switchMap getLesson", "catchError empty lesson", "debounce search input", "tap log emissions", "combine route+query"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "lesson$ = this.route.paramMap.pipe(\n  map(p => p.get(\"slug\") ?? \"\"),\n  filter(Boolean),\n  switchMap(slug => this.api.getLesson(slug)),\n  catchError(err => {\n    console.error(err);\n    return of(null);\n  }),\n);",
            explain: "Lesson page stream — AlefYa /learn/:slug.",
          },
          en: {
            lang: "typescript",
            source: "lesson$ = this.route.paramMap.pipe(\n  map(p => p.get(\"slug\") ?? \"\"),\n  filter(Boolean),\n  switchMap(slug => this.api.getLesson(slug)),\n  catchError(err => {\n    console.error(err);\n    return of(null);\n  }),\n);",
            explain: "Lesson page stream — AlefYa /learn/:slug.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["mergeMap on route", "switchMap for param changes"],
            en: ["mergeMap on route", "switchMap for param changes"],
          },
          {
            ar: ["catchError swallow silently", "log + user message"],
            en: ["catchError swallow silently", "log + user message"],
          },
          {
            ar: ["subscribe inside switchMap without return", "return inner Observable"],
            en: ["subscribe inside switchMap without return", "return inner Observable"],
          },
          {
            ar: ["nested pipe hell", "extract methods"],
            en: ["nested pipe hell", "extract methods"],
          },
        ]),
        discussion: [
          qa(
            "switchMap vs exhaustMap?",
            "switch cancels; exhaust ignores new until done.",
            "switchMap vs exhaustMap?",
            "switch cancels; exhaust ignores new until done.",
          ),
          qa(
            "combineLatest?",
            "combine multiple streams — dashboard.",
            "combineLatest?",
            "combine multiple streams — dashboard.",
          ),
          qa(
            "shareReplay?",
            "cache HTTP — state lesson.",
            "shareReplay?",
            "cache HTTP — state lesson.",
          ),
          qa(
            "debug marbles?",
            "rxjs.dev visualizer.",
            "debug marbles?",
            "rxjs.dev visualizer.",
          ),
        ],
        exercises: {
          ar: ["debounce search tracks", "retry 2 on HTTP", "distinct locale changes", "filter completed lessons"],
          en: ["debounce search tracks", "retry 2 on HTTP", "distinct locale changes", "filter completed lessons"],
        },
        checklist: {
          ar: ["map/filter", "switchMap route", "catchError", "debounceTime", "جاهز signals"],
          en: ["map/filter", "switchMap route", "catchError", "debounceTime", "ready for signals"],
        },
        nextHint: { ar: "التالي: Angular Signals.", en: "Next: Angular signals." },
      }),
      deepLesson({
        slug: "03-signals",
        order: 3,
        duration: 48,
        title: { ar: "Angular Signals", en: "Angular signals" },
        summary: { ar: "signal، computed، effect، toSignal، model.", en: "signal, computed, effect, toSignal, model." },
        why: { ar: "Signals توفر تفاعلية دقيقة: `count = signal(0)` و`double = computed(() => this.count() * 2)`. Angular 17+ يدفع Signals بجانب RxJS — `toSignal(obs$)` جسر بين العالمين.\n\nتقدّم AlefYa: `completed = signal<Set<string>>(new Set())` مع `effect` للحفظ في localStorage. **model()** للربط ثنائي الاتجاه. OnPush يعمل طبيعياً مع Signals — أقل change detection غير ضروري.", en: "Signals provide fine-grained reactivity: `count = signal(0)` and `double = computed(() => this.count() * 2)`. Angular 17+ pushes Signals alongside RxJS — `toSignal(obs$)` bridges both worlds.\n\nAlefYa progress: `completed = signal<Set<string>>(new Set())` with an `effect` persisting to localStorage. **model()** for two-way binding. OnPush works naturally with Signals — less unnecessary change detection." },
        goals: {
          ar: ["signal computed effect", "toSignal from Observable", "model() two-way", "compare signals vs BehaviorSubject"],
          en: ["signal computed effect", "toSignal from Observable", "model() two-way", "compare signals vs BehaviorSubject"],
        },
        concepts: [
          concept(
            "signal & computed",
            "signal setter `.set()` `.update()`. computed read-only derived. no manual subscribe.",
            "signal & computed",
            "signal setter `.set()` `.update()`. computed read-only derived. no manual subscribe.",
          ),
          concept(
            "effect",
            "runs when signal deps change — side effects localStorage analytics. avoid circular writes.",
            "effect",
            "runs when signal deps change — side effects localStorage analytics. avoid circular writes.",
          ),
          concept(
            "toSignal / toObservable",
            "bridge RxJS ↔ signals. `toSignal(route.paramMap.pipe(map(...)))`.",
            "toSignal / toObservable",
            "bridge RxJS ↔ signals. `toSignal(route.paramMap.pipe(map(...)))`.",
          ),
          concept(
            "input model signals",
            "input() output() model() — modern component API.",
            "input model signals",
            "input() output() model() — modern component API.",
          ),
        ],
        steps: {
          ar: ["progress signal Set", "computed percent", "effect localStorage", "toSignal lesson$", "model locale toggle", "OnPush component test"],
          en: ["progress signal Set", "computed percent", "effect localStorage", "toSignal lesson$", "model locale toggle", "OnPush component test"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Injectable({ providedIn: \"root\" })\nexport class ProgressStore {\n  private done = signal(new Set<string>());\n  readonly count = computed(() => this.done().size);\n\n  mark(slug: string) {\n    this.done.update(s => new Set(s).add(slug));\n  }\n}",
            explain: "Progress store — signals for AlefYa dashboard.",
          },
          en: {
            lang: "typescript",
            source: "@Injectable({ providedIn: \"root\" })\nexport class ProgressStore {\n  private done = signal(new Set<string>());\n  readonly count = computed(() => this.done().size);\n\n  mark(slug: string) {\n    this.done.update(s => new Set(s).add(slug));\n  }\n}",
            explain: "Progress store — signals for AlefYa dashboard.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["mutate signal Set in place", "immutable update new Set"],
            en: ["mutate signal Set in place", "immutable update new Set"],
          },
          {
            ar: ["effect writes same signal", "infinite loop — untrack if needed"],
            en: ["effect writes same signal", "infinite loop — untrack if needed"],
          },
          {
            ar: ["signal in async pipe mix", "pick one pattern per view"],
            en: ["signal in async pipe mix", "pick one pattern per view"],
          },
          {
            ar: ["computed side effects", "computed pure only"],
            en: ["computed side effects", "computed pure only"],
          },
        ]),
        discussion: [
          qa(
            "signals replace RxJS?",
            "coexist — events/async RxJS, state signals.",
            "signals replace RxJS?",
            "coexist — events/async RxJS, state signals.",
          ),
          qa(
            "resource() API?",
            "Angular 19+ async resource — watch docs.",
            "resource() API?",
            "Angular 19+ async resource — watch docs.",
          ),
          qa(
            "signal inputs migration?",
            "gradual from @Input.",
            "signal inputs migration?",
            "gradual from @Input.",
          ),
          qa(
            "zoneless signals?",
            "stage 08 advanced.",
            "zoneless signals?",
            "stage 08 advanced.",
          ),
        ],
        exercises: {
          ar: ["computed percent complete", "effect save locale", "toSignal param slug", "model search query"],
          en: ["computed percent complete", "effect save locale", "toSignal param slug", "model search query"],
        },
        checklist: {
          ar: ["signal computed", "effect side effect", "toSignal bridge", "immutable updates", "جاهز Router"],
          en: ["signal computed", "effect side effect", "toSignal bridge", "immutable updates", "ready for Router"],
        },
        nextHint: { ar: "التالي: Router basics.", en: "Next: Router basics." },
      })
    ],
  },
  "05-routing": {
    meta: {
      slug: "05-routing",
      order: 5,
      title: { ar: "التوجيه", en: "Routing" },
      description: { ar: "المسارات، الحراس، والتحميل الكسول", en: "Routes, guards, and lazy loading" },
      lessons: [
        "01-router-basics.json",
        "02-params-data.json",
        "03-guards-lazy.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-router-basics",
        order: 1,
        duration: 45,
        title: { ar: "أساسيات Router", en: "Router basics" },
        summary: { ar: "Routes، routerLink، router-outlet، provideRouter.", en: "Routes, routerLink, router-outlet, provideRouter." },
        why: { ar: "SPA navigation without full reload: `/tracks`, `/learn/angular/01-why-typescript`. `Routes` array maps path → component. `routerLink` + `router-outlet` render nested views.\n\nAlefYa: TrackList at `/tracks`, LessonPage at `/learn/:track/:lesson`. `provideRouter(routes)` in app.config. wildcard `**` redirect 404.", en: "SPA navigation without full reload: `/tracks`, `/learn/angular/01-why-typescript`. `Routes` array maps path → component. `routerLink` + `router-outlet` render nested views.\n\nAlefYa: TrackList at `/tracks`, LessonPage at `/learn/:track/:lesson`. `provideRouter(routes)` in app.config. wildcard `**` redirect 404." },
        goals: {
          ar: ["define Routes array", "routerLink active styling", "router-outlet placement", "redirect default path"],
          en: ["define Routes array", "routerLink active styling", "router-outlet placement", "redirect default path"],
        },
        concepts: [
          concept(
            "Route config",
            "`{ path: 'tracks', component: TrackListComponent }` `{ path: '', redirectTo: 'tracks', pathMatch: 'full' }`.",
            "Route config",
            "`{ path: 'tracks', component: TrackListComponent }` `{ path: '', redirectTo: 'tracks', pathMatch: 'full' }`.",
          ),
          concept(
            "routerLink",
            "`<a routerLink=\"/tracks\" routerLinkActive=\"active\">` — relative links `[routerLink]=\"['learn', track, lesson]\"`.",
            "routerLink",
            "`<a routerLink=\"/tracks\" routerLinkActive=\"active\">` — relative `[routerLink]=\"['learn', track, lesson]\"`.",
          ),
          concept(
            "router-outlet",
            "placeholder where routed component renders. nested outlets for child routes.",
            "router-outlet",
            "placeholder where routed component renders. nested outlets for child routes.",
          ),
          concept(
            "Router service",
            "inject(Router) navigate programmatically `router.navigate(['/tracks'])`.",
            "Router service",
            "inject(Router) navigate programmatically `router.navigate(['/tracks'])`.",
          ),
        ],
        steps: {
          ar: ["app.routes.ts Tracks+Lesson", "router-outlet AppComponent", "routerLink nav", "redirect '' to tracks", "routerLinkActive", "wildcard ** 404 page"],
          en: ["app.routes.ts Tracks+Lesson", "router-outlet AppComponent", "routerLink nav", "redirect '' to tracks", "routerLinkActive", "wildcard ** 404 page"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "export const routes: Routes = [\n  { path: \"\", redirectTo: \"tracks\", pathMatch: \"full\" },\n  { path: \"tracks\", component: TrackListComponent },\n  { path: \"learn/:track/:lesson\", component: LessonPageComponent },\n  { path: \"**\", component: NotFoundComponent },\n];",
            explain: "AlefYa learner routes.",
          },
          en: {
            lang: "typescript",
            source: "export const routes: Routes = [\n  { path: \"\", redirectTo: \"tracks\", pathMatch: \"full\" },\n  { path: \"tracks\", component: TrackListComponent },\n  { path: \"learn/:track/:lesson\", component: LessonPageComponent },\n  { path: \"**\", component: NotFoundComponent },\n];",
            explain: "AlefYa learner routes.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["pathMatch full forgotten", "redirect needs pathMatch: 'full'"],
            en: ["pathMatch full forgotten", "redirect needs pathMatch: 'full'"],
          },
          {
            ar: ["routerLink href reload", "use routerLink not href for internal"],
            en: ["routerLink href reload", "use routerLink not href for internal"],
          },
          {
            ar: ["outlet missing", "blank page — add outlet"],
            en: ["outlet missing", "blank page — add outlet"],
          },
          {
            ar: ["import RouterLink forget", "standalone imports RouterLink"],
            en: ["import RouterLink forget", "standalone imports RouterLink"],
          },
        ]),
        discussion: [
          qa(
            "hash routing?",
            "# routing legacy — HTML5 default.",
            "hash routing?",
            "# routing legacy — HTML5 default.",
          ),
          qa(
            "withComponentInputBinding?",
            "route params as @Input — next lesson.",
            "withComponentInputBinding?",
            "route params as @Input — next lesson.",
          ),
          qa(
            "nested routes?",
            "children array + child outlet.",
            "nested routes?",
            "children array + child outlet.",
          ),
          qa(
            "RouterModule?",
            "provideRouter replaces for standalone.",
            "RouterModule?",
            "provideRouter replaces for standalone.",
          ),
        ],
        exercises: {
          ar: ["404 page route", "routerLinkActive exact", "programmatic navigate", "dashboard route"],
          en: ["404 page route", "routerLinkActive exact", "programmatic navigate", "dashboard route"],
        },
        checklist: {
          ar: ["Routes defined", "router-outlet", "routerLink works", "redirect default", "جاهز params"],
          en: ["Routes defined", "router-outlet", "routerLink works", "redirect default", "ready for params"],
        },
        nextHint: { ar: "التالي: paramMap وqueryParams.", en: "Next: paramMap and queryParams." },
      }),
      deepLesson({
        slug: "02-params-data",
        order: 2,
        duration: 42,
        title: { ar: "المعاملات والبيانات", en: "Params & route data" },
        summary: { ar: "paramMap، queryParams، route data، input binding.", en: "paramMap, queryParams, route data, input binding." },
        why: { ar: "`/learn/angular/01-why-typescript` — `ActivatedRoute.paramMap` gives track and lesson slugs. Query `?locale=en` for bilingual. Static `data: { title: '...' }` on route for breadcrumbs.\n\nModern: `withComponentInputBinding()` maps `:lesson` to `@Input() lesson` or signal input. `toSignal(route.paramMap.pipe(map(...)))` reactive slug.", en: "`/learn/angular/01-why-typescript` — `ActivatedRoute.paramMap` gives track and lesson slugs. Query `?locale=en` for bilingual. Static `data: { title: '...' }` on route for breadcrumbs.\n\nModern: `withComponentInputBinding()` maps `:lesson` to `@Input() lesson` or signal input. `toSignal(route.paramMap.pipe(map(...)))` reactive slug." },
        goals: {
          ar: ["read paramMap queryParams", "route data static metadata", "withComponentInputBinding", "toSignal slug reactive"],
          en: ["read paramMap queryParams", "route data static metadata", "withComponentInputBinding", "toSignal slug reactive"],
        },
        concepts: [
          concept(
            "ActivatedRoute",
            "paramMap Observable emits on change. snapshot for one-time — prefer Observable.",
            "ActivatedRoute",
            "paramMap Observable emits on change. snapshot for one-time — prefer Observable.",
          ),
          concept(
            "Query params",
            "`queryParamMap` for `?tab=discussion`. merge with params in LessonPage.",
            "Query params",
            "`queryParamMap` for `?tab=discussion`. merge with params in LessonPage.",
          ),
          concept(
            "Route data",
            "`data: { breadcrumb: 'Tracks' }` resolve static config.",
            "Route data",
            "`data: { breadcrumb: 'Tracks' }` resolve static config.",
          ),
          concept(
            "Input binding",
            "provideRouter(routes, withComponentInputBinding()) — param name matches @Input.",
            "Input binding",
            "provideRouter(routes, withComponentInputBinding()) — param name matches @Input.",
          ),
        ],
        steps: {
          ar: ["paramMap track+lesson", "queryParam locale", "route data breadcrumb", "enable input binding", "toSignal slug", "switchMap load lesson"],
          en: ["paramMap track+lesson", "queryParam locale", "route data breadcrumb", "enable input binding", "toSignal slug", "switchMap load lesson"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Component({ standalone: true, template: `<h1>{{ track() }} / {{ lesson() }}</h1>` })\nexport class LessonPageComponent {\n  private route = inject(ActivatedRoute);\n  track = toSignal(this.route.paramMap.pipe(map(p => p.get(\"track\")!)), { initialValue: \"\" });\n  lesson = toSignal(this.route.paramMap.pipe(map(p => p.get(\"lesson\")!)), { initialValue: \"\" });\n}",
            explain: "LessonPage reads route params as signals.",
          },
          en: {
            lang: "typescript",
            source: "@Component({ standalone: true, template: `<h1>{{ track() }} / {{ lesson() }}</h1>` })\nexport class LessonPageComponent {\n  private route = inject(ActivatedRoute);\n  track = toSignal(this.route.paramMap.pipe(map(p => p.get(\"track\")!)), { initialValue: \"\" });\n  lesson = toSignal(this.route.paramMap.pipe(map(p => p.get(\"lesson\")!)), { initialValue: \"\" });\n}",
            explain: "LessonPage reads route params as signals.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["snapshot stale on reuse", "same component new params — subscribe paramMap"],
            en: ["snapshot stale on reuse", "same component new params — subscribe paramMap"],
          },
          {
            ar: ["param string null", "filter Boolean or default"],
            en: ["param string null", "filter Boolean or default"],
          },
          {
            ar: ["query params ignored locale", "sync locale service with query"],
            en: ["query params ignored locale", "sync locale service with query"],
          },
          {
            ar: ["input binding name mismatch", "param :lesson → @Input lesson"],
            en: ["input binding name mismatch", "param :lesson → @Input lesson"],
          },
        ]),
        discussion: [
          qa(
            "resolver vs component fetch?",
            "resolver waits — UX tradeoff.",
            "resolver vs component fetch?",
            "resolver waits — UX tradeoff.",
          ),
          qa(
            "matrix params?",
            "rare — matrix ; style.",
            "matrix params?",
            "rare — matrix ; style.",
          ),
          qa(
            "fragment #section?",
            "ActivatedRoute fragment for anchors.",
            "fragment #section?",
            "ActivatedRoute fragment for anchors.",
          ),
          qa(
            "relative navigation?",
            "router.navigate(['..'], { relativeTo })",
            "relative navigation?",
            "router.navigate(['..'], { relativeTo })",
          ),
        ],
        exercises: {
          ar: ["?locale query sync", "breadcrumb from data", "input binding lesson", "invalid slug 404"],
          en: ["?locale query sync", "breadcrumb from data", "input binding lesson", "invalid slug 404"],
        },
        checklist: {
          ar: ["paramMap read", "queryParams", "toSignal params", "input binding optional", "جاهز guards"],
          en: ["paramMap read", "queryParams", "toSignal params", "input binding optional", "ready for guards"],
        },
        nextHint: { ar: "التالي: guards وlazy loading.", en: "Next: guards and lazy loading." },
      }),
      deepLesson({
        slug: "03-guards-lazy",
        order: 3,
        duration: 50,
        title: { ar: "Guards والتحميل الكسول", en: "Guards & lazy loading" },
        summary: { ar: "canActivate، functional guards، loadComponent lazy.", en: "canActivate, functional guards, loadComponent lazy." },
        why: { ar: "**Guards** protect routes: auth before `/admin`. Functional `canActivate: [authGuard]` inject AuthService return boolean|UrlTree. **Lazy loading** splits bundles — admin chunk loads only when visited.\n\nStandalone `loadComponent: () => import('./admin').then(m => m.AdminComponent)`. `canMatch` for feature flags. AlefYa admin editor behind guard.", en: "**Guards** protect routes: auth before `/admin`. Functional `canActivate: [authGuard]` inject AuthService return boolean|UrlTree. **Lazy loading** splits bundles — admin chunk loads only when visited.\n\nStandalone `loadComponent: () => import('./admin').then(m => m.AdminComponent)`. `canMatch` for feature flags. AlefYa admin editor behind guard." },
        goals: {
          ar: ["functional canActivate guard", "redirect UrlTree login", "loadComponent lazy route", "preload strategy optional"],
          en: ["functional canActivate guard", "redirect UrlTree login", "loadComponent lazy route", "preload strategy optional"],
        },
        concepts: [
          concept(
            "Functional guards",
            "`export const authGuard: CanActivateFn = () => inject(Auth).loggedIn() || inject(Router).createUrlTree(['/login']);`",
            "Functional guards",
            "`export const authGuard: CanActivateFn = () => inject(Auth).loggedIn() || inject(Router).createUrlTree(['/login']);`",
          ),
          concept(
            "Lazy loadComponent",
            "`{ path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.AdminComponent), canActivate: [authGuard] }`",
            "Lazy loadComponent",
            "`{ path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.AdminComponent), canActivate: [authGuard] }`",
          ),
          concept(
            "canDeactivate",
            "unsaved form warning — forms stage integration.",
            "canDeactivate",
            "unsaved form warning — forms stage integration.",
          ),
          concept(
            "Preloading",
            "withPreloading(PreloadAllModules) — optional after lazy works.",
            "Preloading",
            "withPreloading(PreloadAllModules) — optional after lazy works.",
          ),
        ],
        steps: {
          ar: ["authGuard functional", "protect admin route", "lazy loadComponent admin", "UrlTree redirect login", "verify separate chunk ng build", "canDeactivate sketch"],
          en: ["authGuard functional", "protect admin route", "lazy loadComponent admin", "UrlTree redirect login", "verify separate chunk ng build", "canDeactivate sketch"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "export const authGuard: CanActivateFn = () => {\n  const auth = inject(AuthService);\n  return auth.isLoggedIn() ? true : inject(Router).createUrlTree([\"/login\"]);\n};\n\n{ path: \"admin\", canActivate: [authGuard],\n  loadComponent: () => import(\"./admin/admin.page\").then(m => m.AdminPageComponent) }",
            explain: "Protected lazy admin — AlefYa editor.",
          },
          en: {
            lang: "typescript",
            source: "export const authGuard: CanActivateFn = () => {\n  const auth = inject(AuthService);\n  return auth.isLoggedIn() ? true : inject(Router).createUrlTree([\"/login\"]);\n};\n\n{ path: \"admin\", canActivate: [authGuard],\n  loadComponent: () => import(\"./admin/admin.page\").then(m => m.AdminPageComponent) }",
            explain: "Protected lazy admin — AlefYa editor.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["guard inject outside context", "use functional guard inject()"],
            en: ["guard inject outside context", "use functional guard inject()"],
          },
          {
            ar: ["lazy import wrong export", "match named export component"],
            en: ["lazy import wrong export", "match named export component"],
          },
          {
            ar: ["always load all routes eager", "lazy large features"],
            en: ["always load all routes eager", "lazy large features"],
          },
          {
            ar: ["guard async without map", "return Observable<boolean|UrlTree>"],
            en: ["guard async without map", "return Observable<boolean|UrlTree>"],
          },
        ]),
        discussion: [
          qa(
            "class guards legacy?",
            "functional preferred Angular 15+.",
            "class guards legacy?",
            "functional preferred Angular 15+.",
          ),
          qa(
            "loadChildren modules?",
            "legacy — loadComponent standalone.",
            "loadChildren modules?",
            "legacy — loadComponent standalone.",
          ),
          qa(
            "resolver fetch before route?",
            "optional — component fetch OK.",
            "resolver fetch before route?",
            "optional — component fetch OK.",
          ),
          qa(
            "SSR lazy?",
            "stage 08 — same routes work.",
            "SSR lazy?",
            "stage 08 — same routes work.",
          ),
        ],
        exercises: {
          ar: ["login guard redirect", "lazy dashboard chunk", "canMatch feature flag", "preload none vs all"],
          en: ["login guard redirect", "lazy dashboard chunk", "canMatch feature flag", "preload none vs all"],
        },
        checklist: {
          ar: ["authGuard works", "lazy chunk verified", "UrlTree redirect", "canActivate on route", "جاهز forms"],
          en: ["authGuard works", "lazy chunk verified", "UrlTree redirect", "canActivate on route", "ready for forms"],
        },
        nextHint: { ar: "التالي: Template-driven forms.", en: "Next: Template-driven forms." },
      })
    ],
  },
  "06-forms": {
    meta: {
      slug: "06-forms",
      order: 6,
      title: { ar: "النماذج", en: "Forms" },
      description: { ar: "Template-driven وReactive Forms", en: "Template-driven and reactive forms" },
      lessons: [
        "01-template-forms.json",
        "02-reactive-forms.json",
        "03-validation.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-template-forms",
        order: 1,
        duration: 42,
        title: { ar: "Template-driven Forms", en: "Template-driven forms" },
        summary: { ar: "NgModel، ngForm، two-way binding للنماذج البسيطة.", en: "NgModel, ngForm, two-way binding for simple forms." },
        why: { ar: "Template-driven forms تضع المنطق في القالب: `#f=\"ngForm\"` و`(ngSubmit)=\"save(f.value)\"`. `[(ngModel)]=\"title\"` ربط ثنائي الاتجاه. مناسبة لتبديلات سريعة في AlefYa — تغيير اللغة، تحديد درس مكتمل.\n\nتحتاج `FormsModule` في imports للمكوّن standalone. التحقق عبر HTML `required` ومراجع `ngModel`. أقل قابلية للتوسع من reactive — تعلّم النمطين.", en: "Template-driven forms put logic in the template: `#f=\"ngForm\"` and `(ngSubmit)=\"save(f.value)\"`. `[(ngModel)]=\"title\"` is two-way binding. Good for quick AlefYa toggles — locale switch, mark lesson complete.\n\nRequires `FormsModule` in standalone component imports. Validation via HTML `required` and `ngModel` refs. Less scalable than reactive — learn both patterns." },
        goals: {
          ar: ["NgModel two-way binding", "ngForm submit handling", "template validation required", "NgModel standalone import"],
          en: ["NgModel two-way binding", "ngForm submit handling", "template validation required", "NgModel standalone import"],
        },
        concepts: [
          concept(
            "NgModel",
            "`[(ngModel)]=\"lesson.title.ar\"` name attribute required in form. standalone import FormsModule.",
            "NgModel",
            "`[(ngModel)]=\"lesson.title.ar\"` name attribute required in form. standalone import FormsModule.",
          ),
          concept(
            "ngForm",
            "exportAs `#lessonForm=\"ngForm\"` access valid dirty touched.",
            "ngForm",
            "exportAs `#lessonForm=\"ngForm\"` access valid dirty touched.",
          ),
          concept(
            "Template validation",
            "`required minlength` on input — `*ngIf=\"title.invalid && title.touched\"` or @if.",
            "Template validation",
            "`required minlength` on input — `@if (title.invalid && title.touched)` error.",
          ),
          concept(
            "When template-driven",
            "simple 2-3 fields settings — reactive for complex AlefYa lesson editor.",
            "When template-driven",
            "simple 2-3 fields settings — reactive for complex AlefYa lesson editor.",
          ),
        ],
        steps: {
          ar: ["import FormsModule", "form ngSubmit", "ngModel title ar/en", "required validation message", "disable submit if invalid", "log f.value"],
          en: ["import FormsModule", "form ngSubmit", "ngModel title ar/en", "required validation message", "disable submit if invalid", "log f.value"],
        },
        code: {
          ar: {
            lang: "html",
            source: "<form #f=\"ngForm\" (ngSubmit)=\"save(f.value)\">\n  <input name=\"titleAr\" [(ngModel)]=\"model.title.ar\" required />\n  @if (f.submitted && !model.title.ar) {\n    <p class=\"error\">العنوان مطلوب</p>\n  }\n  <button type=\"submit\" [disabled]=\"f.invalid\">حفظ</button>\n</form>",
            explain: "نموذج بسيط — إعدادات درس.",
          },
          en: {
            lang: "html",
            source: "<form #f=\"ngForm\" (ngSubmit)=\"save(f.value)\">\n  <input name=\"titleEn\" [(ngModel)]=\"model.title.en\" required />\n  @if (f.submitted && !model.title.en) {\n    <p class=\"error\">Title required</p>\n  }\n  <button type=\"submit\" [disabled]=\"f.invalid\">Save</button>\n</form>",
            explain: "Simple form — lesson settings.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["ngModel without name", "name required for register"],
            en: ["ngModel without name", "name required for register"],
          },
          {
            ar: ["forget FormsModule", "NG8002 can't bind ngModel"],
            en: ["forget FormsModule", "NG8002 can't bind ngModel"],
          },
          {
            ar: ["mutable model shared", "copy on submit"],
            en: ["mutable model shared", "copy on submit"],
          },
          {
            ar: ["complex validation template", "use reactive instead"],
            en: ["complex validation template", "use reactive instead"],
          },
        ]),
        discussion: [
          qa(
            "NgModel standalone?",
            "import FormsModule in component.",
            "NgModel standalone?",
            "import FormsModule in component.",
          ),
          qa(
            "ngModelOptions standalone?",
            "standalone: true on control.",
            "ngModelOptions standalone?",
            "standalone: true on control.",
          ),
          qa(
            "two-way signal model()?",
            "model() replaces NgModel modern.",
            "two-way signal model()?",
            "model() replaces NgModel modern.",
          ),
          qa(
            "accessibility forms?",
            "label for=id required aria.",
            "accessibility forms?",
            "label for=id required aria.",
          ),
        ],
        exercises: {
          ar: ["locale select ngModel", "dirty touched display", "reset form after submit", "checkbox completed"],
          en: ["locale select ngModel", "dirty touched display", "reset form after submit", "checkbox completed"],
        },
        checklist: {
          ar: ["FormsModule imported", "ngModel works", "validation message", "submit disabled invalid", "جاهز reactive"],
          en: ["FormsModule imported", "ngModel works", "validation message", "submit disabled invalid", "ready for reactive"],
        },
        nextHint: { ar: "التالي: Reactive Forms.", en: "Next: Reactive forms." },
      }),
      deepLesson({
        slug: "02-reactive-forms",
        order: 2,
        duration: 50,
        title: { ar: "Reactive Forms", en: "Reactive forms" },
        summary: { ar: "FormBuilder، FormGroup، FormControl typed.", en: "FormBuilder, FormGroup, typed FormControl." },
        why: { ar: "Reactive forms تحفظ النموذج في الكلاس: `form = fb.group({ slug: ['', Validators.required], duration: [45] })`. تحقق قابل للتوسع، اختبار unit سهل، حقول ديناميكية. محرّر دروس AlefYa يستخدم reactive.\n\nTyped forms `FormGroup<{ slug: FormControl<string> }>` تعطي autocomplete. `valueChanges` Observable للمعاينة الحية. خيار `nonNullable` لـ strict typing.", en: "Reactive forms keep the model in the class: `form = fb.group({ slug: ['', Validators.required], duration: [45] })`. Scalable validation, easy unit tests, dynamic fields. AlefYa lesson editor uses reactive forms.\n\nTyped forms `FormGroup<{ slug: FormControl<string> }>` give autocomplete. `valueChanges` Observable for live preview. `nonNullable` option for strict typing." },
        goals: {
          ar: ["FormBuilder group controls", "typed FormGroup", "valueChanges subscribe", "patchValue setValue"],
          en: ["FormBuilder group controls", "typed FormGroup", "valueChanges subscribe", "patchValue setValue"],
        },
        concepts: [
          concept(
            "FormBuilder",
            "inject(FormBuilder) `group({ title: nonNullable.control('') })` — immutable structure.",
            "FormBuilder",
            "inject(FormBuilder) `group({ title: nonNullable.control('') })` — immutable structure.",
          ),
          concept(
            "Template binding",
            "formGroup directive `[formGroup]=\"form\"` formControlName=\"slug\".",
            "Template binding",
            "formGroup directive `[formGroup]=\"form\"` formControlName=\"slug\".",
          ),
          concept(
            "Typed forms",
            "Angular 14+ TypedForms — FormControl<string|null> vs nonNullable.",
            "Typed forms",
            "Angular 14+ TypedForms — FormControl<string|null> vs nonNullable.",
          ),
          concept(
            "valueChanges",
            "form.valueChanges.pipe(debounceTime(300)) live slug preview URL.",
            "valueChanges",
            "form.valueChanges.pipe(debounceTime(300)) live slug preview URL.",
          ),
        ],
        steps: {
          ar: ["ReactiveFormsModule import", "LessonForm group", "formControlName template", "valueChanges log", "patchValue load lesson", "submit getRawValue"],
          en: ["ReactiveFormsModule import", "LessonForm group", "formControlName template", "valueChanges log", "patchValue load lesson", "submit getRawValue"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "form = inject(FormBuilder).group({\n  slug: [\"\", [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],\n  duration: [45, [Validators.min(35), Validators.max(55)]],\n  titleAr: [\"\", Validators.required],\n});\n\nonSave() {\n  if (this.form.invalid) return;\n  console.log(this.form.getRawValue());\n}",
            explain: "Lesson editor form — AlefYa admin.",
          },
          en: {
            lang: "typescript",
            source: "form = inject(FormBuilder).group({\n  slug: [\"\", [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],\n  duration: [45, [Validators.min(35), Validators.max(55)]],\n  titleEn: [\"\", Validators.required],\n});\n\nonSave() {\n  if (this.form.invalid) return;\n  console.log(this.form.getRawValue());\n}",
            explain: "Lesson editor form — AlefYa admin.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["formControlName without formGroup", "wrap with [formGroup]"],
            en: ["formControlName without formGroup", "wrap with [formGroup]"],
          },
          {
            ar: ["subscribe valueChanges no cleanup", "takeUntilDestroyed"],
            en: ["subscribe valueChanges no cleanup", "takeUntilDestroyed"],
          },
          {
            ar: ["setValue partial fields", "use patchValue partial"],
            en: ["setValue partial fields", "use patchValue partial"],
          },
          {
            ar: ["any FormGroup", "enable typed forms strict"],
            en: ["any FormGroup", "enable typed forms strict"],
          },
        ]),
        discussion: [
          qa(
            "FormRecord dynamic?",
            "FormRecord for dynamic keys.",
            "FormRecord dynamic?",
            "FormRecord for dynamic keys.",
          ),
          qa(
            "FormArray lessons?",
            "array of lesson groups.",
            "FormArray lessons?",
            "array of lesson groups.",
          ),
          qa(
            "signals forms?",
            "experimental signal forms watch Angular.",
            "signals forms?",
            "experimental signal forms watch Angular.",
          ),
          qa(
            "template vs reactive?",
            "reactive complex — template simple.",
            "template vs reactive?",
            "reactive complex — template simple.",
          ),
        ],
        exercises: {
          ar: ["FormArray stage lessons", "valueChanges slug preview", "disable form while saving", "typed nonNullable slug"],
          en: ["FormArray stage lessons", "valueChanges slug preview", "disable form while saving", "typed nonNullable slug"],
        },
        checklist: {
          ar: ["FormBuilder group", "formControlName template", "Validators required", "invalid blocks submit", "جاهز validation"],
          en: ["FormBuilder group", "formControlName template", "Validators required", "invalid blocks submit", "ready for validation"],
        },
        nextHint: { ar: "التالي: validators مخصصة.", en: "Next: custom validators." },
      }),
      deepLesson({
        slug: "03-validation",
        order: 3,
        duration: 45,
        title: { ar: "التحقق المخصص", en: "Custom validation" },
        summary: { ar: "Validators، async validators، cross-field validation.", en: "Validators, async validators, cross-field validation." },
        why: { ar: "Built-in Validators insufficient: slug format, unique slug async check API, duration 35-55 range, bilingual title both required.\n\nCustom ValidatorFn returns { slug: true } or null. Async AsyncValidatorFn returns Observable. Display errors with form.get(\"slug\")?.hasError(\"slug\").", en: "Built-in Validators insufficient: slug format, unique slug async check API, duration 35-55 range, bilingual title both required.\n\nCustom ValidatorFn returns { slug: true } or null. Async AsyncValidatorFn returns Observable. Display errors with form.get(\"slug\")?.hasError(\"slug\")." },
        goals: {
          ar: ["custom ValidatorFn slug", "async unique slug check", "cross-field validator", "show errors in template"],
          en: ["custom ValidatorFn slug", "async unique slug check", "cross-field validator", "show errors in template"],
        },
        concepts: [
          concept(
            "ValidatorFn",
            "return ctrl.value?.match(/^[a-z0-9-]+$/) ? null : { slug: true } — null means valid.",
            "ValidatorFn",
            "return ctrl.value?.match(/^[a-z0-9-]+$/) ? null : { slug: true } — null means valid.",
          ),
          concept(
            "Async validators",
            "checkSlugUnique returns map/isUnique — set updateOn blur for perf.",
            "Async validators",
            "checkSlugUnique returns map/isUnique — set updateOn blur for perf.",
          ),
          concept(
            "Cross-field",
            "ValidatorFn on FormGroup parent comparing titleAr titleEn.",
            "Cross-field",
            "ValidatorFn on FormGroup parent comparing titleAr titleEn.",
          ),
          concept(
            "Error display",
            "hasError('slug') && (dirty || touched) — a11y aria-invalid.",
            "Error display",
            "hasError('slug') && (dirty || touched) — a11y aria-invalid.",
          ),
        ],
        steps: {
          ar: ["slugValidator fn", "add to slug control", "async unique mock HTTP", "group validator bilingual", "template error @if", "pending spinner async"],
          en: ["slugValidator fn", "add to slug control", "async unique mock HTTP", "group validator bilingual", "template error @if", "pending spinner async"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "export function slugValidator(): ValidatorFn {\n  return (c) => /^[a-z0-9-]+$/.test(c.value ?? \"\") ? null : { slug: true };\n}\n\nexport function bilingualValidator(): ValidatorFn {\n  return (g) => {\n    const fg = g as FormGroup;\n    const ar = fg.get(\"titleAr\")?.value;\n    const en = fg.get(\"titleEn\")?.value;\n    return ar && en ? null : { bilingual: true };\n  };\n}",
            explain: "Validators لمحتوى AlefYa ثنائي اللغة.",
          },
          en: {
            lang: "typescript",
            source: "export function slugValidator(): ValidatorFn {\n  return (c) => /^[a-z0-9-]+$/.test(c.value ?? \"\") ? null : { slug: true };\n}\n\nexport function bilingualValidator(): ValidatorFn {\n  return (g) => {\n    const fg = g as FormGroup;\n    const ar = fg.get(\"titleAr\")?.value;\n    const en = fg.get(\"titleEn\")?.value;\n    return ar && en ? null : { bilingual: true };\n  };\n}",
            explain: "Validators for AlefYa bilingual content.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["async validator every keystroke", "updateOn blur submit"],
            en: ["async validator every keystroke", "updateOn blur submit"],
          },
          {
            ar: ["forget pending flag", "form.pending disables submit"],
            en: ["forget pending flag", "form.pending disables submit"],
          },
          {
            ar: ["validator side HTTP no cancel", "switchMap in async validator"],
            en: ["validator side HTTP no cancel", "switchMap in async validator"],
          },
          {
            ar: ["error key typo", "hasError('slug') matches return key"],
            en: ["error key typo", "hasError('slug') matches return key"],
          },
        ]),
        discussion: [
          qa(
            "schema validation Zod?",
            "optional client — API validates too.",
            "schema validation Zod?",
            "optional client — API validates too.",
          ),
          qa(
            "CanDeactivate unsaved?",
            "form.dirty guard routing lesson.",
            "CanDeactivate unsaved?",
            "form.dirty guard routing lesson.",
          ),
          qa(
            "setErrors manual?",
            "server errors patch field setErrors.",
            "setErrors manual?",
            "server errors patch field setErrors.",
          ),
          qa(
            "ValidationMessages pipe?",
            "map error keys to i18n strings.",
            "ValidationMessages pipe?",
            "map error keys to i18n strings.",
          ),
        ],
        exercises: {
          ar: ["duration 35-55 validator", "async slug exists", "show bilingual error", "unit test slugValidator"],
          en: ["duration 35-55 validator", "async slug exists", "show bilingual error", "unit test slugValidator"],
        },
        checklist: {
          ar: ["custom ValidatorFn", "async validator", "errors in template", "pending handled", "جاهز HttpClient"],
          en: ["custom ValidatorFn", "async validator", "errors in template", "pending handled", "ready for HttpClient"],
        },
        nextHint: { ar: "التالي: HttpClient.", en: "Next: HttpClient." },
      })
    ],
  },
  "07-http-state": {
    meta: {
      slug: "07-http-state",
      order: 7,
      title: { ar: "HTTP وإدارة الحالة", en: "HTTP & state" },
      description: { ar: "HttpClient، الخدمات، وأنماط الحالة", en: "HttpClient, services, and state patterns" },
      lessons: [
        "01-httpclient.json",
        "02-services.json",
        "03-state-patterns.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-httpclient",
        order: 1,
        duration: 48,
        title: { ar: "HttpClient", en: "HttpClient" },
        summary: { ar: "provideHttpClient، GET POST، interceptors overview.", en: "provideHttpClient, GET POST, interceptors overview." },
        why: { ar: "HttpClient wraps fetch with Observables وtyped responses. AlefYa loads `/api/tracks`, `/api/lessons/:slug`. `provideHttpClient(withInterceptors([authInterceptor]))` in app.config.\n\nHeaders HttpParams for query. Error handling catchError at service level. JSON automatic parse to generic T.", en: "HttpClient wraps fetch with Observables and typed responses. AlefYa loads `/api/tracks`, `/api/lessons/:slug`. `provideHttpClient(withInterceptors([authInterceptor]))` in app.config.\n\nHeaders HttpParams for query. Error handling catchError at service level. JSON automatic parse to generic T." },
        goals: {
          ar: ["provideHttpClient setup", "get post put delete typed", "HttpParams query string", "functional interceptor preview"],
          en: ["provideHttpClient setup", "get post put delete typed", "HttpParams query string", "functional interceptor preview"],
        },
        concepts: [
          concept(
            "HttpClient injection",
            "inject(HttpClient) get post — returns Observable not Promise.",
            "HttpClient injection",
            "inject(HttpClient) get post — returns Observable not Promise.",
          ),
          concept(
            "Typed requests",
            "get<Track[]> post<Lesson>(url, body) — compile-time response shape.",
            "Typed requests",
            "get<Track[]> post<Lesson>(url, body) — compile-time response shape.",
          ),
          concept(
            "HttpParams",
            "new HttpParams({ fromObject: { locale: 'ar' } }) — immutable append.",
            "HttpParams",
            "new HttpParams({ fromObject: { locale: 'ar' } }) — immutable append.",
          ),
          concept(
            "Interceptors",
            "functional `HttpInterceptorFn` add Authorization header logging.",
            "Interceptors",
            "functional `HttpInterceptorFn` add Authorization header logging.",
          ),
        ],
        steps: {
          ar: ["provideHttpClient app.config", "get tracks typed", "post lesson save", "HttpParams locale", "catchError map to user message", "interceptor auth token"],
          en: ["provideHttpClient app.config", "get tracks typed", "post lesson save", "HttpParams locale", "catchError map to user message", "interceptor auth token"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Injectable({ providedIn: \"root\" })\nexport class LessonApi {\n  private http = inject(HttpClient);\n  private base = \"/api\";\n\n  list(track: string) {\n    return this.http.get<Lesson[]>(`${this.base}/tracks/${track}/lessons`);\n  }\n\n  save(lesson: Lesson) {\n    return this.http.post<Lesson>(`${this.base}/lessons`, lesson);\n  }\n}",
            explain: "LessonApi service — CRUD AlefYa.",
          },
          en: {
            lang: "typescript",
            source: "@Injectable({ providedIn: \"root\" })\nexport class LessonApi {\n  private http = inject(HttpClient);\n  private base = \"/api\";\n\n  list(track: string) {\n    return this.http.get<Lesson[]>(`${this.base}/tracks/${track}/lessons`);\n  }\n\n  save(lesson: Lesson) {\n    return this.http.post<Lesson>(`${this.base}/lessons`, lesson);\n  }\n}",
            explain: "LessonApi service — AlefYa CRUD.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["forget provideHttpClient", "NullInjectorError HttpClient"],
            en: ["forget provideHttpClient", "NullInjectorError HttpClient"],
          },
          {
            ar: ["subscribe in component scattered", "centralize in service"],
            en: ["subscribe in component scattered", "centralize in service"],
          },
          {
            ar: ["untyped get<any>", "always generic T"],
            en: ["untyped get<any>", "always generic T"],
          },
          {
            ar: ["double JSON parse", "HttpClient parses — don't JSON.parse body"],
            en: ["double JSON parse", "HttpClient parses — don't JSON.parse body"],
          },
        ]),
        discussion: [
          qa(
            "fetch vs HttpClient?",
            "HttpClient Observables interceptors testing.",
            "fetch vs HttpClient?",
            "HttpClient Observables interceptors testing.",
          ),
          qa(
            "HttpClient in SSR?",
            "provideHttpClient withFetch transferState.",
            "HttpClient in SSR?",
            "provideHttpClient withFetch transferState.",
          ),
          qa(
            "progress events?",
            "reportProgress observe events.",
            "progress events?",
            "reportProgress observe events.",
          ),
          qa(
            "mock HttpClient?",
            "HttpTestingController tests lesson 08.",
            "mock HttpClient?",
            "HttpTestingController tests lesson 08.",
          ),
        ],
        exercises: {
          ar: ["delete lesson API", "interceptor log timing", "HttpParams pagination", "error toast mapping"],
          en: ["delete lesson API", "interceptor log timing", "HttpParams pagination", "error toast mapping"],
        },
        checklist: {
          ar: ["provideHttpClient", "typed get post", "service centralized", "catchError user message", "جاهز services DI"],
          en: ["provideHttpClient", "typed get post", "service centralized", "catchError user message", "ready for services DI"],
        },
        nextHint: { ar: "التالي: Services وDI.", en: "Next: Services and DI." },
      }),
      deepLesson({
        slug: "02-services",
        order: 2,
        duration: 45,
        title: { ar: "الخدمات وDI", en: "Services & DI" },
        summary: { ar: "inject()، providedIn root، hierarchical injectors.", en: "inject(), providedIn root, hierarchical injectors." },
        why: { ar: "Services hold business logic state API calls — components stay thin. `@Injectable({ providedIn: 'root' })` singleton app-wide. `inject(LessonApi)` in component or service.\n\nComponent providers override — rare scoped service per route. Testing: TestBed overrideProvider mock LessonApi.", en: "Services hold business logic, state, API calls — components stay thin. `@Injectable({ providedIn: 'root' })` singleton app-wide. `inject(LessonApi)` in component or service.\n\nComponent providers override — rare scoped service per route. Testing: TestBed overrideProvider mock LessonApi." },
        goals: {
          ar: ["@Injectable providedIn root", "inject() function pattern", "service composition", "component vs root providers"],
          en: ["@Injectable providedIn root", "inject() function pattern", "service composition", "component vs root providers"],
        },
        concepts: [
          concept(
            "Singleton services",
            "providedIn root tree-shakable one instance LocaleService ProgressStore.",
            "Singleton services",
            "providedIn root tree-shakable one instance LocaleService ProgressStore.",
          ),
          concept(
            "inject() function",
            "constructor-less `private api = inject(LessonApi)` works in field initializers.",
            "inject() function",
            "constructor-less `private api = inject(LessonApi)` works in field initializers.",
          ),
          concept(
            "Service layering",
            "Api service raw HTTP — Facade TrackFacade orchestrates for components.",
            "Service layering",
            "Api service raw HTTP — Facade TrackFacade orchestrates for components.",
          ),
          concept(
            "Injection context",
            "inject() only in construction context — factories guards ok.",
            "Injection context",
            "inject() only in construction context — factories guards ok.",
          ),
        ],
        steps: {
          ar: ["LessonApi providedIn root", "TrackFacade inject Api+Progress", "component inject Facade only", "LocaleService signal locale", "component providers experiment", "diagram DI tree"],
          en: ["LessonApi providedIn root", "TrackFacade inject Api+Progress", "component inject Facade only", "LocaleService signal locale", "component providers experiment", "diagram DI tree"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Injectable({ providedIn: \"root\" })\nexport class TrackFacade {\n  private api = inject(LessonApi);\n  private progress = inject(ProgressStore);\n\n  lessons(track: string) {\n    return this.api.list(track).pipe(\n      map(list => list.map(l => ({ ...l, completed: this.progress.isDone(l.slug) }))),\n    );\n  }\n}",
            explain: "Facade — component ي inject واحد فقط.",
          },
          en: {
            lang: "typescript",
            source: "@Injectable({ providedIn: \"root\" })\nexport class TrackFacade {\n  private api = inject(LessonApi);\n  private progress = inject(ProgressStore);\n\n  lessons(track: string) {\n    return this.api.list(track).pipe(\n      map(list => list.map(l => ({ ...l, completed: this.progress.isDone(l.slug) }))),\n    );\n  }\n}",
            explain: "Facade — component injects one service only.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["God service 2000 lines", "split Api Facade Store"],
            en: ["God service 2000 lines", "split Api Facade Store"],
          },
          {
            ar: ["inject in wrong context", "outside constructor/factory fails"],
            en: ["inject in wrong context", "outside constructor/factory fails"],
          },
          {
            ar: ["duplicate providedIn and NgModule", "standalone — root only"],
            en: ["duplicate providedIn and NgModule", "standalone — root only"],
          },
          {
            ar: ["state in component duplicated", "lift to service signal"],
            en: ["state in component duplicated", "lift to service signal"],
          },
        ]),
        discussion: [
          qa(
            "constructor vs inject?",
            "inject preferred new code shorter.",
            "constructor vs inject?",
            "inject preferred new code shorter.",
          ),
          qa(
            "ENV injection token?",
            "InjectionToken API_URL.",
            "ENV injection token?",
            "InjectionToken API_URL.",
          ),
          qa(
            "circular DI?",
            "refactor shared interface third service.",
            "circular DI?",
            "refactor shared interface third service.",
          ),
          qa(
            "providedIn any?",
            "lazy module legacy — avoid.",
            "providedIn any?",
            "lazy module legacy — avoid.",
          ),
        ],
        exercises: {
          ar: ["LocaleService signal", "mock LessonApi test", "Facade mark complete", "InjectionToken API_URL"],
          en: ["LocaleService signal", "mock LessonApi test", "Facade mark complete", "InjectionToken API_URL"],
        },
        checklist: {
          ar: ["providedIn root", "inject() used", "Facade pattern", "no logic dump component", "جاهز state patterns"],
          en: ["providedIn root", "inject() used", "Facade pattern", "no logic dump component", "ready for state patterns"],
        },
        nextHint: { ar: "التالي: أنماط إدارة الحالة.", en: "Next: state management patterns." },
      }),
      deepLesson({
        slug: "03-state-patterns",
        order: 3,
        duration: 52,
        title: { ar: "أنماط إدارة الحالة", en: "State patterns" },
        summary: { ar: "service+signals، RxJS store خفيف، NgRx overview.", en: "Service+signals, lightweight RxJS store, NgRx overview." },
        why: { ar: "AlefYa learner UI state: tracks list, progress completed slugs, locale, loading errors. **Service + signals** enough for medium apps — no NgRx required day one.\n\nBehaviorSubject store legacy — signals preferred 2024+. shareReplay cache HTTP. Immutable updates. DevTools NgRx optional large teams.", en: "AlefYa learner UI state: tracks list, progress completed slugs, locale, loading errors. **Service + signals** enough for medium apps — no NgRx required day one.\n\nBehaviorSubject store legacy — signals preferred 2024+. shareReplay cache HTTP. Immutable updates. DevTools NgRx optional large teams." },
        goals: {
          ar: ["signal store readonly expose", "load error loading flags", "shareReplay HTTP cache", "when NgRx worth it"],
          en: ["signal store readonly expose", "load error loading flags", "shareReplay HTTP cache", "when NgRx worth it"],
        },
        concepts: [
          concept(
            "Signal store pattern",
            "private state signal readonly public computed selectors methods mutate.",
            "Signal store pattern",
            "private state signal readonly public computed selectors methods mutate.",
          ),
          concept(
            "Async state machine",
            "idle loading success error — discriminated union type UI @switch.",
            "Async state machine",
            "idle loading success error — discriminated union type UI @switch.",
          ),
          concept(
            "RxJS cache",
            "tracks$ shareReplay(1) refCount — one HTTP multiple subscribers.",
            "RxJS cache",
            "tracks$ shareReplay(1) refCount — one HTTP multiple subscribers.",
          ),
          concept(
            "NgRx overview",
            "actions reducers effects DevTools — large teams complex async.",
            "NgRx overview",
            "actions reducers effects DevTools — large teams complex async.",
          ),
        ],
        steps: {
          ar: ["TrackStore signal tracks", "load() set loading error", "computed filteredTracks", "shareReplay tracks$", "component inject store only", "document when NgRx"],
          en: ["TrackStore signal tracks", "load() set loading error", "computed filteredTracks", "shareReplay tracks$", "component inject store only", "document when NgRx"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "type LoadState = \"idle\"|\"loading\"|\"error\"|\"ready\";\n\n@Injectable({ providedIn: \"root\" })\nexport class TrackStore {\n  private tracks = signal<Track[]>([]);\n  private status = signal<LoadState>(\"idle\");\n  readonly items = this.tracks.asReadonly();\n  readonly loading = computed(() => this.status() === \"loading\");\n\n  load(http = inject(HttpClient)) {\n    this.status.set(\"loading\");\n    http.get<Track[]>(\"/api/tracks\").subscribe({\n      next: d => { this.tracks.set(d); this.status.set(\"ready\"); },\n      error: () => this.status.set(\"error\"),\n    });\n  }\n}",
            explain: "TrackStore — signal state machine AlefYa.",
          },
          en: {
            lang: "typescript",
            source: "type LoadState = \"idle\"|\"loading\"|\"error\"|\"ready\";\n\n@Injectable({ providedIn: \"root\" })\nexport class TrackStore {\n  private tracks = signal<Track[]>([]);\n  private status = signal<LoadState>(\"idle\");\n  readonly items = this.tracks.asReadonly();\n  readonly loading = computed(() => this.status() === \"loading\");\n\n  load(http = inject(HttpClient)) {\n    this.status.set(\"loading\");\n    http.get<Track[]>(\"/api/tracks\").subscribe({\n      next: d => { this.tracks.set(d); this.status.set(\"ready\"); },\n      error: () => this.status.set(\"error\"),\n    });\n  }\n}",
            explain: "TrackStore — signal state machine AlefYa.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["mutable array in signal", "set([...new]) immutable"],
            en: ["mutable array in signal", "set([...new]) immutable"],
          },
          {
            ar: ["NgRx too early", "service signals until pain clear"],
            en: ["NgRx too early", "service signals until pain clear"],
          },
          {
            ar: ["global everything", "feature scoped stores"],
            en: ["global everything", "feature scoped stores"],
          },
          {
            ar: ["no error state UI", "show error retry button"],
            en: ["no error state UI", "show error retry button"],
          },
        ]),
        discussion: [
          qa(
            "Akita Elf?",
            "alternatives — signals enough here.",
            "Akita Elf?",
            "alternatives — signals enough here.",
          ),
          qa(
            "persist state?",
            "effect localStorage session.",
            "persist state?",
            "effect localStorage session.",
          ),
          qa(
            "optimistic update?",
            "UI first rollback on error.",
            "optimistic update?",
            "UI first rollback on error.",
          ),
          qa(
            "router state?",
            "param + store sync.",
            "router state?",
            "param + store sync.",
          ),
        ],
        exercises: {
          ar: ["error retry load()", "computed angular track only", "shareReplay lessons", "persist progress effect"],
          en: ["error retry load()", "computed angular track only", "shareReplay lessons", "persist progress effect"],
        },
        checklist: {
          ar: ["signal store", "loading error UI", "readonly expose", "immutable updates", "جاهز change detection"],
          en: ["signal store", "loading error UI", "readonly expose", "immutable updates", "ready for change detection"],
        },
        nextHint: { ar: "التالي: Change Detection.", en: "Next: Change detection." },
      })
    ],
  },
  "08-advanced": {
    meta: {
      slug: "08-advanced",
      order: 8,
      title: { ar: "مواضيع متقدمة", en: "Advanced topics" },
      description: { ar: "الأداء، الاختبار، والـ SSR", en: "Performance, testing, and SSR" },
      lessons: [
        "01-change-detection.json",
        "02-testing.json",
        "03-ssr-i18n.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-change-detection",
        order: 1,
        duration: 48,
        title: { ar: "Change Detection", en: "Change detection" },
        summary: { ar: "Default vs OnPush، signals، markForCheck.", en: "Default vs OnPush, signals, markForCheck." },
        why: { ar: "Angular checks components when events async zone runs. **OnPush** checks only when @Input reference changes events async pipe signals. AlefYa lists benefit OnPush + immutable data.\n\nMutate @Input array push may not refresh OnPush — spread new array. `ChangeDetectorRef.markForCheck()` rare with signals.", en: "Angular checks components when events/async zone run. **OnPush** checks only when @Input reference changes, events, async pipe, signals. AlefYa lists benefit from OnPush + immutable data.\n\nMutate @Input array push may not refresh OnPush — spread new array. `ChangeDetectorRef.markForCheck()` rare with signals." },
        goals: {
          ar: ["Default vs OnPush behavior", "OnPush with signals immutable", "async pipe triggers CD", "Detach reattach rare"],
          en: ["Default vs OnPush behavior", "OnPush with signals immutable", "async pipe triggers CD", "Detach reattach rare"],
        },
        concepts: [
          concept(
            "Default strategy",
            "checks entire subtree often — simple small apps OK.",
            "Default strategy",
            "checks entire subtree often — simple small apps OK.",
          ),
          concept(
            "OnPush strategy",
            "ChangeDetectionStrategy.OnPush — input ref signal event markForCheck.",
            "OnPush strategy",
            "ChangeDetectionStrategy.OnPush — input ref signal event markForCheck.",
          ),
          concept(
            "Immutable data",
            "new array object reference triggers OnPush `@Input() lessons`.",
            "Immutable data",
            "new array object reference triggers OnPush `@Input() lessons`.",
          ),
          concept(
            "Zoneless future",
            "experimental provideExperimentalZonelessChangeDetection — signals native.",
            "Zoneless future",
            "experimental provideExperimentalZonelessChangeDetection — signals native.",
          ),
        ],
        steps: {
          ar: ["OnPush TrackList", "immutable update lessons", "verify no update on mutate push", "signals remove OnPush issues", "async pipe child", "profile render count"],
          en: ["OnPush TrackList", "immutable update lessons", "verify no update on mutate push", "signals remove OnPush issues", "async pipe child", "profile render count"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Component({\n  selector: \"app-track-list\",\n  standalone: true,\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: `@for (t of tracks(); track t.slug) { <app-track-card [track]=\"t\" /> }`,\n})\nexport class TrackListComponent {\n  private store = inject(TrackStore);\n  tracks = this.store.items; // readonly signal\n}",
            explain: "OnPush + signal store — pattern AlefYa performant.",
          },
          en: {
            lang: "typescript",
            source: "@Component({\n  selector: \"app-track-list\",\n  standalone: true,\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: `@for (t of tracks(); track t.slug) { <app-track-card [track]=\"t\" /> }`,\n})\nexport class TrackListComponent {\n  private store = inject(TrackStore);\n  tracks = this.store.items; // readonly signal\n}",
            explain: "OnPush + signal store — performant AlefYa pattern.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["OnPush mutate @Input", "immutable new reference"],
            en: ["OnPush mutate @Input", "immutable new reference"],
          },
          {
            ar: ["markForCheck everywhere", "fix data flow signals"],
            en: ["markForCheck everywhere", "fix data flow signals"],
          },
          {
            ar: ["Default on huge tree", "OnPush leaf components"],
            en: ["Default on huge tree", "OnPush leaf components"],
          },
          {
            ar: ["function binding template", "pure pipe computed signal"],
            en: ["function binding template", "pure pipe computed signal"],
          },
        ]),
        discussion: [
          qa(
            "trackBy still needed?",
            "@for track covers — old *ngFor trackBy.",
            "trackBy still needed?",
            "@for track covers — old *ngFor trackBy.",
          ),
          qa(
            "NgZone runOutsideAngular?",
            "third-party libs — advanced.",
            "NgZone runOutsideAngular?",
            "third-party libs — advanced.",
          ),
          qa(
            "signals end OnPush?",
            "signals help — OnPush still best practice.",
            "signals end OnPush?",
            "signals help — OnPush still best practice.",
          ),
          qa(
            "DevTools profiler?",
            "Angular DevTools component tree.",
            "DevTools profiler?",
            "Angular DevTools component tree.",
          ),
        ],
        exercises: {
          ar: ["OnPush bug reproduce mutate", "fix immutable spread", "compare Default profile", "signal input OnPush card"],
          en: ["OnPush bug reproduce mutate", "fix immutable spread", "compare Default profile", "signal input OnPush card"],
        },
        checklist: {
          ar: ["OnPush applied", "immutable updates", "signals or async pipe", "no unnecessary markForCheck", "جاهز testing"],
          en: ["OnPush applied", "immutable updates", "signals or async pipe", "no unnecessary markForCheck", "ready for testing"],
        },
        nextHint: { ar: "التالي: Unit testing.", en: "Next: Unit testing." },
      }),
      deepLesson({
        slug: "02-testing",
        order: 2,
        duration: 50,
        title: { ar: "اختبار Angular", en: "Angular testing" },
        summary: { ar: "TestBed، component tests، HttpTestingController.", en: "TestBed, component tests, HttpTestingController." },
        why: { ar: "Tests guard AlefYa regressions: LessonRow emits select slug, LessonApi parses JSON, forms validate slug. **Jasmine/Karma or Jest** with `ng test`. TestBed creates isolated module environment.\n\nHttpTestingController mocks HTTP no real backend. `fixture.detectChanges()` triggers CD. query By.css debugElement.", en: "Tests guard AlefYa regressions: LessonRow emits select slug, LessonApi parses JSON, forms validate slug. **Jasmine/Karma or Jest** with `ng test`. TestBed creates isolated module environment.\n\nHttpTestingController mocks HTTP without real backend. `fixture.detectChanges()` triggers CD. query By.css debugElement." },
        goals: {
          ar: ["TestBed configureTestingModule", "component create detectChanges", "click emit test", "HttpTestingController mock"],
          en: ["TestBed configureTestingModule", "component create detectChanges", "click emit test", "HttpTestingController mock"],
        },
        concepts: [
          concept(
            "TestBed setup",
            "configureTestingModule imports standalone component providers override.",
            "TestBed setup",
            "configureTestingModule imports standalone component providers override.",
          ),
          concept(
            "Component fixture",
            "createComponent detectChanges nativeElement querySelector.",
            "Component fixture",
            "createComponent detectChanges nativeElement querySelector.",
          ),
          concept(
            "HttpTestingController",
            "expectOne flush mock response verify no outstanding.",
            "HttpTestingController",
            "expectOne flush mock response verify no outstanding.",
          ),
          concept(
            "Service tests",
            "TestBed inject service mock HttpClient — unit isolated.",
            "Service tests",
            "TestBed inject service mock HttpClient — unit isolated.",
          ),
        ],
        steps: {
          ar: ["ng test runs", "LessonRow title render test", "click emit select spy", "LessonApi list HTTP mock", "form invalid submit blocked", "coverage report skim"],
          en: ["ng test runs", "LessonRow title render test", "click emit select spy", "LessonApi list HTTP mock", "form invalid submit blocked", "coverage report skim"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "it(\"يعرض عنوان الدرس\", () => {\n  TestBed.configureTestingModule({ imports: [LessonRowComponent] });\n  const fixture = TestBed.createComponent(LessonRowComponent);\n  fixture.componentRef.setInput(\"lesson\", mockLesson);\n  fixture.detectChanges();\n  expect(fixture.nativeElement.textContent).toContain(\"TypeScript\");\n});",
            explain: "Component test — setInput signal/input API.",
          },
          en: {
            lang: "typescript",
            source: "it(\"shows lesson title\", () => {\n  TestBed.configureTestingModule({ imports: [LessonRowComponent] });\n  const fixture = TestBed.createComponent(LessonRowComponent);\n  fixture.componentRef.setInput(\"lesson\", mockLesson);\n  fixture.detectChanges();\n  expect(fixture.nativeElement.textContent).toContain(\"TypeScript\");\n});",
            explain: "Component test — setInput signal/input API.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["forget detectChanges", "view not updated"],
            en: ["forget detectChanges", "view not updated"],
          },
          {
            ar: ["real HTTP in tests", "HttpTestingController always"],
            en: ["real HTTP in tests", "HttpTestingController always"],
          },
          {
            ar: ["test implementation not behavior", "assert DOM output emit"],
            en: ["test implementation not behavior", "assert DOM output emit"],
          },
          {
            ar: [" flaky async no fakeAsync", "fakeAsync tick flush"],
            en: ["flaky async no fakeAsync", "fakeAsync tick flush"],
          },
        ]),
        discussion: [
          qa(
            "Jest vs Karma?",
            "Angular supports both — Jest faster CI.",
            "Jest vs Karma?",
            "Angular supports both — Jest faster CI.",
          ),
          qa(
            "Cypress e2e?",
            "separate e2e — unit first.",
            "Cypress e2e?",
            "separate e2e — unit first.",
          ),
          qa(
            "TestBed.destroy?",
            "afterEach cleanup prevent leaks.",
            "TestBed.destroy?",
            "afterEach cleanup prevent leaks.",
          ),
          qa(
            "snapshot tests?",
            "DOM snapshot sparingly — brittle.",
            "snapshot tests?",
            "DOM snapshot sparingly — brittle.",
          ),
        ],
        exercises: {
          ar: ["HTTP flush 404 error", "emit Output spy", "validator unit test", "OnPush detectChanges"],
          en: ["HTTP flush 404 error", "emit Output spy", "validator unit test", "OnPush detectChanges"],
        },
        checklist: {
          ar: ["ng test passes", "component DOM assert", "HTTP mocked", "Output tested", "جاهز SSR i18n"],
          en: ["ng test passes", "component DOM assert", "HTTP mocked", "Output tested", "ready for SSR i18n"],
        },
        nextHint: { ar: "التالي: SSR وi18n.", en: "Next: SSR and i18n." },
      }),
      deepLesson({
        slug: "03-ssr-i18n",
        order: 3,
        duration: 45,
        title: { ar: "SSR وi18n", en: "SSR & i18n" },
        summary: { ar: "Angular SSR، hydration، @angular/localize.", en: "Angular SSR, hydration, @angular/localize." },
        why: { ar: "SSR renders HTML on server — SEO faster first paint for AlefYa public track pages. `ng add @angular/ssr` adds server.ts. **Hydration** reuses DOM client-side.\n\ni18n `@angular/localize` `$localize`:title` build per locale ar/en. Runtime locale service complements static i18n.", en: "SSR renders HTML on server — SEO and faster first paint for AlefYa public track pages. `ng add @angular/ssr` adds server.ts. **Hydration** reuses DOM client-side.\n\ni18n `@angular/localize` `$localize`:title` build per locale ar/en. Runtime locale service complements static i18n." },
        goals: {
          ar: ["ng add SSR overview", "hydration provideClientHydration", "localize markers build", "SSR HttpClient transferState"],
          en: ["ng add SSR overview", "hydration provideClientHydration", "localize markers build", "SSR HttpClient transferState"],
        },
        concepts: [
          concept(
            "Angular SSR",
            "Universal renderToString server routes — express node server.",
            "Angular SSR",
            "Universal renderToString server routes — express node server.",
          ),
          concept(
            "Hydration",
            "provideClientHydration() — avoid flicker duplicate fetch transferState.",
            "Hydration",
            "provideClientHydration() — avoid flicker duplicate fetch transferState.",
          ),
          concept(
            "@angular/localize",
            "i18n attributes extract xliff translate build locale ar.",
            "@angular/localize",
            "i18n attributes extract xliff translate build locale ar.",
          ),
          concept(
            "Runtime locale",
            "LocaleService signal + dir rtl ltr — complements build i18n.",
            "Runtime locale",
            "LocaleService signal + dir rtl ltr — complements build i18n.",
          ),
        ],
        steps: {
          ar: ["ng add @angular/ssr skim files", "provideClientHydration app.config", "i18n mark welcome string", "build locale ar", "view page source SSR HTML", "RTL dir bind document"],
          en: ["ng add @angular/ssr skim files", "provideClientHydration app.config", "i18n mark welcome string", "build locale ar", "view page source SSR HTML", "RTL dir bind document"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "// app.config.ts\nimport { provideClientHydration } from \"@angular/platform-browser\";\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideClientHydration(),\n  ],\n};\n\n// template i18n\n<h1 i18n=\"@@welcome\">مرحباً بك في AlefYa</h1>",
            explain: "SSR hydration + i18n marker.",
          },
          en: {
            lang: "typescript",
            source: "// app.config.ts\nimport { provideClientHydration } from \"@angular/platform-browser\";\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideClientHydration(),\n  ],\n};\n\n// template i18n\n<h1 i18n=\"@@welcome\">Welcome to AlefYa</h1>",
            explain: "SSR hydration + i18n marker.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["window document in SSR", "PLATFORM_ID inject isPlatformBrowser"],
            en: ["window document in SSR", "PLATFORM_ID inject isPlatformBrowser"],
          },
          {
            ar: ["double HTTP SSR client", "transferHttpCache hydration"],
            en: ["double HTTP SSR client", "transferHttpCache hydration"],
          },
          {
            ar: ["mix runtime translate build i18n", "pick strategy per string type"],
            en: ["mix runtime translate build i18n", "pick strategy per string type"],
          },
          {
            ar: ["hydration mismatch DOM", "avoid direct DOM change pre-stable"],
            en: ["hydration mismatch DOM", "avoid direct DOM change pre-stable"],
          },
        ]),
        discussion: [
          qa(
            "SSG prerender?",
            "prerender static routes tracks list.",
            "SSG prerender?",
            "prerender static routes tracks list.",
          ),
          qa(
            "ngx-translate?",
            "runtime JSON — different from localize build.",
            "ngx-translate?",
            "runtime JSON — different from localize build.",
          ),
          qa(
            "deploy SSR?",
            "Node server or Vercel Netlify adapter.",
            "deploy SSR?",
            "Node server or Vercel Netlify adapter.",
          ),
          qa(
            "Arabic RTL SSR?",
            "dir=rtl lang=ar on html element.",
            "Arabic RTL SSR?",
            "dir=rtl lang=ar on html element.",
          ),
        ],
        exercises: {
          ar: ["isPlatformBrowser guard", "extract i18n xliff", "prerender tracks route", "LocaleService dir rtl"],
          en: ["isPlatformBrowser guard", "extract i18n xliff", "prerender tracks route", "LocaleService dir rtl"],
        },
        checklist: {
          ar: ["SSR files understood", "hydration enabled", "i18n marker added", "RTL considered", "جاهز capstone"],
          en: ["SSR files understood", "hydration enabled", "i18n marker added", "RTL considered", "ready for capstone"],
        },
        nextHint: { ar: "التالي: تصميم مشروع الواجهة.", en: "Next: capstone UI design." },
      })
    ],
  },
  "09-project": {
    meta: {
      slug: "09-project",
      order: 9,
      title: { ar: "مشروع تطبيقي", en: "Capstone project" },
      description: { ar: "واجهة متعلّم لمسارات ألف ياء", en: "A learner UI for AlefYa-style tracks" },
      lessons: [
        "01-design.json",
        "02-implement.json",
        "03-polish.json",
      ],
    },
    lessons: [
      deepLesson({
        slug: "01-design",
        order: 1,
        duration: 50,
        title: { ar: "تصميم واجهة المتعلّم", en: "Learner UI design" },
        summary: { ar: "wireframes، routes، components، state map لـ AlefYa.", en: "Wireframes, routes, components, state map for AlefYa." },
        why: { ar: "Capstone: **AlefYa learner UI** — browse tracks، open lesson، track progress، switch ar/en. Design before code: routes `/tracks`, `/learn/:track/:lesson`, `/dashboard`.\n\nComponent tree: AppShell، TrackList، TrackCard، LessonPage، LessonNav، ProgressBar، LocaleToggle. State: TrackStore ProgressStore LocaleService.", en: "Capstone: **AlefYa learner UI** — browse tracks, open lesson, track progress, switch ar/en. Design before code: routes `/tracks`, `/learn/:track/:lesson`, `/dashboard`.\n\nComponent tree: AppShell, TrackList, TrackCard, LessonPage, LessonNav, ProgressBar, LocaleToggle. State: TrackStore ProgressStore LocaleService." },
        goals: {
          ar: ["wireframe 4 screens", "define Routes map", "component responsibility split", "state ownership diagram"],
          en: ["wireframe 4 screens", "define Routes map", "component responsibility split", "state ownership diagram"],
        },
        concepts: [
          concept(
            "User flows",
            "land tracks → pick angular → lesson list → lesson reader → mark complete → dashboard percent.",
            "User flows",
            "land tracks → pick angular → lesson list → lesson reader → mark complete → dashboard percent.",
          ),
          concept(
            "Route map",
            "/tracks /learn/:track/:lesson /dashboard /settings — lazy admin optional.",
            "Route map",
            "/tracks /learn/:track/:lesson /dashboard /settings — lazy admin optional.",
          ),
          concept(
            "Smart vs dumb",
            "pages smart inject Facade — cards rows dumb @Input @Output.",
            "Smart vs dumb",
            "pages smart inject Facade — cards rows dumb @Input @Output.",
          ),
          concept(
            "Accessibility",
            "keyboard nav lesson list skip link focus management lang dir.",
            "Accessibility",
            "keyboard nav lesson list skip link focus management lang dir.",
          ),
        ],
        steps: {
          ar: ["sketch tracks page", "sketch lesson split nav+content", "list components slugs", "assign store ownership", "define Lesson type final", "review checklist acceptance"],
          en: ["sketch tracks page", "sketch lesson split nav+content", "list components slugs", "assign store ownership", "define Lesson type final", "review checklist acceptance"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "/**\n * AlefYa Learner UI — design spec\n * Routes:\n *   /tracks\n *   /learn/:track/:lesson\n *   /dashboard\n * Components:\n *   TrackListPage, TrackCard, LessonPage,\n *   LessonSidebar, LessonContent, ProgressRing\n * State:\n *   TrackStore, ProgressStore, LocaleService\n */",
            explain: "Design spec comment — مرجع قبل التنفيذ.",
          },
          en: {
            lang: "typescript",
            source: "/**\n * AlefYa Learner UI — design spec\n * Routes:\n *   /tracks\n *   /learn/:track/:lesson\n *   /dashboard\n * Components:\n *   TrackListPage, TrackCard, LessonPage,\n *   LessonSidebar, LessonContent, ProgressRing\n * State:\n *   TrackStore, ProgressStore, LocaleService\n */",
            explain: "Design spec comment — reference before implementation.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["design skip jump code", "10 min wireframe saves hours"],
            en: ["skip design jump code", "10 min wireframe saves hours"],
          },
          {
            ar: ["God LessonPage", "split sidebar content"],
            en: ["God LessonPage", "split sidebar content"],
          },
          {
            ar: ["no progress persistence plan", "ProgressStore localStorage effect"],
            en: ["no progress persistence plan", "ProgressStore localStorage effect"],
          },
          {
            ar: ["ignore mobile layout", "sidebar collapse @media"],
            en: ["ignore mobile layout", "sidebar collapse @media"],
          },
        ]),
        discussion: [
          qa(
            "Material vs custom?",
            "custom CSS or Tailwind — AlefYa brand.",
            "Material vs custom?",
            "custom CSS or Tailwind — AlefYa brand.",
          ),
          qa(
            "mock API?",
            "json-server or static assets stage 02.",
            "mock API?",
            "json-server or static assets stage 02.",
          ),
          qa(
            "dark mode?",
            "optional CSS variables.",
            "dark mode?",
            "optional CSS variables.",
          ),
          qa(
            "AI Helper placement?",
            "sticky bottom lesson page — product note.",
            "AI Helper placement?",
            "sticky bottom lesson page — product note.",
          ),
        ],
        exercises: {
          ar: ["Figma/paper wireframe", "route table markdown", "component tree diagram", "acceptance criteria 5 items"],
          en: ["Figma/paper wireframe", "route table markdown", "component tree diagram", "acceptance criteria 5 items"],
        },
        checklist: {
          ar: ["routes defined", "components listed", "state owners", "flows sketched", "جاهز implement"],
          en: ["routes defined", "components listed", "state owners", "flows sketched", "ready to implement"],
        },
        nextHint: { ar: "التالي: تنفيذ end-to-end.", en: "Next: end-to-end implementation." },
      }),
      deepLesson({
        slug: "02-implement",
        order: 2,
        duration: 55,
        title: { ar: "التنفيذ", en: "Implementation" },
        summary: { ar: "بناء features end-to-end: tracks، lesson، progress.", en: "Build features end-to-end: tracks, lesson, progress." },
        why: { ar: "Implementation connects all stages: standalone components، router، HttpClient/mock، signals store، reactive forms optional admin. Working vertical slice beats half features.\n\nOrder: routes shell → TrackList+Card → LessonPage param load → ProgressStore mark → Dashboard computed percent.", en: "Implementation connects all stages: standalone components, router, HttpClient/mock, signal store, optional reactive admin forms. A working vertical slice beats half-done features.\n\nOrder: routes shell → TrackList+Card → LessonPage param load → ProgressStore mark → Dashboard computed percent." },
        goals: {
          ar: ["TrackList page working", "LessonPage load by slug", "mark complete persists", "locale toggle ar/en"],
          en: ["TrackList page working", "LessonPage load by slug", "mark complete persists", "locale toggle ar/en"],
        },
        concepts: [
          concept(
            "Vertical slice",
            "one track angular full flow before second track polish.",
            "Vertical slice",
            "one track angular full flow before second track polish.",
          ),
          concept(
            "Mock to real API",
            "assets/data/angular.json then swap LessonApi base URL.",
            "Mock to real API",
            "assets/data/angular.json then swap LessonApi base URL.",
          ),
          concept(
            "Composition",
            "pages import dumb components standalone chain.",
            "Composition",
            "pages import dumb components standalone chain.",
          ),
          concept(
            "Error loading UI",
            "@if loading error ready — state machine lesson 07.",
            "Error loading UI",
            "@if loading error ready — state machine lesson 07.",
          ),
        ],
        steps: {
          ar: ["app routes + shell", "TrackList mock JSON", "TrackCard routerLink", "LessonPage switchMap load", "ProgressStore mark+effect", "Dashboard computed %"],
          en: ["app routes + shell", "TrackList mock JSON", "TrackCard routerLink", "LessonPage switchMap load", "ProgressStore mark+effect", "Dashboard computed %"],
        },
        code: {
          ar: {
            lang: "typescript",
            source: "@Component({\n  standalone: true,\n  imports: [RouterLink, AsyncPipe, LocaleTitlePipe],\n  template: `\n    @for (t of tracks$ | async; track t.slug) {\n      <app-track-card [track]=\"t\" [locale]=\"locale()\" (select)=\"go(t.slug)\" />\n    }\n  `,\n})\nexport class TrackListPage {\n  locale = inject(LocaleService).locale;\n  tracks$ = inject(TrackFacade).tracks();\n  private router = inject(Router);\n  go(slug: string) { this.router.navigate([\"/learn\", slug, \"01-why-typescript\"]); }\n}",
            explain: "TrackList page — يجمع router store pipes.",
          },
          en: {
            lang: "typescript",
            source: "@Component({\n  standalone: true,\n  imports: [RouterLink, AsyncPipe, LocaleTitlePipe],\n  template: `\n    @for (t of tracks$ | async; track t.slug) {\n      <app-track-card [track]=\"t\" [locale]=\"locale()\" (select)=\"go(t.slug)\" />\n    }\n  `,\n})\nexport class TrackListPage {\n  locale = inject(LocaleService).locale;\n  tracks$ = inject(TrackFacade).tracks();\n  private router = inject(Router);\n  go(slug: string) { this.router.navigate([\"/learn\", slug, \"01-why-typescript\"]); }\n}",
            explain: "TrackList page — combines router store pipes.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["everything in one component", "split pages dumb/smart"],
            en: ["everything in one component", "split pages dumb/smart"],
          },
          {
            ar: ["hardcoded locale", "LocaleService signal"],
            en: ["hardcoded locale", "LocaleService signal"],
          },
          {
            ar: ["no loading state", "spinner while fetch"],
            en: ["no loading state", "spinner while fetch"],
          },
          {
            ar: ["skip ProgressStore", "wire mark complete early"],
            en: ["skip ProgressStore", "wire mark complete early"],
          },
        ]),
        discussion: [
          qa(
            "json assets vs API?",
            "assets for demo API later.",
            "json assets vs API?",
            "assets for demo API later.",
          ),
          qa(
            "CSS framework?",
            "Tailwind optional — keep readable.",
            "CSS framework?",
            "Tailwind optional — keep readable.",
          ),
          qa(
            "git commits?",
            "slice commits track lesson progress.",
            "git commits?",
            "slice commits track lesson progress.",
          ),
          qa(
            "defer polish?",
            "working first — lesson 03 polish.",
            "defer polish?",
            "working first — lesson 03 polish.",
          ),
        ],
        exercises: {
          ar: ["LessonNav sidebar slugs", "mark complete button", "dashboard percent", "error route 404"],
          en: ["LessonNav sidebar slugs", "mark complete button", "dashboard percent", "error route 404"],
        },
        checklist: {
          ar: ["tracks list works", "lesson loads slug", "progress persists", "locale toggles", "جاهز polish"],
          en: ["tracks list works", "lesson loads slug", "progress persists", "locale toggles", "ready for polish"],
        },
        nextHint: { ar: "التالي: a11y، performance، deploy.", en: "Next: a11y, performance, deploy." },
      }),
      deepLesson({
        slug: "03-polish",
        order: 3,
        duration: 48,
        title: { ar: "تحسين وتسليم", en: "Polish & ship" },
        summary: { ar: "a11y، performance budgets، production build، deploy.", en: "a11y, performance budgets, production build, deploy." },
        why: { ar: "التحسين النهائي يفصل العرض التجريبي عن منتج حقيقي: تنقل الدروس بلوحة المفاتيح، تسميات aria ثنائية اللغة، أداء Lighthouse، وميزانيات `ng build --configuration production`.\n\nانشر `dist/` على static host أو Node SSR. README يشرح الإعداد والمسارات والبيانات التجريبية. تهانينا — أكملت مسار Angular من 30 درساً!", en: "Final polish separates a demo from a real product: keyboard lesson navigation, bilingual aria labels, Lighthouse performance, and `ng build --configuration production` budgets.\n\nDeploy `dist/` to a static host or Node SSR. README documents setup, routes, and mock data. Congratulations — you completed the 30-lesson Angular track!" },
        goals: {
          ar: ["a11y audit fixes", "Lighthouse performance pass", "production build optimize", "deploy dist documented"],
          en: ["a11y audit fixes", "Lighthouse performance pass", "production build optimize", "deploy dist documented"],
        },
        concepts: [
          concept(
            "Accessibility",
            "focus trap skip link aria-current lesson button labels lang attribute.",
            "Accessibility",
            "focus trap skip link aria-current lesson button labels lang attribute.",
          ),
          concept(
            "Performance",
            "lazy routes OnPush track @for budgets angular.json source maps off prod.",
            "Performance",
            "lazy routes OnPush track @for budgets angular.json source maps off prod.",
          ),
          concept(
            "Production build",
            "ng build optimization tree-shake hash filenames output hashing.",
            "Production build",
            "ng build optimization tree-shake hash filenames output hashing.",
          ),
          concept(
            "Deploy",
            "Firebase Vercel Netlify static — SSR needs node adapter environment API_URL.",
            "Deploy",
            "Firebase Vercel Netlify static — SSR needs node adapter environment API_URL.",
          ),
        ],
        steps: {
          ar: ["tab through lesson nav", "aria-label Arabic buttons", "ng build production size", "Lighthouse run fix", "deploy dist host", "README screenshots"],
          en: ["tab through lesson nav", "aria-label buttons", "ng build production size", "Lighthouse run fix", "deploy dist host", "README screenshots"],
        },
        code: {
          ar: {
            lang: "bash",
            source: "# Production build\nng build --configuration production\n\n# Analyze bundle (optional)\nng build --stats-json\n\n# Deploy static dist/ to host\n# e.g. firebase deploy, vercel --prod\n\n# Verify\nnpx http-server dist/alefya-ui/browser -p 8080",
            explain: "Build وdeploy — خطوات التسليم.",
          },
          en: {
            lang: "bash",
            source: "# Production build\nng build --configuration production\n\n# Analyze bundle (optional)\nng build --stats-json\n\n# Deploy static dist/ to host\n# e.g. firebase deploy, vercel --prod\n\n# Verify\nnpx http-server dist/alefya-ui/browser -p 8080",
            explain: "Build and deploy — shipping steps.",
          },
        },
        pitfalls: pitfalls([
          {
            ar: ["ship dev build", "production configuration always"],
            en: ["ship dev build", "production configuration always"],
          },
          {
            ar: ["ignore a11y", "WCAG basics keyboard contrast"],
            en: ["ignore a11y", "WCAG basics keyboard contrast"],
          },
          {
            ar: ["bundle huge no lazy", "verify lazy chunks admin"],
            en: ["bundle huge no lazy", "verify lazy chunks admin"],
          },
          {
            ar: ["no README", "document routes mock setup"],
            en: ["no README", "document routes mock setup"],
          },
        ]),
        discussion: [
          qa(
            "PWA?",
            "ng add @angular/pwa optional offline.",
            "PWA?",
            "ng add @angular/pwa optional offline.",
          ),
          qa(
            "monitoring?",
            "Sentry optional production.",
            "monitoring?",
            "Sentry optional production.",
          ),
          qa(
            "next steps after track?",
            "connect real AlefYa API auth.",
            "next steps after track?",
            "connect real AlefYa API auth.",
          ),
          qa(
            "portfolio?",
            "deploy URL + GitHub README case study.",
            "portfolio?",
            "deploy URL + GitHub README case study.",
          ),
        ],
        exercises: {
          ar: ["Lighthouse 90+ perf", "focus visible styles", "budget warning fix", "write DEPLOY.md"],
          en: ["Lighthouse 90+ perf", "focus visible styles", "budget warning fix", "write DEPLOY.md"],
        },
        checklist: {
          ar: ["keyboard nav works", "production build succeeds", "deployed URL live", "README complete", "أكملت مسار Angular!"],
          en: ["keyboard nav works", "production build succeeds", "deployed URL live", "README complete", "Angular track complete!"],
        },
        nextHint: { ar: "تهانينا — راجع مسارات AlefYa الأخرى أو اربط API حقيقي.", en: "Congratulations — explore other AlefYa tracks or connect a real API." },
      })
    ],
  }
};
