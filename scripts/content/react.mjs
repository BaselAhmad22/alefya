import { stage } from "./expand.mjs";

export const reactTrack = {
  slug: "react",
  order: 3,
  title: { ar: "React", en: "React" },
  tagline: {
    ar: "من المكوّنات حتى تطبيق واجهة حديث",
    en: "From components to a modern UI app",
  },
  description: {
    ar: "مسار مرتّب لـ React: JavaScript الحديث، JSX، الحالة، الـ Hooks، التوجيه، جلب البيانات، الأنماط، ثم مشروع تطبيقي. كل درس عميق عربي/إنجليزي داخل ألف ياء.",
    en: "An ordered React path: modern JS, JSX, state, Hooks, routing, data fetching, patterns, then a capstone. Every lesson is deep bilingual content inside AlefYa.",
  },
  color: "#61DAFB",
  estimatedHours: 100,
  stages: [
    "01-js-for-react",
    "02-fundamentals",
    "03-state-props",
    "04-hooks",
    "05-routing",
    "06-data-forms",
    "07-patterns",
    "08-project",
  ],
};

export const reactStages = {
  "01-js-for-react": stage(
    "01-js-for-react",
    1,
    { ar: "JavaScript لـ React", en: "JavaScript for React" },
    {
      ar: "الوحدات، الثبات، دوال المصفوفات، async، وdestructuring — قبل JSX.",
      en: "Modules, immutability, array methods, async, and destructuring — before JSX.",
    },
    [
      {
        slug: "01-modules-immutability",
        order: 1,
        duration: 45,
        title: { ar: "الوحدات والثبات", en: "Modules & immutability" },
        summary: {
          ar: "ES modules ولماذا React يتوقع أن لا تُعدّل الكائنات والمصفوفات مباشرة.",
          en: "ES modules and why React expects you not to mutate objects and arrays in place.",
        },
        focus: {
          ar: "React يعتمد على مقارنة مراجع (reference equality) لاكتشاف التغيير. إذا عدّلت state أو props بالمكان (mutation) قد لا يعيد React الرسم أو يصبح السلوك غير متوقع.",
          en: "React relies on reference equality to detect change. If you mutate state or props in place, React may skip re-rendering or behave unpredictably.",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "ES Modules في مشروع Vite", en: "ES modules in a Vite project" },
            body: {
              ar: "في React الحديث تستخدم import/export بدل script globals. export default للمكوّن الرئيسي وexport named للدوال المساعدة. Vite يحلّ الاعتماديات ويُعيد البناء عند الحفظ (HMR). فصل الملفات يجعل كل مكوّن مسؤولية واحدة — أسهل للاختبار وإعادة الاستخدام.",
              en: "Modern React uses import/export instead of global scripts. export default for the main component and named exports for helpers. Vite resolves dependencies and hot-reloads on save (HMR). Splitting files gives each component a single responsibility — easier to test and reuse.",
            },
          },
          {
            title: { ar: "لماذا Immutability؟", en: "Why immutability?" },
            body: {
              ar: "عند setState أو setItems، React يقارن المرجع القديم بالجديد. items.push(x) يبقي نفس المرجع — React يظن أن لا شيء تغيّر. الحل: spread [...items, x] أو map/filter لإنتاج مصفوفة جديدة. نفس المنطق للكائنات: { ...user, name: 'Ali' } بدل user.name = 'Ali'.",
              en: "On setState or setItems, React compares old and new references. items.push(x) keeps the same reference — React thinks nothing changed. Fix with spread [...items, x] or map/filter for a new array. Same for objects: { ...user, name: 'Ali' } instead of user.name = 'Ali'.",
            },
          },
          {
            title: { ar: "نسخ سطحية vs عميقة", en: "Shallow vs deep copy" },
            body: {
              ar: "Spread ينسخ المستوى الأول فقط. إذا state فيه nested object، عدّل الداخلية بـ spread متداخل: { ...state, profile: { ...state.profile, city: 'Riyadh' } }. للبيانات العميقة جداً استخدم structuredClone — لكن في معظم واجهات React، shallow copy كافٍ إذا صمّمت state مسطحاً.",
              en: "Spread copies only the first level. If state has nested objects, update inner fields with nested spread: { ...state, profile: { ...state.profile, city: 'Riyadh' } }. For very deep data use structuredClone — but for most UIs, shallow copy suffices if you keep state reasonably flat.",
            },
          },
          {
            title: { ar: "const مع React", en: "const and React" },
            body: {
              ar: "const يمنع إعادة تعيين المتغير لا محتواه. const [items, setItems] = useState([]) — items ثابت المرجع حتى setItems. لا تكتب items = [...] مباشرة؛ استخدم setter. هذا يربط immutability بقواعد Hooks من البداية.",
              en: "const blocks reassignment, not mutation of contents. const [items, setItems] = useState([]) — the items reference is fixed until setItems. Never write items = [...] directly; use the setter. This ties immutability to Hook rules from day one.",
            },
          },
        ],
        codeSource: `// utils/lessonHelpers.js
export function cloneLesson(lesson) {
  return { ...lesson, title: { ...lesson.title } };
}

export function addLesson(list, lesson) {
  return [...list, lesson];
}

// Wrong: list.push(lesson) — same reference, React won't detect change
// Right: return a new array`,
        codeExplain: {
          ar: "cloneLesson وaddLesson يوضحان spread للكائنات والمصفوفات — نفس النمط داخل setState.",
          en: "cloneLesson and addLesson demonstrate spread for objects and arrays — the same pattern inside setState.",
        },
        faqs: [
          {
            q: { ar: "هل React يمنع mutation بالقوة؟", en: "Does React forbid mutation by force?" },
            a: {
              ar: "لا — JavaScript يسمح بالتعديل. لكن React لا يضمن إعادة الرسم إذا غيّرت المرجع نفسه. اتبع immutability لسلوك متوقع.",
              en: "No — JavaScript allows mutation. But React does not guarantee re-renders if you keep the same reference. Follow immutability for predictable behavior.",
            },
          },
          {
            q: { ar: "متى أستخدم structuredClone؟", en: "When should I use structuredClone?" },
            a: {
              ar: "عند نسخ كائنات متداخلة بعمق قبل التعديل. في forms بسيطة، spread كافٍ.",
              en: "When cloning deeply nested objects before editing. For simple forms, spread is enough.",
            },
          },
          {
            q: { ar: "default vs named export؟", en: "default vs named export?" },
            a: {
              ar: "default للمكوّن الرئيسي في الملف؛ named للدوال المشتركة. named exports أسهل لإعادة التسمية في IDE.",
              en: "default for the file's main component; named for shared utilities. Named exports rename cleanly in the IDE.",
            },
          },
          {
            q: { ar: "هل immutability يبطّئ التطبيق؟", en: "Does immutability slow apps down?" },
            a: {
              ar: "نسخ arrays صغيرة سريعة. React ي optimize diffing. للقوائم الضخمة استخدم virtualization لاحقاً.",
              en: "Copying small arrays is fast. React optimizes diffing. For huge lists use virtualization later.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: map وfilter وreduce — أسلوب React لعرض القوائم.",
          en: "Next: map, filter, and reduce — React's style for rendering lists.",
        },
      },
      {
        slug: "02-array-methods",
        order: 2,
        duration: 48,
        title: { ar: "دوال المصفوفات", en: "Array methods" },
        summary: {
          ar: "map وfilter وreduce وfind — تحويل البيانات قبل عرضها في JSX.",
          en: "map, filter, reduce, and find — transforming data before rendering in JSX.",
        },
        focus: {
          ar: "React لا يملك template loops — تعرض القوائم بـ array.map داخل JSX. filter وreduce تبني derived data بدون state زائد.",
          en: "React has no template loops — you render lists with array.map inside JSX. filter and reduce build derived data without extra state.",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "map للعرض", en: "map for rendering" },
            body: {
              ar: "items.map(item => <li key={item.id}>{item.title.ar}</li>) — map يرجع مصفوفة عناصر React. key يجب أن يكون stable unique id لا index إن أمكن. map لا يعدّل الأصل؛ ينتج JSX جديد كل render.",
              en: "items.map(item => <li key={item.id}>{item.title.ar}</li>) — map returns an array of React elements. key should be a stable unique id, not index when possible. map does not mutate the source; it produces new JSX each render.",
            },
          },
          {
            title: { ar: "filter للقوائم المفلترة", en: "filter for filtered lists" },
            body: {
              ar: "const visible = lessons.filter(l => !l.completed) — اعرض visible.map بدل تخزين نسختين في state. derived data من props/state يقلل desync. في search box: filter by title.includes(query).",
              en: "const visible = lessons.filter(l => !l.completed) — render visible.map instead of storing two copies in state. Derived data from props/state reduces desync. In a search box: filter by title.includes(query).",
            },
          },
          {
            title: { ar: "reduce للتجميع", en: "reduce for aggregation" },
            body: {
              ar: "tracks.reduce((acc, t) => acc + t.estimatedHours, 0) لمجموع الساعات. reduce يبني object maps: lessons.reduce((m, l) => ({ ...m, [l.slug]: l }), {}). مفيد قبل Context أو selectors.",
              en: "tracks.reduce((acc, t) => acc + t.estimatedHours, 0) for total hours. reduce builds object maps: lessons.reduce((m, l) => ({ ...m, [l.slug]: l }), {}). Useful before Context or selectors.",
            },
          },
          {
            title: { ar: "find وsome وevery", en: "find, some, and every" },
            body: {
              ar: "find يرجع عنصراً واحداً أو undefined — مثالي selectedLesson. some/every للتحقق: lessons.some(l => l.slug === id). استخدمها في handlers قبل setState.",
              en: "find returns one item or undefined — ideal for selectedLesson. some/every for checks: lessons.some(l => l.slug === id). Use in handlers before setState.",
            },
          },
        ],
        codeSource: `const lessons = [
  { id: "1", slug: "01-hooks", title: { ar: "Hooks", en: "Hooks" }, done: false },
  { id: "2", slug: "02-state", title: { ar: "State", en: "State" }, done: true },
];

const pending = lessons.filter((l) => !l.done);
const titles = pending.map((l) => l.title.en);
const totalDone = lessons.filter((l) => l.done).length;

// In JSX: pending.map(l => <LessonRow key={l.id} lesson={l} />)`,
        codeExplain: {
          ar: "filter ثم map — pipeline شائع: state واحد، عرض مشتق.",
          en: "filter then map — common pipeline: one state, derived display.",
        },
        faqs: [
          {
            q: { ar: "لماذا لا for loop في JSX؟", en: "Why not a for loop in JSX?" },
            a: {
              ar: "JSX يقبل expressions فقط. map expression يُرجع array React elements. for loops are statements.",
              en: "JSX accepts expressions only. map returns an array of React elements. for loops are statements.",
            },
          },
          {
            q: { ar: "هل index كـ key مقبول؟", en: "Is index as key acceptable?" },
            a: {
              ar: "فقط للقوائم الثابتة التي لا تُ reorder. للقوائم الديناميكية استخدم id.",
              en: "Only for static lists that never reorder. For dynamic lists use id.",
            },
          },
          {
            q: { ar: "reduce vs useMemo؟", en: "reduce vs useMemo?" },
            a: {
              ar: "reduce يحسب القيمة. useMemo ي cache النتيجة بين renders — نتعلمه في performance.",
              en: "reduce computes the value. useMemo caches between renders — covered in performance.",
            },
          },
          {
            q: { ar: "هل chain map.filter.map بطيء؟", en: "Is chaining map.filter.map slow?" },
            a: {
              ar: "لآلاف العناصر قد تحتاج memoization. للواجهات العادية clarity أهم.",
              en: "For thousands of items you may memoize. For typical UIs clarity wins.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Promises وasync/await لجلب البيانات.",
          en: "Next: Promises and async/await for fetching data.",
        },
      },
      {
        slug: "03-async-promises",
        order: 3,
        duration: 50,
        title: { ar: "Async وPromises", en: "Async & Promises" },
        summary: {
          ar: "Promises وasync/await — كيف تتعامل React مع العمليات غير المتزامنة قبل useEffect.",
          en: "Promises and async/await — how React handles asynchronous work before useEffect.",
        },
        focus: {
          ar: "جلب الدروس من API لا يحدث فوراً. Promise يمثل نتيجة مستقبلية؛ async/await يجعل الكود linear.",
          en: "Fetching lessons from an API is not instant. A Promise represents a future result; async/await keeps code linear.",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "Promise basics", en: "Promise basics" },
            body: {
              ar: "fetch(url) يرجع Promise<Response>. .then(res => res.json()) يرجع Promise<data>. .catch(err) للأخطاء. Promise.all([p1,p2]) ينتظر الكل — مفيد لتحميل track + lessons معاً.",
              en: "fetch(url) returns Promise<Response>. .then(res => res.json()) returns Promise<data>. .catch(err) handles errors. Promise.all([p1,p2]) waits for all — useful loading track + lessons together.",
            },
          },
          {
            title: { ar: "async/await", en: "async/await" },
            body: {
              ar: "async function load() { const res = await fetch(url); if (!res.ok) throw new Error(res.status); return res.json(); } — await يوقف الدالة حتى ينتهي fetch دون blocking UI thread. try/catch بدل .catch.",
              en: "async function load() { const res = await fetch(url); if (!res.ok) throw new Error(res.status); return res.json(); } — await pauses the function until fetch completes without blocking the UI thread. try/catch replaces .catch.",
            },
          },
          {
            title: { ar: "لا async في render", en: "No async in render" },
            body: {
              ar: "function App() { await fetch(...) } /* invalid */ — render يجب أن يكون pure وسريع. async يجعل المكوّن Promise. ضع await داخل useEffect أو onClick handler.",
              en: "function App() { await fetch(...) } /* invalid */ — render must be pure and fast. async makes the component a Promise. Put await inside useEffect or onClick handlers.",
            },
          },
          {
            title: { ar: "AbortController", en: "AbortController" },
            body: {
              ar: "const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal }); return () => ctrl.abort(); — يلغي fetch عند unmount. ستربطه بـ useEffect cleanup.",
              en: "const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal }); return () => ctrl.abort(); — cancels fetch on unmount. You will wire this to useEffect cleanup.",
            },
          },
        ],
        codeSource: `async function fetchLesson(slug) {
  const res = await fetch(\`/api/lessons/\${slug}\`);
  if (!res.ok) {
    throw new Error(\`HTTP \${res.status}\`);
  }
  return res.json();
}

fetchLesson("01-hooks")
  .then((data) => console.log(data.title))
  .catch((err) => console.error(err.message));`,
        codeExplain: {
          ar: "fetchLesson pattern — نفس المنطق داخل useEffect لاحقاً.",
          en: "fetchLesson pattern — same logic inside useEffect later.",
        },
        faqs: [
          {
            q: { ar: "fetch vs axios؟", en: "fetch vs axios?" },
            a: {
              ar: "fetch مدمج في المتصفح. axios interceptors وtimeouts — اختياري. المسار يستخدم fetch.",
              en: "fetch is built into browsers. axios adds interceptors/timeouts — optional. This track uses fetch.",
            },
          },
          {
            q: { ar: "لماذا res.ok؟", en: "Why check res.ok?" },
            a: {
              ar: "fetch لا يرمي على 404. تحقق من res.ok أو status قبل json().",
              en: "fetch does not throw on 404. Check res.ok or status before json().",
            },
          },
          {
            q: { ar: "Promise.all vs allSettled؟", en: "Promise.all vs allSettled?" },
            a: {
              ar: "all يفشل إذا فشل واحد. allSettled ينتظر الكل — dashboards.",
              en: "all fails if one fails. allSettled waits for all — useful for dashboards.",
            },
          },
          {
            q: { ar: "هل await في onClick مسموح؟", en: "Is await in onClick allowed?" },
            a: {
              ar: "نعم — handler async function. عالج loading/error في state.",
              en: "Yes — async handler. Handle loading/error in state.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: destructuring لـ props و state.",
          en: "Next: destructuring for props and state.",
        },
      },
      {
        slug: "04-destructuring",
        order: 4,
        duration: 42,
        title: { ar: "Destructuring", en: "Destructuring" },
        summary: {
          ar: "فك props و state و hooks باختصار — syntax يظهر في كل ملف React.",
          en: "Unpack props, state, and hooks concisely — syntax that appears in every React file.",
        },
        focus: {
          ar: "function Component({ title, onSave }) أقصر من props.title. array destructuring مع useState: const [count, setCount] = useState(0).",
          en: "function Component({ title, onSave }) beats props.title everywhere. Array destructuring with useState: const [count, setCount] = useState(0).",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "Object destructuring في props", en: "Object destructuring in props" },
            body: {
              ar: "function LessonCard({ lesson, locale = 'ar', onComplete }) — defaults في parameter. rename: { title: lessonTitle }. nested: { title: { ar } } للعناوين ثنائية اللغة.",
              en: "function LessonCard({ lesson, locale = 'ar', onComplete }) — defaults in parameters. Rename: { title: lessonTitle }. Nested: { title: { ar } } for bilingual titles.",
            },
          },
          {
            title: { ar: "Array destructuring", en: "Array destructuring" },
            body: {
              ar: "const [first, ...rest] = items; const [value, setValue] = useState(''); skip: const [, setOnly] = useState(0). swap: [a, b] = [b, a].",
              en: "const [first, ...rest] = items; const [value, setValue] = useState(''); skip: const [, setOnly] = useState(0). swap: [a, b] = [b, a].",
            },
          },
          {
            title: { ar: "Rest في parameters", en: "Rest in parameters" },
            body: {
              ar: "function Button({ children, variant, ...domProps }) — مرّر domProps لـ <button {...domProps}>. pattern شائع لـ wrapper components.",
              en: "function Button({ children, variant, ...domProps }) — pass domProps to <button {...domProps}>. Common wrapper component pattern.",
            },
          },
          {
            title: { ar: "Destructuring في return", en: "Destructuring in return" },
            body: {
              ar: "useLesson() يرجع { data, loading, error } — const { data, loading } = useLesson(slug). optional chaining: data?.title?.ar.",
              en: "useLesson() returns { data, loading, error } — const { data, loading } = useLesson(slug). Optional chaining: data?.title?.ar.",
            },
          },
        ],
        codeSource: `function LessonRow({ lesson, locale = "en", onToggle }) {
  const { slug, duration, title } = lesson;
  const label = title[locale];
  return { slug, label, duration, onToggle };
}

// useState returns array — destructure it
// const [query, setQuery] = useState("");
const { ar, en } = { ar: "مرحبا", en: "Hello" };`,
        codeExplain: {
          ar: "LessonRow parameters — نفس الشكل في JSX components.",
          en: "LessonRow parameters — same shape in JSX components.",
        },
        faqs: [
          {
            q: { ar: "هل destructuring يبطّئ؟", en: "Does destructuring slow things down?" },
            a: {
              ar: "فرق negligible. readability worth it.",
              en: "Negligible difference. Readability is worth it.",
            },
          },
          {
            q: { ar: "متى لا أفك props؟", en: "When not to destructure props?" },
            a: {
              ar: "إذا مرّرت props كاملة لchild: <Child {...props} />.",
              en: "When passing entire props to child: <Child {...props} />.",
            },
          },
          {
            q: { ar: "default vs defaultProps؟", en: "default vs defaultProps?" },
            a: {
              ar: "defaults في parameters هي الأسلوب الحديث لل function components.",
              en: "Parameter defaults are modern for function components.",
            },
          },
          {
            q: { ar: "optional chaining؟", en: "Optional chaining?" },
            a: {
              ar: "user?.profile?.name يمنع crash إذا user null أثناء loading.",
              en: "user?.profile?.name prevents crash when user is null during loading.",
            },
          },
        ],
        nextHint: {
          ar: "انتهت مرحلة JS — التالي: ما هو React؟",
          en: "JS stage done — next: what is React?",
        },
      },
    ],
  ),

  "02-fundamentals": stage(
    "02-fundamentals",
    2,
    { ar: "أساسيات React", en: "React fundamentals" },
    {
      ar: "ما هو React، JSX، المكوّنات، وآلية الرسم.",
      en: "What React is, JSX, components, and rendering.",
    },
    [
      {
        slug: "01-what-is-react",
        order: 1,
        duration: 45,
        title: { ar: "ما هو React؟", en: "What is React?" },
        summary: {
          ar: "مكتبة واجهة declarative — مكوّنات، Virtual DOM، و ecosystem.",
          en: "A declarative UI library — components, Virtual DOM, and ecosystem.",
        },
        focus: {
          ar: "React ليس framework كامل — إنه طبقة UI. تختار routing وdata fetching لاحقاً. فهم declarative vs imperative يغيّر طريقة تصميم الشاشات.",
          en: "React is not a full framework — it is a UI layer. You choose routing and data fetching later. Understanding declarative vs imperative changes how you design screens.",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "Declarative UI", en: "Declarative UI" },
            body: {
              ar: "تصف ماذا تريد على الشاشة عندما تكون البيانات X: return <LessonList lessons={done} />. React يحدد كيف يحدّث DOM. imperative: document.querySelector ثم appendChild — صعب مع state معقد.",
              en: "You describe what the screen should show when data is X: return <LessonList lessons={done} />. React figures out how to update the DOM. Imperative: document.querySelector then appendChild — hard with complex state.",
            },
          },
          {
            title: { ar: "Virtual DOM و Reconciliation", en: "Virtual DOM & reconciliation" },
            body: {
              ar: "React يبني tree من objects (elements) في الذاكرة. عند تغيّر state، يقارن tree جديد بقديم (diffing) ويحدّث DOM الحقيقي بالحد الأدنى. هذا يجعل updates سريعة دون كتابة DOM يدوياً.",
              en: "React builds a tree of objects (elements) in memory. When state changes, it diffs the new tree against the old and updates the real DOM minimally. This keeps updates fast without manual DOM code.",
            },
          },
          {
            title: { ar: "React vs React DOM", en: "React vs React DOM" },
            body: {
              ar: "package react: createElement، Hooks، Component logic. react-dom: createRoot، render للمتصفح. React Native يستخدم react-native renderer — نفس mental model.",
              en: "package react: createElement, Hooks, component logic. react-dom: createRoot, render for browsers. React Native uses a react-native renderer — same mental model.",
            },
          },
          {
            title: { ar: "Ecosystem", en: "Ecosystem" },
            body: {
              ar: "Vite للبناء، React Router للتوجيه، TanStack Query للبيانات — اختيارات شائعة. المسار يبني تدريجياً: JSX → state → hooks → router → fetch → project.",
              en: "Vite for bundling, React Router for routing, TanStack Query for data — common choices. This path builds gradually: JSX → state → hooks → router → fetch → project.",
            },
          },
        ],
        codeSource: `// Imperative (vanilla)
const el = document.createElement("p");
el.textContent = "Hello";
document.body.appendChild(el);

// Declarative (React idea)
// function Greeting() { return <p>Hello</p>; }`,
        codeExplain: {
          ar: "مقارنة mental — React يختصر DOM boilerplate.",
          en: "Mental comparison — React removes DOM boilerplate.",
        },
        faqs: [
          {
            q: { ar: "هل React framework؟", en: "Is React a framework?" },
            a: {
              ar: "غالباً يُسمّى library — لا يفرض routing أو data layer. Next.js framework فوق React.",
              en: "Often called a library — no enforced routing or data layer. Next.js is a framework on React.",
            },
          },
          {
            q: { ar: "Virtual DOM = بطيء؟", en: "Is Virtual DOM slow?" },
            a: {
              ar: "React 18+ concurrent features تحسّن. للمعظم أسرع من DOM يدوي غير منظم.",
              en: "React 18+ concurrent features help. For most apps faster than messy manual DOM.",
            },
          },
          {
            q: { ar: "Class vs function components؟", en: "Class vs function components?" },
            a: {
              ar: "المسار function + Hooks فقط — standard حديث.",
              en: "This track uses function + Hooks only — modern standard.",
            },
          },
          {
            q: { ar: "لماذا React وليس Vue؟", en: "Why React not Vue?" },
            a: {
              ar: "React ecosystem ووظائف — AlefYa يعلّم React لمسار واضح.",
              en: "React ecosystem and jobs — AlefYa teaches React for a clear path.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: JSX — syntax يخلط HTML مع JavaScript.",
          en: "Next: JSX — syntax mixing HTML with JavaScript.",
        },
      },
      {
        slug: "02-jsx-elements",
        order: 2,
        duration: 48,
        title: { ar: "JSX والعناصر", en: "JSX & elements" },
        summary: {
          ar: "JSX rules: one root، expressions، className، fragments.",
          en: "JSX rules: one root, expressions, className, fragments.",
        },
        focus: {
          ar: "JSX يترجم إلى React.createElement — ليس HTML حقيقي. className بدل class، htmlFor بدل for.",
          en: "JSX compiles to React.createElement — not real HTML. className not class, htmlFor not for.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "JSX expressions", en: "JSX expressions" },
            body: {
              ar: "أقواس {} للـ JavaScript: <h1>{title.ar}</h1>، {items.length === 0 && <Empty />}. ternary للشرط: {loading ? <Spinner /> : <List />}. لا if statements داخل JSX — استخدم ternary أو variable قبل return.",
              en: "Curly braces {} for JavaScript: <h1>{title.ar}</h1>, {items.length === 0 && <Empty />}. Ternary for conditions: {loading ? <Spinner /> : <List />}. No if statements inside JSX — use ternary or a variable before return.",
            },
          },
          {
            title: { ar: "Attributes و camelCase", en: "Attributes & camelCase" },
            body: {
              ar: "onClick، tabIndex، aria-label. style={{ color: 'red', fontSize: 16 }} — object camelCase. self-closing: <img src=\"...\" alt=\"...\" />.",
              en: "onClick, tabIndex, aria-label. style={{ color: 'red', fontSize: 16 }} — object with camelCase. Self-closing: <img src=\"...\" alt=\"...\" />.",
            },
          },
          {
            title: { ar: "Fragments", en: "Fragments" },
            body: {
              ar: "<></> أو <Fragment> — return عناصر متعددة بدون div wrapper زائد. مفيد لـ lists وtables حيث div يكسر layout.",
              en: "<></> or <Fragment> — return multiple elements without an extra div wrapper. Useful for lists and tables where a div breaks layout.",
            },
          },
          {
            title: { ar: "JSX ≠ strings", en: "JSX is not strings" },
            body: {
              ar: "لا تبني JSX بconcat strings — XSS risk ويفقد React diffing. دائماً JSX syntax أو createElement.",
              en: "Never build JSX with string concat — XSS risk and breaks React diffing. Always use JSX syntax or createElement.",
            },
          },
        ],
        codeSource: `function LessonBadge({ lesson, locale }) {
  const label = lesson.title[locale];
  return (
    <>
      <span className="badge">{lesson.duration}m</span>
      <strong>{label}</strong>
      {lesson.completed && <span aria-label="done">✓</span>}
    </>
  );
}`,
        codeExplain: {
          ar: "Fragment، className، expression — أنماط يومية.",
          en: "Fragment, className, expression — daily patterns.",
        },
        faqs: [
          {
            q: { ar: "لماذا className؟", en: "Why className?" },
            a: {
              ar: "class كلمة محجوزة في JS. JSX يتبع DOM property names.",
              en: "class is reserved in JS. JSX follows DOM property names.",
            },
          },
          {
            q: { ar: "هل أحتاج Babel؟", en: "Do I need Babel?" },
            a: {
              ar: "Vite يترجم JSX تلقائياً.",
              en: "Vite transpiles JSX automatically.",
            },
          },
          {
            q: { ar: "&& vs ternary؟", en: "&& vs ternary?" },
            a: {
              ar: "&& للإظهار/الإخفاء. ternary لفرعين مختلفين.",
              en: "&& for show/hide. Ternary for two different branches.",
            },
          },
          {
            q: { ar: "dangerouslySetInnerHTML؟", en: "dangerouslySetInnerHTML?" },
            a: {
              ar: "تجنّبه إلا مع sanitize — XSS.",
              en: "Avoid unless sanitized — XSS risk.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: المكوّنات — building blocks.",
          en: "Next: components — the building blocks.",
        },
      },
      {
        slug: "03-components",
        order: 3,
        duration: 50,
        title: { ar: "المكوّنات", en: "Components" },
        summary: {
          ar: "Function components، composition، export/import.",
          en: "Function components, composition, export/import.",
        },
        focus: {
          ar: "المكوّن دالة ترجع JSX — capital letter. composition أفضل من inheritance في React.",
          en: "A component is a function returning JSX — capital letter required. Composition beats inheritance in React.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Function components", en: "Function components" },
            body: {
              ar: "function TrackCard({ track }) { return <article>...</article>; } — اسم يبدأ بحرف كبير. React ي treat it كمكوّن لا HTML tag. export default TrackCard من الملف.",
              en: "function TrackCard({ track }) { return <article>...</article>; } — name must start uppercase. React treats it as a component, not an HTML tag. export default TrackCard from the file.",
            },
          },
          {
            title: { ar: "Composition", en: "Composition" },
            body: {
              ar: "<PageLayout sidebar={<Sidebar />} main={<LessonList />} /> — مرّر JSX كـ props (children). App = tree من مكوّنات صغيرة قابلة لإعادة الاستخدام.",
              en: "<PageLayout sidebar={<Sidebar />} main={<LessonList />} /> — pass JSX as props (children). App = tree of small reusable components.",
            },
          },
          {
            title: { ar: "Single responsibility", en: "Single responsibility" },
            body: {
              ar: "TrackCard يعرض track. LessonList ي map lessons. App يجمع data flow. إذا ملف >200 سطر فكّره.",
              en: "TrackCard displays a track. LessonList maps lessons. App orchestrates data flow. Split files over ~200 lines.",
            },
          },
          {
            title: { ar: "Pure render", en: "Pure render" },
            body: {
              ar: "نفس props → نفس JSX. لا side effects في render (لا fetch، لا localStorage). side effects في useEffect لاحقاً.",
              en: "Same props → same JSX. No side effects in render (no fetch, no localStorage). Side effects go in useEffect later.",
            },
          },
        ],
        codeSource: `import TrackCard from "./TrackCard.jsx";

function App() {
  const tracks = [{ slug: "react", title: { en: "React" }, color: "#61DAFB" }];
  return (
    <main>
      {tracks.map((t) => (
        <TrackCard key={t.slug} track={t} />
      ))}
    </main>
  );
}

export default App;`,
        codeExplain: {
          ar: "App ي compose TrackCard — pattern capstone.",
          en: "App composes TrackCard — capstone pattern.",
        },
        faqs: [
          {
            q: { ar: "arrow vs function؟", en: "arrow vs function?" },
            a: {
              ar: "كلاهما يعمل. function له hoisting — arrow concise.",
              en: "Both work. function hoists — arrow is concise.",
            },
          },
          {
            q: { ar: "ملف واحد لكل مكوّن؟", en: "One file per component?" },
            a: {
              ar: "convention — TrackCard.jsx. صغيرة يمكن تجميعها.",
              en: "Convention — TrackCard.jsx. Tiny ones can share a file.",
            },
          },
          {
            q: { ar: "children prop؟", en: "children prop?" },
            a: {
              ar: "محتوى بين tags: <Card>text</Card> → props.children.",
              en: "Content between tags: <Card>text</Card> → props.children.",
            },
          },
          {
            q: { ar: "هل أحتاج PropTypes؟", en: "Need PropTypes?" },
            a: {
              ar: "TypeScript بديل — المسار JS. PropTypes optional runtime check.",
              en: "TypeScript is alternative — this track is JS. PropTypes optional runtime check.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: كيف React يرسم للـ DOM.",
          en: "Next: how React paints to the DOM.",
        },
      },
      {
        slug: "04-rendering",
        order: 4,
        duration: 44,
        title: { ar: "الرسم والـ Root", en: "Rendering & root" },
        summary: {
          ar: "createRoot، StrictMode، re-render cycle.",
          en: "createRoot, StrictMode, re-render cycle.",
        },
        focus: {
          ar: "React 18: createRoot من react-dom/client. state change → re-render subtree → commit DOM.",
          en: "React 18: createRoot from react-dom/client. State change → re-render subtree → commit to DOM.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "createRoot", en: "createRoot" },
            body: {
              ar: "import { createRoot } from 'react-dom/client'; createRoot(document.getElementById('root')).render(<App />); — entry في main.jsx. render يستبدل محتوى root.",
              en: "import { createRoot } from 'react-dom/client'; createRoot(document.getElementById('root')).render(<App />); — entry in main.jsx. render replaces root content.",
            },
          },
          {
            title: { ar: "Re-render cycle", en: "Re-render cycle" },
            body: {
              ar: "setState في App → React يستدعي App مرة أخرى → diff → update DOM. children re-render unless memoized. فهم cycle يشرح لماذا immutability.",
              en: "setState in App → React calls App again → diff → update DOM. Children re-render unless memoized. Understanding the cycle explains immutability.",
            },
          },
          {
            title: { ar: "StrictMode", en: "StrictMode" },
            body: {
              ar: "<StrictMode><App /></StrictMode> — dev only double-invoke لاكتشاف side effects. لا يظهر في production build.",
              en: "<StrictMode><App /></StrictMode> — dev-only double-invoke to surface side effects. Not in production build.",
            },
          },
          {
            title: { ar: "Conditional render", en: "Conditional rendering" },
            body: {
              ar: "if (!user) return <Login />; return <Dashboard /> — early return في component body. أو inline ternary في JSX.",
              en: "if (!user) return <Login />; return <Dashboard /> — early return in component body. Or inline ternary in JSX.",
            },
          },
        ],
        codeSource: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
        codeExplain: {
          ar: "main.jsx standard في Vite React template.",
          en: "Standard main.jsx in Vite React template.",
        },
        faqs: [
          {
            q: { ar: "ReactDOM.render deprecated؟", en: "ReactDOM.render deprecated?" },
            a: {
              ar: "نعم — createRoot في React 18+.",
              en: "Yes — createRoot in React 18+.",
            },
          },
          {
            q: { ar: "كم re-render طبيعي؟", en: "How many re-renders is normal?" },
            a: {
              ar: "كثير في dev مع StrictMode. optimize لاحقاً إذا measured problem.",
              en: "Many in dev with StrictMode. Optimize later if measured problem.",
            },
          },
          {
            q: { ar: "root.innerHTML قبل React؟", en: "root.innerHTML before React?" },
            a: {
              ar: "React يستبدل — لا تخلط imperative DOM على نفس root.",
              en: "React replaces — don't mix imperative DOM on same root.",
            },
          },
          {
            q: { ar: "portal؟", en: "Portals?" },
            a: {
              ar: "createPortal للmodals — advanced، لاحقاً.",
              en: "createPortal for modals — advanced, later.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: props — تدفق البيانات للأسفل.",
          en: "Next: props — data flow downward.",
        },
      },
    ],
  ),

  "03-state-props": stage(
    "03-state-props",
    3,
    { ar: "State و Props", en: "State & props" },
    {
      ar: "تدفق props، useState، رفع state، lists و keys.",
      en: "Props flow, useState, lifting state, lists and keys.",
    },
    [
      {
        slug: "01-props-flow",
        order: 1,
        duration: 45,
        title: { ar: "تدفق Props", en: "Props flow" },
        summary: {
          ar: "One-way data flow: parent → child عبر props.",
          en: "One-way data flow: parent → child via props.",
        },
        focus: {
          ar: "Props read-only للـ child — لا تعدّل props مباشرة. events ترجع للأعلى عبر callbacks.",
          en: "Props are read-only for the child — never mutate props. Events bubble up via callbacks.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Props كـ inputs", en: "Props as inputs" },
            body: {
              ar: "<LessonRow lesson={item} locale=\"ar\" onSelect={handleSelect} /> — parent يمرّر data وfunctions. child يعرض فقط. إذا child يحتاج يغيّر data، parent يملك state.",
              en: "<LessonRow lesson={item} locale=\"ar\" onSelect={handleSelect} /> — parent passes data and functions. Child displays only. If child must change data, parent owns state.",
            },
          },
          {
            title: { ar: "Callback props", en: "Callback props" },
            body: {
              ar: "onComplete={(id) => setLessons(prev => prev.map(...))} — child يستدعي onComplete(id) عند click. naming: on + Event. لا تمرّر setState مباشرة إلا wrapper بسيط.",
              en: "onComplete={(id) => setLessons(prev => prev.map(...))} — child calls onComplete(id) on click. Naming: on + Event. Avoid passing setState raw unless simple wrapper.",
            },
          },
          {
            title: { ar: "Prop drilling", en: "Prop drilling" },
            body: {
              ar: "تمرير props عبر 3+ levels مزعج — Context لاحقاً. حتى then، props أفضل للـ direct parent-child.",
              en: "Passing props through 3+ levels is tedious — Context later. Until then, props are best for direct parent-child.",
            },
          },
          {
            title: { ar: "Default values", en: "Default values" },
            body: {
              ar: "function Row({ locale = 'ar' }) — defaults في destructuring. للoptional props استخدم default parameters لا mutation.",
              en: "function Row({ locale = 'ar' }) — defaults in destructuring. For optional props use default parameters, not mutation.",
            },
          },
        ],
        codeSource: `function LessonRow({ lesson, onToggle }) {
  return (
    <li>
      <span>{lesson.title.ar}</span>
      <button type="button" onClick={() => onToggle(lesson.id)}>
        Toggle
      </button>
    </li>
  );
}

function LessonList({ lessons, onToggle }) {
  return (
    <ul>
      {lessons.map((l) => (
        <LessonRow key={l.id} lesson={l} onToggle={onToggle} />
      ))}
    </ul>
  );
}`,
        codeExplain: {
          ar: "onToggle callback — child لا يملك list state.",
          en: "onToggle callback — child does not own list state.",
        },
        faqs: [
          {
            q: { ar: "هل أعدّل props؟", en: "Can I mutate props?" },
            a: {
              ar: "لا — anti-pattern. parent يحدّث state.",
              en: "No — anti-pattern. Parent updates state.",
            },
          },
          {
            q: { ar: "spread props؟", en: "Spread props?" },
            a: {
              ar: "<Row {...lesson} /> — shortcut. explicit أوضح للقراءة.",
              en: "<Row {...lesson} /> — shortcut. Explicit is clearer.",
            },
          },
          {
            q: { ar: "props vs state؟", en: "props vs state?" },
            a: {
              ar: "props من parent. state داخلي للمكوّن.",
              en: "props from parent. state internal to component.",
            },
          },
          {
            q: { ar: "children prop؟", en: "children prop?" },
            a: {
              ar: "prop خاص — JSX بين tags.",
              en: "Special prop — JSX between tags.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: useState — state محلي.",
          en: "Next: useState — local state.",
        },
      },
      {
        slug: "02-use-state",
        order: 2,
        duration: 50,
        title: { ar: "useState", en: "useState" },
        summary: {
          ar: "Hook لstate محلي — initializer، functional updates، batching.",
          en: "Hook for local state — initializer, functional updates, batching.",
        },
        focus: {
          ar: "useState(initial) يرجع [value, setValue]. setValue(new) أو setValue(prev => ...) للتحديثات المعتمدة على القديم.",
          en: "useState(initial) returns [value, setValue]. setValue(new) or setValue(prev => ...) for updates based on previous value.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Basic useState", en: "Basic useState" },
            body: {
              ar: "const [count, setCount] = useState(0); setCount(c => c + 1) — functional update عندما new state يعتمد على old. lazy init: useState(() => expensive()) مرة واحدة.",
              en: "const [count, setCount] = useState(0); setCount(c => c + 1) — functional update when new state depends on old. Lazy init: useState(() => expensive()) runs once.",
            },
          },
          {
            title: { ar: "Object و array state", en: "Object & array state" },
            body: {
              ar: "setUser(u => ({ ...u, name: 'Sara' })); setItems(items => [...items, newItem]). لا user.name = x ثم setUser(user) — same reference.",
              en: "setUser(u => ({ ...u, name: 'Sara' })); setItems(items => [...items, newItem]). Never user.name = x then setUser(user) — same reference.",
            },
          },
          {
            title: { ar: "Batching", en: "Batching" },
            body: {
              ar: "React 18 ي batch setState في event handlers — render واحد. await بعد setState قد يرى state قديم — استخدم functional update.",
              en: "React 18 batches setState in event handlers — one render. await after setState may see stale state — use functional updates.",
            },
          },
          {
            title: { ar: "State location", en: "State location" },
            body: {
              ar: "ضع state أقرب common ancestor للم consumers. form input state في input component أو parent حسب sharing.",
              en: "Place state at the nearest common ancestor of consumers. Form input state in input or parent depending on sharing.",
            },
          },
        ],
        codeSource: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}

function TodoInput() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  function add() {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text }]);
    setText("");
  }
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="button" onClick={add}>Add</button>
    </>
  );
}`,
        codeExplain: {
          ar: "functional setTodos و controlled input — أساس forms.",
          en: "functional setTodos and controlled input — forms foundation.",
        },
        faqs: [
          {
            q: { ar: "لماذا functional update؟", en: "Why functional update?" },
            a: {
              ar: "يتجنب stale closure عند updates متتالية.",
              en: "Avoids stale closure on consecutive updates.",
            },
          },
          {
            q: { ar: "useState async؟", en: "Is useState async?" },
            a: {
              ar: "setState schedules re-render — value لا يتغير فوراً بعد set.",
              en: "setState schedules re-render — value does not change immediately after set.",
            },
          },
          {
            q: { ar: "state كبير واحد؟", en: "One big state object?" },
            a: {
              ar: "يفضّل split أو useReducer للمعقد.",
              en: "Prefer split or useReducer for complex cases.",
            },
          },
          {
            q: { ar: "initial من localStorage؟", en: "Initial from localStorage?" },
            a: {
              ar: "lazy init: useState(() => JSON.parse(localStorage.getItem('x')))",
              en: "lazy init: useState(() => JSON.parse(localStorage.getItem('x')))",
            },
          },
        ],
        nextHint: {
          ar: "التالي: lifting state — مشاركة بين siblings.",
          en: "Next: lifting state — sharing between siblings.",
        },
      },
      {
        slug: "03-lifting-state",
        order: 3,
        duration: 48,
        title: { ar: "رفع State", en: "Lifting state up" },
        summary: {
          ar: "نقل state للـ parent المشترك عندما siblings تحتاج نفس البيانات.",
          en: "Move state to shared parent when siblings need the same data.",
        },
        focus: {
          ar: "FilterPanel وLessonList يحتاجان selectedTrack — ارفع selectedTrack لـ App مرّر setter وvalue لكلاهما.",
          en: "FilterPanel and LessonList both need selectedTrack — lift selectedTrack to App and pass value and setter to both.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Identifying shared state", en: "Identifying shared state" },
            body: {
              ar: "إذا مكوّنان يعرضان نفس data أو one controls other — state في ancestor. مثال: search query في header وfiltered list في body → state في Layout.",
              en: "If two components show the same data or one controls the other — state lives in an ancestor. Example: search query in header and filtered list in body → state in Layout.",
            },
          },
          {
            title: { ar: "Controlled siblings", en: "Controlled siblings" },
            body: {
              ar: "TemperatureInput metric وimperial — lift celsius to parent، each child receives value + onChange. single source of truth.",
              en: "TemperatureInput metric and imperial — lift celsius to parent, each child receives value + onChange. Single source of truth.",
            },
          },
          {
            title: { ar: "Derived state caution", en: "Derived state caution" },
            body: {
              ar: "لا تخزّن filteredList في state إذا lessons + filter كافيان — derive at render. lifting لا يعني duplicate state.",
              en: "Don't store filteredList in state if lessons + filter suffice — derive at render. Lifting does not mean duplicate state.",
            },
          },
          {
            title: { ar: "Colocation", en: "Colocation" },
            body: {
              ar: "ارفع فقط عند الحاجة. UI-only state (hover, open) يبقى local. balance بين drilling وlifting.",
              en: "Lift only when needed. UI-only state (hover, open) stays local. Balance drilling vs lifting.",
            },
          },
        ],
        codeSource: `function App() {
  const [filter, setFilter] = useState("");
  const lessons = [/* ... */];
  const visible = lessons.filter((l) =>
    l.title.en.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <>
      <SearchBox value={filter} onChange={setFilter} />
      <LessonList lessons={visible} />
    </>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search lessons"
    />
  );
}`,
        codeExplain: {
          ar: "filter في App — SearchBox controlled، LessonList يستقبل derived list.",
          en: "filter in App — controlled SearchBox, LessonList gets derived list.",
        },
        faqs: [
          {
            q: { ar: "متى Context بدل lifting؟", en: "When Context instead of lifting?" },
            a: {
              ar: "عندما drilling عميق — درس Context لاحقاً.",
              en: "When drilling goes deep — Context lesson later.",
            },
          },
          {
            q: { ar: "global state library؟", en: "Global state library?" },
            a: {
              ar: "useState + lifting كافٍ للكثير. Zustand لاحقاً optional.",
              en: "useState + lifting enough for many apps. Zustand optional later.",
            },
          },
          {
            q: { ar: "duplicate state bug؟", en: "Duplicate state bug?" },
            a: {
              ar: "نسخ props إلى useState — anti-pattern. derive أو sync carefully.",
              en: "Copying props into useState — anti-pattern. Derive or sync carefully.",
            },
          },
          {
            q: { ar: "lifting performance؟", en: "Lifting performance?" },
            a: {
              ar: "re-render parent ي re-render children — memoize لاحقاً إذا لزم.",
              en: "Parent re-render re-renders children — memoize later if needed.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: lists و keys.",
          en: "Next: lists and keys.",
        },
      },
      {
        slug: "04-lists-keys",
        order: 4,
        duration: 44,
        title: { ar: "Lists و Keys", en: "Lists & keys" },
        summary: {
          ar: "render lists، key prop، stable identity.",
          en: "Rendering lists, key prop, stable identity.",
        },
        focus: {
          ar: "key يساعد React ي match items بين renders. index key خطر عند reorder/delete.",
          en: "key helps React match items between renders. Index keys are risky on reorder/delete.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "map في JSX", en: "map in JSX" },
            body: {
              ar: "lessons.map(lesson => <LessonRow key={lesson.slug} lesson={lesson} />). key على outer element في list. لا key على Fragment بدون key prop (<Fragment key={id}>).",
              en: "lessons.map(lesson => <LessonRow key={lesson.slug} lesson={lesson} />). key on the outer list element. No key on Fragment without key prop (<Fragment key={id}>).",
            },
          },
          {
            title: { ar: "Stable keys", en: "Stable keys" },
            body: {
              ar: "id من database أو slug — ثابت عبر renders. Math.random() key — سيء. key ليس prop — React ي consume it.",
              en: "Database id or slug — stable across renders. Math.random() key — bad. key is not a prop — React consumes it.",
            },
          },
          {
            title: { ar: "Index keys", en: "Index keys" },
            body: {
              ar: "key={index} عند delete middle item — React reuses wrong DOM/state. استخدم id. exception: static never-changing lists.",
              en: "key={index} on delete middle item — React reuses wrong DOM/state. Use id. Exception: static never-changing lists.",
            },
          },
          {
            title: { ar: "Empty و loading lists", en: "Empty & loading lists" },
            body: {
              ar: "lessons.length === 0 ? <EmptyState /> : lessons.map(...). handle loading قبل map لتجنب flash.",
              en: "lessons.length === 0 ? <EmptyState /> : lessons.map(...). Handle loading before map to avoid flash.",
            },
          },
        ],
        codeSource: `function LessonList({ lessons, onComplete }) {
  if (lessons.length === 0) {
    return <p>No lessons yet.</p>;
  }
  return (
    <ul className="lesson-list">
      {lessons.map((lesson) => (
        <LessonRow
          key={lesson.slug}
          lesson={lesson}
          onComplete={() => onComplete(lesson.slug)}
        />
      ))}
    </ul>
  );
}`,
        codeExplain: {
          ar: "slug كـ key — stable في AlefYa content.",
          en: "slug as key — stable in AlefYa content.",
        },
        faqs: [
          {
            q: { ar: "هل key يصل للـ child؟", en: "Does key reach the child?" },
            a: {
              ar: "لا — use id prop إذا child يحتاج id.",
              en: "No — pass id prop if child needs it.",
            },
          },
          {
            q: { ar: "nested lists keys؟", en: "Nested list keys?" },
            a: {
              ar: "key unique ضمن sibling list — يمكن repeat across levels.",
              en: "key unique within sibling list — can repeat across levels.",
            },
          },
          {
            q: { ar: "key={uuid()}؟", en: "key={uuid()}?" },
            a: {
              ar: "جديد كل render — ي destroy/remount. never.",
              en: "New every render — destroys/remounts. Never.",
            },
          },
          {
            q: { ar: "filter يغيّر order؟", en: "Filter changes order?" },
            a: {
              ar: "keys stable — React preserves component state correctly.",
              en: "Stable keys — React preserves component state correctly.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: useEffect — side effects.",
          en: "Next: useEffect — side effects.",
        },
      },
    ],
  ),

  "04-hooks": stage(
    "04-hooks",
    4,
    { ar: "Hooks", en: "Hooks" },
    {
      ar: "useEffect، useRef/useMemo، custom hooks، rules.",
      en: "useEffect, useRef/useMemo, custom hooks, rules.",
    },
    [
      {
        slug: "01-use-effect",
        order: 1,
        duration: 52,
        title: { ar: "useEffect", en: "useEffect" },
        summary: {
          ar: "Side effects بعد render — fetch، subscriptions، DOM sync.",
          en: "Side effects after render — fetch, subscriptions, DOM sync.",
        },
        focus: {
          ar: "useEffect(() => { ... }, [deps]) — runs after paint. return cleanup on unmount/re-run.",
          en: "useEffect(() => { ... }, [deps]) — runs after paint. return cleanup on unmount/re-run.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Effect lifecycle", en: "Effect lifecycle" },
            body: {
              ar: "mount → effect runs → deps change → cleanup → effect again → unmount → cleanup. [] deps = once on mount. no deps = every render (نادراً).",
              en: "mount → effect runs → deps change → cleanup → effect again → unmount → cleanup. [] deps = once on mount. no deps = every render (rare).",
            },
          },
          {
            title: { ar: "Fetching data", en: "Fetching data" },
            body: {
              ar: "useEffect(() => { let cancelled = false; async function load() { const data = await fetch(...); if (!cancelled) setData(data); } load(); return () => { cancelled = true; }; }, [slug]); — race condition guard.",
              en: "useEffect(() => { let cancelled = false; async function load() { const data = await fetch(...); if (!cancelled) setData(data); } load(); return () => { cancelled = true; }; }, [slug]); — race condition guard.",
            },
          },
          {
            title: { ar: "Dependency array", en: "Dependency array" },
            body: {
              ar: "include every value from component used inside effect. eslint-plugin-react-hooks يساعد. missing dep → stale data bug.",
              en: "Include every component value used inside the effect. eslint-plugin-react-hooks helps. Missing dep → stale data bug.",
            },
          },
          {
            title: { ar: "Not for derived state", en: "Not for derived state" },
            body: {
              ar: "لا useEffect(() => setFullName(first + last)) — compute during render. effects للـ sync خارج React (API, timers, document.title).",
              en: "Don't useEffect(() => setFullName(first + last)) — compute during render. Effects sync outside React (API, timers, document.title).",
            },
          },
        ],
        codeSource: `import { useEffect, useState } from "react";

