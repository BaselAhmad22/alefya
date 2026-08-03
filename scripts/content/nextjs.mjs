import { stage } from "./expand.mjs";

export const nextjsTrack = {
  slug: "nextjs",
  order: 4,
  title: { ar: "Next.js", en: "Next.js" },
  tagline: {
    ar: "من App Router حتى منتج جاهز للإطلاق",
    en: "From App Router to a shippable product",
  },
  description: {
    ar: "مسار Next.js الحديث (App Router): الهيكل، التوجيه، Server/Client Components، جلب البيانات، Server Actions، الأداء، النشر، ثم مشروع. محتوى ثنائي اللغة عميق داخل ألف ياء.",
    en: "Modern Next.js (App Router) path: structure, routing, Server/Client Components, data fetching, Server Actions, performance, deploy, then a project. Deep bilingual content inside AlefYa.",
  },
  color: "#E8E8E8",
  estimatedHours: 95,
  stages: [
    "01-foundations",
    "02-app-router",
    "03-server-client",
    "04-data",
    "05-actions-mutations",
    "06-ui-assets",
    "07-production",
    "08-project",
  ],
};

export const nextjsStages = {
  "01-foundations": stage(
    "01-foundations",
    1,
    { ar: "أساسيات Next.js", en: "Next.js foundations" },
    {
      ar: "لماذا Next.js، create-next-app، هيكل المشروع، وإعداد TypeScript",
      en: "Why Next.js, create-next-app, project structure, and TypeScript setup",
    },
    [
      {
        slug: "01-why-next",
        order: 1,
        duration: 45,
        title: { ar: "لماذا Next.js؟", en: "Why Next.js?" },
        summary: {
          ar: "فهم مكان Next.js في React ecosystem ومتى يكون الخيار الصحيح لمشروعك.",
          en: "Understand Next.js in the React ecosystem and when it is the right choice.",
        },
        focus: {
          ar: "Next.js ليس مجرد React — إنه إطار full-stack يضيف التوجيه، التقديم من الخادم، وتحسينات الإنتاج افتراضياً. قبل أن تكتب أول صفحة، تحتاج أن تعرف لماذا الفرق مهم لمشاريع AlefYa ثنائية اللغة.",
          en: "Next.js is not just React — it is a full-stack framework adding routing, server rendering, and production optimizations by default. Before your first page, you need to know why that matters for bilingual AlefYa-style products.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "React + إطار = Next.js", en: "React + framework = Next.js" },
            body: {
              ar: "React يعطيك مكوّنات وإدارة واجهة؛ Next.js يضيف **App Router**، **Server Components**، **file-based routing**، و**build pipeline** جاهز للنشر. بدون Next.js تبني bundler وrouter وSSR يدوياً — ممكن لكن مكلف في الفرق. في مسار ألف ياء، Next.js يختصر الطريق من prototype إلى منتج.",
              en: "React gives you components and UI state; Next.js adds **App Router**, **Server Components**, **file-based routing**, and a **deploy-ready build pipeline**. Without Next.js you wire bundler, router, and SSR yourself — doable but expensive for teams. On the AlefYa path, Next.js shortens prototype-to-product.",
            },
          },
          {
            title: { ar: "Full-stack على Node", en: "Full-stack on Node" },
            body: {
              ar: "Next.js يعمل فوق Node.js: Route Handlers وServer Actions وmiddleware تسمح بـ API وauth وrevalidation داخل نفس المشروع. لا تحتاج Express منفصل للبداية — لكن يمكنك التكامل لاحقاً. هذا يقلل context switching بين frontend وbackend repos.",
              en: "Next.js runs on Node.js: Route Handlers, Server Actions, and middleware let you handle APIs, auth, and revalidation in one repo. You do not need a separate Express app to start — though integration is possible later. That cuts context switching between frontend and backend repos.",
            },
          },
          {
            title: { ar: "App Router مقابل Pages Router", en: "App Router vs Pages Router" },
            body: {
              ar: "المسار الحديث يعتمد **App Router** (`app/`) — RSC، layouts متداخلة، loading/error UI. **Pages Router** (`pages/`) legacy لكن ما زال مدعوماً. مشاريع جديدة: App Router فقط. التوثيق والدروس هنا كلها App Router.",
              en: "This path uses **App Router** (`app/`) — RSC, nested layouts, loading/error UI. **Pages Router** (`pages/`) is legacy but supported. New projects: App Router only. All docs and lessons here are App Router.",
            },
          },
          {
            title: { ar: "متى لا تختار Next.js", en: "When not to choose Next.js" },
            body: {
              ar: "SPA خالص بدون SEO، تطبيق React Native، أو static site بسيط جداً — قد يكون Vite أو Astro أو CRA (deprecated) أنسب. Next.js shines عند: SEO، i18n، dashboards، e-commerce، ومحتوى ديناميكي. قرار واعٍ أفضل من hype.",
              en: "Pure SPA with no SEO, React Native, or a tiny static site — Vite, Astro, or legacy CRA might fit better. Next.js shines for SEO, i18n, dashboards, e-commerce, and dynamic content. A deliberate choice beats hype.",
            },
          },
        ],
        codeSource: `// app/page.tsx — أبسط صفحة App Router
export default function HomePage() {
  return (
    <main>
      <h1>AlefYa — Next.js track</h1>
      <p>Server Component by default — no "use client" needed.</p>
    </main>
  );
}`,
        faqs: [
          {
            q: { ar: "هل Next.js يستبدل React؟", en: "Does Next.js replace React?" },
            a: {
              ar: "لا — Next.js مبني على React. تكتب JSX وhooks في Client Components؛ الفرق في التوجيه والتقديم والبنية.",
              en: "No — Next.js is built on React. You write JSX and hooks in Client Components; the difference is routing, rendering, and structure.",
            },
          },
          {
            q: { ar: "هل أحتاج Node.js في الإنتاج؟", en: "Do I need Node.js in production?" },
            a: {
              ar: "لـ SSR وServer Actions نعم — أو static export لمواقع ثابتة فقط. Vercel يدير Node تلقائياً.",
              en: "For SSR and Server Actions yes — or static export for fully static sites. Vercel manages Node for you.",
            },
          },
          {
            q: { ar: "95 ساعة — واقعي؟", en: "95 hours — realistic?" },
            a: {
              ar: "نعم لمسار عميق: App Router، RSC، data، actions، production، ومشروع capstone. خفّف حسب خبرتك في React.",
              en: "Yes for a deep path: App Router, RSC, data, actions, production, capstone. Trim based on React experience.",
            },
          },
          {
            q: { ar: "Next.js 14 أم 15؟", en: "Next.js 14 or 15?" },
            a: {
              ar: "المفاهيم App Router مستقرة — استخدم LTS/أحدث stable من create-next-app. الدروس تركز على المفاهيم لا رقم الإصدار.",
              en: "App Router concepts are stable — use LTS/latest stable from create-next-app. Lessons focus on concepts, not version numbers.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: create-next-app — إنشاء أول مشروع بالخيارات الصحيحة.",
          en: "Next: create-next-app — scaffold your first project with the right options.",
        },
      },
      {
        slug: "02-create-app",
        order: 2,
        duration: 42,
        title: { ar: "create-next-app", en: "create-next-app" },
        summary: {
          ar: "إنشاء مشروع Next.js بالـ CLI: TypeScript، ESLint، Tailwind، App Router.",
          en: "Scaffold a Next.js project via CLI: TypeScript, ESLint, Tailwind, App Router.",
        },
        focus: {
          ar: "أول أمر `npx create-next-app@latest` يحدد تجربة التطوير لأسابيع. اختيار TypeScript وApp Router وTailwind من البداية يطابق مسار ألف ياء ويمنع إعادة الهيكلة لاحقاً.",
          en: "Your first `npx create-next-app@latest` run sets the dev experience for weeks. Choosing TypeScript, App Router, and Tailwind upfront matches the AlefYa path and avoids painful rewrites.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "create-next-app", en: "create-next-app" },
            body: {
              ar: "الأداة الرسمية تنشئ هيكل `app/`، `public/`، `next.config.ts`، و`package.json` مع scripts: `dev`، `build`، `start`، `lint`. **Turbopack** (`--turbo`) يسرّع dev في المشاريع الكبيرة — اختياري.",
              en: "The official tool scaffolds `app/`, `public/`, `next.config.ts`, and `package.json` with scripts: `dev`, `build`, `start`, `lint`. **Turbopack** (`--turbo`) speeds dev in large projects — optional.",
            },
          },
          {
            title: { ar: "خيارات التثبيت", en: "Scaffold options" },
            body: {
              ar: "فعّل: **TypeScript**، **ESLint**، **Tailwind CSS**، **`src/` directory** (اختياري لكن منظم)، **App Router**، **import alias `@/*`**. تجنّب Pages Router في مشروع جديد. **turbopack** للتجربة في dev.",
              en: "Enable: **TypeScript**, **ESLint**, **Tailwind CSS**, **`src/` directory** (optional but tidy), **App Router**, **`@/*` import alias**. Avoid Pages Router on new projects. Try **turbopack** in dev.",
            },
          },
          {
            title: { ar: "Node وnpm/pnpm", en: "Node and npm/pnpm" },
            body: {
              ar: "Node **20 LTS** أو أحدث. `pnpm` أسرع في monorepos؛ `npm` يكفي للمسار. `.nvmrc` أو `engines` في package.json يثبت الإصدار للفريق.",
              en: "Node **20 LTS** or newer. `pnpm` is faster in monorepos; `npm` is fine for this path. `.nvmrc` or `engines` in package.json pins version for the team.",
            },
          },
          {
            title: { ar: "أول تشغيل", en: "First run" },
            body: {
              ar: "`npm run dev` يفتح http://localhost:3000. Hot reload يعمل على Server وClient Components. `npm run build` يكشف أخطاء production مبكراً — شغّله قبل كل merge.",
              en: "`npm run dev` opens http://localhost:3000. Hot reload works for Server and Client Components. `npm run build` surfaces production errors early — run before every merge.",
            },
          },
        ],
        codeSource: `# إنشاء مشروع AlefYa-style
npx create-next-app@latest alefya-next \\
  --typescript --eslint --tailwind \\
  --app --src-dir --import-alias "@/*"

cd alefya-next
npm run dev

# تحقق من البناء
npm run build`,
        faqs: [
          {
            q: { ar: "src/ أم جذر app/؟", en: "src/ or root app/?" },
            a: {
              ar: "كلاهما صحيح — `src/app/` يفصل الكود عن configs في الجذر. ألف ياء يفضل src/ للوضوح.",
              en: "Both work — `src/app/` separates code from root configs. AlefYa prefers src/ for clarity.",
            },
          },
          {
            q: { ar: "هل Tailwind إلزامي؟", en: "Is Tailwind required?" },
            a: {
              ar: "في المسار نعم للسرعة — يمكن CSS Modules لاحقاً. create-next-app يضبط postcss تلقائياً.",
              en: "Yes on this path for speed — CSS Modules come later. create-next-app configures postcss automatically.",
            },
          },
          {
            q: { ar: "خطأ EACCES عند npx؟", en: "EACCES error on npx?" },
            a: {
              ar: "لا تستخدم sudo مع npm. أصلح ownership لمجلد npm أو استخدم nvm.",
              en: "Never use sudo with npm. Fix npm folder ownership or use nvm.",
            },
          },
          {
            q: { ar: "Can I use Yarn?", en: "Can I use Yarn?" },
            a: {
              ar: "نعم — create-next-app يدعم yarn/pnpm/bun. المهم consistency داخل الفريق.",
              en: "Yes — create-next-app supports yarn/pnpm/bun. Team consistency matters most.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: قراءة هيكل المشروع — app، layouts، وملفات الإعداد.",
          en: "Next: read project structure — app, layouts, and config files.",
        },
      },
      {
        slug: "03-project-structure",
        order: 3,
        duration: 48,
        title: { ar: "هيكل المشروع", en: "Project structure" },
        summary: {
          ar: "خريطة مجلدات App Router: app، components، lib، public، والملفات الجذرية.",
          en: "App Router folder map: app, components, lib, public, and root files.",
        },
        focus: {
          ar: "فهم أين يذهب كل ملف يمنع chaos عندما ينمو المشروع. App Router يفرض conventions — اتبعها وستجد الكود بسرعة.",
          en: "Knowing where each file belongs prevents chaos as the project grows. App Router enforces conventions — follow them and you will find code fast.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "مجلد app/", en: "The app/ directory" },
            body: {
              ar: "**`app/`** (أو `src/app/`) هو قلب التوجيه: `page.tsx` = route، `layout.tsx` = shell مشترك، `loading.tsx` و`error.tsx` = UI للحالات. المجلدات = segments URL. `app/tracks/[slug]/page.tsx` → `/tracks/nextjs`.",
              en: "**`app/`** (or `src/app/`) is routing core: `page.tsx` = route, `layout.tsx` = shared shell, `loading.tsx` and `error.tsx` = state UI. Folders = URL segments. `app/tracks/[slug]/page.tsx` → `/tracks/nextjs`.",
            },
          },
          {
            title: { ar: "components و lib", en: "components and lib" },
            body: {
              ar: "**`components/`** للمكوّنات القابلة لإعادة الاستخدام (UI، forms). **`lib/`** للدوال الخالصة: fetch helpers، validators، db client. **`hooks/`** اختياري لـ client hooks. لا تضع business logic داخل page.tsx — استخرجها.",
              en: "**`components/`** for reusable pieces (UI, forms). **`lib/`** for pure helpers: fetch utilities, validators, db client. Optional **`hooks/`** for client hooks. Do not bury business logic in page.tsx — extract it.",
            },
          },
          {
            title: { ar: "public و assets", en: "public and assets" },
            body: {
              ar: "**`public/`** ملفات ثابتة تُخدم من `/`: favicon، robots.txt، صور marketing. للصور المحسّنة استخدم **`next/image`** مع imports أو remote patterns — ليس كل شيء في public.",
              en: "**`public/`** static files served from `/`: favicon, robots.txt, marketing images. For optimized images use **`next/image`** with imports or remote patterns — not everything belongs in public.",
            },
          },
          {
            title: { ar: "ملفات الإعداد", en: "Config files" },
            body: {
              ar: "`next.config.ts` — images domains، redirects، experimental flags. `tsconfig.json` — paths `@/*`. `tailwind.config.ts` — design tokens. `.env.local` — secrets (لا ت commit). `middleware.ts` في الجذر أو src للـ edge logic.",
              en: "`next.config.ts` — image domains, redirects, experimental flags. `tsconfig.json` — `@/*` paths. `tailwind.config.ts` — design tokens. `.env.local` — secrets (never commit). Root or src `middleware.ts` for edge logic.",
            },
          },
        ],
        codeSource: `// src/app/layout.tsx — root layout (required)
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlefYa",
  description: "Bilingual learning paths",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

// src/app/tracks/page.tsx → /tracks
// src/lib/i18n.ts → shared helpers (not a route)`,
        faqs: [
          {
            q: { ar: "لماذا page.tsx وليس index.tsx؟", en: "Why page.tsx not index.tsx?" },
            a: {
              ar: "App Router convention — `page` يُصدّر UI للـ segment. `index` كان Pages Router.",
              en: "App Router convention — `page` exports UI for the segment. `index` was Pages Router.",
            },
          },
          {
            q: { ar: "هل أضع components داخل app/?", en: "Put components inside app/?" },
            a: {
              ar: "يمكن `_components` colocated، لكن المشاركة الأوسع → `src/components/`. underscore folders لا تصبح routes.",
              en: "You can colocate in `_components`, but shared UI → `src/components/`. Underscore folders are not routes.",
            },
          },
          {
            q: { ar: "أين Route Handlers؟", en: "Where do Route Handlers go?" },
            a: {
              ar: "`app/api/hello/route.ts` — `GET`/`POST` exports. ليس داخل pages.",
              en: "`app/api/hello/route.ts` — export `GET`/`POST`. Not inside pages.",
            },
          },
          {
            q: { ar: "monorepo؟", en: "Monorepo?" },
            a: {
              ar: "لاحقاً في production — البداية single app أبسط. Turborepo + packages عند الحاجة.",
              en: "Later in production — start with a single app. Turborepo + packages when needed.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: TypeScript — strict mode وtyping للـ App Router.",
          en: "Next: TypeScript — strict mode and App Router typing.",
        },
      },
      {
        slug: "04-typescript-setup",
        order: 4,
        duration: 50,
        title: { ar: "إعداد TypeScript", en: "TypeScript setup" },
        summary: {
          ar: "strict mode، typed routes، Metadata، ونماذج bilingual لمحتوى AlefYa.",
          en: "strict mode, typed routes, Metadata, and bilingual models for AlefYa content.",
        },
        focus: {
          ar: "Next.js + TypeScript يعطيان autocomplete لـ params وsearchParams وMetadata. strict من اليوم الأول يمنع bugs في Server Components حيث لا runtime prop-types.",
          en: "Next.js + TypeScript give autocomplete for params, searchParams, and Metadata. strict from day one prevents bugs in Server Components where there is no runtime prop-types.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "tsconfig في Next.js", en: "tsconfig in Next.js" },
            body: {
              ar: "create-next-app يفعّل **`strict: true`** و**`moduleResolution: bundler`**. **`paths`** `@/*` → `./src/*`. **`plugins: [{ name: \"next\" }]`** يفعّل typed routes (experimental). لا تعطّل strict لتسريع البداية — الديون ستعود.",
              en: "create-next-app enables **`strict: true`** and **`moduleResolution: bundler`**. **`paths`** `@/*` → `./src/*`. **`plugins: [{ name: \"next\" }]`** enables typed routes (experimental). Do not disable strict to start fast — debt returns.",
            },
          },
          {
            title: { ar: "Page props typing", en: "Page props typing" },
            body: {
              ar: "`PageProps` / manual types: `{ params: Promise<{ slug: string }> }` في Next 15+. **`await params`** في async Server Components. **`searchParams`** للـ query string — typed كـ `Record<string, string | string[] | undefined>`.",
              en: "`PageProps` / manual types: `{ params: Promise<{ slug: string }> }` in Next 15+. **`await params`** in async Server Components. **`searchParams`** for query strings — typed as `Record<string, string | string[] | undefined>`.",
            },
          },
          {
            title: { ar: "نماذج bilingual", en: "Bilingual models" },
            body: {
              ar: "`type Locale = 'ar' | 'en'` و`type Bilingual<T = string> = Record<Locale, T>`. **`LessonMeta`** مع `title: Bilingual` يطابق JSON في ألف ياء. استخدم **`satisfies`** للتحقق دون widening.",
              en: "`type Locale = 'ar' | 'en'` and `type Bilingual<T = string> = Record<Locale, T>`. **`LessonMeta`** with `title: Bilingual` matches AlefYa JSON. Use **`satisfies`** to validate without widening.",
            },
          },
          {
            title: { ar: "Server vs Client types", en: "Server vs Client types" },
            body: {
              ar: "لا تمرّر functions أو class instances من Server إلى Client — serialization error. **`import type`** فقط للأ types في client files. **`React.ComponentProps<'button'>`** لـ wrapper components.",
              en: "Do not pass functions or class instances from Server to Client — serialization error. **`import type`** only for types in client files. **`React.ComponentProps<'button'>`** for wrapper components.",
            },
          },
        ],
        codeSource: `type Locale = "ar" | "en";
type Bilingual = Record<Locale, string>;

interface TrackMeta {
  slug: string;
  title: Bilingual;
  order: number;
}

const nextjsTrack = {
  slug: "nextjs",
  order: 4,
  title: { ar: "Next.js", en: "Next.js" },
} satisfies TrackMeta;

// app/tracks/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> };

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}`,
        faqs: [
          {
            q: { ar: "أخطاء JSX.IntrinsicElements؟", en: "JSX.IntrinsicElements errors?" },
            a: {
              ar: "تأكد `@types/react` متوافق مع React version. `npm i -D @types/react@latest`.",
              en: "Ensure `@types/react` matches React version. `npm i -D @types/react@latest`.",
            },
          },
          {
            q: { ar: "هل أستخدم any في params؟", en: "Use any for params?" },
            a: {
              ar: "لا — عرّف slug literals أو Zod parse في layout/page.",
              en: "No — define slug literals or Zod parse in layout/page.",
            },
          },
          {
            q: { ar: "Zod مع Next.js؟", en: "Zod with Next.js?" },
            a: {
              ar: "ممتاز لـ Server Actions وAPI — نعيده في دروس forms وactions.",
              en: "Great for Server Actions and APIs — we revisit in forms and actions lessons.",
            },
          },
          {
            q: { ar: "typedRoutes experimental؟", en: "typedRoutes experimental?" },
            a: {
              ar: "اختياري — ي catch broken links في build. فعّله في next.config عند الاستقرار.",
              en: "Optional — catches broken links at build. Enable in next.config when stable.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: App Router — file-based routing بالتفصيل.",
          en: "Next stage: App Router — file-based routing in depth.",
        },
      },
    ],
  ),
  "02-app-router": stage(
    "02-app-router",
    2,
    { ar: "App Router", en: "App Router" },
    {
      ar: "التوجيه القائم على الملفات، layouts، loading/error، وroute groups",
      en: "File-based routing, layouts, loading/error, and route groups",
    },
    [
      {
        slug: "01-file-based-routing",
        order: 1,
        duration: 48,
        title: { ar: "التوجيه القائم على الملفات", en: "File-based routing" },
        summary: {
          ar: "كيف تتحول مجلدات app/ إلى URLs: static، dynamic، catch-all، وoptional catch-all.",
          en: "How app/ folders become URLs: static, dynamic, catch-all, and optional catch-all.",
        },
        focus: {
          ar: "App Router يربط filesystem بالـ URL مباشرة — لا routes config منفصل. فهم segments وparams أساس كل صفحة ديناميكية في AlefYa (tracks، lessons، locales).",
          en: "App Router maps the filesystem to URLs directly — no separate routes config. Understanding segments and params is the base for every dynamic AlefYa page (tracks, lessons, locales).",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Segments ثابتة", en: "Static segments" },
            body: {
              ar: "`app/about/page.tsx` → `/about`. Nested folders = nested paths: `app/tracks/nextjs/page.tsx` → `/tracks/nextjs`. كل segment يحتاج **`page.tsx`** (أو **`route.ts`** للـ API) ليصبح publicly accessible.",
              en: "`app/about/page.tsx` → `/about`. Nested folders = nested paths: `app/tracks/nextjs/page.tsx` → `/tracks/nextjs`. Each segment needs **`page.tsx`** (or **`route.ts`** for APIs) to be publicly accessible.",
            },
          },
          {
            title: { ar: "Dynamic [param]", en: "Dynamic [param]" },
            body: {
              ar: "`app/tracks/[slug]/page.tsx` — **`[slug]`** dynamic segment. في page: `const { slug } = await params`. **`generateStaticParams`** لـ SSG paths. **`dynamicParams`** يتحكم بـ 404 للـ slugs غير المولّدة.",
              en: "`app/tracks/[slug]/page.tsx` — **`[slug]`** dynamic segment. In page: `const { slug } = await params`. **`generateStaticParams`** for SSG paths. **`dynamicParams`** controls 404 for ungenerated slugs.",
            },
          },
          {
            title: { ar: "Catch-all [...slug]", en: "Catch-all [...slug]" },
            body: {
              ar: "**`[...slug]`** يطابق مساراً متعدد المستويات: `/docs/a/b/c` → `slug: ['a','b','c']`. **`[[...slug]]`** optional — يطابق `/docs` أيضاً. مفيد لـ CMS-driven docs mirrors.",
              en: "**`[...slug]`** matches multi-level paths: `/docs/a/b/c` → `slug: ['a','b','c']`. **`[[...slug]]`** optional — also matches `/docs`. Useful for CMS-driven doc mirrors.",
            },
          },
          {
            title: { ar: "not-found و redirect", en: "not-found and redirect" },
            body: {
              ar: "**`notFound()`** من `next/navigation` يعرض `not-found.tsx`. **`redirect()`** للتوجيه server-side. **`permanentRedirect`** لـ 308 SEO. استخدمها في Server Components وRoute Handlers.",
              en: "**`notFound()`** from `next/navigation` renders `not-found.tsx`. **`redirect()`** for server redirects. **`permanentRedirect`** for 308 SEO. Use in Server Components and Route Handlers.",
            },
          },
        ],
        codeSource: `// app/tracks/[slug]/page.tsx
import { notFound } from "next/navigation";

const TRACKS = ["nextjs", "angular", "aspnet"] as const;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return TRACKS.map((slug) => ({ slug }));
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;
  if (!TRACKS.includes(slug as (typeof TRACKS)[number])) notFound();
  return <h1>Track: {slug}</h1>;
}`,
        faqs: [
          {
            q: { ar: "هل ترتيب المجلدات ي matter؟", en: "Does folder order matter?" },
            a: {
              ar: "URL يتبع nesting فقط — لا alphabet sorting.",
              en: "URL follows nesting only — no alphabet sorting.",
            },
          },
          {
            q: { ar: "page.tsx vs route.ts في نفس folder؟", en: "page.tsx vs route.ts same folder?" },
            a: {
              ar: "يمكن coexist — page للـ UI، route للـ API على نفس path prefix (نادر).",
              en: "They can coexist — page for UI, route for API on same prefix (uncommon).",
            },
          },
          {
            q: { ar: "Parallel routes؟", en: "Parallel routes?" },
            a: {
              ar: "متقدم — `@modal` slots. خارج نطاق هذا الدرس؛ راجع docs عند الحاجة.",
              en: "Advanced — `@modal` slots. Out of scope here; check docs when needed.",
            },
          },
          {
            q: { ar: "i18n [locale] segment؟", en: "i18n [locale] segment?" },
            a: {
              ar: "شائع: `app/[locale]/...` + middleware rewrite. نطبّق في production stage.",
              en: "Common: `app/[locale]/...` + middleware rewrite. We apply in production stage.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: layouts و templates — shells متداخلة.",
          en: "Next: layouts and templates — nested shells.",
        },
      },
      {
        slug: "02-layouts-templates",
        order: 2,
        duration: 52,
        title: { ar: "Layouts و Templates", en: "Layouts and templates" },
        summary: {
          ar: "Root layout، nested layouts، template.tsx، وفروقات إعادة render.",
          en: "Root layout, nested layouts, template.tsx, and re-render differences.",
        },
        focus: {
          ar: "Layouts تحافظ على state عند navigation؛ templates تعيد mount. هذا الفرق يحدد أين navbar، sidebar AlefYa، وprogress tracker.",
          en: "Layouts preserve state on navigation; templates remount. That difference decides where AlefYa navbar, sidebar, and progress tracker live.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "layout.tsx", en: "layout.tsx" },
            body: {
              ar: "**`layout.tsx`** يلف children و**يبقى mounted** عند التنقل بين sibling routes. Root layout **must** include `<html>` و`<body>`. Nested: `app/tracks/layout.tsx` يشارك shell لكل `/tracks/*`.",
              en: "**`layout.tsx`** wraps children and **stays mounted** when navigating sibling routes. Root layout **must** include `<html>` and `<body>`. Nested: `app/tracks/layout.tsx` shares shell for all `/tracks/*`.",
            },
          },
          {
            title: { ar: "template.tsx", en: "template.tsx" },
            body: {
              ar: "**`template.tsx`** مثل layout لكن **re-mounts** كل navigation — مفيد لـ enter animations أو reset analytics. نادر؛ default = layout فقط.",
              en: "**`template.tsx`** looks like layout but **re-mounts** on each navigation — useful for enter animations or analytics reset. Rare; default to layout.",
            },
          },
          {
            title: { ar: "children و parallel slots", en: "children and parallel slots" },
            body: {
              ar: "Layout يستقبل **`{ children }`**. Parallel routes تضيف **`@slot`** props. **`default.tsx`** fallback للـ slots. AlefYa sidebar يمكن slot `@sidebar` لاحقاً.",
              en: "Layout receives **`{ children }`**. Parallel routes add **`@slot`** props. **`default.tsx`** slot fallback. AlefYa sidebar could be `@sidebar` slot later.",
            },
          },
          {
            title: { ar: "Metadata في layouts", en: "Metadata in layouts" },
            body: {
              ar: "**`export const metadata`** أو **`generateMetadata`** في layout/page — merged hierarchy (child overrides). **`title.template`** في root: `%s | AlefYa`.",
              en: "**`export const metadata`** or **`generateMetadata`** in layout/page — merged hierarchy (child overrides). Root **`title.template`**: `%s | AlefYa`.",
            },
          },
        ],
        codeSource: `// app/tracks/layout.tsx
import { TrackSidebar } from "@/components/TrackSidebar";

export default function TracksLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <TrackSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// app/layout.tsx — root (once)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body className="antialiased">{children}</body>
    </html>
  );
}`,
        faqs: [
          {
            q: { ar: "layout بدون page في segment؟", en: "Layout without page in segment?" },
            a: {
              ar: "segment layout-only ممكن — URL يحتاج page في leaf أو child.",
              en: "Layout-only segments work — URL needs a page at leaf or child.",
            },
          },
          {
            q: { ar: "Client layout؟", en: "Client layout?" },
            a: {
              ar: "Avoid — root layout Server preferred. Client shell داخل Server layout OK.",
              en: "Avoid — prefer Server root layout. Client shell inside Server layout is OK.",
            },
          },
          {
            q: { ar: "scroll restoration؟", en: "Scroll restoration?" },
            a: {
              ar: "Layouts preserve scroll في nested areas؛ `<Link scroll>` default true.",
              en: "Layouts preserve scroll in nested areas; `<Link scroll>` defaults true.",
            },
          },
          {
            q: { ar: "multiple root layouts؟", en: "Multiple root layouts?" },
            a: {
              ar: "لا — root واحد. Route groups `(marketing)` لت layouts مختلفة بدون URL segment.",
              en: "No — one root. Route groups `(marketing)` for different layouts without URL segment.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: loading.tsx و error.tsx — UX للانتظار والفشل.",
          en: "Next: loading.tsx and error.tsx — UX for pending and failure.",
        },
      },
      {
        slug: "03-loading-error",
        order: 3,
        duration: 46,
        title: { ar: "Loading و Error UI", en: "Loading and error UI" },
        summary: {
          ar: "Suspense boundaries تلقائية، error boundaries، وglobal-error.",
          en: "Automatic Suspense boundaries, error boundaries, and global-error.",
        },
        focus: {
          ar: "Next.js يحوّل loading.tsx و error.tsx إلى boundaries بدون boilerplate React. تجربة AlefYa أثناء جلب الدروس تعتمد على هذه الملفات.",
          en: "Next.js turns loading.tsx and error.tsx into boundaries without React boilerplate. AlefYa lesson fetch UX depends on these files.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "loading.tsx", en: "loading.tsx" },
            body: {
              ar: "**`loading.tsx`** يلف **`page.tsx`** sibling في **Suspense** تلقائياً — instant loading UI أثناء async Server Component. Nested loading = granular skeletons. **`loading.js`** Client optional.",
              en: "**`loading.tsx`** auto-wraps sibling **`page.tsx`** in **Suspense** — instant loading UI during async Server Component. Nested loading = granular skeletons.",
            },
          },
          {
            title: { ar: "error.tsx", en: "error.tsx" },
            body: {
              ar: "**`error.tsx`** must be **Client Component** (`\"use client\"`) — **`error`**, **`reset`**. ي catch errors في segment children. **`global-error.tsx`** root fallback — نادر.",
              en: "**`error.tsx`** must be **Client Component** (`\"use client\"`) — **`error`**, **`reset`**. Catches errors in segment children. **`global-error.tsx`** root fallback — rare.",
            },
          },
          {
            title: { ar: "not-found.tsx", en: "not-found.tsx" },
            body: {
              ar: "**`not-found.tsx`** UI لـ **`notFound()`**. يمكن colocated per segment. 404 SEO-friendly أفضل من throw generic.",
              en: "**`not-found.tsx`** UI for **`notFound()`**. Colocate per segment. SEO-friendly 404 beats generic throw.",
            },
          },
          {
            title: { ar: "Streaming مع Suspense", en: "Streaming with Suspense" },
            body: {
              ar: "Manual **`<Suspense fallback={...}>`** داخل page لتقسيم slow/fast parts. **`loading.tsx`** = route-level default. Combine للـ dashboards.",
              en: "Manual **`<Suspense fallback={...}>`** inside page splits slow/fast parts. **`loading.tsx`** = route-level default. Combine for dashboards.",
            },
          },
        ],
        codeSource: `"use client";

// app/tracks/[slug]/error.tsx
export default function TrackError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert">
      <h2>Failed to load track</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// app/tracks/[slug]/loading.tsx (Server OK)
export default function Loading() {
  return <div className="animate-pulse h-8 bg-gray-200 rounded" />;
}`,
        faqs: [
          {
            q: { ar: "error.tsx يلتقط fetch errors؟", en: "Does error.tsx catch fetch errors?" },
            a: {
              ar: "نعم في Server Component render — throw أو rejected promise.",
              en: "Yes during Server Component render — throw or rejected promise.",
            },
          },
          {
            q: { ar: "loading لا يظهر؟", en: "Loading not showing?" },
            a: {
              ar: "ربما page sync سريع — أضف artificial delay للتعلّم فقط، أو Suspense manual.",
              en: "Page may resolve too fast — add artificial delay for learning only, or manual Suspense.",
            },
          },
          {
            q: { ar: "digest في error؟", en: "digest in error?" },
            a: {
              ar: "Server error hash للـ logging — لا تعرض secrets للمستخدم.",
              en: "Server error hash for logging — do not expose secrets to users.",
            },
          },
          {
            q: { ar: "boundary vs try/catch؟", en: "boundary vs try/catch?" },
            a: {
              ar: "try/catch داخل async page لـ control flow؛ boundary لـ UI recovery.",
              en: "try/catch inside async page for control flow; boundary for UI recovery.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: route groups `(folder)` — تنظيم بدون URL.",
          en: "Next: route groups `(folder)` — organization without URL.",
        },
      },
      {
        slug: "04-route-groups",
        order: 4,
        duration: 44,
        title: { ar: "Route Groups", en: "Route groups" },
        summary: {
          ar: "مجلدات `(name)` لتنظيم routes وlayouts متعددة بدون segment في URL.",
          en: "Folders `(name)` to organize routes and multiple layouts without URL segments.",
        },
        focus: {
          ar: "Route groups تحل مشكلة marketing vs app shell في AlefYa: landing بدون sidebar، dashboard مع sidebar — نفس repo، URLs نظيفة.",
          en: "Route groups solve AlefYa marketing vs app shell: landing without sidebar, dashboard with sidebar — same repo, clean URLs.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Syntax (group)", en: "(group) syntax" },
            body: {
              ar: "مجلد **`(marketing)`** لا يظهر في URL: `app/(marketing)/about/page.tsx` → `/about`. **`(app)`** و **`(auth)`** layouts مختلفة. يمكن nested groups.",
              en: "Folder **`(marketing)`** omitted from URL: `app/(marketing)/about/page.tsx` → `/about`. Different **`(app)`** and **`(auth)`** layouts. Groups can nest.",
            },
          },
          {
            title: { ar: "Multiple root layouts", en: "Multiple root layouts" },
            body: {
              ar: "كل group يمكن **`layout.tsx`** مختلف — لكن **`<html>`** مرة واحدة في true root أو per-group root without shared parent (advanced). Pattern: `(shop)` vs `(admin)`.",
              en: "Each group can have distinct **`layout.tsx`** — but one **`<html>`** at true root or per-group root without shared parent (advanced). Pattern: `(shop)` vs `(admin)`.",
            },
          },
          {
            title: { ar: "تنظيم الفريق", en: "Team organization" },
            body: {
              ar: "Groups = ownership boundaries: `(learn)` tracks، `(account)` settings. `_private` folders للـ colocation غير routed (convention underscore).",
              en: "Groups = ownership boundaries: `(learn)` tracks, `(account)` settings. `_private` folders for non-routed colocation (underscore convention).",
            },
          },
          {
            title: { ar: "Conflicts و routing", en: "Conflicts and routing" },
            body: {
              ar: "Two pages same URL across groups = **build error**. Plan URLs on paper first. Groups لا replace `[locale]` — compose both.",
              en: "Two pages same URL across groups = **build error**. Plan URLs on paper first. Groups do not replace `[locale]` — compose both.",
            },
          },
        ],
        codeSource: `// app/(marketing)/layout.tsx — no sidebar
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>Public AlefYa</header>
      {children}
    </>
  );
}

// app/(learn)/layout.tsx — with sidebar
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside>Stages</aside>
      {children}
    </div>
  );
}

// app/(learn)/tracks/[slug]/page.tsx → /tracks/[slug]`,
        faqs: [
          {
            q: { ar: "() vs []؟", en: "() vs []?" },
            a: {
              ar: "`()` group = no URL. `[]` = dynamic param in URL.",
              en: "`()` group = no URL. `[]` = dynamic param in URL.",
            },
          },
          {
            q: { ar: "Link بين groups؟", en: "Link across groups?" },
            a: {
              ar: "`<Link href=\"/tracks/nextjs\">` — path فقط، groups invisible.",
              en: "`<Link href=\"/tracks/nextjs\">` — path only, groups invisible.",
            },
          },
          {
            q: { ar: "private folder _lib؟", en: "private folder _lib?" },
            a: {
              ar: "`_` prefix excludes from routing — colocate utils near routes.",
              en: "`_` prefix excludes from routing — colocate utils near routes.",
            },
          },
          {
            q: { ar: "أ many groups؟", en: "Too many groups?" },
            a: {
              ar: "2–4 groups typical — over-splitting confuses onboarding.",
              en: "2–4 groups typical — over-splitting confuses onboarding.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: Server vs Client Components.",
          en: "Next stage: Server vs Client Components.",
        },
      },
    ],
  ),
  "03-server-client": stage(
    "03-server-client",
    3,
    { ar: "Server و Client Components", en: "Server and Client Components" },
    {
      ar: "نموذج RSC، Client Components، وحدود التركيب",
      en: "RSC model, Client Components, and composition boundaries",
    },
    [
      {
        slug: "01-rsc-model",
        order: 1,
        duration: 52,
        title: { ar: "نموذج RSC", en: "The RSC model" },
        summary: {
          ar: "Server Components افتراضياً: render على الخادم، zero bundle JS للـ UI الثابت.",
          en: "Server Components by default: render on server, zero bundle JS for static UI.",
        },
        focus: {
          ar: "React Server Components تغيّر كيف نفكر في data وinteractivity. في AlefYa، محتوى الدروس JSON-heavy — RSC يجلبه على الخادم دون إرسال parsers ضخمة للمتصفح.",
          en: "React Server Components change how we think about data and interactivity. AlefYa lesson content is JSON-heavy — RSC fetches on server without shipping huge parsers to the browser.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Server Component default", en: "Server Component default" },
            body: {
              ar: "كل ملف في `app/` **Server Component** ما لم تكتب **`\"use client\"`**. يمكن **async** مباشرة — `await fetch()`، db queries. **لا hooks** (useState/useEffect). **لا browser APIs**.",
              en: "Every `app/` file is a **Server Component** unless you add **`\"use client\"`**. Can be **async** — `await fetch()`, db queries. **No hooks** (useState/useEffect). **No browser APIs**.",
            },
          },
          {
            title: { ar: "Payload و serialization", en: "Payload and serialization" },
            body: {
              ar: "RSC يرسل **serialized tree** للعميل — ليس HTML فقط. Props للـ Client children يجب أن تكون **serializable** (JSON-like). Functions/classes/Dates بحذر — `Date` sometimes OK as string.",
              en: "RSC sends a **serialized tree** to the client — not HTML only. Props to Client children must be **serializable** (JSON-like). Functions/classes/Dates need care — stringify Dates when unsure.",
            },
          },
          {
            title: { ar: "Zero JS benefit", en: "Zero JS benefit" },
            body: {
              ar: "Server Components **لا تُضاف** لـ client bundle — icons، markdown renderers، heavy libs on server. Client يستقبل نتيجة فقط. يقلل TTI لصفحات محتوى AlefYa.",
              en: "Server Components **do not ship** to client bundle — icons, markdown renderers, heavy libs stay on server. Client gets output only. Lowers TTI for AlefYa content pages.",
            },
          },
          {
            title: { ar: "Request lifecycle", en: "Request lifecycle" },
            body: {
              ar: "كل navigation/request = render pass على server (مع caching). Dev = fresh often. Production = cached segments per fetch/revalidate rules — نغطيها في data stage.",
              en: "Each navigation/request = server render pass (with caching). Dev often fresh. Production caches segments per fetch/revalidate rules — covered in data stage.",
            },
          },
        ],
        codeSource: `// Server Component — no directive
import { getLesson } from "@/lib/content";

export default async function LessonPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  return (
    <article>
      <h1>{lesson.title.ar}</h1>
      <div dangerouslySetInnerHTML={{ __html: lesson.content.ar }} />
    </article>
  );
}`,
        faqs: [
          {
            q: { ar: "RSC = SSR قديم؟", en: "RSC = old SSR?" },
            a: {
              ar: "RSC أعمق — component-level server render + streaming + client merge.",
              en: "RSC goes deeper — component-level server render + streaming + client merge.",
            },
          },
          {
            q: { ar: "هل كل شيء Server؟", en: "Everything Server?" },
            a: {
              ar: "لا — interactivity يحتاج Client islands. Rule: Server default, Client when needed.",
              en: "No — interactivity needs Client islands. Rule: Server default, Client when needed.",
            },
          },
          {
            q: { ar: "console.log أين؟", en: "Where does console.log go?" },
            a: {
              ar: "Server Component → terminal/server logs. Client → browser devtools.",
              en: "Server Component → terminal/server logs. Client → browser devtools.",
            },
          },
          {
            q: { ar: "SEO مع RSC؟", en: "SEO with RSC?" },
            a: {
              ar: "ممتاز — HTML كامل من server. Metadata API ي complement.",
              en: "Strong — full HTML from server. Metadata API complements.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: Client Components — use client وhooks.",
          en: "Next: Client Components — use client and hooks.",
        },
      },
      {
        slug: "02-client-components",
        order: 2,
        duration: 50,
        title: { ar: "Client Components", en: "Client Components" },
        summary: {
          ar: "use client، hooks، event handlers، وحدود الاستيراد.",
          en: "use client, hooks, event handlers, and import boundaries.",
        },
        focus: {
          ar: "أزرار، toggles، locale switcher، وAI Helper في AlefYa كلها Client Components. ضع \"use client\" في أعلى الملف — مرة واحدة per module boundary.",
          en: "Buttons, toggles, locale switcher, and AI Helper in AlefYa are Client Components. Put \"use client\" at file top — once per module boundary.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "use client directive", en: "use client directive" },
            body: {
              ar: "**`\"use client\"`** أول سطر — ي mark module + imports **client boundary**. كل imports من هذا الملف (transitive) client unless pure types. **لا** `\"use client\"` في layout root إن أمكن.",
              en: "**`\"use client\"`** first line — marks module + imports as **client boundary**. Transitive imports become client unless type-only. Avoid **`\"use client\"`** on root layout when possible.",
            },
          },
          {
            title: { ar: "Hooks و events", en: "Hooks and events" },
            body: {
              ar: "**useState**, **useEffect**, **useRef**, **onClick**, **onChange** — Client only. Forms progressive enhancement مع Server Actions لاحقاً — Client للـ optimistic UI.",
              en: "**useState**, **useEffect**, **useRef**, **onClick**, **onChange** — Client only. Forms use Server Actions later — Client for optimistic UI.",
            },
          },
          {
            title: { ar: "Browser APIs", en: "Browser APIs" },
            body: {
              ar: "**localStorage**, **window**, **matchMedia**, **IntersectionObserver** — Client + often **useEffect**. SSR mismatch: default state until mounted أو dynamic import ssr:false.",
              en: "**localStorage**, **window**, **matchMedia**, **IntersectionObserver** — Client + often **useEffect**. SSR mismatch: default state until mounted or dynamic import ssr:false.",
            },
          },
          {
            title: { ar: "Third-party libs", en: "Third-party libs" },
            body: {
              ar: "Charts، maps، rich editors — غالباً Client. **`next/dynamic(() => import('...'), { ssr: false })`** لتأخير bundle. Wrap في thin Client component.",
              en: "Charts, maps, rich editors — usually Client. **`next/dynamic(() => import('...'), { ssr: false })`** defers bundle. Wrap in thin Client component.",
            },
          },
        ],
        codeSource: `"use client";

import { useState } from "react";

type Locale = "ar" | "en";

export function LocaleSwitcher({
  initial,
}: { initial: Locale }) {
  const [locale, setLocale] = useState<Locale>(initial);

  return (
    <div className="flex gap-2">
      {(["ar", "en"] as const).map((loc) => (
        <button
          key={loc}
          type="button"
          aria-pressed={locale === loc}
          onClick={() => setLocale(loc)}
          className={locale === loc ? "font-bold" : ""}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}`,
        faqs: [
          {
            q: { ar: "use client في every file؟", en: "use client in every file?" },
            a: {
              ar: "فقط leaf interactive — Server parents import Client children OK.",
              en: "Only interactive leaves — Server parents importing Client children is OK.",
            },
          },
          {
            q: { ar: "Context Provider؟", en: "Context Provider?" },
            a: {
              ar: "Provider = Client — wrap في layout، children Server+Client mix.",
              en: "Provider = Client — wrap in layout, children can mix Server+Client.",
            },
          },
          {
            q: { ar: "use server في client file؟", en: "use server in client file?" },
            a: {
              ar: "لا — Server Actions في server module، import action في client.",
              en: "No — Server Actions in server modules, import action in client.",
            },
          },
          {
            q: { ar: "hydration mismatch؟", en: "Hydration mismatch?" },
            a: {
              ar: "Server HTML ≠ client first render — avoid Date.now/random in render.",
              en: "Server HTML ≠ client first render — avoid Date.now/random in render.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: composition boundaries — Server يلف Client.",
          en: "Next: composition boundaries — Server wrapping Client.",
        },
      },
      {
        slug: "03-composition-boundaries",
        order: 3,
        duration: 48,
        title: { ar: "حدود التركيب", en: "Composition boundaries" },
        summary: {
          ar: "children pattern، passing Server → Client، وanti-patterns.",
          en: "children pattern, passing Server → Client, and anti-patterns.",
        },
        focus: {
          ar: "التركيب الصحيح يبقي bundle صغيراً: Server page ي fetch data ويمرّر JSX كـ children لـ Client shell. العكس — Client ي import Server — ممنوع.",
          en: "Correct composition keeps bundles small: Server page fetches data and passes JSX as children to Client shell. Reverse — Client importing Server — is forbidden.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Server wraps Client", en: "Server wraps Client" },
            body: {
              ar: "**Allowed:** Server page imports `<Counter />` Client. **Forbidden:** Client imports Server component directly — bundler error. **Pattern:** `<ClientShell>{serverRenderedChildren}</ClientShell>`.",
              en: "**Allowed:** Server page imports `<Counter />` Client. **Forbidden:** Client imports Server component directly — bundler error. **Pattern:** `<ClientShell>{serverRenderedChildren}</ClientShell>`.",
            },
          },
          {
            title: { ar: "children as slot", en: "children as slot" },
            body: {
              ar: "Client layout receives **Server-rendered children** — interactivity في shell، content static/streamed inside. AlefYa: Client sidebar + Server lesson body.",
              en: "Client layout receives **Server-rendered children** — interactivity in shell, content static/streamed inside. AlefYa: Client sidebar + Server lesson body.",
            },
          },
          {
            title: { ar: "Shared components", en: "Shared components" },
            body: {
              ar: "Pure UI بدون hooks يمكن Server. عند أول hook need — split: `Card.tsx` Server، `CardMenu.tsx` Client. **`import type`** لل sharing types.",
              en: "Pure UI without hooks can stay Server. On first hook need — split: `Card.tsx` Server, `CardMenu.tsx` Client. **`import type`** for shared types.",
            },
          },
          {
            title: { ar: "Anti-patterns", en: "Anti-patterns" },
            body: {
              ar: "**Big bang \"use client\"** on page — loses RSC benefits. **Fetching in useEffect** what Server could fetch. **Prop drilling functions** to Client from Server — impossible.",
              en: "**Big bang \"use client\"** on page — loses RSC benefits. **Fetching in useEffect** what Server could fetch. **Prop drilling functions** to Client from Server — impossible.",
            },
          },
        ],
        codeSource: `// LessonShell.tsx — Client
"use client";

import { useState } from "react";

export function LessonShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)}>Toggle nav</button>
      <h1>{title}</h1>
      {open && children}
    </div>
  );
}

// page.tsx — Server
import { LessonShell } from "./LessonShell";

export default async function Page() {
  const title = "RSC boundaries";
  return (
    <LessonShell title={title}>
      <article>Server-rendered lesson content here</article>
    </LessonShell>
  );
}`,
        faqs: [
          {
            q: { ar: "Client import Server — workaround؟", en: "Client import Server — workaround?" },
            a: {
              ar: "Pass as children/props slots — never direct import.",
              en: "Pass as children/props slots — never direct import.",
            },
          },
          {
            q: { ar: "forwardRef across boundary؟", en: "forwardRef across boundary?" },
            a: {
              ar: "Ref على Client wrapper — children Server OK without ref.",
              en: "Ref on Client wrapper — Server children OK without ref.",
            },
          },
          {
            q: { ar: "Context + Server data؟", en: "Context + Server data?" },
            a: {
              ar: "Pass server data as Provider value prop from Server parent wrapper.",
              en: "Pass server data as Provider value prop from Server parent wrapper.",
            },
          },
          {
            q: { ar: "How to measure bundle?", en: "How to measure bundle?" },
            a: {
              ar: "`@next/bundle-analyzer` — verify Client islands stay small.",
              en: "`@next/bundle-analyzer` — verify Client islands stay small.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: جلب البيانات — fetch، cache، streaming.",
          en: "Next stage: data fetching — fetch, cache, streaming.",
        },
      },
    ],
  ),
  "04-data": stage(
    "04-data",
    4,
    { ar: "جلب البيانات", en: "Data fetching" },
    {
      ar: "fetch caching، Suspense streaming، parallel و sequential",
      en: "fetch caching, Suspense streaming, parallel and sequential",
    },
    [
      {
        slug: "01-fetch-caching",
        order: 1,
        duration: 54,
        title: { ar: "fetch والتخزين المؤقت", en: "fetch and caching" },
        summary: {
          ar: "Extended fetch في Server Components: cache، revalidate، tags.",
          en: "Extended fetch in Server Components: cache, revalidate, tags.",
        },
        focus: {
          ar: "Next.js يوسّع fetch بـ caching semantics — ليس مجرد HTTP client. دروس AlefYa من API أو filesystem تحتاج cache strategy واضحة لتجنب stale أو over-fetch.",
          en: "Next.js extends fetch with caching semantics — not just an HTTP client. AlefYa lessons from API or filesystem need a clear cache strategy to avoid stale or over-fetching.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Default cache", en: "Default cache" },
            body: {
              ar: "في Server Components، **`fetch(url)`** **cached** افتراضياً (force-cache). **`fetch(url, { cache: 'no-store' })`** fresh every request — dashboards. **`next: { revalidate: 60 }`** ISR-like seconds.",
              en: "In Server Components, **`fetch(url)`** is **cached** by default (force-cache). **`fetch(url, { cache: 'no-store' })`** fresh every request — dashboards. **`next: { revalidate: 60 }`** ISR-like seconds.",
            },
          },
          {
            title: { ar: "cache tags", en: "cache tags" },
            body: {
              ar: "**`next: { tags: ['lessons'] }`** — **`revalidateTag('lessons')`** من Server Action/route invalidates. Granular invalidation أفضل من revalidatePath كامل.",
              en: "**`next: { tags: ['lessons'] }`** — **`revalidateTag('lessons')`** from Server Action/route invalidates. Granular invalidation beats full revalidatePath.",
            },
          },
          {
            title: { ar: "unstable_cache", en: "unstable_cache" },
            body: {
              ar: "ل non-fetch sources (fs، db direct): **`unstable_cache(async () => ..., ['key'], { revalidate: 3600 })`**. Same semantics as fetch cache — check docs for stable name.",
              en: "For non-fetch sources (fs, db): **`unstable_cache(async () => ..., ['key'], { revalidate: 3600 })`**. Same semantics as fetch cache — check docs for stable name.",
            },
          },
          {
            title: { ar: "Deduping", en: "Deduping" },
            body: {
              ar: "Same fetch URL in one render tree **deduped** — one network call. Layout + page fetching same lesson = efficient. Different cache options = separate entries.",
              en: "Same fetch URL in one render tree is **deduped** — one network call. Layout + page fetching same lesson = efficient. Different cache options = separate entries.",
            },
          },
        ],
        codeSource: `const API = process.env.API_URL!;

export async function getTrack(slug: string) {
  const res = await fetch(\`\${API}/tracks/\${slug}\`, {
    next: { revalidate: 300, tags: ["tracks", \`track-\${slug}\`] },
  });
  if (!res.ok) throw new Error("Track not found");
  return res.json();
}

export async function getLessonDraft(slug: string) {
  const res = await fetch(\`\${API}/lessons/\${slug}\`, {
    cache: "no-store",
  });
  return res.json();
}`,
        faqs: [
          {
            q: { ar: "fetch في Client Component؟", en: "fetch in Client Component?" },
            a: {
              ar: "لا extended cache — use SWR/React Query أو Server fetch + props.",
              en: "No extended cache — use SWR/React Query or Server fetch + props.",
            },
          },
          {
            q: { ar: "POST fetch cached؟", en: "POST fetch cached?" },
            a: {
              ar: "GET default cached — mutations via Server Actions not fetch POST cache.",
              en: "GET default cached — mutations via Server Actions not fetch POST cache.",
            },
          },
          {
            q: { ar: "dev vs prod cache?", en: "dev vs prod cache?" },
            a: {
              ar: "Dev often no-store feel — test cache in production build.",
              en: "Dev often feels no-store — test cache in production build.",
            },
          },
          {
            q: { ar: "Axios instead?", en: "Axios instead?" },
            a: {
              ar: "Axios bypasses Next fetch cache — wrap with unstable_cache or use fetch.",
              en: "Axios bypasses Next fetch cache — wrap with unstable_cache or use fetch.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: streaming و Suspense.",
          en: "Next: streaming and Suspense.",
        },
      },
      {
        slug: "02-streaming-suspense",
        order: 2,
        duration: 50,
        title: { ar: "Streaming و Suspense", en: "Streaming and Suspense" },
        summary: {
          ar: "إرسال HTML تدريجياً، Suspense boundaries، وloading UX.",
          en: "Incremental HTML, Suspense boundaries, and loading UX.",
        },
        focus: {
          ar: "Streaming يعرض shell سريعاً ومحتوى الدروس البطيء لاحقاً — critical لـ AlefYa حيث markdown طويل أو AI summary يتأخر.",
          en: "Streaming shows a fast shell and slower lesson content later — critical for AlefYa where markdown is long or AI summary is slow.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Streaming SSR", en: "Streaming SSR" },
            body: {
              ar: "Next.js **streams** RSC payload — browser يرى layout فوراً. **Suspense** boundaries = flush points. **`loading.tsx`** = implicit boundary around page.",
              en: "Next.js **streams** RSC payload — browser sees layout immediately. **Suspense** boundaries = flush points. **`loading.tsx`** = implicit boundary around page.",
            },
          },
          {
            title: { ar: "Manual Suspense", en: "Manual Suspense" },
            body: {
              ar: "`<Suspense fallback={<Skeleton />}><SlowPart /></Suspense>` — **SlowPart** async Server Component. Multiple boundaries = staggered reveal.",
              en: "`<Suspense fallback={<Skeleton />}><SlowPart /></Suspense>` — **SlowPart** async Server Component. Multiple boundaries = staggered reveal.",
            },
          },
          {
            title: { ar: "fallback design", en: "fallback design" },
            body: {
              ar: "Skeletons matching layout shift أقل — same dimensions as content. AlefYa lesson: title instant، body skeleton. **aria-busy** for a11y.",
              en: "Skeletons with minimal layout shift — match content dimensions. AlefYa lesson: instant title, body skeleton. **aria-busy** for a11y.",
            },
          },
          {
            title: { ar: "Error + Suspense", en: "Error + Suspense" },
            body: {
              ar: "Error boundary sibling to Suspense — failed slow part لا ي kill fast shell. **`error.tsx`** per route segment.",
              en: "Error boundary sibling to Suspense — failed slow part does not kill fast shell. **`error.tsx`** per route segment.",
            },
          },
        ],
        codeSource: `import { Suspense } from "react";

async function RelatedLessons({ trackSlug }: { trackSlug: string }) {
  await new Promise((r) => setTimeout(r, 800)); // slow source
  const items = await fetchRelated(trackSlug);
  return (
    <ul>{items.map((l) => <li key={l.slug}>{l.title.en}</li>)}</ul>
  );
}

export default function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <section>
      <h1>Track overview — instant</h1>
      <Suspense fallback={<p>Loading related…</p>}>
        <RelatedLessons trackSlug="nextjs" />
      </Suspense>
    </section>
  );
}`,
        faqs: [
          {
            q: { ar: "Suspense in Client?", en: "Suspense in Client?" },
            a: {
              ar: "Client Suspense for lazy() — Server Suspense for async RSC.",
              en: "Client Suspense for lazy() — Server Suspense for async RSC.",
            },
          },
          {
            q: { ar: "waterfall inside Suspense?", en: "waterfall inside Suspense?" },
            a: {
              ar: "Nested serial awaits still waterfall — parallelize (next lesson).",
              en: "Nested serial awaits still waterfall — parallelize (next lesson).",
            },
          },
          {
            q: { ar: "disable streaming?", en: "disable streaming?" },
            a: {
              ar: "Rare — `export const dynamic = 'force-static'` changes behavior.",
              en: "Rare — `export const dynamic = 'force-static'` changes behavior.",
            },
          },
          {
            q: { ar: "SEO streamed content?", en: "SEO streamed content?" },
            a: {
              ar: "Crawlers receive full HTML after stream completes — OK for SEO.",
              en: "Crawlers receive full HTML after stream completes — OK for SEO.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: parallel vs sequential fetching.",
          en: "Next: parallel vs sequential fetching.",
        },
      },
      {
        slug: "03-parallel-sequential",
        order: 3,
        duration: 48,
        title: { ar: "Parallel و Sequential", en: "Parallel and sequential" },
        summary: {
          ar: "Promise.all، waterfalls، preload patterns.",
          en: "Promise.all, waterfalls, and preload patterns.",
        },
        focus: {
          ar: "Waterfalls تقتل TTFB perceived — track page تحتاج track meta + user progress + lesson list: parallelize independent fetches.",
          en: "Waterfalls kill perceived TTFB — a track page needs meta + user progress + lesson list: parallelize independent fetches.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Waterfall anti-pattern", en: "Waterfall anti-pattern" },
            body: {
              ar: "await A then await B in same component = serial. **Fix:** start both promises before await — `const a = fetchA(); const b = fetchB(); await Promise.all([a,b])`.",
              en: "await A then await B in same component = serial. **Fix:** start both promises before await — `const a = fetchA(); const b = fetchB(); await Promise.all([a,b])`.",
            },
          },
          {
            title: { ar: "Component-level parallel", en: "Component-level parallel" },
            body: {
              ar: "Split independent data into **sibling async components** each wrapped in Suspense — implicit parallel. Parent sync، children fetch concurrently.",
              en: "Split independent data into **sibling async components** each wrapped in Suspense — implicit parallel. Sync parent, children fetch concurrently.",
            },
          },
          {
            title: { ar: "Sequential when needed", en: "Sequential when needed" },
            body: {
              ar: "B depends on A id — serial OK. **`preload`** pattern: call sync function starting fetch early from layout، consume in page.",
              en: "B depends on A id — serial OK. **`preload`** pattern: sync function starts fetch early from layout, consume in page.",
            },
          },
          {
            title: { ar: "React cache()", en: "React cache()" },
            body: {
              ar: "**`cache(fn)`** dedupe per-request — same getUser() in layout+page = one call. Different from fetch cache — for db/fs helpers.",
              en: "**`cache(fn)`** dedupes per-request — same getUser() in layout+page = one call. Different from fetch cache — for db/fs helpers.",
            },
          },
        ],
        codeSource: `import { cache } from "react";

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});

export default async function DashboardPage() {
  const userP = getUser("u1");
  const statsP = fetchStats("u1");
  const [user, stats] = await Promise.all([userP, statsP]);
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Completed: {stats.lessonsDone}</p>
    </div>
  );
}`,
        faqs: [
          {
            q: { ar: "Promise.all one fails?", en: "Promise.all one fails?" },
            a: {
              ar: "All reject — use Promise.allSettled or separate error boundaries.",
              en: "All reject — use Promise.allSettled or separate error boundaries.",
            },
          },
          {
            q: { ar: "preload from next/navigation?", en: "preload from next/navigation?" },
            a: {
              ar: "Router prefetch links — data preload via cache() + early call.",
              en: "Router prefetch links — data preload via cache() + early call.",
            },
          },
          {
            q: { ar: "GraphQL batch?", en: "GraphQL batch?" },
            a: {
              ar: "Single query — parallel at schema level; still one round trip.",
              en: "Single query — parallel at schema level; still one round trip.",
            },
          },
          {
            q: { ar: "Measure waterfalls?", en: "Measure waterfalls?" },
            a: {
              ar: "Server timing logs، Vercel analytics، React devtools limited on server.",
              en: "Server timing logs, Vercel analytics, React devtools limited on server.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: Server Actions والـ mutations.",
          en: "Next stage: Server Actions and mutations.",
        },
      },
    ],
  ),
  "05-actions-mutations": stage(
    "05-actions-mutations",
    5,
    { ar: "Actions و Mutations", en: "Actions and mutations" },
    {
      ar: "Server Actions، forms، revalidation",
      en: "Server Actions, forms, and revalidation",
    },
    [
      {
        slug: "01-server-actions",
        order: 1,
        duration: 52,
        title: { ar: "Server Actions", en: "Server Actions" },
        summary: {
          ar: "use server، typed actions، mutations بدون API route منفصل.",
          en: "use server, typed actions, mutations without a separate API route.",
        },
        focus: {
          ar: "Server Actions تجعل POST mutations functions عادية على الخادم — م ideal لـ mark lesson complete أو save notes في AlefYa.",
          en: "Server Actions turn POST mutations into plain server functions — ideal for mark lesson complete or save notes in AlefYa.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "use server", en: "use server" },
            body: {
              ar: "**`\"use server\"`** atop file or inline in Server Component — exports async functions callable from Client via import. Runs **only** on server — secrets safe.",
              en: "**`\"use server\"`** atop file or inline in Server Component — exports async functions callable from Client via import. Runs **only** on server — secrets safe.",
            },
          },
          {
            title: { ar: "Invocation", en: "Invocation" },
            body: {
              ar: "From form **`action={fn}`** or **`onClick={() => fn()}`** with transition. Args must be serializable — use FormData for rich input.",
              en: "From form **`action={fn}`** or **`onClick={() => fn()}`** with transition. Args must be serializable — use FormData for rich input.",
            },
          },
          {
            title: { ar: "Return values", en: "Return values" },
            body: {
              ar: "Return **`{ error, success }`** objects — Client reads via **`useActionState`** (React 19) or **`useFormState`**. Throw for unexpected — caught by error boundary.",
              en: "Return **`{ error, success }`** objects — Client reads via **`useActionState`** (React 19) or **`useFormState`**. Throw for unexpected — caught by error boundary.",
            },
          },
          {
            title: { ar: "Security basics", en: "Security basics" },
            body: {
              ar: "**Auth check inside action** — never trust Client. **Validate** with Zod. **CSRF** — Next handles for same-origin forms. Rate limit sensitive actions.",
              en: "**Auth check inside action** — never trust Client. **Validate** with Zod. **CSRF** — Next handles for same-origin forms. Rate limit sensitive actions.",
            },
          },
        ],
        codeSource: `"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

const Schema = z.object({ slug: z.string(), done: z.coerce.boolean() });

export async function toggleLessonComplete(formData: FormData) {
  const parsed = Schema.safeParse({
    slug: formData.get("slug"),
    done: formData.get("done"),
  });
  if (!parsed.success) return { error: "Invalid input" };

  await db.progress.upsert({
    where: { slug: parsed.data.slug },
    update: { done: parsed.data.done },
    create: parsed.data,
  });

  revalidateTag("progress");
  return { success: true };
}`,
        faqs: [
          {
            q: { ar: "Action vs Route Handler?", en: "Action vs Route Handler?" },
            a: {
              ar: "Actions for form/mutations from UI — Route Handler for webhooks/external API.",
              en: "Actions for form/mutations from UI — Route Handler for webhooks/external API.",
            },
          },
          {
            q: { ar: "Call from Server Component?", en: "Call from Server Component?" },
            a: {
              ar: "Direct await in form action only — not arbitrary call in render.",
              en: "Direct await in form action only — not arbitrary call in render.",
            },
          },
          {
            q: { ar: "File upload?", en: "File upload?" },
            a: {
              ar: "FormData with File — action receives blob server-side.",
              en: "FormData with File — action receives blob server-side.",
            },
          },
          {
            q: { ar: "Edge runtime actions?", en: "Edge runtime actions?" },
            a: {
              ar: "Possible with limits — Node default for db drivers.",
              en: "Possible with limits — Node default for db drivers.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: forms + actions patterns.",
          en: "Next: forms + actions patterns.",
        },
      },
      {
        slug: "02-forms-actions",
        order: 2,
        duration: 50,
        title: { ar: "Forms و Actions", en: "Forms and actions" },
        summary: {
          ar: "progressive enhancement، useFormState، pending UI.",
          en: "Progressive enhancement, useFormState, and pending UI.",
        },
        focus: {
          ar: "Native forms + Server Actions تعمل بدون JS — ثم enhance بـ pending states. نماذج AlefYa (feedback، notes) يجب أن ت degrade gracefully.",
          en: "Native forms + Server Actions work without JS — then enhance with pending states. AlefYa forms (feedback, notes) must degrade gracefully.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Form action", en: "Form action" },
            body: {
              ar: "`<form action={saveNote}>` — Server Action receives **FormData**. **`name`** attributes map to keys. Works without hydration — progressive enhancement.",
              en: "`<form action={saveNote}>` — Server Action receives **FormData**. **`name`** attributes map to keys. Works without hydration — progressive enhancement.",
            },
          },
          {
            title: { ar: "useFormState / useActionState", en: "useFormState / useActionState" },
            body: {
              ar: "Client wrapper: **`const [state, action, pending] = useActionState(fn, initial)`**. Pass **`action`** to form — show **`pending`** spinner. Display **`state.error`** inline.",
              en: "Client wrapper: **`const [state, action, pending] = useActionState(fn, initial)`**. Pass **`action`** to form — show **`pending`** spinner. Display **`state.error`** inline.",
            },
          },
          {
            title: { ar: "useFormStatus", en: "useFormStatus" },
            body: {
              ar: "Child **`SubmitButton`** uses **`useFormStatus()`** — pending from parent form context. Decouple button disabled state from page.",
              en: "Child **`SubmitButton`** uses **`useFormStatus()`** — pending from parent form context. Decouple button disabled state from page.",
            },
          },
          {
            title: { ar: "Client validation", en: "Client validation" },
            body: {
              ar: "HTML **`required`**, **`pattern`** for UX — **server Zod** for truth. Never skip server validation.",
              en: "HTML **`required`**, **`pattern`** for UX — **server Zod** for truth. Never skip server validation.",
            },
          },
        ],
        codeSource: `"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveFeedback } from "./actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function FeedbackForm({ lessonSlug }: { lessonSlug: string }) {
  const [state, action] = useActionState(saveFeedback, { error: null });

  return (
    <form action={action}>
      <input type="hidden" name="slug" value={lessonSlug} />
      <textarea name="body" required minLength={10} />
      {state.error && <p role="alert">{state.error}</p>}
      <SubmitBtn />
    </form>
  );
}`,
        faqs: [
          {
            q: { ar: "Missing useFormStatus import?", en: "Missing useFormStatus import?" },
            a: {
              ar: "import from react-dom — must be inside form subtree.",
              en: "import from react-dom — must be inside form subtree.",
            },
          },
          {
            q: { ar: "reset form on success?", en: "reset form on success?" },
            a: {
              ar: "state.success + key prop remount or form ref reset.",
              en: "state.success + key prop remount or form ref reset.",
            },
          },
          {
            q: { ar: "Multiple buttons?", en: "Multiple buttons?" },
            a: {
              ar: "formAction prop per button — different Server Actions.",
              en: "formAction prop per button — different Server Actions.",
            },
          },
          {
            q: { ar: "React Hook Form?", en: "React Hook Form?" },
            a: {
              ar: "Compatible — submit handler calls action or hidden native submit.",
              en: "Compatible — submit handler calls action or hidden native submit.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: revalidation بعد mutations.",
          en: "Next: revalidation after mutations.",
        },
      },
      {
        slug: "03-revalidation",
        order: 3,
        duration: 46,
        title: { ar: "Revalidation", en: "Revalidation" },
        summary: {
          ar: "revalidatePath، revalidateTag، وon-demand ISR.",
          en: "revalidatePath, revalidateTag, and on-demand ISR.",
        },
        focus: {
          ar: "بعد mark complete أو edit content، UI يجب أن ي reflect بدون hard refresh — revalidation hooks في cache layer.",
          en: "After mark complete or edit content, UI must reflect without hard refresh — revalidation hooks in the cache layer.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "revalidatePath", en: "revalidatePath" },
            body: {
              ar: "**`revalidatePath('/tracks/[slug]', 'page')`** — invalidates cached renders for path. **`layout`** type includes nested. Use after mutations affecting visible page.",
              en: "**`revalidatePath('/tracks/[slug]', 'page')`** — invalidates cached renders for path. **`layout`** type includes nested. Use after mutations affecting visible page.",
            },
          },
          {
            title: { ar: "revalidateTag", en: "revalidateTag" },
            body: {
              ar: "Pair with **`fetch(..., { next: { tags: ['x'] } })`**. One tag invalidates many pages — better for shared lesson lists.",
              en: "Pair with **`fetch(..., { next: { tags: ['x'] } })`**. One tag invalidates many pages — better for shared lesson lists.",
            },
          },
          {
            title: { ar: "router.refresh", en: "router.refresh" },
            body: {
              ar: "Client **`router.refresh()`** re-fetches Server Components — soft refresh without full navigation. After action if not using revalidate in action.",
              en: "Client **`router.refresh()`** re-fetches Server Components — soft refresh without full navigation. After action if not using revalidate in action.",
            },
          },
          {
            title: { ar: "Time-based revalidate", en: "Time-based revalidate" },
            body: {
              ar: "**`export const revalidate = 3600`** route segment config — background revalidation. Combine with on-demand for CMS publish webhooks.",
              en: "**`export const revalidate = 3600`** route segment config — background revalidation. Combine with on-demand for CMS publish webhooks.",
            },
          },
        ],
        codeSource: `"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function publishLesson(slug: string) {
  await cms.publish(slug);
  revalidateTag("lessons");
  revalidatePath(\`/tracks/\${slug}\`);
  revalidatePath("/tracks", "layout");
}

// Route Handler webhook
export async function POST(req: Request) {
  const { slug } = await req.json();
  revalidateTag(\`lesson-\${slug}\`);
  return Response.json({ ok: true });
}`,
        faqs: [
          {
            q: { ar: "Path literal vs dynamic?", en: "Path literal vs dynamic?" },
            a: {
              ar: "Use actual path string — `/tracks/nextjs` not bracket syntax.",
              en: "Use actual path string — `/tracks/nextjs` not bracket syntax.",
            },
          },
          {
            q: { ar: "Stale while revalidate?", en: "Stale while revalidate?" },
            a: {
              ar: "Next serves stale then updates — similar ISR behavior.",
              en: "Next serves stale then updates — similar ISR behavior.",
            },
          },
          {
            q: { ar: "revalidate in middleware?", en: "revalidate in middleware?" },
            a: {
              ar: "No — call from Server Action or Route Handler.",
              en: "No — call from Server Action or Route Handler.",
            },
          },
          {
            q: { ar: "Cache Components future?", en: "Cache Components future?" },
            a: {
              ar: "Watch Next releases — semantics evolve; tags/path remain core.",
              en: "Watch Next releases — semantics evolve; tags/path remain core.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: UI assets — images، metadata، CSS.",
          en: "Next stage: UI assets — images, metadata, CSS.",
        },
      },
    ],
  ),
  "06-ui-assets": stage(
    "06-ui-assets",
    6,
    { ar: "UI و Assets", en: "UI and assets" },
    {
      ar: "next/image، fonts، metadata SEO، Tailwind و CSS Modules",
      en: "next/image, fonts, metadata SEO, Tailwind and CSS Modules",
    },
    [
      {
        slug: "01-images-fonts",
        order: 1,
        duration: 48,
        title: { ar: "Images و Fonts", en: "Images and fonts" },
        summary: {
          ar: "next/image optimization، local/remote images، next/font.",
          en: "next/image optimization, local/remote images, and next/font.",
        },
        focus: {
          ar: "Performance AlefYa يعتمد على صور track cards وخطوط عربية/إنجليزية بدون layout shift — next/image و next/font built-in.",
          en: "AlefYa performance depends on track card images and Arabic/English fonts without layout shift — next/image and next/font are built-in.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "next/image", en: "next/image" },
            body: {
              ar: "**`<Image src width height alt>`** — lazy load، responsive sizes، WebP/AVIF. **Remote:** `images.remotePatterns` in next.config. **`priority`** for LCP hero. **`placeholder=\"blur\"`** with blurDataURL.",
              en: "**`<Image src width height alt>`** — lazy load, responsive sizes, WebP/AVIF. **Remote:** `images.remotePatterns` in next.config. **`priority`** for LCP hero. **`placeholder=\"blur\"`** with blurDataURL.",
            },
          },
          {
            title: { ar: "Sizing", en: "Sizing" },
            body: {
              ar: "Always **`width`/`height`** or **`fill`** with **`sizes`** for responsive. **`className=\"object-cover\"`** in container **`relative`**. Wrong sizes = over-fetch huge images.",
              en: "Always **`width`/`height`** or **`fill`** with **`sizes`** for responsive. **`className=\"object-cover\"`** in **`relative`** container. Wrong sizes = over-fetching huge images.",
            },
          },
          {
            title: { ar: "next/font", en: "next/font" },
            body: {
              ar: "**`import { Inter, Noto_Sans_Arabic } from 'next/font/google'`** — self-host، no layout shift. Export **`variable`** for Tailwind **`font-sans`**. **`subsets: ['arabic','latin']`**.",
              en: "**`import { Inter, Noto_Sans_Arabic } from 'next/font/google'`** — self-hosted, no layout shift. Export **`variable`** for Tailwind **`font-sans`**. **`subsets: ['arabic','latin']`**.",
            },
          },
          {
            title: { ar: "Static import", en: "Static import" },
            body: {
              ar: "`import hero from './hero.png'` — auto width/height. Colocate assets in `app/` or `public/` per use case.",
              en: "`import hero from './hero.png'` — auto width/height. Colocate assets in `app/` or `public/` per use case.",
            },
          },
        ],
        codeSource: `import Image from "next/image";
import { Noto_Sans_Arabic, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-ar" });

export default function TrackCard({ title, cover }: { title: string; cover: string }) {
  return (
    <article className={\`\${inter.variable} \${arabic.variable}\`}>
      <Image
        src={cover}
        alt={title}
        width={640}
        height={360}
        sizes="(max-width:768px) 100vw, 320px"
        className="rounded-lg"
      />
      <h2>{title}</h2>
    </article>
  );
}`,
        faqs: [
          {
            q: { ar: "img vs Image?", en: "img vs Image?" },
            a: {
              ar: "Always Image unless special case — img loses optimization.",
              en: "Always Image unless special case — img loses optimization.",
            },
          },
          {
            q: { ar: "SVG in Image?", en: "SVG in Image?" },
            a: {
              ar: "Often inline `<svg>` or img for SVG — Image skips vector opt.",
              en: "Often inline `<svg>` or img for SVG — Image skips vector opt.",
            },
          },
          {
            q: { ar: "Custom local font?", en: "Custom local font?" },
            a: {
              ar: "next/font/local with src path array.",
              en: "next/font/local with src path array.",
            },
          },
          {
            q: { ar: "CDN images?", en: "CDN images?" },
            a: {
              ar: "Add domain to remotePatterns — required for security.",
              en: "Add domain to remotePatterns — required for security.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: metadata و SEO.",
          en: "Next: metadata and SEO.",
        },
      },
      {
        slug: "02-metadata-seo",
        order: 2,
        duration: 50,
        title: { ar: "Metadata و SEO", en: "Metadata and SEO" },
        summary: {
          ar: "Metadata API، Open Graph، generateMetadata، sitemap.",
          en: "Metadata API, Open Graph, generateMetadata, and sitemap.",
        },
        focus: {
          ar: "دروس AlefYa يجب أن ت index بـ ar/en — Metadata API dynamic per lesson/track بدون react-helmet.",
          en: "AlefYa lessons must index in ar/en — Metadata API dynamic per lesson/track without react-helmet.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Static metadata", en: "Static metadata" },
            body: {
              ar: "**`export const metadata: Metadata`** in layout/page — title، description، openGraph، twitter، robots. **`metadataBase`** in root for absolute OG URLs.",
              en: "**`export const metadata: Metadata`** in layout/page — title, description, openGraph, twitter, robots. Root **`metadataBase`** for absolute OG URLs.",
            },
          },
          {
            title: { ar: "generateMetadata", en: "generateMetadata" },
            body: {
              ar: "Async **`generateMetadata({ params })`** — fetch lesson، return `{ title, description, alternates: { languages } }`. Runs parallel to page when possible.",
              en: "Async **`generateMetadata({ params })`** — fetch lesson, return `{ title, description, alternates: { languages } }`. Runs parallel to page when possible.",
            },
          },
          {
            title: { ar: "alternates و canonical", en: "alternates and canonical" },
            body: {
              ar: "**`alternates.canonical`**, **`languages: { 'ar': '/ar/...', 'en': '/en/...' }`** — hreflang for bilingual SEO.",
              en: "**`alternates.canonical`**, **`languages: { 'ar': '/ar/...', 'en': '/en/...' }`** — hreflang for bilingual SEO.",
            },
          },
          {
            title: { ar: "sitemap و robots", en: "sitemap and robots" },
            body: {
              ar: "**`app/sitemap.ts`** export default function — dynamic URLs from CMS. **`robots.ts`** disallow staging. **`jsonLd`** via script in page optional.",
              en: "**`app/sitemap.ts`** export default function — dynamic URLs from CMS. **`robots.ts`** disallow staging. Optional **`jsonLd`** script in page.",
            },
          },
        ],
        codeSource: `import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  return {
    title: lesson.title.en,
    description: lesson.summary.en,
    openGraph: {
      title: lesson.title.en,
      description: lesson.summary.en,
      type: "article",
    },
    alternates: {
      canonical: \`/en/lessons/\${slug}\`,
      languages: {
        ar: \`/ar/lessons/\${slug}\`,
        en: \`/en/lessons/\${slug}\`,
      },
    },
  };
}`,
        faqs: [
          {
            q: { ar: "metadata in Client Component?", en: "metadata in Client Component?" },
            a: {
              ar: "No — export from Server layout/page only.",
              en: "No — export from Server layout/page only.",
            },
          },
          {
            q: { ar: "title template?", en: "title template?" },
            a: {
              ar: "Root: `title: { template: '%s | AlefYa', default: 'AlefYa' }`.",
              en: "Root: `title: { template: '%s | AlefYa', default: 'AlefYa' }`.",
            },
          },
          {
            q: { ar: "OG image dynamic?", en: "OG image dynamic?" },
            a: {
              ar: "opengraph-image.tsx route — ImageResponse API.",
              en: "opengraph-image.tsx route — ImageResponse API.",
            },
          },
          {
            q: { ar: "noindex draft lessons?", en: "noindex draft lessons?" },
            a: {
              ar: "robots: { index: false } in generateMetadata when draft.",
              en: "robots: { index: false } in generateMetadata when draft.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: CSS Modules و Tailwind.",
          en: "Next: CSS Modules and Tailwind.",
        },
      },
      {
        slug: "03-css-modules-tailwind",
        order: 3,
        duration: 45,
        title: { ar: "CSS Modules و Tailwind", en: "CSS Modules and Tailwind" },
        summary: {
          ar: "globals.css، modules، Tailwind v4 في Next، وdesign tokens.",
          en: "globals.css, modules, Tailwind v4 in Next, and design tokens.",
        },
        focus: {
          ar: "create-next-app يأتي Tailwind-ready — AlefYa design system ي combine utility classes مع CSS variables للـ RTL وdark mode.",
          en: "create-next-app ships Tailwind-ready — AlefYa design system combines utility classes with CSS variables for RTL and dark mode.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Tailwind in Next", en: "Tailwind in Next" },
            body: {
              ar: "**`globals.css`** `@import \"tailwindcss\"` (v4) or directives (v3). **`@theme`** block for tokens — colors، fonts from next/font variables. **`content`** paths include app/components.",
              en: "**`globals.css`** `@import \"tailwindcss\"` (v4) or directives (v3). **`@theme`** block for tokens — colors, fonts from next/font variables. **`content`** paths include app/components.",
            },
          },
          {
            title: { ar: "CSS Modules", en: "CSS Modules" },
            body: {
              ar: "**`Button.module.css`** — `import styles from './Button.module.css'` — scoped classes. Good for complex animations third-party overrides. Coexist with Tailwind via **`className={cn(styles.root, 'flex')}`**.",
              en: "**`Button.module.css`** — scoped classes via import. Good for complex animations. Coexist with Tailwind via **`className={cn(styles.root, 'flex')}`**.",
            },
          },
          {
            title: { ar: "RTL support", en: "RTL support" },
            body: {
              ar: "**`<html dir=\"rtl\">`** — Tailwind **`rtl:`** and **`ltr:`** variants. Logical properties **`ms-`/`me-`** instead of ml/mr. Test both locales.",
              en: "**`<html dir=\"rtl\">`** — Tailwind **`rtl:`** and **`ltr:`** variants. Logical properties **`ms-`/`me-`** instead of ml/mr. Test both locales.",
            },
          },
          {
            title: { ar: "Dark mode", en: "Dark mode" },
            body: {
              ar: "**`class=\"dark\"` on html** — Tailwind **`dark:`** variants. **`prefers-color-scheme`** or Client toggle. AlefYa track accent `#E8E8E8` needs contrast check on dark bg.",
              en: "**`class=\"dark\"` on html** — Tailwind **`dark:`** variants. **`prefers-color-scheme`** or Client toggle. AlefYa track accent `#E8E8E8` needs contrast on dark bg.",
            },
          },
        ],
        codeSource: `// globals.css excerpt
@import "tailwindcss";

@theme {
  --color-track-next: #e8e8e8;
  --font-sans: var(--font-inter), var(--font-ar), system-ui;
}

// LessonCard.tsx
import styles from "./LessonCard.module.css";

export function LessonCard({ title }: { title: string }) {
  return (
    <div className={\`\${styles.card} rounded-xl border p-4 rtl:text-right\`}>
      <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
    </div>
  );
}`,
        faqs: [
          {
            q: { ar: "Tailwind vs styled-components?", en: "Tailwind vs styled-components?" },
            a: {
              ar: "Tailwind default in path — RSC-friendly. CSS-in-JS runtime costly on server.",
              en: "Tailwind default in path — RSC-friendly. CSS-in-JS runtime costly on server.",
            },
          },
          {
            q: { ar: "clsx / tailwind-merge?", en: "clsx / tailwind-merge?" },
            a: {
              ar: "`cn()` helper — standard in shadcn-style stacks.",
              en: "`cn()` helper — standard in shadcn-style stacks.",
            },
          },
          {
            q: { ar: "Import CSS in RSC?", en: "Import CSS in RSC?" },
            a: {
              ar: "Global in layout — modules in component file OK.",
              en: "Global in layout — modules in component file OK.",
            },
          },
          {
            q: { ar: "Purge missing classes?", en: "Purge missing classes?" },
            a: {
              ar: "Dynamic class strings need safelist — prefer full class names.",
              en: "Dynamic class strings need safelist — prefer full class names.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: production — env، auth، deploy.",
          en: "Next stage: production — env, auth, deploy.",
        },
      },
    ],
  ),
  "07-production": stage(
    "07-production",
    7,
    { ar: "Production", en: "Production" },
    {
      ar: "env config، auth patterns، deploy على Vercel",
      en: "env config, auth patterns, deploy on Vercel",
    },
    [
      {
        slug: "01-env-config",
        order: 1,
        duration: 48,
        title: { ar: "Env و Config", en: "Env and config" },
        summary: {
          ar: ".env files، NEXT_PUBLIC_، next.config، runtime vs build time.",
          en: ".env files, NEXT_PUBLIC_, next.config, runtime vs build time.",
        },
        focus: {
          ar: "Secrets و API URLs يجب فصلها بـ env — خطأ شائع: commit .env.local أو expose server keys بـ NEXT_PUBLIC.",
          en: "Secrets and API URLs must use env vars — common mistakes: committing .env.local or exposing server keys via NEXT_PUBLIC.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "Env files", en: "Env files" },
            body: {
              ar: "**`.env.local`** gitignored — secrets. **`.env.development`**, **`.env.production`** — shared non-secret defaults. Load order documented in Next.js env docs.",
              en: "**`.env.local`** gitignored — secrets. **`.env.development`**, **`.env.production`** — shared non-secret defaults. Load order documented in Next.js env docs.",
            },
          },
          {
            title: { ar: "NEXT_PUBLIC_", en: "NEXT_PUBLIC_" },
            body: {
              ar: "Prefix **`NEXT_PUBLIC_`** — inlined in **client bundle**. Never put DB password. **`process.env.API_SECRET`** server-only.",
              en: "Prefix **`NEXT_PUBLIC_`** — inlined in **client bundle**. Never put DB password. **`process.env.API_SECRET`** server-only.",
            },
          },
          {
            title: { ar: "next.config.ts", en: "next.config.ts" },
            body: {
              ar: "**`env`** block legacy — prefer process.env. **`images`**, **`redirects`**, **`headers`**, **`experimental`**. **`serverExternalPackages`** for native modules.",
              en: "**`env`** block legacy — prefer process.env. **`images`**, **`redirects`**, **`headers`**, **`experimental`**. **`serverExternalPackages`** for native modules.",
            },
          },
          {
            title: { ar: "Validation", en: "Validation" },
            body: {
              ar: "**`@t3-oss/env-nextjs`** or Zod at startup — fail build if missing **`DATABASE_URL`**. Document `.env.example` in repo.",
              en: "**`@t3-oss/env-nextjs`** or Zod at startup — fail build if missing **`DATABASE_URL`**. Document `.env.example` in repo.",
            },
          },
        ],
        codeSource: `# .env.example (commit this)
DATABASE_URL=postgresql://localhost:5432/alefya
NEXT_PUBLIC_SITE_URL=http://localhost:3000
AUTH_SECRET=generate-with-openssl

# Server-only — no NEXT_PUBLIC
# lib/env.ts
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export const env = schema.parse(process.env);`,
        faqs: [
          {
            q: { ar: "Env change needs restart?", en: "Env change needs restart?" },
            a: {
              ar: "Dev server restart — production redeploy on Vercel.",
              en: "Dev server restart — production redeploy on Vercel.",
            },
          },
          {
            q: { ar: "Edge env?", en: "Edge env?" },
            a: {
              ar: "Same vars if edge route — some Node APIs unavailable.",
              en: "Same vars if edge route — some Node APIs unavailable.",
            },
          },
          {
            q: { ar: "CI secrets?", en: "CI secrets?" },
            a: {
              ar: "GitHub Actions secrets → Vercel project env.",
              en: "GitHub Actions secrets → Vercel project env.",
            },
          },
          {
            q: { ar: "Read env in Client?", en: "Read env in Client?" },
            a: {
              ar: "Only NEXT_PUBLIC_ at build time — not runtime server secrets.",
              en: "Only NEXT_PUBLIC_ at build time — not runtime server secrets.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: auth patterns.",
          en: "Next: auth patterns.",
        },
      },
      {
        slug: "02-auth-patterns",
        order: 2,
        duration: 55,
        title: { ar: "Auth Patterns", en: "Auth patterns" },
        summary: {
          ar: "Auth.js، middleware protection، session في Server Components.",
          en: "Auth.js, middleware protection, and session in Server Components.",
        },
        focus: {
          ar: "Progress AlefYa وAI Helper يحتاجان user session — auth في App Router = middleware + server session read، ليس client-only JWT in localStorage فقط.",
          en: "AlefYa progress and AI Helper need user sessions — App Router auth = middleware + server session read, not client-only JWT in localStorage alone.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Auth.js (NextAuth v5)", en: "Auth.js (NextAuth v5)" },
            body: {
              ar: "**`auth.ts`** config — providers (Google، credentials). **`handlers`** export for route. **`auth()`** in Server Components/Actions — `const session = await auth()`.",
              en: "**`auth.ts`** config — providers (Google, credentials). **`handlers`** export for route. **`auth()`** in Server Components/Actions — `const session = await auth()`.",
            },
          },
          {
            title: { ar: "middleware", en: "middleware" },
            body: {
              ar: "**`middleware.ts`** — `export default auth((req) => { ... })` — protect `/learn/*`. Matcher config excludes static files. Redirect unauthenticated to login.",
              en: "**`middleware.ts`** — `export default auth((req) => { ... })` — protect `/learn/*`. Matcher config excludes static files. Redirect unauthenticated to login.",
            },
          },
          {
            title: { ar: "Authorization", en: "Authorization" },
            body: {
              ar: "Authentication ≠ authorization — check **`session.user.role`** in Server Action before mutate. **Never** trust Client `isAdmin` prop alone.",
              en: "Authentication ≠ authorization — check **`session.user.role`** in Server Action before mutate. **Never** trust Client `isAdmin` prop alone.",
            },
          },
          {
            title: { ar: "Alternatives", en: "Alternatives" },
            body: {
              ar: "Clerk، Supabase Auth — faster setup. Pattern same: middleware + server session. Roll your own only if requirements extreme.",
              en: "Clerk, Supabase Auth — faster setup. Same pattern: middleware + server session. Roll your own only for extreme requirements.",
            },
          },
        ],
        codeSource: `// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
});

// middleware.ts
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/learn/:path*"],
};

// app/learn/page.tsx
export default async function LearnHome() {
  const session = await auth();
  if (!session) redirect("/login");
  return <p>Welcome {session.user?.name}</p>;
}`,
        faqs: [
          {
            q: { ar: "JWT vs database session?", en: "JWT vs database session?" },
            a: {
              ar: "Auth.js supports both — DB easier revoke; JWT edge-friendly.",
              en: "Auth.js supports both — DB easier revoke; JWT edge-friendly.",
            },
          },
          {
            q: { ar: "auth in Client?", en: "auth in Client?" },
            a: {
              ar: "useSession Client hook — prefer server auth() for data pages.",
              en: "useSession Client hook — prefer server auth() for data pages.",
            },
          },
          {
            q: { ar: "API Route protection?", en: "API Route protection?" },
            a: {
              ar: "await auth() in handler — return 401 if null.",
              en: "await auth() in handler — return 401 if null.",
            },
          },
          {
            q: { ar: "OAuth redirect URL?", en: "OAuth redirect URL?" },
            a: {
              ar: "Register `/api/auth/callback/google` in provider console.",
              en: "Register `/api/auth/callback/google` in provider console.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: deploy على Vercel.",
          en: "Next: deploy on Vercel.",
        },
      },
      {
        slug: "03-deploy-vercel",
        order: 3,
        duration: 50,
        title: { ar: "Deploy على Vercel", en: "Deploy on Vercel" },
        summary: {
          ar: "Git integration، preview deployments، env، domains، monitoring.",
          en: "Git integration, preview deployments, env, domains, and monitoring.",
        },
        focus: {
          ar: "Next.js + Vercel = zero-config default — لكن فهم preview/production branches و env per environment ضروري قبل launch AlefYa capstone.",
          en: "Next.js + Vercel is zero-config default — but preview/production branches and env per environment matter before AlefYa capstone launch.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "Deploy flow", en: "Deploy flow" },
            body: {
              ar: "Connect GitHub repo → **`main`** production، PRs → **preview URLs**. **`vercel --prod`** CLI alternative. Build command **`next build`**, output `.next`.",
              en: "Connect GitHub repo → **`main`** production, PRs → **preview URLs**. **`vercel --prod`** CLI alternative. Build command **`next build`**, output `.next`.",
            },
          },
          {
            title: { ar: "Environment variables", en: "Environment variables" },
            body: {
              ar: "Vercel dashboard — Production / Preview / Development scopes. **`NEXT_PUBLIC_`** available client-side after redeploy.",
              en: "Vercel dashboard — Production / Preview / Development scopes. **`NEXT_PUBLIC_`** available client-side after redeploy.",
            },
          },
          {
            title: { ar: "Domains و HTTPS", en: "Domains and HTTPS" },
            body: {
              ar: "Custom domain DNS → Vercel. Automatic TLS. **`NEXT_PUBLIC_SITE_URL`** match production URL for OG links.",
              en: "Custom domain DNS → Vercel. Automatic TLS. **`NEXT_PUBLIC_SITE_URL`** match production URL for OG links.",
            },
          },
          {
            title: { ar: "Observability", en: "Observability" },
            body: {
              ar: "Vercel Analytics، Speed Insights، Runtime Logs. **`after()`** API for post-response work. Set up error alerting before launch.",
              en: "Vercel Analytics, Speed Insights, Runtime Logs. **`after()`** API for post-response work. Set up error alerting before launch.",
            },
          },
        ],
        codeSource: `# Local production smoke test
npm run build
npm run start

# Deploy CLI (optional)
npm i -g vercel
vercel link
vercel env pull .env.local
vercel --prod

# package.json scripts
# "build": "next build",
# "start": "next start"`,
        faqs: [
          {
            q: { ar: "Build fails on Vercel?", en: "Build fails on Vercel?" },
            a: {
              ar: "Run `npm run build` locally first — fix TS errors. Check Node version in project settings.",
              en: "Run `npm run build` locally first — fix TS errors. Check Node version in project settings.",
            },
          },
          {
            q: { ar: "Serverless limits?", en: "Serverless limits?" },
            a: {
              ar: "Function duration/size limits — long jobs → background queue.",
              en: "Function duration/size limits — long jobs → background queue.",
            },
          },
          {
            q: { ar: "Self-host Docker?", en: "Self-host Docker?" },
            a: {
              ar: "next start in container — you manage scaling/SSL.",
              en: "next start in container — you manage scaling/SSL.",
            },
          },
          {
            q: { ar: "Preview vs production data?", en: "Preview vs production data?" },
            a: {
              ar: "Separate DATABASE_URL for preview — never test migrations on prod.",
              en: "Separate DATABASE_URL for preview — never test migrations on prod.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة الأخيرة: مشروع capstone.",
          en: "Final stage: capstone project.",
        },
      },
    ],
  ),
  "08-project": stage(
    "08-project",
    8,
    { ar: "المشروع", en: "Capstone project" },
    {
      ar: "تصميم، تنفيذ، وتحصين تطبيق تعلّم AlefYa-style",
      en: "Design, implement, and harden an AlefYa-style learning app",
    },
    [
      {
        slug: "01-design",
        order: 1,
        duration: 55,
        title: { ar: "تصميم المشروع", en: "Project design" },
        summary: {
          ar: "Scope، routes map، data model، وMVP features.",
          en: "Scope, routes map, data model, and MVP features.",
        },
        focus: {
          ar: "Capstone = mini AlefYa: tracks list، track detail، lesson reader، progress toggle — wireframes قبل code يمنع rewrite.",
          en: "Capstone = mini AlefYa: tracks list, track detail, lesson reader, progress toggle — wireframes before code prevent rewrite.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "MVP scope", en: "MVP scope" },
            body: {
              ar: "**In:** tracks index، `/tracks/[slug]`، `/tracks/[slug]/lessons/[lessonSlug]`، mark complete، bilingual toggle، auth gate on learn routes. **Out:** payments، admin CMS، AI Helper v2.",
              en: "**In:** tracks index, `/tracks/[slug]`, `/tracks/[slug]/lessons/[lessonSlug]`, mark complete, bilingual toggle, auth gate on learn routes. **Out:** payments, admin CMS, AI Helper v2.",
            },
          },
          {
            title: { ar: "Routes map", en: "Routes map" },
            body: {
              ar: "`(marketing)/` landing، `(learn)/tracks`، dynamic segments، `(auth)/login`. Route groups for layouts. Write URL table before folders.",
              en: "`(marketing)/` landing, `(learn)/tracks`, dynamic segments, `(auth)/login`. Route groups for layouts. Write URL table before folders.",
            },
          },
          {
            title: { ar: "Data model", en: "Data model" },
            body: {
              ar: "**Track**, **Lesson**, **Progress** (userId, lessonSlug, done). JSON files or SQLite/Postgres. **`getTrack(slug)`**, **`getLesson(slug)`** cached.",
              en: "**Track**, **Lesson**, **Progress** (userId, lessonSlug, done). JSON files or SQLite/Postgres. **`getTrack(slug)`**, **`getLesson(slug)`** cached.",
            },
          },
          {
            title: { ar: "UX decisions", en: "UX decisions" },
            body: {
              ar: "RTL default ar، sidebar stage nav، reading width max-w-prose، skeleton loading per lesson. Accessibility: focus order، skip link.",
              en: "RTL default ar, sidebar stage nav, reading width max-w-prose, skeleton loading per lesson. Accessibility: focus order, skip link.",
            },
          },
        ],
        codeSource: `/**
 * Capstone route map (plan before coding)
 *
 * /                     → marketing home
 * /login                → auth
 * /tracks               → all tracks (learn layout)
 * /tracks/[slug]        → track overview + stage list
 * /tracks/[slug]/lessons/[lessonSlug] → lesson reader
 *
 * Server Actions:
 * - toggleLessonComplete(formData)
 *
 * Data:
 * - content/tracks/*.json (or DB)
 * - progress table per user
 */`,
        faqs: [
          {
            q: { ar: "JSON vs DB?", en: "JSON vs DB?" },
            a: {
              ar: "JSON faster MVP — DB if auth progress required persistent multi-device.",
              en: "JSON faster MVP — DB if auth progress required persistent multi-device.",
            },
          },
          {
            q: { ar: "How long for MVP?", en: "How long for MVP?" },
            a: {
              ar: "15–25 hours after this path — split across design/implement/harden lessons.",
              en: "15–25 hours after this path — split across design/implement/harden lessons.",
            },
          },
          {
            q: { ar: "Figma required?", en: "Figma required?" },
            a: {
              ar: "Paper wireframe OK — one screen flow documented.",
              en: "Paper wireframe OK — one screen flow documented.",
            },
          },
          {
            q: { ar: "Copy AlefYa content?", en: "Copy AlefYa content?" },
            a: {
              ar: "Use 1–2 sample tracks you author — or import JSON structure only.",
              en: "Use 1–2 sample tracks you author — or import JSON structure only.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: التنفيذ — بناء vertical slice.",
          en: "Next: implementation — build a vertical slice.",
        },
      },
      {
        slug: "02-implement",
        order: 2,
        duration: 55,
        title: { ar: "تنفيذ المشروع", en: "Project implementation" },
        summary: {
          ar: "Vertical slice: track list → lesson page → Server Action progress.",
          en: "Vertical slice: track list → lesson page → Server Action progress.",
        },
        focus: {
          ar: "ابنِ end-to-end path واحد قبل polish الكل — tracks index → lesson → mark complete → revalidate — يثبت every pattern من المسار.",
          en: "Build one end-to-end path before polishing everything — tracks index → lesson → mark complete → revalidate — proves every pattern from the path.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Vertical slice", en: "Vertical slice" },
            body: {
              ar: "Day 1: layouts + tracks list static. Day 2: dynamic lesson page + markdown render Server-side. Day 3: auth + progress action + revalidateTag. Then expand tracks.",
              en: "Day 1: layouts + static tracks list. Day 2: dynamic lesson page + Server markdown. Day 3: auth + progress action + revalidateTag. Then expand tracks.",
            },
          },
          {
            title: { ar: "Content layer", en: "Content layer" },
            body: {
              ar: "**`lib/content.ts`** — `getTracks()`, `getLesson(slug)` with unstable_cache or fs read. Types **`Bilingual`**, **`Lesson`**. Single import point for pages.",
              en: "**`lib/content.ts`** — `getTracks()`, `getLesson(slug)` with unstable_cache or fs read. Types **`Bilingual`**, **`Lesson`**. Single import point for pages.",
            },
          },
          {
            title: { ar: "Components split", en: "Components split" },
            body: {
              ar: "Server: **`LessonBody`**, **`TrackGrid`**. Client: **`LocaleSwitcher`**, **`CompleteButton`**, **`SidebarNav`**. Keep Client leaves small.",
              en: "Server: **`LessonBody`**, **`TrackGrid`**. Client: **`LocaleSwitcher`**, **`CompleteButton`**, **`SidebarNav`**. Keep Client leaves small.",
            },
          },
          {
            title: { ar: "Git discipline", en: "Git discipline" },
            body: {
              ar: "Feature branches، PR preview on Vercel، `npm run build` before merge. Conventional commits optional but helpful.",
              en: "Feature branches, PR preview on Vercel, `npm run build` before merge. Conventional commits optional but helpful.",
            },
          },
        ],
        codeSource: `// app/(learn)/tracks/page.tsx
import { getTracks } from "@/lib/content";
import { TrackCard } from "@/components/TrackCard";

export default async function TracksPage() {
  const tracks = await getTracks();
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {tracks.map((t) => (
        <TrackCard key={t.slug} track={t} />
      ))}
    </ul>
  );
}

// components/CompleteButton.tsx — Client + form action
"use client";
import { toggleLessonComplete } from "@/app/actions/progress";

export function CompleteButton({ slug, done }: { slug: string; done: boolean }) {
  return (
    <form action={toggleLessonComplete}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="done" value={String(!done)} />
      <button type="submit">{done ? "Completed ✓" : "Mark complete"}</button>
    </form>
  );
}`,
        faqs: [
          {
            q: { ar: "MDX for lessons?", en: "MDX for lessons?" },
            a: {
              ar: "Optional — JSON markdown string + react-markdown Server OK for MVP.",
              en: "Optional — JSON markdown string + react-markdown Server OK for MVP.",
            },
          },
          {
            q: { ar: "Stuck on auth?", en: "Stuck on auth?" },
            a: {
              ar: "Mock session dev-only — swap Auth.js when ready.",
              en: "Mock session dev-only — swap Auth.js when ready.",
            },
          },
          {
            q: { ar: "Type errors content?", en: "Type errors content?" },
            a: {
              ar: "Zod parse JSON at load — fail build on bad content.",
              en: "Zod parse JSON at load — fail build on bad content.",
            },
          },
          {
            q: { ar: "Parallel features?", en: "Parallel features?" },
            a: {
              ar: "Finish slice first — then locale، then SEO polish.",
              en: "Finish slice first — then locale, then SEO polish.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: harden — tests، a11y، performance audit.",
          en: "Next: harden — tests, a11y, performance audit.",
        },
      },
      {
        slug: "03-harden",
        order: 3,
        duration: 52,
        title: { ar: "تحصين المشروع", en: "Harden the project" },
        summary: {
          ar: "Build CI، Lighthouse، error handling، security checklist.",
          en: "Build CI, Lighthouse, error handling, and security checklist.",
        },
        focus: {
          ar: "Shippable = build green، Core Web Vitals acceptable، auth enforced، errors graceful — ليس feature-complete فقط.",
          en: "Shippable means green build, acceptable Core Web Vitals, enforced auth, graceful errors — not just feature-complete.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "CI pipeline", en: "CI pipeline" },
            body: {
              ar: "GitHub Action: **`npm ci`**, **`npm run lint`**, **`npm run build`**. Block merge on fail. Optional Playwright smoke: home + tracks load.",
              en: "GitHub Action: **`npm ci`**, **`npm run lint`**, **`npm run build`**. Block merge on fail. Optional Playwright smoke: home + tracks load.",
            },
          },
          {
            title: { ar: "Performance audit", en: "Performance audit" },
            body: {
              ar: "Lighthouse on lesson page — LCP image priority، font subsetting، reduce Client JS. Vercel Speed Insights production data.",
              en: "Lighthouse on lesson page — LCP image priority, font subsetting, reduce Client JS. Vercel Speed Insights production data.",
            },
          },
          {
            title: { ar: "Security checklist", en: "Security checklist" },
            body: {
              ar: "Auth on mutations، Zod validate، CSP headers optional، no secrets in client، rate limit login action. **`robots`** noindex staging.",
              en: "Auth on mutations, Zod validate, optional CSP headers, no client secrets, rate limit login action. **`robots`** noindex staging.",
            },
          },
          {
            title: { ar: "Launch readiness", en: "Launch readiness" },
            body: {
              ar: "Custom domain، production env، error monitoring، README deploy docs، demo script 3 min for portfolio.",
              en: "Custom domain, production env, error monitoring, README deploy docs, 3-minute demo script for portfolio.",
            },
          },
        ],
        codeSource: `# .github/workflows/ci.yml (minimal)
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build

# Pre-launch manual checklist:
# [ ] npm run build passes
# [ ] Lighthouse performance > 85 on lesson page
# [ ] Auth blocks /learn without session
# [ ] NEXT_PUBLIC_SITE_URL correct in production`,
        faqs: [
          {
            q: { ar: "E2E required?", en: "E2E required?" },
            a: {
              ar: "One smoke test impressive — not full coverage for capstone.",
              en: "One smoke test impressive — not full coverage for capstone.",
            },
          },
          {
            q: { ar: "a11y tools?", en: "a11y tools?" },
            a: {
              ar: "axe DevTools + keyboard-only navigation test.",
              en: "axe DevTools + keyboard-only navigation test.",
            },
          },
          {
            q: { ar: "What if Lighthouse low?", en: "What if Lighthouse low?" },
            a: {
              ar: "Fix LCP first — images/fonts — then TBT Client JS.",
              en: "Fix LCP first — images/fonts — then TBT Client JS.",
            },
          },
          {
            q: { ar: "After capstone?", en: "After capstone?" },
            a: {
              ar: "Add CMS، AI Helper، or mobile PWA — you have the base.",
              en: "Add CMS, AI Helper, or mobile PWA — you have the base.",
            },
          },
        ],
        nextHint: {
          ar: "أكملت مسار Next.js — راجع مشروعك، انشره، وأضفه لمحفظتك.",
          en: "You finished the Next.js track — review, deploy, and add it to your portfolio.",
        },
      },
    ],
  ),
};