function LessonDetail({ slug }) {
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setError(null);
    fetch(\`/api/lessons/\${slug}\`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then(setLesson)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => ctrl.abort();
  }, [slug]);

  if (error) return <p>Error: {error}</p>;
  if (!lesson) return <p>Loading...</p>;
  return <h1>{lesson.title.en}</h1>;
}`,
        codeExplain: {
          ar: "AbortController cleanup — pattern production fetch.",
          en: "AbortController cleanup — production fetch pattern.",
        },
        faqs: [
          {
            q: { ar: "async useEffect؟", en: "async useEffect?" },
            a: {
              ar: "async function داخل effect — لا async callback مباشرة.",
              en: "async function inside effect — not async callback directly.",
            },
          },
          {
            q: { ar: "useEffect vs useLayoutEffect؟", en: "useEffect vs useLayoutEffect?" },
            a: {
              ar: "useLayoutEffect قبل paint — قياس DOM. default useEffect.",
              en: "useLayoutEffect before paint — measure DOM. Default useEffect.",
            },
          },
          {
            q: { ar: "infinite loop effect؟", en: "Infinite loop effect?" },
            a: {
              ar: "setState in effect بدون deps condition — fix deps أو logic.",
              en: "setState in effect without deps guard — fix deps or logic.",
            },
          },
          {
            q: { ar: "React Query بديل؟", en: "React Query alternative?" },
            a: {
              ar: "TanStack Query — advanced. المسار fetch + useEffect أولاً.",
              en: "TanStack Query — advanced. This track teaches fetch + useEffect first.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: useRef، useMemo، useCallback.",
          en: "Next: useRef, useMemo, useCallback.",
        },
      },
      {
        slug: "02-use-ref-memo",
        order: 2,
        duration: 50,
        title: { ar: "useRef و useMemo", en: "useRef & useMemo" },
        summary: {
          ar: "Refs للـ DOM و mutable values. Memoization للـ expensive compute و stable callbacks.",
          en: "Refs for DOM and mutable values. Memoization for expensive compute and stable callbacks.",
        },
        focus: {
          ar: "useRef لا يسبب re-render. useMemo/useCallback cache بين renders عند stable deps.",
          en: "useRef does not trigger re-render. useMemo/useCallback cache between renders with stable deps.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "useRef DOM", en: "useRef for DOM" },
            body: {
              ar: "const inputRef = useRef(null); <input ref={inputRef} /> — inputRef.current.focus() في handler. ref persists across renders.",
              en: "const inputRef = useRef(null); <input ref={inputRef} /> — inputRef.current.focus() in handler. ref persists across renders.",
            },
          },
          {
            title: { ar: "useRef mutable box", en: "useRef as mutable box" },
            body: {
              ar: "const timerRef = useRef(null); timerRef.current = setInterval(...). cleanup clearInterval. لا تخزّن UI state في ref.",
              en: "const timerRef = useRef(null); timerRef.current = setInterval(...). cleanup clearInterval. Don't store UI state in ref.",
            },
          },
          {
            title: { ar: "useMemo", en: "useMemo" },
            body: {
              ar: "const sorted = useMemo(() => lessons.sort(...), [lessons]); — skip re-sort if lessons same reference. don't overuse — measure first.",
              en: "const sorted = useMemo(() => lessons.sort(...), [lessons]); — skip re-sort if lessons same reference. Don't overuse — measure first.",
            },
          },
          {
            title: { ar: "useCallback", en: "useCallback" },
            body: {
              ar: "const onSelect = useCallback((id) => { ... }, [deps]); — stable reference لـ memoized child. مع React.memo على child.",
              en: "const onSelect = useCallback((id) => { ... }, [deps]); — stable reference for memoized child. Pairs with React.memo on child.",
            },
          },
        ],
        codeSource: `import { useRef, useMemo, useCallback, memo } from "react";

const LessonRow = memo(function LessonRow({ lesson, onSelect }) {
  return (
    <li onClick={() => onSelect(lesson.slug)}>{lesson.title.en}</li>
  );
});

function LessonList({ lessons, onSelectLesson }) {
  const searchRef = useRef(null);
  const sorted = useMemo(
    () => [...lessons].sort((a, b) => a.title.en.localeCompare(b.title.en)),
    [lessons]
  );
  const onSelect = useCallback((slug) => onSelectLesson(slug), [onSelectLesson]);
  return (
    <>
      <button type="button" onClick={() => searchRef.current?.focus()}>
        Focus search
      </button>
      <input ref={searchRef} />
      <ul>{sorted.map((l) => <LessonRow key={l.slug} lesson={l} onSelect={onSelect} />)}</ul>
    </>
  );
}`,
        codeExplain: {
          ar: "memo + useCallback + useMemo — performance trio.",
          en: "memo + useCallback + useMemo — performance trio.",
        },
        faqs: [
          {
            q: { ar: "useMemo everywhere؟", en: "useMemo everywhere?" },
            a: {
              ar: "لا — premature optimization. profile first.",
              en: "No — premature optimization. Profile first.",
            },
          },
          {
            q: { ar: "ref.current في render؟", en: "ref.current in render?" },
            a: {
              ar: "avoid — undefined first render. use in effects/handlers.",
              en: "Avoid — undefined first render. Use in effects/handlers.",
            },
          },
          {
            q: { ar: "forwardRef؟", en: "forwardRef?" },
            a: {
              ar: "pass ref through wrapper component — advanced pattern.",
              en: "Pass ref through wrapper component — advanced pattern.",
            },
          },
          {
            q: { ar: "useCallback بدون memo child؟", en: "useCallback without memo child?" },
            a: {
              ar: "little benefit — child re-renders anyway.",
              en: "Little benefit — child re-renders anyway.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: custom hooks.",
          en: "Next: custom hooks.",
        },
      },
      {
        slug: "03-custom-hooks",
        order: 3,
        duration: 48,
        title: { ar: "Custom Hooks", en: "Custom hooks" },
        summary: {
          ar: "extract reusable stateful logic — useLesson، useLocalStorage.",
          en: "Extract reusable stateful logic — useLesson, useLocalStorage.",
        },
        focus: {
          ar: "custom hook = function starts with use، calls other hooks. share logic not state instance.",
          en: "Custom hook = function starting with use, calling other hooks. Shares logic not state instance.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Naming use*", en: "Naming use*" },
            body: {
              ar: "useLesson(slug) — eslint rules of hooks apply. each call gets own state. extract fetch + loading + error pattern.",
              en: "useLesson(slug) — eslint rules of hooks apply. Each call gets own state. Extract fetch + loading + error pattern.",
            },
          },
          {
            title: { ar: "Return shape", en: "Return shape" },
            body: {
              ar: "return { data, loading, error, refetch } — object أو tuple [data, actions]. consistent API across app.",
              en: "return { data, loading, error, refetch } — object or tuple [data, actions]. Consistent API across app.",
            },
          },
          {
            title: { ar: "Composition of hooks", en: "Composition of hooks" },
            body: {
              ar: "useLesson يستخدم useEffect + useState. useAuth يستخدم useContext + useMemo. hooks compose.",
              en: "useLesson uses useEffect + useState. useAuth uses useContext + useMemo. Hooks compose.",
            },
          },
          {
            title: { ar: "Testing hooks", en: "Testing hooks" },
            body: {
              ar: "test via component wrapper أو @testing-library/react renderHook. logic isolated from UI.",
              en: "Test via component wrapper or @testing-library/react renderHook. Logic isolated from UI.",
            },
          },
        ],
        codeSource: `import { useEffect, useState, useCallback } from "react";

export function useLesson(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(\`/api/lessons/\${slug}\`);
      if (!res.ok) throw new Error(res.statusText);
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}`,
        codeExplain: {
          ar: "useLesson — reusable في Detail وSidebar.",
          en: "useLesson — reusable in Detail and Sidebar.",
        },
        faqs: [
          {
            q: { ar: "class components hooks؟", en: "Hooks in class components?" },
            a: {
              ar: "لا — custom hooks for function components only.",
              en: "No — custom hooks for function components only.",
            },
          },
          {
            q: { ar: "share state between useLesson calls؟", en: "Share state between useLesson calls?" },
            a: {
              ar: "each call isolated — use Context or cache library.",
              en: "Each call isolated — use Context or cache library.",
            },
          },
          {
            q: { ar: "hook في hook conditionally؟", en: "Hook inside hook conditionally?" },
            a: {
              ar: "custom hook can early return before hooks? no — same rules.",
              en: "Custom hook early return before hooks? No — same rules.",
            },
          },
          {
            q: { ar: "file location؟", en: "File location?" },
            a: {
              ar: "src/hooks/useLesson.js — convention.",
              en: "src/hooks/useLesson.js — convention.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: rules of hooks.",
          en: "Next: rules of hooks.",
        },
      },
      {
        slug: "04-rules-of-hooks",
        order: 4,
        duration: 42,
        title: { ar: "قواعد Hooks", en: "Rules of hooks" },
        summary: {
          ar: "top level only، React functions only — why linter enforces.",
          en: "Top level only, React functions only — why the linter enforces this.",
        },
        focus: {
          ar: "Hooks rely on call order. if/for hooks breaks order → wrong state pairing.",
          en: "Hooks rely on call order. if/for hooks breaks order → wrong state pairing.",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "Only top level", en: "Only at top level" },
            body: {
              ar: "لا useState داخل if (loggedIn) — conditional hooks forbidden. extract child component أو hook with internal condition on state not hook call.",
              en: "No useState inside if (loggedIn) — conditional hooks forbidden. Extract child component or hook with internal condition on state, not hook call.",
            },
          },
          {
            title: { ar: "React functions only", en: "React functions only" },
            body: {
              ar: "call hooks from components or custom hooks — not regular utils. eslint-plugin-react-hooks catches violations.",
              en: "Call hooks from components or custom hooks — not regular utils. eslint-plugin-react-hooks catches violations.",
            },
          },
          {
            title: { ar: "Hook order diagram", en: "Hook order diagram" },
            body: {
              ar: "render 1: useState(A), useEffect(B). render 2: same order — React maps slot 0 → A state. break order → chaos.",
              en: "render 1: useState(A), useEffect(B). render 2: same order — React maps slot 0 → A state. Break order → chaos.",
            },
          },
          {
            title: { ar: "Fixing violations", en: "Fixing violations" },
            body: {
              ar: "conditional UI → early return after all hooks. shared conditional logic → custom hook always called.",
              en: "Conditional UI → early return after all hooks. Shared conditional logic → custom hook always called.",
            },
          },
        ],
        codeSource: `// WRONG
function Bad({ show }) {
  if (show) {
    const [x, setX] = useState(0); // Rules violation
  }
  return null;
}

// RIGHT
function Good({ show }) {
  const [x, setX] = useState(0);
  if (!show) return null;
  return <button onClick={() => setX(x + 1)}>{x}</button>;
}`,
        codeExplain: {
          ar: "hooks قبل early return — golden rule.",
          en: "Hooks before early return — golden rule.",
        },
        faqs: [
          {
            q: { ar: "لماذا React strict؟", en: "Why is React strict?" },
            a: {
              ar: "internal linked list of hooks per component — order is identity.",
              en: "Internal linked list of hooks per component — order is identity.",
            },
          },
          {
            q: { ar: "loops with hooks؟", en: "Loops with hooks?" },
            a: {
              ar: "never — map to child components each with own hooks.",
              en: "Never — map to child components each with own hooks.",
            },
          },
          {
            q: { ar: "eslint config؟", en: "eslint config?" },
            a: {
              ar: "plugins: ['react-hooks'], rules: { 'react-hooks/rules-of-hooks': 'error' }",
              en: "plugins: ['react-hooks'], rules: { 'react-hooks/rules-of-hooks': 'error' }",
            },
          },
          {
            q: { ar: "StrictMode double hooks؟", en: "StrictMode double hooks?" },
            a: {
              ar: "dev only — surfaces impure effects not hook count change.",
              en: "Dev only — surfaces impure effects not hook count change.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: React Router.",
          en: "Next: React Router.",
        },
      },
    ],
  ),

  "05-routing": stage(
    "05-routing",
    5,
    { ar: "التوجيه", en: "Routing" },
    {
      ar: "React Router — routes، nested layouts، protected routes.",
      en: "React Router — routes, nested layouts, protected routes.",
    },
    [
      {
        slug: "01-react-router",
        order: 1,
        duration: 48,
        title: { ar: "React Router", en: "React Router" },
        summary: {
          ar: "BrowserRouter، Routes، Route، Link، useParams.",
          en: "BrowserRouter, Routes, Route, Link, useParams.",
        },
        focus: {
          ar: "SPA routing — URL changes بدون full page reload. React Router maps path → component.",
          en: "SPA routing — URL changes without full page reload. React Router maps path → component.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Setup", en: "Setup" },
            body: {
              ar: "npm i react-router-dom. <BrowserRouter><Routes><Route path=\"/\" element={<Home />} /><Route path=\"/tracks/:slug\" element={<Track />} /></Routes></BrowserRouter>. Vite historyApiFallback for dev.",
              en: "npm i react-router-dom. <BrowserRouter><Routes><Route path=\"/\" element={<Home />} /><Route path=\"/tracks/:slug\" element={<Track />} /></Routes></BrowserRouter>. Vite historyApiFallback for dev.",
            },
          },
          {
            title: { ar: "Link و NavLink", en: "Link & NavLink" },
            body: {
              ar: "<Link to=\"/tracks/react\">React</Link> — client navigation. NavLink adds active className for nav bars.",
              en: "<Link to=\"/tracks/react\">React</Link> — client navigation. NavLink adds active className for nav bars.",
            },
          },
          {
            title: { ar: "URL params", en: "URL params" },
            body: {
              ar: "const { slug } = useParams(); useParams reads :slug from path. useSearchParams for ?locale=ar query strings.",
              en: "const { slug } = useParams(); useParams reads :slug from path. useSearchParams for ?locale=ar query strings.",
            },
          },
          {
            title: { ar: "404 route", en: "404 route" },
            body: {
              ar: "<Route path=\"*\" element={<NotFound />} /> — catch-all last in Routes.",
              en: "<Route path=\"*\" element={<NotFound />} /> — catch-all last in Routes.",
            },
          },
        ],
        codeSource: `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

function TrackPage() {
  const { slug } = useParams();
  return <h1>Track: {slug}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tracks/react">React</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>AlefYa</h1>} />
        <Route path="/tracks/:slug" element={<TrackPage />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}`,
        codeExplain: {
          ar: "minimal SPA — expand في nested routes.",
          en: "Minimal SPA — expand in nested routes.",
        },
        faqs: [
          {
            q: { ar: "HashRouter vs BrowserRouter؟", en: "HashRouter vs BrowserRouter?" },
            a: {
              ar: "BrowserRouter clean URLs — server must fallback to index.html.",
              en: "BrowserRouter clean URLs — server must fallback to index.html.",
            },
          },
          {
            q: { ar: "Navigate component؟", en: "Navigate component?" },
            a: {
              ar: "redirect declarative — <Navigate to=\"/login\" replace />",
              en: "Declarative redirect — <Navigate to=\"/login\" replace />",
            },
          },
          {
            q: { ar: "useNavigate؟", en: "useNavigate?" },
            a: {
              ar: "imperative navigate after form submit: navigate('/success')",
              en: "Imperative navigate after form submit: navigate('/success')",
            },
          },
          {
            q: { ar: "React Router v6 vs v5؟", en: "React Router v6 vs v5?" },
            a: {
              ar: "v6: Routes not Switch, element not component.",
              en: "v6: Routes not Switch, element not component.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: nested routes و Outlet.",
          en: "Next: nested routes and Outlet.",
        },
      },
      {
        slug: "02-nested-routes",
        order: 2,
        duration: 46,
        title: { ar: "Nested Routes", en: "Nested routes" },
        summary: {
          ar: "Layout routes، Outlet، index routes، relative links.",
          en: "Layout routes, Outlet, index routes, relative links.",
        },
        focus: {
          ar: "Track layout يبقى ثابتاً — lesson list/detail يتبدل في Outlet.",
          en: "Track layout stays fixed — lesson list/detail swap inside Outlet.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Layout + Outlet", en: "Layout + Outlet" },
            body: {
              ar: "function TrackLayout() { return <div><Sidebar /><Outlet /></div>; } Route path=\"tracks/:slug\" element={<TrackLayout />}> nested Route children.",
              en: "function TrackLayout() { return <div><Sidebar /><Outlet /></div>; } Route path=\"tracks/:slug\" element={<TrackLayout />}> nested Route children.",
            },
          },
          {
            title: { ar: "Index route", en: "Index route" },
            body: {
              ar: "<Route index element={<TrackOverview />} /> — default child at parent path. /tracks/react shows overview.",
              en: "<Route index element={<TrackOverview />} /> — default child at parent path. /tracks/react shows overview.",
            },
          },
          {
            title: { ar: "Relative paths", en: "Relative paths" },
            body: {
              ar: "nested Route path=\"lessons/:lessonSlug\" — full path builds automatically. Link to=\"lessons/01-hooks\" relative.",
              en: "nested Route path=\"lessons/:lessonSlug\" — full path builds automatically. Link to=\"lessons/01-hooks\" relative.",
            },
          },
          {
            title: { ar: "useOutletContext", en: "useOutletContext" },
            body: {
              ar: "parent <Outlet context={{ track }} /> — child useOutletContext() reads track without prop drilling through Outlet.",
              en: "parent <Outlet context={{ track }} /> — child useOutletContext() reads track without prop drilling through Outlet.",
            },
          },
        ],
        codeSource: `import { Routes, Route, Outlet, Link, useParams } from "react-router-dom";

function TrackLayout() {
  const { slug } = useParams();
  return (
    <div className="track-layout">
      <aside>
        <Link to="lessons/01-intro">Intro</Link>
      </aside>
      <Outlet context={{ slug }} />
    </div>
  );
}

// In router config:
// <Route path="tracks/:slug" element={<TrackLayout />}>
//   <Route index element={<TrackHome />} />
//   <Route path="lessons/:lessonSlug" element={<LessonPage />} />
// </Route>`,
        codeExplain: {
          ar: "AlefYa-like layout — sidebar + content area.",
          en: "AlefYa-like layout — sidebar + content area.",
        },
        faqs: [
          {
            q: { ar: "absolute nested path؟", en: "Absolute nested path?" },
            a: {
              ar: "path=\"/admin\" from nested — escapes parent. rare.",
              en: "path=\"/admin\" from nested — escapes parent. Rare.",
            },
          },
          {
            q: { ar: "multiple Outlets؟", en: "Multiple Outlets?" },
            a: {
              ar: "named outlets advanced — single Outlet common.",
              en: "Named outlets advanced — single Outlet common.",
            },
          },
          {
            q: { ar: "loader API؟", en: "Loader API?" },
            a: {
              ar: "React Router data APIs — fetch before render. optional advanced.",
              en: "React Router data APIs — fetch before render. Optional advanced.",
            },
          },
          {
            q: { ar: "breadcrumb from routes؟", en: "Breadcrumb from routes?" },
            a: {
              ar: "useMatches() returns route chain — build breadcrumb.",
              en: "useMatches() returns route chain — build breadcrumb.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: protected routes.",
          en: "Next: protected routes.",
        },
      },
      {
        slug: "03-protected-routes",
        order: 3,
        duration: 44,
        title: { ar: "Protected Routes", en: "Protected routes" },
        summary: {
          ar: "Auth guard — redirect unauthenticated users.",
          en: "Auth guard — redirect unauthenticated users.",
        },
        focus: {
          ar: "RequireAuth wrapper يقرأ auth state — Navigate to login if missing.",
          en: "RequireAuth wrapper reads auth state — Navigate to login if missing.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "RequireAuth component", en: "RequireAuth component" },
            body: {
              ar: "function RequireAuth({ children }) { const { user } = useAuth(); if (!user) return <Navigate to=\"/login\" state={{ from: location }} replace />; return children; } wrap protected routes.",
              en: "function RequireAuth({ children }) { const { user } = useAuth(); if (!user) return <Navigate to=\"/login\" state={{ from: location }} replace />; return children; } wrap protected routes.",
            },
          },
          {
            title: { ar: "Return URL", en: "Return URL" },
            body: {
              ar: "login reads location.state.from — after success navigate(from). preserves deep links.",
              en: "login reads location.state.from — after success navigate(from). Preserves deep links.",
            },
          },
          {
            title: { ar: "Role-based routes", en: "Role-based routes" },
            body: {
              ar: "if (user.role !== 'admin') return <Forbidden />. combine with RequireAuth.",
              en: "if (user.role !== 'admin') return <Forbidden />. Combine with RequireAuth.",
            },
          },
          {
            title: { ar: "Loading auth", en: "Loading auth" },
            body: {
              ar: "while (authLoading) return <Spinner /> — avoid flash redirect before token check.",
              en: "while (authLoading) return <Spinner /> — avoid flash redirect before token check.",
            },
          },
        ],
        codeSource: `import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Checking session...</p>;
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Usage:
// <Route path="/dashboard" element={
//   <RequireAuth><Dashboard /></RequireAuth>
// } />`,
        codeExplain: {
          ar: "state.from — UX pattern بعد login.",
          en: "state.from — UX pattern after login.",
        },
        faqs: [
          {
            q: { ar: "JWT في localStorage؟", en: "JWT in localStorage?" },
            a: {
              ar: "common tutorial pattern — httpOnly cookies أكثر أماناً production.",
              en: "Common tutorial pattern — httpOnly cookies safer in production.",
            },
          },
          {
            q: { ar: "logout navigate؟", en: "logout navigate?" },
            a: {
              ar: "clear auth + navigate('/') — reset protected state.",
              en: "clear auth + navigate('/') — reset protected state.",
            },
          },
          {
            q: { ar: "server-side auth؟", en: "Server-side auth?" },
            a: {
              ar: "client guard UX only — API must validate token.",
              en: "Client guard UX only — API must validate token.",
            },
          },
          {
            q: { ar: "lazy load protected؟", en: "Lazy load protected?" },
            a: {
              ar: "React.lazy + RequireAuth — code split admin pages.",
              en: "React.lazy + RequireAuth — code split admin pages.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: controlled forms.",
          en: "Next: controlled forms.",
        },
      },
    ],
  ),

  "06-data-forms": stage(
    "06-data-forms",
    6,
    { ar: "البيانات والنماذج", en: "Data & forms" },
    {
      ar: "Controlled forms، fetch، loading و error UI.",
      en: "Controlled forms, fetch, loading and error UI.",
    },
    [
      {
        slug: "01-controlled-forms",
        order: 1,
        duration: 50,
        title: { ar: "Controlled Forms", en: "Controlled forms" },
        summary: {
          ar: "React state drives input values — single source of truth.",
          en: "React state drives input values — single source of truth.",
        },
        focus: {
          ar: "value + onChange on every input. form onSubmit preventDefault.",
          en: "value + onChange on every input. form onSubmit preventDefault.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Controlled inputs", en: "Controlled inputs" },
            body: {
              ar: "<input value={email} onChange={e => setEmail(e.target.value)} /> — React owns value. uncontrolled uses ref — rare in modern React forms.",
              en: "<input value={email} onChange={e => setEmail(e.target.value)} /> — React owns value. Uncontrolled uses ref — rare in modern React forms.",
            },
          },
          {
            title: { ar: "Form submit", en: "Form submit" },
            body: {
              ar: "function handleSubmit(e) { e.preventDefault(); if (!valid) return; api.post(form); }. disable button while submitting.",
              en: "function handleSubmit(e) { e.preventDefault(); if (!valid) return; api.post(form); }. Disable button while submitting.",
            },
          },
          {
            title: { ar: "Multiple fields", en: "Multiple fields" },
            body: {
              ar: "single object state: { title: { ar: '', en: '' }, duration: 45 }. handleChange(field, value) or name attribute pattern.",
              en: "Single object state: { title: { ar: '', en: '' }, duration: 45 }. handleChange(field, value) or name attribute pattern.",
            },
          },
          {
            title: { ar: "Validation", en: "Validation" },
            body: {
              ar: "client validation before submit — required, min length. show errors next to fields. server errors map to fields after response.",
              en: "Client validation before submit — required, min length. Show errors next to fields. Map server errors after response.",
            },
          },
        ],
        codeSource: `import { useState } from "react";

export function LessonForm({ onSave }) {
  const [form, setForm] = useState({
    titleAr: "",
    titleEn: "",
    duration: 45,
  });
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.titleAr.trim()) next.titleAr = "Required";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    onSave({
      title: { ar: form.titleAr, en: form.titleEn },
      duration: Number(form.duration),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.titleAr}
        onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
        aria-invalid={!!errors.titleAr}
      />
      {errors.titleAr && <span>{errors.titleAr}</span>}
      <button type="submit">Save</button>
    </form>
  );
}`,
        codeExplain: {
          ar: "bilingual lesson form — AlefYa admin pattern.",
          en: "Bilingual lesson form — AlefYa admin pattern.",
        },
        faqs: [
          {
            q: { ar: "react-hook-form؟", en: "react-hook-form?" },
            a: {
              ar: "library for large forms — learn controlled first.",
              en: "Library for large forms — learn controlled first.",
            },
          },
          {
            q: { ar: "textarea controlled؟", en: "Controlled textarea?" },
            a: {
              ar: "same value/onChange — children not defaultValue.",
              en: "Same value/onChange — no defaultValue children.",
            },
          },
          {
            q: { ar: "select multiple؟", en: "Select multiple?" },
            a: {
              ar: "value array + onChange e.target.selectedOptions.",
              en: "value array + onChange e.target.selectedOptions.",
            },
          },
          {
            q: { ar: "file input؟", en: "File input?" },
            a: {
              ar: "often uncontrolled — e.target.files[0] on change.",
              en: "Often uncontrolled — e.target.files[0] on change.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: fetch data في components.",
          en: "Next: fetch data in components.",
        },
      },
      {
        slug: "02-fetch-data",
        order: 2,
        duration: 48,
        title: { ar: "Fetch Data", en: "Fetch data" },
        summary: {
          ar: "Loading tracks/lessons — useEffect، custom hooks، POST/PUT.",
          en: "Loading tracks/lessons — useEffect, custom hooks, POST/PUT.",
        },
        focus: {
          ar: "Separate data layer from UI — hook or service function + component renders states.",
          en: "Separate data layer from UI — hook or service function + component renders states.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "GET lists", en: "GET lists" },
            body: {
              ar: "useEffect fetch /api/tracks → setTracks. refetch on filter change via deps. pagination: page in deps.",
              en: "useEffect fetch /api/tracks → setTracks. Refetch on filter change via deps. Pagination: page in deps.",
            },
          },
          {
            title: { ar: "POST mutations", en: "POST mutations" },
            body: {
              ar: "async function createLesson(body) { const res = await fetch('/api/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }. optimistic UI optional.",
              en: "async function createLesson(body) { const res = await fetch('/api/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }. Optimistic UI optional.",
            },
          },
          {
            title: { ar: "Service module", en: "Service module" },
            body: {
              ar: "api/lessons.js exports fetchLessons, createLesson — components import not raw fetch scattered.",
              en: "api/lessons.js exports fetchLessons, createLesson — components import not raw fetch scattered.",
            },
          },
          {
            title: { ar: "Environment base URL", en: "Environment base URL" },
            body: {
              ar: "const BASE = import.meta.env.VITE_API_URL — Vite env prefix VITE_.",
              en: "const BASE = import.meta.env.VITE_API_URL — Vite env prefix VITE_.",
            },
          },
        ],
        codeSource: `const API = import.meta.env.VITE_API_URL ?? "";

export async function fetchTracks() {
  const res = await fetch(\`\${API}/tracks\`);
  if (!res.ok) throw new Error(\`Failed: \${res.status}\`);
  return res.json();
}

export async function createLesson(payload) {
  const res = await fetch(\`\${API}/lessons\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}`,
        codeExplain: {
          ar: "api module — testable بدون React.",
          en: "API module — testable without React.",
        },
        faqs: [
          {
            q: { ar: "CORS errors؟", en: "CORS errors?" },
            a: {
              ar: "server must allow origin — dev proxy in vite.config.",
              en: "Server must allow origin — dev proxy in vite.config.",
            },
          },
          {
            q: { ar: "credentials cookies؟", en: "Credentials cookies?" },
            a: {
              ar: "fetch(url, { credentials: 'include' }) — with CORS config.",
              en: "fetch(url, { credentials: 'include' }) — with CORS config.",
            },
          },
          {
            q: { ar: "debounce search fetch؟", en: "Debounce search fetch?" },
            a: {
              ar: "useEffect + setTimeout cleanup — or useDeferredValue.",
              en: "useEffect + setTimeout cleanup — or useDeferredValue.",
            },
          },
          {
            q: { ar: "cache responses؟", en: "Cache responses?" },
            a: {
              ar: "TanStack Query — staleTime. manual Map cache possible.",
              en: "TanStack Query — staleTime. Manual Map cache possible.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: loading و error states UI.",
          en: "Next: loading and error states UI.",
        },
      },
      {
        slug: "03-loading-errors",
        order: 3,
        duration: 45,
        title: { ar: "Loading و Errors", en: "Loading & errors" },
        summary: {
          ar: "UI patterns: skeleton، retry، error boundaries intro.",
          en: "UI patterns: skeleton, retry, error boundaries intro.",
        },
        focus: {
          ar: "Every async UI needs loading + error + empty + success states — explicit not accidental.",
          en: "Every async UI needs loading + error + empty + success states — explicit not accidental.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "State machine mental model", en: "State machine mental model" },
            body: {
              ar: "idle → loading → success | error. boolean flags (loading, error) or status enum 'loading'|'error'|'success'. mutually exclusive render branches.",
              en: "idle → loading → success | error. Boolean flags (loading, error) or status enum 'loading'|'error'|'success'. Mutually exclusive render branches.",
            },
          },
          {
            title: { ar: "Skeleton UI", en: "Skeleton UI" },
            body: {
              ar: "placeholder shapes while loading — better UX than blank. match layout of final content to avoid layout shift.",
              en: "Placeholder shapes while loading — better UX than blank. Match final layout to avoid layout shift.",
            },
          },
          {
            title: { ar: "Retry", en: "Retry" },
            body: {
              ar: "error UI: message + <button onClick={refetch}>Retry</button>. refetch re-runs fetch function from hook.",
              en: "Error UI: message + <button onClick={refetch}>Retry</button>. refetch re-runs fetch function from hook.",
            },
          },
          {
            title: { ar: "Error Boundary", en: "Error Boundary" },
            body: {
              ar: "class component componentDidCatch — catches render errors not async. wrap route sections. React 19 error boundaries evolving.",
              en: "Class component componentDidCatch — catches render errors not async. Wrap route sections. React 19 error boundaries evolving.",
            },
          },
        ],
        codeSource: `function TrackList() {
  const { data, loading, error, refetch } = useTracks();

  if (loading) {
    return (
      <ul aria-busy="true">
        {[1, 2, 3].map((i) => (
          <li key={i} className="skeleton" />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button type="button" onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!data?.length) return <p>No tracks published yet.</p>;

  return (
    <ul>
      {data.map((t) => (
        <li key={t.slug}>{t.title.en}</li>
      ))}
    </ul>
  );
}`,
        codeExplain: {
          ar: "four states — checklist لكل data component.",
          en: "Four states — checklist for every data component.",
        },
        faqs: [
          {
            q: { ar: "Suspense for fetch؟", en: "Suspense for fetch?" },
            a: {
              ar: "React 19 / frameworks — fallback UI. manual states still essential learning.",
              en: "React 19 / frameworks — fallback UI. Manual states still essential learning.",
            },
          },
          {
            q: { ar: "toast vs inline error؟", en: "Toast vs inline error?" },
            a: {
              ar: "inline for form field errors — toast for global failures.",
              en: "Inline for form field errors — toast for global failures.",
            },
          },
          {
            q: { ar: "error boundary async؟", en: "Error boundary async?" },
            a: {
              ar: "no — handle async errors in state.",
              en: "No — handle async errors in state.",
            },
          },
          {
            q: { ar: "aria-busy؟", en: "aria-busy?" },
            a: {
              ar: "accessibility — screen readers know loading.",
              en: "Accessibility — screen readers know loading.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: composition patterns.",
          en: "Next: composition patterns.",
        },
      },
    ],
  ),

  "07-patterns": stage(
    "07-patterns",
    7,
    { ar: "أنماط React", en: "React patterns" },
    {
      ar: "Composition، Context، performance basics.",
      en: "Composition, Context, performance basics.",
    },
    [
      {
        slug: "01-composition",
        order: 1,
        duration: 46,
        title: { ar: "Composition", en: "Composition" },
        summary: {
          ar: "children، render props lite، compound components idea.",
          en: "children, render props lite, compound components idea.",
        },
        focus: {
          ar: "Prefer composing small components over props explosion or inheritance.",
          en: "Prefer composing small components over props explosion or inheritance.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "children pattern", en: "children pattern" },
            body: {
              ar: "function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; } — flexible slot for any content. Layout components heavily use children.",
              en: "function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; } — flexible slot for any content. Layout components heavily use children.",
            },
          },
          {
            title: { ar: "Specialized subcomponents", en: "Specialized subcomponents" },
            body: {
              ar: "Tabs, TabList, TabPanel — export together, share implicit structure. user composes: <Tabs><TabList>...</TabList><TabPanel>...</TabPanel></Tabs>.",
              en: "Tabs, TabList, TabPanel — export together, share implicit structure. User composes: <Tabs><TabList>...</TabList><TabPanel>...</TabPanel></Tabs>.",
            },
          },
          {
            title: { ar: "Container vs presentational", en: "Container vs presentational" },
            body: {
              ar: "TrackListContainer fetches data — TrackListView pure props. separates data from UI — easier test and reuse.",
              en: "TrackListContainer fetches data — TrackListView pure props. Separates data from UI — easier test and reuse.",
            },
          },
          {
            title: { ar: "Avoid prop drilling with composition", en: "Avoid prop drilling with composition" },
            body: {
              ar: "pass JSX as prop: <Layout sidebar={<Filters track={track} />} /> — sometimes cleaner than Context for one-off.",
              en: "Pass JSX as prop: <Layout sidebar={<Filters track={track} />} /> — sometimes cleaner than Context for one-off.",
            },
          },
        ],
        codeSource: `function Page({ header, sidebar, children }) {
  return (
    <div className="page">
      <header>{header}</header>
      <div className="page-body">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Page
      header={<h1>AlefYa Learner</h1>}
      sidebar={<TrackNav slug="react" />}
    >
      <LessonContent />
    </Page>
  );
}`,
        codeExplain: {
          ar: "Page layout — composition over monolith App JSX.",
          en: "Page layout — composition over monolith App JSX.",
        },
        faqs: [
          {
            q: { ar: "inheritance في React؟", en: "Inheritance in React?" },
            a: {
              ar: "deprecated pattern — composition official recommendation.",
              en: "Deprecated pattern — composition is official recommendation.",
            },
          },
          {
            q: { ar: "render props؟", en: "Render props?" },
            a: {
              ar: "prop as function children — less common with hooks.",
              en: "Prop as function children — less common with hooks.",
            },
          },
          {
            q: { ar: "slot naming؟", en: "Slot naming?" },
            a: {
              ar: "React uses props: header, footer, not Vue slots syntax.",
              en: "React uses props: header, footer, not Vue slot syntax.",
            },
          },
          {
            q: { ar: "HOC؟", en: "HOC?" },
            a: {
              ar: "higher-order component — wrappers rare now; hooks replace most.",
              en: "Higher-order component — wrappers rare now; hooks replace most.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Context API.",
          en: "Next: Context API.",
        },
      },
      {
        slug: "02-context",
        order: 2,
        duration: 50,
        title: { ar: "Context", en: "Context" },
        summary: {
          ar: "createContext، Provider، useContext — theme، locale، auth.",
          en: "createContext, Provider, useContext — theme, locale, auth.",
        },
        focus: {
          ar: "Context broadcasts value to deep tree without drilling — split contexts by update frequency.",
          en: "Context broadcasts value to deep tree without drilling — split contexts by update frequency.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "createContext + Provider", en: "createContext + Provider" },
            body: {
              ar: "const LocaleContext = createContext('ar'); <LocaleContext.Provider value={locale}>...</LocaleContext.Provider>. default value for tests without provider.",
              en: "const LocaleContext = createContext('ar'); <LocaleContext.Provider value={locale}>...</LocaleContext.Provider>. Default value for tests without provider.",
            },
          },
          {
            title: { ar: "useContext", en: "useContext" },
            body: {
              ar: "const locale = useContext(LocaleContext); any descendant reads. re-render when context value changes — all consumers update.",
              en: "const locale = useContext(LocaleContext); any descendant reads. Re-render when context value changes — all consumers update.",
            },
          },
          {
            title: { ar: "Custom provider hook", en: "Custom provider hook" },
            body: {
              ar: "function LocaleProvider({ children }) { const [locale, setLocale] = useState('ar'); const value = useMemo(() => ({ locale, setLocale }), [locale]); return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>; }",
              en: "function LocaleProvider({ children }) { const [locale, setLocale] = useState('ar'); const value = useMemo(() => ({ locale, setLocale }), [locale]); return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>; }",
            },
          },
          {
            title: { ar: "When not Context", en: "When not Context" },
            body: {
              ar: "frequent updates (mouse position) — avoid. server cache — TanStack Query. Context for theme, auth user, locale — low churn.",
              en: "Frequent updates (mouse position) — avoid. Server cache — TanStack Query. Context for theme, auth user, locale — low churn.",
            },
          },
        ],
        codeSource: `import { createContext, useContext, useMemo, useState } from "react";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState("ar");
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale requires LocaleProvider");
  return ctx;
}

function Title({ bilingual }) {
  const { locale } = useLocale();
  return <h1>{bilingual[locale]}</h1>;
}`,
        codeExplain: {
          ar: "AlefYa locale pattern — ar/en toggle app-wide.",
          en: "AlefYa locale pattern — ar/en toggle app-wide.",
        },
        faqs: [
          {
            q: { ar: "Context vs Redux؟", en: "Context vs Redux?" },
            a: {
              ar: "Context built-in — enough for theme/auth. Redux complex global with middleware.",
              en: "Context built-in — enough for theme/auth. Redux for complex global with middleware.",
            },
          },
          {
            q: { ar: "multiple contexts؟", en: "Multiple contexts?" },
            a: {
              ar: "split — ThemeContext, AuthContext — avoid one mega context.",
              en: "Split — ThemeContext, AuthContext — avoid one mega context.",
            },
          },
          {
            q: { ar: "Provider hell؟", en: "Provider hell?" },
            a: {
              ar: "compose providers helper or single AppProviders component.",
              en: "Compose providers helper or single AppProviders component.",
            },
          },
          {
            q: { ar: "context performance؟", en: "Context performance?" },
            a: {
              ar: "memoize value object — split contexts — memo children.",
              en: "Memoize value object — split contexts — memo children.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: performance optimization.",
          en: "Next: performance optimization.",
        },
      },
      {
        slug: "03-performance",
        order: 3,
        duration: 48,
        title: { ar: "Performance", en: "Performance" },
        summary: {
          ar: "React.memo، lazy، code splitting، measure before optimize.",
          en: "React.memo, lazy, code splitting, measure before optimize.",
        },
        focus: {
          ar: "Profile with React DevTools Profiler — then memo, lazy, virtualize.",
          en: "Profile with React DevTools Profiler — then memo, lazy, virtualize.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "React.memo", en: "React.memo" },
            body: {
              ar: "memo(Component) skips re-render if props shallow equal. useless if parent passes new object/function every render — pair with useMemo/useCallback.",
              en: "memo(Component) skips re-render if props shallow equal. Useless if parent passes new object/function every render — pair with useMemo/useCallback.",
            },
          },
          {
            title: { ar: "lazy + Suspense", en: "lazy + Suspense" },
            body: {
              ar: "const Admin = lazy(() => import('./Admin.jsx')); <Suspense fallback={<Spinner />}><Admin /></Suspense> — splits bundle, loads on route.",
              en: "const Admin = lazy(() => import('./Admin.jsx')); <Suspense fallback={<Spinner />}><Admin /></Suspense> — splits bundle, loads on route.",
            },
          },
          {
            title: { ar: "List virtualization", en: "List virtualization" },
            body: {
              ar: "1000+ rows — render visible only (@tanstack/react-virtual). keys + stable items still matter.",
              en: "1000+ rows — render visible only (@tanstack/react-virtual). keys + stable items still matter.",
            },
          },
          {
            title: { ar: "Measure first", en: "Measure first" },
            body: {
              ar: "Premature memo adds complexity. Profiler shows slow commits — optimize hot paths. avoid inline object literals in props to memoized children.",
              en: "Premature memo adds complexity. Profiler shows slow commits — optimize hot paths. Avoid inline object literals in props to memoized children.",
            },
          },
        ],
        codeSource: `import { lazy, Suspense, memo } from "react";

const Dashboard = lazy(() => import("./Dashboard.jsx"));

const Stat = memo(function Stat({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
});

function App() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Dashboard />
    </Suspense>
  );
}`,
        codeExplain: {
          ar: "lazy route + memo presentational — capstone prep.",
          en: "Lazy route + memo presentational — capstone prep.",
        },
        faqs: [
          {
            q: { ar: "memo every component؟", en: "memo every component?" },
            a: {
              ar: "no — overhead. target list items and heavy charts.",
              en: "No — overhead. Target list items and heavy charts.",
            },
          },
          {
            q: { ar: "useMemo vs memo؟", en: "useMemo vs memo?" },
            a: {
              ar: "useMemo caches value — memo caches component render.",
              en: "useMemo caches value — memo caches component render.",
            },
          },
          {
            q: { ar: "key prop performance؟", en: "key prop performance?" },
            a: {
              ar: "stable keys help reconciliation — wrong keys cause remount cost.",
              en: "Stable keys help reconciliation — wrong keys cause remount cost.",
            },
          },
          {
            q: { ar: "React 19 compiler؟", en: "React 19 compiler?" },
            a: {
              ar: "auto memoization coming — still understand manual tools.",
              en: "Auto memoization coming — still understand manual tools.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: تصميم مشروع capstone.",
          en: "Next: capstone project design.",
        },
      },
    ],
  ),

  "08-project": stage(
    "08-project",
    8,
    { ar: "المشروع التطبيقي", en: "Capstone project" },
    {
      ar: "تصميم، تنفيذ، و polish لتطبيق learner UI.",
      en: "Design, implement, and polish a learner UI app.",
    },
    [
      {
        slug: "01-design",
        order: 1,
        duration: 55,
        title: { ar: "تصميم التطبيق", en: "App design" },
        summary: {
          ar: "Wireframes، routes، component tree، data model لـ AlefYa-style learner app.",
          en: "Wireframes, routes, component tree, data model for AlefYa-style learner app.",
        },
        focus: {
          ar: "Plan before code — pages، shared layout، API contracts، bilingual fields.",
          en: "Plan before code — pages, shared layout, API contracts, bilingual fields.",
        },
        stack: "javascript",
        ideas: [
          {
            title: { ar: "Feature scope", en: "Feature scope" },
            body: {
              ar: "MVP: track list، track detail with lesson sidebar، lesson reader، locale toggle، progress checkmarks (localStorage). out of scope v1: auth admin، comments.",
              en: "MVP: track list, track detail with lesson sidebar, lesson reader, locale toggle, progress checkmarks (localStorage). Out of scope v1: admin auth, comments.",
            },
          },
          {
            title: { ar: "Route map", en: "Route map" },
            body: {
              ar: "/ tracks index. /tracks/:slug overview. /tracks/:slug/lessons/:lessonSlug reader. /404. sketch on paper before App.jsx grows.",
              en: "/ tracks index. /tracks/:slug overview. /tracks/:slug/lessons/:lessonSlug reader. /404. Sketch on paper before App.jsx grows.",
            },
          },
          {
            title: { ar: "Component tree", en: "Component tree" },
            body: {
              ar: "AppProviders (Locale, Progress) → Router → Layout (Header, Outlet) → TrackLayout (Sidebar, LessonOutlet). leaf: LessonSection, CodeBlock, Checklist.",
              en: "AppProviders (Locale, Progress) → Router → Layout (Header, Outlet) → TrackLayout (Sidebar, LessonOutlet). Leaves: LessonSection, CodeBlock, Checklist.",
            },
          },
          {
            title: { ar: "Data shapes", en: "Data shapes" },
            body: {
              ar: "Track { slug, title: {ar,en}, stages[] }. Lesson { slug, title, summary, sections[] }. align with static JSON or mock API — same shapes as AlefYa content.",
              en: "Track { slug, title: {ar,en}, stages[] }. Lesson { slug, title, summary, sections[] }. Align with static JSON or mock API — same shapes as AlefYa content.",
            },
          },
        ],
        codeSource: `/*
 * Capstone route map (sketch)
 *
 * /                     -> TrackListPage
 * /tracks/:slug         -> TrackLayout + TrackOverview (index)
 * /tracks/:slug/lessons/:lessonSlug -> LessonPage
 *
 * Context: LocaleProvider, ProgressProvider (localStorage)
 * Hooks: useTracks, useLesson, useProgress
 *
 * Components:
 *   Layout, TrackCard, StageNav, LessonContent, BilingualText
 */`,
        codeExplain: {
          ar: "comment blueprint — انسخ لREADME مشروعك.",
          en: "Comment blueprint — copy to your project README.",
        },
        faqs: [
          {
            q: { ar: "Figma required؟", en: "Figma required?" },
            a: {
              ar: "paper wireframe كافٍ — clarity over pixels.",
              en: "Paper wireframe enough — clarity over pixels.",
            },
          },
          {
            q: { ar: "mock API؟", en: "Mock API?" },
            a: {
              ar: "public/ JSON files + fetch — or json-server dev.",
              en: "public/ JSON files + fetch — or json-server dev.",
            },
          },
          {
            q: { ar: "TypeScript؟", en: "TypeScript?" },
            a: {
              ar: "optional upgrade — JSDoc types if staying JS.",
              en: "Optional upgrade — JSDoc types if staying JS.",
            },
          },
          {
            q: { ar: "scope creep؟", en: "Scope creep?" },
            a: {
              ar: "ship MVP first — polish lesson third stage.",
              en: "Ship MVP first — polish in lesson three.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: تنفيذ الميزات الأساسية.",
          en: "Next: implement core features.",
        },
      },
      {
        slug: "02-implement",
        order: 2,
        duration: 55,
        title: { ar: "التنفيذ", en: "Implementation" },
        summary: {
          ar: "Build routes، fetch content، lesson UI، progress persistence.",
          en: "Build routes, fetch content, lesson UI, progress persistence.",
        },
        focus: {
          ar: "Vertical slices: one route end-to-end before polishing all pages.",
          en: "Vertical slices: one route end-to-end before polishing all pages.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Bootstrap project", en: "Bootstrap project" },
            body: {
              ar: "npm create vite@latest alefya-learner -- --template react. install react-router-dom. folder structure: components/, hooks/, pages/, api/, context/.",
              en: "npm create vite@latest alefya-learner -- --template react. install react-router-dom. folder structure: components/, hooks/, pages/, api/, context/.",
            },
          },
          {
            title: { ar: "First vertical slice", en: "First vertical slice" },
            body: {
              ar: "Track list page: fetchTracks hook → TrackCard grid → Link to /tracks/react. proves routing + data + locale before lesson reader complexity.",
              en: "Track list page: fetchTracks hook → TrackCard grid → Link to /tracks/react. Proves routing + data + locale before lesson reader complexity.",
            },
          },
          {
            title: { ar: "Lesson reader", en: "Lesson reader" },
            body: {
              ar: "LessonPage useLesson(slug) renders sections (concepts, code, checklist). Sidebar StageNav highlights active lesson. mark complete updates ProgressContext + localStorage.",
              en: "LessonPage useLesson(slug) renders sections (concepts, code, checklist). Sidebar StageNav highlights active lesson. Mark complete updates ProgressContext + localStorage.",
            },
          },
          {
            title: { ar: "Integration checklist", en: "Integration checklist" },
            body: {
              ar: "all routes work, loading/error on each fetch, locale switches all BilingualText, progress survives refresh, mobile layout acceptable.",
              en: "All routes work, loading/error on each fetch, locale switches all BilingualText, progress survives refresh, mobile layout acceptable.",
            },
          },
        ],
        codeSource: `// pages/TrackListPage.jsx
import { Link } from "react-router-dom";
import { useTracks } from "../hooks/useTracks";
import { useLocale } from "../context/LocaleContext";

export function TrackListPage() {
  const { data: tracks, loading, error } = useTracks();
  const { locale } = useLocale();

  if (loading) return <p>Loading tracks...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <ul className="track-grid">
      {tracks.map((track) => (
        <li key={track.slug}>
          <Link to={\`/tracks/\${track.slug}\`}>
            {track.title[locale]}
          </Link>
        </li>
      ))}
    </ul>
  );
}`,
        codeExplain: {
          ar: "first slice — copy pattern لباقي pages.",
          en: "First slice — copy pattern for remaining pages.",
        },
        faqs: [
          {
            q: { ar: "CSS approach؟", en: "CSS approach?" },
            a: {
              ar: "CSS modules or plain CSS — consistent tokens for color/spacing.",
              en: "CSS modules or plain CSS — consistent tokens for color/spacing.",
            },
          },
          {
            q: { ar: "git commits؟", en: "git commits?" },
            a: {
              ar: "commit per slice — routing, data, lesson UI, progress.",
              en: "Commit per slice — routing, data, lesson UI, progress.",
            },
          },
          {
            q: { ar: "stuck on fetch؟", en: "Stuck on fetch?" },
            a: {
              ar: "use AI Helper with network tab screenshot — check CORS and URL.",
              en: "Use AI Helper with network tab screenshot — check CORS and URL.",
            },
          },
          {
            q: { ar: "hardcode vs API؟", en: "Hardcode vs API?" },
            a: {
              ar: "import JSON first — swap to fetch when structure stable.",
              en: "import JSON first — swap to fetch when structure stable.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: polish — a11y، responsive، deploy.",
          en: "Next: polish — a11y, responsive, deploy.",
        },
      },
      {
        slug: "03-polish",
        order: 3,
        duration: 52,
        title: { ar: "Polish و Deploy", en: "Polish & deploy" },
        summary: {
          ar: "Accessibility، responsive CSS، SEO basics، static deploy.",
          en: "Accessibility, responsive CSS, SEO basics, static deploy.",
        },
        focus: {
          ar: "Production feel: keyboard nav، focus states، meta tags، build + host.",
          en: "Production feel: keyboard nav, focus states, meta tags, build + host.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "Accessibility pass", en: "Accessibility pass" },
            body: {
              ar: "semantic HTML: main, nav, article. focus visible on links/buttons. aria-current on active lesson. alt text on images. test Tab navigation only.",
              en: "Semantic HTML: main, nav, article. Focus visible on links/buttons. aria-current on active lesson. Alt text on images. Test Tab navigation only.",
            },
          },
          {
            title: { ar: "Responsive layout", en: "Responsive layout" },
            body: {
              ar: "sidebar collapses to drawer on mobile. readable line length for lesson prose. touch targets 44px min. test 320px and 1280px widths.",
              en: "Sidebar collapses to drawer on mobile. Readable line length for lesson prose. Touch targets 44px min. Test 320px and 1280px widths.",
            },
          },
          {
            title: { ar: "SEO & meta", en: "SEO & meta" },
            body: {
              ar: "index.html title/description. react-helmet-async per route optional. SPA still needs fallback index on host.",
              en: "index.html title/description. react-helmet-async per route optional. SPA still needs fallback index on host.",
            },
          },
          {
            title: { ar: "Build & deploy", en: "Build & deploy" },
            body: {
              ar: "npm run build → dist/. deploy Netlify/Vercel/GitHub Pages. set redirects /* /index.html 200 for client routes.",
              en: "npm run build → dist/. Deploy Netlify/Vercel/GitHub Pages. Set redirects /* /index.html 200 for client routes.",
            },
          },
        ],
        codeSource: `# Production build
npm run build

# Preview locally
npm run preview

# Netlify _redirects (public/_redirects)
/*    /index.html   200

# Environment for production API
# VITE_API_URL=https://api.example.com`,
        codeExplain: {
          ar: "build + SPA redirect — required for BrowserRouter production.",
          en: "Build + SPA redirect — required for BrowserRouter in production.",
        },
        faqs: [
          {
            q: { ar: "Lighthouse score؟", en: "Lighthouse score?" },
            a: {
              ar: "run audit — fix contrast and labels. lazy routes help performance.",
              en: "Run audit — fix contrast and labels. Lazy routes help performance.",
            },
          },
          {
            q: { ar: "env secrets in Vite؟", en: "Env secrets in Vite?" },
            a: {
              ar: "VITE_ vars exposed to client — never secret keys.",
              en: "VITE_ vars exposed to client — never secret keys.",
            },
          },
          {
            q: { ar: "custom domain؟", en: "Custom domain?" },
            a: {
              ar: "host DNS + HTTPS auto on Netlify/Vercel.",
              en: "Host DNS + HTTPS auto on Netlify/Vercel.",
            },
          },
          {
            q: { ar: "what after capstone؟", en: "What after capstone?" },
            a: {
              ar: "explore Next.js SSR، testing library، or contribute to AlefYa UI.",
              en: "Explore Next.js SSR, Testing Library, or contribute to AlefYa UI.",
            },
          },
        ],
        nextHint: {
          ar: "أكملت مسار React — راجع مشروعك وشاركه في portfolio.",
          en: "You finished the React track — review your project and add it to your portfolio.",
        },
      },
    ],
  ),
};
