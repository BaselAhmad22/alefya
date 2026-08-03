import { stage } from "./expand.mjs";

export const reactNativeTrack = {
  slug: "react-native",
  order: 5,
  title: { ar: "React Native", en: "React Native" },
  tagline: {
    ar: "من أول شاشة حتى تطبيق جوال قابل للبناء",
    en: "From first screen to a buildable mobile app",
  },
  description: {
    ar: "مسار React Native مرتّب: البيئة، المكوّنات، الأنماط، التنقل، الحالة، القوائم، واجهات الجهاز، البناء، ثم مشروع. دروس عميقة عربي/إنجليزي داخل ألف ياء.",
    en: "Ordered React Native path: environment, components, styling, navigation, state, lists, device APIs, builds, then a project. Deep bilingual lessons inside AlefYa.",
  },
  color: "#00D4FF",
  estimatedHours: 105,
  stages: [
    "01-environment",
    "02-core-ui",
    "03-styling",
    "04-navigation",
    "05-state-data",
    "06-lists-forms",
    "07-native-device",
    "08-release",
    "09-project",
  ],
};

export const reactNativeStages = {
  "01-environment": stage(
    "01-environment",
    1,
    { ar: "البيئة والأدوات", en: "Environment & tooling" },
    {
      ar: "فهم React Native، اختيار Expo أو CLI، أول تطبيق، وأدوات التطوير",
      en: "Understand React Native, choose Expo or CLI, first app, and dev tools",
    },
    [
      {
        slug: "01-what-is-rn",
        duration: 45,
        title: { ar: "ما هو React Native؟", en: "What is React Native?" },
        summary: {
          ar: "كيف يعمل React Native: جسر JavaScript إلى مكوّنات iOS/Android أصلية، ومتى يكون الخيار المناسب.",
          en: "How React Native works: JavaScript bridge to native iOS/Android components, and when it fits.",
        },
        focus: {
          ar: "React Native يتيح بناء تطبيقات جوال بـ JavaScript/TypeScript وReact — لكن بدلاً من DOM يستخدم مكوّنات أصلية مثل `View` و`Text`.",
          en: "React Native lets you build mobile apps with JavaScript/TypeScript and React — but instead of the DOM it renders native components like `View` and `Text`.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "React على الويب مقابل الجوال", en: "React on web vs mobile" },
            body: {
              ar: "في React للويب ترسم `<div>` و`<span>` ويحوّلها React DOM إلى عناصر HTML. في React Native لا يوجد HTML: `<View>` يصبح `UIView` على iOS و`android.view.View` على Android. `<Text>` يصبح `UILabel` أو `TextView`. هذا يعني أن التخطيط والأداء أقرب لتطبيق أصلي، لكن واجهة البرمجة تبقى declarative كما تعرف من React. لا تستخدم `<div>` في RN — سيفشل البناء فوراً.",
              en: "In web React you render `<div>` and `<span>` and React DOM maps them to HTML. In React Native there is no HTML: `<View>` becomes `UIView` on iOS and `android.view.View` on Android. `<Text>` becomes `UILabel` or `TextView`. Layout and performance stay closer to native apps while the API stays declarative like React. Never use `<div>` in RN — the build fails immediately.",
            },
          },
          {
            title: { ar: "الجسر (Bridge) والـ New Architecture", en: "The bridge & New Architecture" },
            body: {
              ar: "في المعمارية الكلاسيكية، JavaScript thread يتواصل مع UI thread عبر **Bridge** — تسلسل JSON للرسائل. هذا كان يسبب bottlenecks في التطبيقات الثقيلة. **New Architecture** (Fabric + TurboModules + JSI) يقلّل التسلسل ويسمح باستدعاءات مباشرة أسرع. Expo SDK الحديث يفعّل New Architecture افتراضياً في مشاريع جديدة. افهم المفهوم: JS يقرر ماذا يُرسم، native يُنفّذ الرسم.",
              en: "In the classic architecture, the JavaScript thread talks to the UI thread via a **Bridge** — JSON-serialized messages. That caused bottlenecks in heavy apps. The **New Architecture** (Fabric + TurboModules + JSI) reduces serialization and enables faster direct calls. Modern Expo SDK enables New Architecture by default in new projects. Mental model: JS decides what to render, native executes the paint.",
            },
          },
          {
            title: { ar: "متى تختار React Native", en: "When to choose React Native" },
            body: {
              ar: "RN ممتاز عندما: فريقك يعرف React، تريد iOS + Android من codebase واحد، التطبيق واجهة-heavy مع APIs شائعة (كamera، موقع، push). أقل ملاءمة عندما: تحتاج رسوميات 3D مكثّفة، كل pixel يجب أن يكون native SDK proprietary، أو latency شبه صفر في audio/gaming. تطبيق تعلّم مثل AlefYa — قوائم، دروس، تقدّم، offline — fit مثالي لـ RN.",
              en: "RN shines when: your team knows React, you want iOS + Android from one codebase, the app is UI-heavy with common APIs (camera, location, push). Less ideal when: you need heavy 3D graphics, every pixel must be a proprietary native SDK, or near-zero latency in audio/gaming. A learning app like AlefYa — lists, lessons, progress, offline — is an ideal RN fit.",
            },
          },
          {
            title: { ar: "المنظومة: Metro، Hermes، React", en: "The stack: Metro, Hermes, React" },
            body: {
              ar: "**Metro** هو bundler JS (مثل webpack لكن للجوال). **Hermes** محرك JS من Meta محسّن للموبايل — startup أسرع وذاكرة أقل. React نفسه (hooks، components، reconciliation) يعمل كما على الويب مع اختلافات: لا CSS files، لا `window`، styling عبر `StyleSheet`. Node.js يُستخدم للأدوات فقط — التطبيق على الجهاز لا يشغّل Node.",
              en: "**Metro** is the JS bundler (like webpack but for mobile). **Hermes** is Meta's mobile-tuned JS engine — faster startup, lower memory. React itself (hooks, components, reconciliation) works like the web with differences: no CSS files, no `window`, styling via `StyleSheet`. Node.js powers tooling only — the on-device app does not run Node.",
            },
          },
        ],
        codeSource: `import { View, Text, StyleSheet } from "react-native";

export default function AlefYaPreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ألف ياء</Text>
      <Text style={styles.subtitle}>React Native track</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 16, color: "#64748b", marginTop: 8 },
});`,
        codeExplain: {
          ar: "هذا أبسط شاشة RN: `View` بدل div، `Text` لكل نص (RN لا يعرض نصاً خارج Text)، و`StyleSheet.create` للأنماط.",
          en: "Simplest RN screen: `View` instead of div, `Text` for all strings (RN won't render raw text outside Text), and `StyleSheet.create` for styles.",
        },
        faqs: [
          {
            q: { ar: "هل React Native = React للويب في متصفح؟", en: "Is React Native = React in a mobile browser?" },
            a: {
              ar: "لا. لا WebView افتراضياً — المكوّنات native. WebView موجود كمكوّن منفصل عند الحاجة لعرض HTML.",
              en: "No. Not a WebView by default — components are native. WebView exists as a separate component when you need HTML.",
            },
          },
          {
            q: { ar: "هل أحتاج Mac لبناء iOS؟", en: "Do I need a Mac to build iOS?" },
            a: {
              ar: "للتطوير المحلي على Simulator نعم. مع Expo EAS Build يمكن بناء iOS من Windows/Linux في السحابة.",
              en: "For local Simulator development, yes. With Expo EAS Build you can build iOS from Windows/Linux in the cloud.",
            },
          },
          {
            q: { ar: "JavaScript أم TypeScript؟", en: "JavaScript or TypeScript?" },
            a: {
              ar: "TypeScript موصى به — Expo templates تدعمه، وtypes تمنع أخطاء props وnavigation params شائعة.",
              en: "TypeScript is recommended — Expo templates support it, and types prevent common props and navigation param bugs.",
            },
          },
          {
            q: { ar: "هل RN مناسب للمبتدئين؟", en: "Is RN good for beginners?" },
            a: {
              ar: "نعم إذا أتقنت React basics أولاً (components، props، state). هذا المسار يفترض معرفة React — راجع مسار React على ألف ياء إن لزم.",
              en: "Yes if you know React basics first (components, props, state). This track assumes React — revisit the React track on AlefYa if needed.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: Expo مقابل React Native CLI — أي مسار تختار لمشروعك.",
          en: "Next: Expo vs React Native CLI — which path for your project.",
        },
      },
      {
        slug: "02-expo-vs-cli",
        duration: 50,
        title: { ar: "Expo مقابل CLI", en: "Expo vs CLI" },
        summary: {
          ar: "مقارنة Expo (Managed/Dev Client) مع React Native CLI — متى تستخدم كل مسار وما التكلفة.",
          en: "Compare Expo (Managed/Dev Client) with React Native CLI — when to use each and the tradeoffs.",
        },
        focus: {
          ar: "Expo يبسّط البداية: CLI، SDK جاهز، EAS للبناء. CLI يعطيك تحكماً كاملاً في native folders لكن صيانة أ heavier.",
          en: "Expo simplifies onboarding: CLI, ready SDK, EAS builds. CLI gives full native folder control but heavier maintenance.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "Expo Managed Workflow", en: "Expo Managed Workflow" },
            body: {
              ar: "في **Managed** لا ترى `ios/` و`android/` — Expo SDK يغلّف native modules شائعة: `expo-camera`، `expo-location`، `expo-router`. التحديث عبر `npx expo install`. البناء عبر **EAS Build** في السحابة. مثالي لـ MVP، تطبيقات تعليمية، وفرق صغيرة. القيد: native module غير مدعوم في SDK يحتاج **prebuild** أو Dev Client.",
              en: "In **Managed** you don't touch `ios/` and `android/` — Expo SDK wraps common native modules: `expo-camera`, `expo-location`, `expo-router`. Upgrade via `npx expo install`. Builds via **EAS Build** in the cloud. Ideal for MVPs, learning apps, and small teams. Limit: unsupported native modules need **prebuild** or a Dev Client.",
            },
          },
          {
            title: { ar: "React Native CLI", en: "React Native CLI" },
            body: {
              ar: "**`npx @react-native-community/cli init`** ينشئ مشروعاً مع مجلدات native كاملة. تفتح Xcode/Android Studio، تضيف pods وGradle dependencies يدوياً. مناسب لفرق لديها مهندسين native، تكامل SDKs enterprise (Maps proprietary، payment SDKs)، أو متطلبات build pipeline خاصة. تكلفة: أنت مسؤول عن ترقية RN، fixing breaking changes في Gradle/Xcode.",
              en: "**`npx @react-native-community/cli init`** scaffolds full native folders. You open Xcode/Android Studio, add pods and Gradle deps manually. Fits teams with native engineers, enterprise SDK integration, or custom build pipelines. Cost: you own RN upgrades and Gradle/Xcode breaking fixes.",
            },
          },
          {
            title: { ar: "Expo Dev Client — الوسط", en: "Expo Dev Client — the middle ground" },
            body: {
              ar: "**Development Build** (Dev Client) = Expo tooling + native code مخصص. `npx expo prebuild` يولّد `ios/android`، تضيف native module، تبني Dev Client مرة، ثم `expo start` كالعادة. AlefYa capstone يمكن أن يبدأ Managed وينتقل لـ Dev Client إذا احتجت module خاص.",
              en: "**Development Build** (Dev Client) = Expo tooling + custom native code. `npx expo prebuild` generates `ios/android`, you add a native module, build the Dev Client once, then `expo start` as usual. The AlefYa capstone can start Managed and move to Dev Client if you need a custom module.",
            },
          },
          {
            title: { ar: "قرار عملي للمسار", en: "Practical choice for this track" },
            body: {
              ar: "مسار ألف ياء يستخدم **Expo** (SDK 52+): أسرع للتعلّم، OTA updates، EAS Build في دروس Release. تعلّم متى تحتاج `expo prebuild` — علامة: مكتبة تقول «requires linking» ولا توجد نسخة expo-*. لا تختار CLI «للتحدي» في مشروع تعليمي — ركّز على RN concepts.",
              en: "The AlefYa path uses **Expo** (SDK 52+): faster learning, OTA updates, EAS Build in Release lessons. Learn when you need `expo prebuild` — signal: a library says «requires linking» with no expo-* package. Don't pick CLI «for the challenge» in a learning project — focus on RN concepts.",
            },
          },
        ],
        codeSource: `# إنشاء مشروع Expo (مسار ألف ياء)
npx create-expo-app@latest AlefYaMobile --template blank-typescript
cd AlefYaMobile

# تشغيل على جهاز/محاكي
npx expo start

# مقارنة: CLI خام (اختياري — خارج المسار الافتراضي)
# npx @react-native-community/cli init AlefYaBare --version latest

# إضافة حزمة Expo-compatible
npx expo install expo-router react-native-safe-area-context`,
        codeExplain: {
          ar: "`create-expo-app` + `--template blank-typescript` هو baseline المسار. `expo install` يثبت إصدارات متوافقة مع SDK.",
          en: "`create-expo-app` with `--template blank-typescript` is this track's baseline. `expo install` pins SDK-compatible versions.",
        },
        faqs: [
          {
            q: { ar: "هل Expo مجاني؟", en: "Is Expo free?" },
            a: {
              ar: "Expo SDK وCLI مجانيان. EAS Build له tier مجاني محدود — كافٍ للتعلّم؛ الإنتاج قد يحتاج خطة.",
              en: "Expo SDK and CLI are free. EAS Build has a limited free tier — enough for learning; production may need a paid plan.",
            },
          },
          {
            q: { ar: "هل يمكن الخروج من Expo لاحقاً؟", en: "Can I eject from Expo later?" },
            a: {
              ar: "نعم — `expo prebuild` يولّد native projects دون «eject» القديم. تحافظ على JS codebase.",
              en: "Yes — `expo prebuild` generates native projects without old «eject». You keep the JS codebase.",
            },
          },
          {
            q: { ar: "Expo Go vs Dev Client؟", en: "Expo Go vs Dev Client?" },
            a: {
              ar: "Expo Go تطبيق جاهز لاختبار SDK المدمج. Dev Client مشروعك + native modules مخصصة — ضروري قبل الإنتاج.",
              en: "Expo Go is a prebuilt app for built-in SDK testing. Dev Client is your app + custom native modules — required before production.",
            },
          },
          {
            q: { ar: "أي template أختار؟", en: "Which template should I pick?" },
            a: {
              ar: "`blank-typescript` للمسار — tabs/router نضيفه في دروس Navigation ل تفهم كل خطوة.",
              en: "`blank-typescript` for this track — we add tabs/router in Navigation lessons so you understand each step.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: تشغيل أول تطبيق على محاكي أو جهاز حقيقي.",
          en: "Next: run your first app on a simulator or physical device.",
        },
      },
      {
        slug: "03-first-app",
        duration: 48,
        title: { ar: "أول تطبيق", en: "Your first app" },
        summary: {
          ar: "هيكل مشروع Expo، App.tsx، Fast Refresh، وتشغيل على Android/iOS/Web.",
          en: "Expo project layout, App.tsx, Fast Refresh, and running on Android/iOS/Web.",
        },
        focus: {
          ar: "تشغيل حلقة التطوير: تعديل App.tsx، حفظ، رؤية التغيير فوراً — ثم فهم entry point وملفات التكوين.",
          en: "Run the dev loop: edit App.tsx, save, see instant updates — then understand entry point and config files.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "هيكل المشروع", en: "Project structure" },
            body: {
              ar: "**`App.tsx`** — جذر واجهتك (أو `_layout.tsx` مع expo-router لاحقاً). **`app.json` / `app.config.ts`** — اسم التطبيق، bundle id، أيقونات، plugins. **`package.json`** — scripts: `expo start`، `android`، `ios`. **`assets/`** — صور وأيقونات. **`node_modules/`** — لا تعدّل. **`tsconfig.json`** — extends expo/tsconfig.base. لا تبحث عن `index.html` — entry عبر `expo-router/entry` أو `registerRootComponent`.",
              en: "**`App.tsx`** — UI root (or `_layout.tsx` with expo-router later). **`app.json` / `app.config.ts`** — app name, bundle id, icons, plugins. **`package.json`** — scripts: `expo start`, `android`, `ios`. **`assets/`** — images and icons. **`node_modules/`** — don't edit. **`tsconfig.json`** — extends expo/tsconfig.base. No `index.html` — entry via `expo-router/entry` or `registerRootComponent`.",
            },
          },
          {
            title: { ar: "Fast Refresh", en: "Fast Refresh" },
            body: {
              ar: "عند حفظ الملف، Metro يحدّث الوحدات المتغيرة دون إعادة تشغيل كاملة — **Fast Refresh**. إذا عدّلت exports غير React components أو أخطأ syntax، قد تحتاج reload يدوي (R في terminal أو shake device → Reload). Hot reload يحافظ على state؛ full reload يعيد mount. أثناء التعلّم، إذا «علّق» التطبيق — reload أول خطوة.",
              en: "On save, Metro updates changed modules without a full restart — **Fast Refresh**. If you change non-component exports or syntax breaks, manual reload (R in terminal or shake device → Reload). Hot reload keeps state; full reload remounts. While learning, if the app «freezes» — reload first.",
            },
          },
          {
            title: { ar: "تشغيل على الأجهزة", en: "Running on devices" },
            body: {
              ar: "**iOS Simulator** (Mac): `i` في Expo CLI أو Xcode Simulator. **Android Emulator**: `a` — يحتاج Android Studio + AVD. **جهاز حقيقي**: Expo Go يمسح QR (نفس Wi‑Fi). **Tunnel** (`expo start --tunnel`) إذا الشبكة تمنع LAN. **Web**: `w` — مفيد لـ UI سريع لكن ليس بديلاً لاختبار native APIs.",
              en: "**iOS Simulator** (Mac): `i` in Expo CLI or Xcode Simulator. **Android Emulator**: `a` — needs Android Studio + AVD. **Physical device**: Expo Go scans QR (same Wi‑Fi). **Tunnel** (`expo start --tunnel`) if LAN is blocked. **Web**: `w` — handy for quick UI but not a substitute for native API testing.",
            },
          },
          {
            title: { ar: "أول تعديلات AlefYa", en: "First AlefYa edits" },
            body: {
              ar: "استبدل محتوى App.tsx بشاشة ترحيب: عنوان ثنائي اللغة، زر «ابدأ» (Pressable لاحقاً). جرّب `StatusBar` من expo-status-bar. عرّف `type Locale = 'ar' | 'en'` وstate للغة — جسر لدروس State. تأكد أن النص العربي يظهر RTL صحيحاً (Expo يدعم `I18nManager` لاحقاً).",
              en: "Replace App.tsx with a welcome screen: bilingual title, a «Start» button (Pressable later). Try `StatusBar` from expo-status-bar. Define `type Locale = 'ar' | 'en'` and locale state — bridge to State lessons. Verify Arabic renders RTL correctly (Expo supports `I18nManager` later).",
            },
          },
        ],
        codeSource: `import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

type Locale = "ar" | "en";

const copy = {
  ar: { title: "مرحباً بك في ألف ياء", start: "ابدأ التعلّم" },
  en: { title: "Welcome to AlefYa", start: "Start learning" },
};

export default function App() {
  const [locale, setLocale] = useState<Locale>("ar");
  const t = copy[locale];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>{t.title}</Text>
      <Pressable
        style={styles.button}
        onPress={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
      >
        <Text style={styles.buttonText}>{t.start}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center" },
  button: { marginTop: 24, backgroundColor: "#00D4FF", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "#0f172a", fontWeight: "600" },
});`,
        codeExplain: {
          ar: "تطبيق كامل صغير: state للغة، Pressable، StatusBar. هذا نموذج شاشة AlefYa قبل Navigation.",
          en: "Small complete app: locale state, Pressable, StatusBar. AlefYa screen pattern before Navigation.",
        },
        faqs: [
          {
            q: { ar: "QR لا يعمل — ماذا أفعل؟", en: "QR code won't connect — what now?" },
            a: {
              ar: "تأكد نفس Wi‑Fi، عطّل VPN، أو استخدم `expo start --tunnel`.",
              en: "Same Wi‑Fi, disable VPN, or use `expo start --tunnel`.",
            },
          },
          {
            q: { ar: "Metro bundler error عند البداية؟", en: "Metro bundler error on start?" },
            a: {
              ar: "جرّب `npx expo start -c` لمسح cache. احذف node_modules وأعد install إن استمر.",
              en: "Try `npx expo start -c` to clear cache. Delete node_modules and reinstall if it persists.",
            },
          },
          {
            q: { ar: "هل أختبر Web فقط؟", en: "Should I test web only?" },
            a: {
              ar: "Web مكمل — لكن Safe Area، haptics، وpermissions تحتاج محاكي/جهاز.",
              en: "Web is supplemental — Safe Area, haptics, and permissions need simulator/device.",
            },
          },
          {
            q: { ar: "أين أضع الشاشات لاحقاً؟", en: "Where do screens go later?" },
            a: {
              ar: "مجلد `app/` مع expo-router (درس Navigation) أو `src/screens/` مع React Navigation.",
              en: "Folder `app/` with expo-router (Navigation lesson) or `src/screens/` with React Navigation.",
            },
          },
        ],
        nextHint: {
          ar: "الدرس التالي: React Native DevTools، logging، وReactotron.",
          en: "Next: React Native DevTools, logging, and debugging workflow.",
        },
      },
      {
        slug: "04-devtools",
        duration: 42,
        title: { ar: "أدوات التطوير", en: "DevTools & debugging" },
        summary: {
          ar: "React Native DevTools، console.log، Element Inspector، Flipper/Reactotron، وقراءة أخطاء Metro.",
          en: "React Native DevTools, console.log, Element Inspector, Flipper/Reactotron, and reading Metro errors.",
        },
        focus: {
          ar: "Debugging في RN يجمع بين أدوات React (Components tree) وأدوات native (layout، network) — تعلّم القائمة الكاملة مبكراً.",
          en: "RN debugging blends React tools (component tree) and native tools (layout, network) — learn the full toolkit early.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Developer Menu", en: "Developer Menu" },
            body: {
              ar: "هزّ الجهاز (أو Cmd+D / Cmd+M) يفتح **Developer Menu**: Reload، Debug، Show Element Inspector، Performance Monitor. في Simulator: Hardware → Shake. Enable **Fast Refresh** دائماً. **Performance Monitor** يعرض JS/UI FPS — مفيد لاكتشاف jank في Lists لاحقاً.",
              en: "Shake device (or Cmd+D / Cmd+M) opens the **Developer Menu**: Reload, Debug, Show Element Inspector, Performance Monitor. Simulator: Hardware → Shake. Keep **Fast Refresh** on. **Performance Monitor** shows JS/UI FPS — useful for list jank later.",
            },
          },
          {
            title: { ar: "React Native DevTools", en: "React Native DevTools" },
            body: {
              ar: "Expo/RN الحديث يدعم **React Native DevTools** (افتح من Metro أو `j` في terminal): Components tab مثل React DevTools، Profiler، وnetwork overview. **`console.log`** يظهر في terminal Metro — ليس browser console. استخدم **`console.warn`** للتمييز. **`debugger`** statement يوقف عند ربط Chrome/Hermes debugger (أقل استخداماً مع DevTools الجديد).",
              en: "Modern Expo/RN supports **React Native DevTools** (Metro or `j` in terminal): Components tab like React DevTools, Profiler, network overview. **`console.log`** prints to Metro terminal — not the browser console. Use **`console.warn`** to stand out. **`debugger`** pauses when attached to Chrome/Hermes debugger (less needed with new DevTools).",
            },
          },
          {
            title: { ar: "Element Inspector", en: "Element Inspector" },
            body: {
              ar: "**Inspect Element** ي let you tap UI لرؤية component، style، layout box. يكشف: padding vs margin، flex direction خاطئ، Text بدون flex shrink. في RTL، Inspector يوضح إن `flexDirection` انعكس. اربطه بدرس Styling — أسرع من trial-and-error.",
              en: "**Inspect Element** lets you tap UI to see component, style, layout box. Surfaces: padding vs margin, wrong flex direction, Text without flex shrink. In RTL, Inspector shows if `flexDirection` flipped. Pair with Styling lessons — faster than blind trial-and-error.",
            },
          },
          {
            title: { ar: "قراءة أخطاء Metro", en: "Reading Metro errors" },
            body: {
              ar: "أخطاء حمراء في terminal: **Red Screen** على الجهاز. اقرأ من **أسفل لأعلى**: السطر في ملفك أولاً، ثم stack JS. «Unable to resolve module» = import path أو package ناقص — `npx expo install`. Syntax error ي often ي kill Fast Refresh حتى تصلح. احفظ screenshot للـ Red Screen — ي contains component stack.",
              en: "Red terminal errors → **Red Screen** on device. Read **bottom-up**: your file line first, then JS stack. «Unable to resolve module» = bad import or missing package — `npx expo install`. Syntax errors often kill Fast Refresh until fixed. Screenshot Red Screens — they include component stack.",
            },
          },
        ],
        codeSource: `import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DebugDemo() {
  useEffect(() => {
    console.log("[AlefYa] screen mounted");
    return () => console.log("[AlefYa] screen unmounted");
  }, []);

  const lessons = [{ slug: "01-what-is-rn" }, { slug: "02-expo-vs-cli" }];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lessons loaded: {lessons.length}</Text>
      {__DEV__ && (
        <Text style={styles.devBanner}>DEV — logs appear in Metro terminal</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16 },
  devBanner: { marginTop: 8, color: "#b45309", fontSize: 12 },
});`,
        codeExplain: {
          ar: "`__DEV__` global ي true فقط في development — useful ل banners وlogs. useEffect logging pattern للتتبع.",
          en: "`__DEV__` is true only in development — useful for banners and logs. useEffect logging pattern for tracing.",
        },
        faqs: [
          {
            q: { ar: "هل أحتاج Flipper؟", en: "Do I need Flipper?" },
            a: {
              ar: "اختياري — DevTools + Inspector كافيان للمسار. Flipper أقوى ل native logs متقدمة.",
              en: "Optional — DevTools + Inspector suffice for this track. Flipper is stronger for advanced native logs.",
            },
          },
          {
            q: { ar: "console.log لا يظهر؟", en: "console.log not showing?" },
            a: {
              ar: "راقب terminal الذي شغّلت فيه `expo start` — ليس VS Code Debug Console افتراضياً.",
              en: "Watch the terminal running `expo start` — not VS Code Debug Console by default.",
            },
          },
          {
            q: { ar: "Yellow box warnings — أتجاهلها؟", en: "Yellow box warnings — ignore?" },
            a: {
              ar: "اقرأها — كثيراً ما ت signal deprecated API أو missing key في lists.",
              en: "Read them — they often signal deprecated APIs or missing list keys.",
            },
          },
          {
            q: { ar: "كيف أ debug network؟", en: "How do I debug network?" },
            a: {
              ar: "React Native DevTools network tab، أو `fetch` logging مؤقت، أو Reactotron — درس Fetch لاحقاً.",
              en: "React Native DevTools network tab, temporary `fetch` logging, or Reactotron — Fetch lesson later.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: View، Text، Pressable — لبنات الواجهة.",
          en: "Next stage: View, Text, Pressable — core UI building blocks.",
        },
      },
    ],
  ),

  "02-core-ui": stage(
    "02-core-ui",
    2,
    { ar: "مكوّنات الواجهة الأساسية", en: "Core UI components" },
    {
      ar: "View، Text، Pressable، الصور، الأيقونات، وSafe Area",
      en: "View, Text, Pressable, images, icons, and Safe Area",
    },
    [
      {
        slug: "01-view-text",
        duration: 45,
        title: { ar: "View و Text", en: "View & Text" },
        summary: {
          ar: "View كحاوية، Text لكل محتوى نصي، nesting rules، وaccessibility basics.",
          en: "View as container, Text for all strings, nesting rules, and accessibility basics.",
        },
        focus: {
          ar: "`View` = div-like container؛ `Text` إلزامي لأي نص — RN لا ي render strings مباشرة داخل View.",
          en: "`View` = div-like container; `Text` is required for any string — RN won't render raw text inside View.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "View — الحاوية الأساسية", en: "View — the base container" },
            body: {
              ar: "**`View`** ي supports layout (flexbox)، touch handling (with pointerEvents)، وstyle. لا ي render نصاً — ضع Text بداخله. يمكن nesting: View داخل View للتقسيم. **`ScrollView`** لاحقاً للمحتوى الطويل — View alone لا ي scroll. **`pointerEvents=\"box-none\"`** ي let touches pass through للchildren — useful لل overlays.",
              en: "**`View`** supports layout (flexbox), touch handling (with pointerEvents), and styles. It doesn't render text — put Text inside. Nest Views to structure UI. Use **`ScrollView`** later for long content — View alone doesn't scroll. **`pointerEvents=\"box-none\"`** lets touches pass to children — useful for overlays.",
            },
          },
          {
            title: { ar: "Text — قواعد النص", en: "Text — text rules" },
            body: {
              ar: "كل string يجب أن يكون داخل **`<Text>`**. يمكن nest Text لت inherit styles: `<Text><Text style={{ fontWeight: '700' }}>Bold</Text> rest</Text>`. **`numberOfLines`** + **`ellipsizeMode`** لل truncation. **`selectable`** للنسخ. **`accessibilityRole=\"header\"`** للعناوين. Arabic: استخدم `writingDirection` أو rely on RTL layout من النظام.",
              en: "Every string must be inside **`<Text>`**. Nest Text to inherit styles: `<Text><Text style={{ fontWeight: '700' }}>Bold</Text> rest</Text>`. **`numberOfLines`** + **`ellipsizeMode`** for truncation. **`selectable`** for copy. **`accessibilityRole=\"header\"`** for titles. Arabic: use `writingDirection` or rely on system RTL layout.",
            },
          },
          {
            title: { ar: "Accessibility", en: "Accessibility" },
            body: {
              ar: "**`accessible={true}`** يجمع children لل screen reader. **`accessibilityLabel`** ي describe العنصر. **`accessibilityHint`** لل action expected. **`accessibilityRole`** (button، header، link). Test: iOS VoiceOver، Android TalkBack. AlefYa يجب أن labels الأزرار واضحة («Mark lesson complete») not just «button».",
              en: "**`accessible={true}`** groups children for screen readers. **`accessibilityLabel`** describes the element. **`accessibilityHint`** for expected action. **`accessibilityRole`** (button, header, link). Test: iOS VoiceOver, Android TalkBack. AlefYa buttons need clear labels («Mark lesson complete») not just «button».",
            },
          },
          {
            title: { ar: "أنماط AlefYa lesson card", en: "AlefYa lesson card pattern" },
            body: {
              ar: "Card = View + borderRadius + padding. Title Text bold، summary Text muted color، duration badge View صغير. استخدم **`gap`** (RN 0.71+) أو margins بين العناصر. لا ت put multiple unrelated texts في Text واحد طويل — structure لل screen readers.",
              en: "Card = View + borderRadius + padding. Bold title Text, muted summary Text, small duration badge View. Use **`gap`** (RN 0.71+) or margins between items. Don't cram unrelated copy into one long Text — structure helps screen readers.",
            },
          },
        ],
        codeSource: `import { View, Text, StyleSheet } from "react-native";

type LessonCardProps = {
  title: string;
  summary: string;
  duration: number;
};

function LessonCard({ title, summary, duration }: LessonCardProps) {
  return (
    <View style={styles.card} accessible accessibilityRole="summary">
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.summary} numberOfLines={2}>
        {summary}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{duration} min</Text>
      </View>
    </View>
  );
}

export default function LessonListPreview() {
  return (
    <View style={styles.screen}>
      <LessonCard
        title="View & Text"
        summary="Core containers and typography rules in React Native."
        duration={45}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  summary: { fontSize: 14, color: "#64748b", lineHeight: 20 },
  badge: { alignSelf: "flex-start", backgroundColor: "#e0f2fe", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, color: "#0369a1", fontWeight: "600" },
});`,
        codeExplain: {
          ar: "LessonCard AlefYa: View hierarchy، Text nesting، badge، accessibilityRole.",
          en: "AlefYa LessonCard: View hierarchy, Text nesting, badge, accessibilityRole.",
        },
        faqs: [
          {
            q: { ar: "لماذا Text مطلوب؟", en: "Why is Text required?" },
            a: {
              ar: "RN maps Text ل native text views — strings خارج Text غير مدعومة by design.",
              en: "RN maps Text to native text views — strings outside Text are unsupported by design.",
            },
          },
          {
            q: { ar: "هل يوجد span؟", en: "Is there a span?" },
            a: {
              ar: "Nested Text ي act like inline spans — no separate span component.",
              en: "Nested Text acts like inline spans — no separate span component.",
            },
          },
          {
            q: { ar: "Custom fonts؟", en: "Custom fonts?" },
            a: {
              ar: "`expo-font` + `useFonts` — ن cover في Icons lesson أو Project polish.",
              en: "`expo-font` + `useFonts` — covered in Icons lesson or Project polish.",
            },
          },
          {
            q: { ar: "TextInput vs Text؟", en: "TextInput vs Text?" },
            a: {
              ar: "TextInput لل input editable — درس Forms لاحقاً.",
              en: "TextInput for editable input — Forms lesson later.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Pressable، TouchableOpacity، و feedback اللمسي.",
          en: "Next: Pressable, TouchableOpacity, and touch feedback.",
        },
      },
      {
        slug: "02-pressable-touch",
        duration: 48,
        title: { ar: "Pressable واللمس", en: "Pressable & touch" },
        summary: {
          ar: "Pressable API، pressed states، hitSlop، disabled، وبدائل TouchableOpacity.",
          en: "Pressable API, pressed states, hitSlop, disabled, and TouchableOpacity alternatives.",
        },
        focus: {
          ar: "**Pressable** هو API الحديث للأزرار وال touch targets — style callback مع `pressed` state.",
          en: "**Pressable** is the modern API for buttons and touch targets — style callback with `pressed` state.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Pressable basics", en: "Pressable basics" },
            body: {
              ar: "**`Pressable`** ي wrap content و fires **`onPress`**, **`onPressIn`**, **`onPressOut`**, **`onLongPress`**. **`style`** can be function: `({ pressed }) => [styles.btn, pressed && styles.pressed]`. **`android_ripple`** ل material ripple on Android. Prefer Pressable over legacy TouchableOpacity — more flexible.",
              en: "**`Pressable`** wraps content and fires **`onPress`**, **`onPressIn`**, **`onPressOut`**, **`onLongPress`**. **`style`** can be a function: `({ pressed }) => [styles.btn, pressed && styles.pressed]`. **`android_ripple`** for Material ripple on Android. Prefer Pressable over legacy TouchableOpacity — more flexible.",
            },
          },
          {
            title: { ar: "hitSlop و touch targets", en: "hitSlop & touch targets" },
            body: {
              ar: "**`hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`** expands touch area دون changing visual size — Apple HIG ~44pt minimum. **`disabled={loading}`** blocks interaction — pair with opacity style. Don't nest Pressables deeply — gesture conflicts.",
              en: "**`hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`** expands touch area without visual size — Apple HIG ~44pt minimum. **`disabled={loading}`** blocks interaction — pair with opacity style. Don't nest Pressables deeply — gesture conflicts.",
            },
          },
          {
            title: { ar: "Haptics و feedback", en: "Haptics & feedback" },
            body: {
              ar: "**`expo-haptics`**: `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on successful tap. **`ActivityIndicator`** inside button while loading. Combine: press → haptic → navigate. Avoid haptic on every list row — فقط actions مهمة.",
              en: "**`expo-haptics`**: `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on successful tap. **`ActivityIndicator`** inside button while loading. Combine: press → haptic → navigate. Avoid haptic on every list row — only meaningful actions.",
            },
          },
          {
            title: { ar: "AlefYa CTA patterns", en: "AlefYa CTA patterns" },
            body: {
              ar: "Primary CTA: `#00D4FF` background. Secondary: outline Pressable. «Continue lesson» vs «Mark complete» — distinct labels وaccessibilityHint. Long press optional لل context menu لاحقاً.",
              en: "Primary CTA: `#00D4FF` background. Secondary: outline Pressable. «Continue lesson» vs «Mark complete» — distinct labels and accessibilityHint. Optional long press for context menu later.",
            },
          },
        ],
        codeSource: `import { useState } from "react";
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
};

function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    if (loading) return;
    setLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await onPress();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color="#0f172a" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

export default function TouchDemo() {
  return (
    <View style={styles.screen}>
      <PrimaryButton label="Continue lesson" onPress={async () => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 24 },
  button: { backgroundColor: "#00D4FF", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  label: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
});`,
        codeExplain: {
          ar: "زر AlefYa: loading state، haptics، pressed opacity، hitSlop، accessibility.",
          en: "AlefYa button: loading state, haptics, pressed opacity, hitSlop, accessibility.",
        },
        faqs: [
          {
            q: { ar: "TouchableOpacity vs Pressable؟", en: "TouchableOpacity vs Pressable?" },
            a: {
              ar: "TouchableOpacity ي opacity only — Pressable أ flexible (ripple، long press، style fn).",
              en: "TouchableOpacity only fades opacity — Pressable is more flexible (ripple, long press, style fn).",
            },
          },
          {
            q: { ar: "onPress ي fire مرتين؟", en: "onPress firing twice?" },
            a: {
              ar: "تحقق من nested touchables أو duplicate handlers — use Pressable واحد per action.",
              en: "Check nested touchables or duplicate handlers — one Pressable per action.",
            },
          },
          {
            q: { ar: "GestureHandler؟", en: "GestureHandler?" },
            a: {
              ar: "`react-native-gesture-handler` لل swipes/pan — React Navigation ي depend on it. Pressable يكفي لل taps.",
              en: "`react-native-gesture-handler` for swipes/pan — React Navigation depends on it. Pressable is enough for taps.",
            },
          },
          {
            q: { ar: "Keyboard dismiss on tap outside؟", en: "Keyboard dismiss on tap outside?" },
            a: {
              ar: "`Keyboard.dismiss()` in Pressable wrapper — Forms lesson covers KeyboardAvoidingView.",
              en: "`Keyboard.dismiss()` in Pressable wrapper — Forms lesson covers KeyboardAvoidingView.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Image، expo-image، و @expo/vector-icons.",
          en: "Next: Image, expo-image, and @expo/vector-icons.",
        },
      },
      {
        slug: "03-images-icons",
        duration: 46,
        title: { ar: "الصور والأيقونات", en: "Images & icons" },
        summary: {
          ar: "Image vs expo-image، resizeMode، assets، SF Symbols/Ionicons، و caching.",
          en: "Image vs expo-image, resizeMode, assets, Ionicons, and caching.",
        },
        focus: {
          ar: "الصور في RN تحتاج أبعاد explicit أو flex — و`expo-image` ي offers caching وblur placeholder أفضل من Image القديم.",
          en: "RN images need explicit dimensions or flex — `expo-image` offers caching and blur placeholders better than legacy Image.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "React Native Image", en: "React Native Image" },
            body: {
              ar: "**`Image`** from react-native: **`source={require('./logo.png')}`** local، **`{ uri: 'https://...' }`** remote. MUST set **`width/height`** or **`style={{ flex: 1 }}`** in bounded parent — zero-size image = invisible. **`resizeMode`**: cover، contain، stretch. Remote images: no built-in cache قوي — prefer expo-image.",
              en: "**`Image`** from react-native: **`source={require('./logo.png')}`** local, **`{ uri: 'https://...' }`** remote. MUST set **`width/height`** or **`style={{ flex: 1 }}`** in bounded parent — zero-size image = invisible. **`resizeMode`**: cover, contain, stretch. Remote images: weak built-in cache — prefer expo-image.",
            },
          },
          {
            title: { ar: "expo-image", en: "expo-image" },
            body: {
              ar: "**`expo-image`** — **`contentFit`** (like object-fit)، **`placeholder`** blurhash، **`transition`**, disk/memory cache، GIF/WebP. **`Image.prefetch(urls)`** for lesson thumbnails. AlefYa track cards: prefetch next stage icons.",
              en: "**`expo-image`** — **`contentFit`** (like object-fit), **`placeholder`** blurhash, **`transition`**, disk/memory cache, GIF/WebP. **`Image.prefetch(urls)`** for lesson thumbnails. AlefYa track cards: prefetch next stage icons.",
            },
          },
          {
            title: { ar: "@expo/vector-icons", en: "@expo/vector-icons" },
            body: {
              ar: "**`Ionicons`**, **`MaterialIcons`**, **`Feather`** — `<Ionicons name=\"checkmark-circle\" size={24} color=\"#00D4FF\" />`. Icons as font glyphs — scale cleanly. Tab bar icons: focused/unfocused color. Don't mix too many icon families — pick one (Ionicons) for AlefYa.",
              en: "**`Ionicons`**, **`MaterialIcons`**, **`Feather`** — `<Ionicons name=\"checkmark-circle\" size={24} color=\"#00D4FF\" />`. Icons as font glyphs — scale cleanly. Tab bar icons: focused/unfocused color. Don't mix too many icon families — pick one (Ionicons) for AlefYa.",
            },
          },
          {
            title: { ar: "Assets و DPI", en: "Assets & DPI" },
            body: {
              ar: "Put images in **`assets/`**. `@2x` `@3x` suffixes for density (PNG). SVG: **`react-native-svg`** + optional transformer. App icon/splash via **`app.json`** — Release stage. Keep hero images < 200KB when possible.",
              en: "Put images in **`assets/`**. `@2x` `@3x` suffixes for density (PNG). SVG: **`react-native-svg`** + optional transformer. App icon/splash via **`app.json`** — Release stage. Keep hero images < 200KB when possible.",
            },
          },
        ],
        codeSource: `import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const TRACK_COLOR = "#00D4FF";

export default function TrackHeader() {
  return (
    <View style={styles.row}>
      <Image
        source={require("../assets/icon.png")}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.meta}>
        <Text style={styles.title}>React Native</Text>
        <View style={styles.progressRow}>
          <Ionicons name="book-outline" size={16} color={TRACK_COLOR} />
          <Text style={styles.subtitle}>29 lessons · 105h</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 12 },
  meta: { flex: 1, gap: 4 },
  title: { fontSize: 17, fontWeight: "700" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  subtitle: { fontSize: 13, color: "#64748b" },
});`,
        codeExplain: {
          ar: "expo-image مع أبعاد fixed، Ionicons في row — pattern ل track list header.",
          en: "expo-image with fixed dimensions, Ionicons in row — track list header pattern.",
        },
        faqs: [
          {
            q: { ar: "الصورة لا تظهر؟", en: "Image not showing?" },
            a: {
              ar: "99% missing width/height — set explicit dimensions.",
              en: "99% missing width/height — set explicit dimensions.",
            },
          },
          {
            q: { ar: "HTTPS required؟", en: "HTTPS required?" },
            a: {
              ar: "iOS ATS blocks cleartext HTTP — use HTTPS or configure exceptions (dev only).",
              en: "iOS ATS blocks cleartext HTTP — use HTTPS or configure exceptions (dev only).",
            },
          },
          {
            q: { ar: "SVG in RN؟", en: "SVG in RN?" },
            a: {
              ar: "react-native-svg — import as component or use transformer for .svg files.",
              en: "react-native-svg — import as component or use transformer for .svg files.",
            },
          },
          {
            q: { ar: "expo-image vs Image؟", en: "expo-image vs Image?" },
            a: {
              ar: "expo-image for network + cache + placeholders — Image OK for static require().",
              en: "expo-image for network + cache + placeholders — Image OK for static require().",
            },
          },
        ],
        nextHint: {
          ar: "التالي: SafeAreaView و notches/status bar.",
          en: "Next: SafeAreaView and notches/status bar.",
        },
      },
      {
        slug: "04-safe-area",
        duration: 44,
        title: { ar: "Safe Area", en: "Safe Area" },
        summary: {
          ar: "Notches، status bar، home indicator — safe-area-context و edges.",
          en: "Notches, status bar, home indicator — safe-area-context and edges.",
        },
        focus: {
          ar: "محتوى UI ي must respect safe areas — `react-native-safe-area-context` is standard with Expo وNavigation.",
          en: "UI content must respect safe areas — `react-native-safe-area-context` is standard with Expo and Navigation.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "لماذا Safe Area", en: "Why Safe Area" },
            body: {
              ar: "iPhones with notch/Dynamic Island، Android punch-holes — content under status bar أو home gesture bar ي gets clipped or hard to tap. **`SafeAreaView`** from **`react-native-safe-area-context`** (not deprecated core one) applies padding from **`useSafeAreaInsets()`**.",
              en: "Notched iPhones, Dynamic Island, Android punch-holes — content under status bar or home gesture bar gets clipped or hard to tap. **`SafeAreaView`** from **`react-native-safe-area-context`** (not deprecated core one) applies padding from **`useSafeAreaInsets()`**.",
            },
          },
          {
            title: { ar: "useSafeAreaInsets", en: "useSafeAreaInsets" },
            body: {
              ar: "**`const insets = useSafeAreaInsets()`** → `{ top, right, bottom, left }`. Apply manually: `paddingTop: insets.top` on header، `paddingBottom: insets.bottom` on tab bar. More control than SafeAreaView wrapper — useful for full-bleed backgrounds with inset content.",
              en: "**`const insets = useSafeAreaInsets()`** → `{ top, right, bottom, left }`. Apply manually: `paddingTop: insets.top` on header, `paddingBottom: insets.bottom` on tab bar. More control than SafeAreaView wrapper — useful for full-bleed backgrounds with inset content.",
            },
          },
          {
            title: { ar: "SafeAreaView edges", en: "SafeAreaView edges" },
            body: {
              ar: "**`<SafeAreaView edges={['top', 'left', 'right']}>`** — exclude bottom if tab navigator already handles it. Double padding = too much whitespace — coordinate with **`headerTransparent`** in navigation.",
              en: "**`<SafeAreaView edges={['top', 'left', 'right']}>`** — exclude bottom if tab navigator already handles it. Double padding = too much whitespace — coordinate with **`headerTransparent`** in navigation.",
            },
          },
          {
            title: { ar: "StatusBar", en: "StatusBar" },
            body: {
              ar: "**`expo-status-bar`**: **`style=\"light\" | \"dark\" | \"auto\"`**. Match header background — dark header → light status icons. **`androidStatusBar`** in app.json for splash. Edge-to-edge Android 15+: follow Expo SDK release notes.",
              en: "**`expo-status-bar`**: **`style=\"light\" | \"dark\" | \"auto\"`**. Match header background — dark header → light status icons. **`androidStatusBar`** in app.json for splash. Edge-to-edge Android 15+: follow Expo SDK release notes.",
            },
          },
        ],
        codeSource: `import { Text, View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function LessonScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
        <Text style={styles.header}>Lesson: Safe Area</Text>
      </SafeAreaView>
      <View style={styles.body}>
        <Text style={styles.content}>Content scrolls here…</Text>
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.footerText}>Next lesson</Text>
      </View>
    </View>
  );
}

export default function AppShell() {
  return (
    <SafeAreaProvider>
      <LessonScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  safe: { backgroundColor: "#f1f5f9" },
  header: { fontSize: 18, fontWeight: "700", padding: 16 },
  body: { flex: 1, padding: 16 },
  content: { fontSize: 15, lineHeight: 22 },
  footer: { borderTopWidth: 1, borderTopColor: "#e2e8f0", padding: 16 },
  footerText: { textAlign: "center", fontWeight: "600", color: "#00D4FF" },
});`,
        codeExplain: {
          ar: "SafeAreaProvider at root، SafeAreaView لل header، manual bottom inset لل footer CTA.",
          en: "SafeAreaProvider at root, SafeAreaView for header, manual bottom inset for footer CTA.",
        },
        faqs: [
          {
            q: { ar: "SafeAreaProvider missing؟", en: "SafeAreaProvider missing?" },
            a: {
              ar: "Wrap app root — expo-router templates often include it in _layout.",
              en: "Wrap app root — expo-router templates often include it in _layout.",
            },
          },
          {
            q: { ar: "Double top padding؟", en: "Double top padding?" },
            a: {
              ar: "Navigation header + SafeAreaView both add top — use edges or headerShown: false.",
              en: "Navigation header + SafeAreaView both add top — use edges or headerShown: false.",
            },
          },
          {
            q: { ar: "Android status bar overlap؟", en: "Android status bar overlap?" },
            a: {
              ar: "Ensure SafeAreaProvider و StatusBar — check translucent in app.json.",
              en: "Ensure SafeAreaProvider and StatusBar — check translucent in app.json.",
            },
          },
          {
            q: { ar: "Landscape safe areas؟", en: "Landscape safe areas?" },
            a: {
              ar: "insets.left/right matter on notched iPhones — don't hardcode padding.",
              en: "insets.left/right matter on notched iPhones — don't hardcode padding.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: StyleSheet، Flexbox، و responsive layout.",
          en: "Next stage: StyleSheet, Flexbox, and responsive layout.",
        },
      },
    ],
  ),

  "03-styling": stage(
    "03-styling",
    3,
    { ar: "التنسيق والتخطيط", en: "Styling & layout" },
    {
      ar: "StyleSheet، Flexbox، Platform-specific styles، و responsive design",
      en: "StyleSheet, Flexbox, platform-specific styles, and responsive design",
    },
    [
      {
        slug: "01-styleheet-flexbox",
        duration: 52,
        title: { ar: "StyleSheet و Flexbox", en: "StyleSheet & Flexbox" },
        summary: {
          ar: "StyleSheet.create، flex defaults (column)، justify/align، flexGrow — layout RN.",
          en: "StyleSheet.create, flex defaults (column), justify/align, flexGrow — RN layout.",
        },
        focus: {
          ar: "Flexbox هو نظام layout الوحيد في RN — default **`flexDirection: 'column'`** (عكس CSS web row).",
          en: "Flexbox is RN's only layout system — default **`flexDirection: 'column'`** (opposite of typical web row).",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "StyleSheet.create", en: "StyleSheet.create" },
            body: {
              ar: "**`StyleSheet.create({ ... })`** validates keys at runtime in dev، sends numeric IDs to native — faster than inline objects. Combine styles: **`style={[styles.base, active && styles.active]}`**. Order matters — later overrides earlier. No CSS files — styles are JS objects. camelCase: **`backgroundColor`**, **`marginHorizontal`**. Limited selectors — no `.child > p`.",
              en: "**`StyleSheet.create({ ... })`** validates keys in dev, sends numeric IDs to native — faster than inline objects. Combine styles: **`style={[styles.base, active && styles.active]}`**. Order matters — later overrides earlier. No CSS files — styles are JS objects. camelCase: **`backgroundColor`**, **`marginHorizontal`**. Limited selectors — no `.child > p`.",
            },
          },
          {
            title: { ar: "Flexbox column default", en: "Flexbox column default" },
            body: {
              ar: "Root View with **`flex: 1`** fills screen. **`flexDirection: 'row'`** for horizontal rows (icon + text). **`justifyContent`**: main axis (column = vertical): center، space-between. **`alignItems`**: cross axis: stretch default. **`gap`** (modern RN) between children. **`flex: 1`** on child = take remaining space — common for scroll body.",
              en: "Root View with **`flex: 1`** fills screen. **`flexDirection: 'row'`** for horizontal rows (icon + text). **`justifyContent`**: main axis (column = vertical): center, space-between. **`alignItems`**: cross axis: stretch default. **`gap`** (modern RN) between children. **`flex: 1`** on child = take remaining space — common for scroll body.",
            },
          },
          {
            title: { ar: "Common layout recipes", en: "Common layout recipes" },
            body: {
              ar: "**Centered screen**: flex 1 + justify center + align center. **Header/body/footer**: column with flex 1 on body. **Card row**: row + align center + gap. **Sticky footer button**: body flex 1، footer fixed padding. Debug with Inspector borderWidth 1 temporarily.",
              en: "**Centered screen**: flex 1 + justify center + align center. **Header/body/footer**: column with flex 1 on body. **Card row**: row + align center + gap. **Sticky footer button**: body flex 1, fixed footer padding. Debug with temporary Inspector borderWidth 1.",
            },
          },
          {
            title: { ar: "AlefYa lesson layout", en: "AlefYa lesson layout" },
            body: {
              ar: "Lesson screen: header (title)، ScrollView flex 1 (concepts)، bottom CTA bar. Code block card: padding، monospace font via **`fontFamily: Platform.select(...)`** later. Track color `#00D4FF` لل accents only — not full backgrounds.",
              en: "Lesson screen: header (title), ScrollView flex 1 (concepts), bottom CTA bar. Code block card: padding, monospace font via **`fontFamily: Platform.select(...)`** later. Track color `#00D4FF` for accents only — not full backgrounds.",
            },
          },
        ],
        codeSource: `import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function LessonLayout() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StyleSheet & Flexbox</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.paragraph}>
          Flexbox defaults to column. Use flex: 1 on the scroll area so the footer stays pinned.
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerCta}>Mark complete</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  paragraph: { fontSize: 15, lineHeight: 22, color: "#334155" },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#e2e8f0" },
  footerCta: { textAlign: "center", color: "#00D4FF", fontWeight: "700", fontSize: 16 },
});`,
        codeExplain: {
          ar: "Header / ScrollView flex 1 / footer — canonical lesson shell flex pattern.",
          en: "Header / ScrollView flex 1 / footer — canonical lesson shell flex pattern.",
        },
        faqs: [
          {
            q: { ar: "percentage width؟", en: "Percentage width?" },
            a: {
              ar: "Supported but parent needs defined width — flex often clearer.",
              en: "Supported but parent needs defined width — flex is often clearer.",
            },
          },
          {
            q: { ar: "absolute position؟", en: "Absolute position?" },
            a: {
              ar: "`position: 'absolute'` works — use for overlays; flex for main layout.",
              en: "`position: 'absolute'` works — use for overlays; flex for main layout.",
            },
          },
          {
            q: { ar: "Shadow iOS vs elevation Android؟", en: "Shadow iOS vs elevation Android?" },
            a: {
              ar: "iOS: shadow* props — Android: elevation — Platform.select in next lesson.",
              en: "iOS: shadow* props — Android: elevation — Platform.select in next lesson.",
            },
          },
          {
            q: { ar: "Tailwind in RN؟", en: "Tailwind in RN?" },
            a: {
              ar: "NativeWind exists — this track teaches StyleSheet first for fundamentals.",
              en: "NativeWind exists — this track teaches StyleSheet first for fundamentals.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Platform.select و styles خاصة ب iOS/Android.",
          en: "Next: Platform.select and iOS/Android-specific styles.",
        },
      },
      {
        slug: "02-platform-specific",
        duration: 47,
        title: { ar: "أنماط حسب المنصة", en: "Platform-specific styling" },
        summary: {
          ar: "Platform.OS، Platform.select، shadows/elevation، fonts، و RTL nuances.",
          en: "Platform.OS, Platform.select, shadows/elevation, fonts, and RTL nuances.",
        },
        focus: {
          ar: "تطبيق واحد، UX native-feeling — Platform API يختصر if/else for iOS vs Android styling.",
          en: "One app, native-feeling UX — Platform API shortens if/else for iOS vs Android styling.",
        },
        stack: "jsx",
        ideas: [
          {
            title: { ar: "Platform.select", en: "Platform.select" },
            body: {
              ar: "**`Platform.select({ ios: { shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 4 }, default: {} })`** — one expression. **`Platform.OS === 'ios'`** for logic branches. **`Platform.Version`** for API level checks on Android.",
              en: "**`Platform.select({ ios: { shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 4 }, default: {} })`** — one expression. **`Platform.OS === 'ios'`** for logic branches. **`Platform.Version`** for API level checks on Android.",
            },
          },
          {
            title: { ar: "Shadows و elevation", en: "Shadows & elevation" },
            body: {
              ar: "iOS shadows: shadowColor، shadowOffset، shadowOpacity، shadowRadius — Android ignores them. Android **`elevation`** — iOS ignores it. Card component: merge both via Platform.select. Avoid heavy shadows on lists — performance.",
              en: "iOS shadows: shadowColor, shadowOffset, shadowOpacity, shadowRadius — Android ignores them. Android **`elevation`** — iOS ignores it. Card component: merge both via Platform.select. Avoid heavy shadows on lists — performance.",
            },
          },
          {
            title: { ar: "Fonts و typography", en: "Fonts & typography" },
            body: {
              ar: "System default: **`fontFamily: Platform.select({ ios: 'System', android: 'Roboto' })`**. Custom fonts via expo-font. **`allowFontScaling`** on Text — respect user accessibility font size. **`maxFontSizeMultiplier`** cap if layout breaks.",
              en: "System default: **`fontFamily: Platform.select({ ios: 'System', android: 'Roboto' })`**. Custom fonts via expo-font. **`allowFontScaling`** on Text — respect user accessibility font size. **`maxFontSizeMultiplier`** cap if layout breaks.",
            },
          },
          {
            title: { ar: "RTL و Platform", en: "RTL & Platform" },
            body: {
              ar: "**`I18nManager.isRTL`** — start/end replace left/right in RN 0.71+ logical properties where available. Arabic AlefYa: test on device with Arabic system language. **`writingDirection: 'rtl'`** on Text containers when mixing LTR code snippets.",
              en: "**`I18nManager.isRTL`** — start/end replace left/right in RN 0.71+ logical properties where available. Arabic AlefYa: test on device with Arabic system language. **`writingDirection: 'rtl'`** on Text containers when mixing LTR code snippets.",
            },
          },
        ],
        codeSource: `import { Platform, View, Text, StyleSheet } from "react-native";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function PlatformCardDemo() {
  return (
    <View style={styles.screen}>
      <Card title="Cross-platform card">
        <Text style={styles.body}>
          Shadow on iOS, elevation on Android — same component.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  body: { marginTop: 8, fontSize: 14, color: "#475569", lineHeight: 20 },
});`,
        codeExplain: {
          ar: "Card with Platform.select shadow/elevation spread into StyleSheet.",
          en: "Card with Platform.select shadow/elevation spread into StyleSheet.",
        },
        faqs: [
          {
            q: { ar: "Platform-specific files؟", en: "Platform-specific files?" },
            a: {
              ar: "`Button.ios.tsx` / `Button.android.tsx` — Metro resolves automatically for big splits.",
              en: "`Button.ios.tsx` / `Button.android.tsx` — Metro resolves automatically for big splits.",
            },
          },
          {
            q: { ar: "Web platform؟", en: "Web platform?" },
            a: {
              ar: "Expo web adds Platform.OS === 'web' — styles may need web-specific tweaks.",
              en: "Expo web adds Platform.OS === 'web' — styles may need web-specific tweaks.",
            },
          },
          {
            q: { ar: "Hairline border؟", en: "Hairline border?" },
            a: {
              ar: "`StyleSheet.hairlineWidth` — 1 physical pixel divider cross-platform.",
              en: "`StyleSheet.hairlineWidth` — 1 physical pixel divider cross-platform.",
            },
          },
          {
            q: { ar: "Status bar height manual؟", en: "Manual status bar height?" },
            a: {
              ar: "Avoid — use safe-area-context insets instead of hardcoding 44/24.",
              en: "Avoid — use safe-area-context insets instead of hardcoding 44/24.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: responsive dimensions و useWindowDimensions.",
          en: "Next: responsive dimensions and useWindowDimensions.",
        },
      },
      {
        slug: "03-responsive",
        duration: 50,
        title: { ar: "تصميم responsive", en: "Responsive design" },
        summary: {
          ar: "useWindowDimensions، Dimensions API، breakpoints، tablets، orientation.",
          en: "useWindowDimensions, Dimensions API, breakpoints, tablets, orientation.",
        },
        focus: {
          ar: "Mobile layouts ت vary by width — hooks و breakpoints ت let one codebase adapt phones و tablets.",
          en: "Mobile layouts vary by width — hooks and breakpoints let one codebase adapt phones and tablets.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "useWindowDimensions", en: "useWindowDimensions" },
            body: {
              ar: "**`const { width, height, scale, fontScale } = useWindowDimensions()`** — re-renders on rotation/resize. Prefer over **`Dimensions.get('window')`** static — doesn't update on rotate. Use width for column count: width > 600 → 2 column grid.",
              en: "**`const { width, height, scale, fontScale } = useWindowDimensions()`** — re-renders on rotation/resize. Prefer over static **`Dimensions.get('window')`** — doesn't update on rotate. Use width for column count: width > 600 → 2 column grid.",
            },
          },
          {
            title: { ar: "Breakpoints بسيطة", en: "Simple breakpoints" },
            body: {
              ar: "Define **`const isTablet = width >= 768`**. Conditional styles: `paddingHorizontal: isTablet ? 32 : 16`. **`numColumns`** on FlatList for grid. Don't port full desktop CSS — mobile-first spacing.",
              en: "Define **`const isTablet = width >= 768`**. Conditional styles: `paddingHorizontal: isTablet ? 32 : 16`. **`numColumns`** on FlatList for grid. Don't port full desktop CSS — mobile-first spacing.",
            },
          },
          {
            title: { ar: "PixelRatio و fonts", en: "PixelRatio & fonts" },
            body: {
              ar: "**`PixelRatio.get()`** — device density. **`PixelRatio.roundToNearestPixel(8.4)`** for hairline consistency. **`fontScale`** from useWindowDimensions — user accessibility setting — don't fight it unless layout breaks.",
              en: "**`PixelRatio.get()`** — device density. **`PixelRatio.roundToNearestPixel(8.4)`** for hairline consistency. **`fontScale`** from useWindowDimensions — user accessibility setting — don't fight it unless layout breaks.",
            },
          },
          {
            title: { ar: "AlefYa tablet layout", en: "AlefYa tablet layout" },
            body: {
              ar: "Phone: single column lesson list. Tablet landscape: master-detail — list left 40%، lesson right 60%. Implement in Project stage — here practice width-based `flexDirection` row when `isTablet`.",
              en: "Phone: single column lesson list. Tablet landscape: master-detail — list left 40%, lesson right 60%. Implement in Project stage — here practice width-based `flexDirection` row when `isTablet`.",
            },
          },
        ],
        codeSource: `import { View, Text, useWindowDimensions, StyleSheet } from "react-native";

export default function ResponsiveTrackGrid() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const columns = isTablet ? 2 : 1;
  const tracks = ["React", "React Native", "Angular", "ASP.NET"];

  return (
    <View style={[styles.screen, isTablet && styles.screenTablet]}>
      <Text style={styles.heading}>Tracks</Text>
      <View style={[styles.grid, { flexDirection: columns === 2 ? "row" : "column", flexWrap: "wrap" }]}>
        {tracks.map((name) => (
          <View
            key={name}
            style={[styles.tile, columns === 2 && { width: (width - 48) / 2 }]}
          >
            <Text style={styles.tileText}>{name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  screenTablet: { paddingHorizontal: 32 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  grid: { gap: 12 },
  tile: { backgroundColor: "#e0f2fe", padding: 20, borderRadius: 10 },
  tileText: { fontWeight: "600", color: "#0369a1" },
});`,
        codeExplain: {
          ar: "useWindowDimensions drives column count و tile width — responsive grid without media queries.",
          en: "useWindowDimensions drives column count and tile width — responsive grid without media queries.",
        },
        faqs: [
          {
            q: { ar: "Percent vs flex؟", en: "Percent vs flex?" },
            a: {
              ar: "Flex preferred for dynamic — percent needs parent width known.",
              en: "Flex preferred for dynamic layouts — percent needs known parent width.",
            },
          },
          {
            q: { ar: "Orientation lock؟", en: "Orientation lock?" },
            a: {
              ar: "expo-screen-orientation — lock portrait for learning app if desired.",
              en: "expo-screen-orientation — lock portrait for learning app if desired.",
            },
          },
          {
            q: { ar: "Foldables؟", en: "Foldables?" },
            a: {
              ar: "useWindowDimensions updates on fold — retest layouts on resize events.",
              en: "useWindowDimensions updates on fold — retest layouts on resize events.",
            },
          },
          {
            q: { ar: "react-native-responsive-screen؟", en: "react-native-responsive-screen?" },
            a: {
              ar: "Third-party helpers exist — understand core hooks first.",
              en: "Third-party helpers exist — understand core hooks first.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: React Navigation و expo-router.",
          en: "Next stage: React Navigation and expo-router.",
        },
      },
    ],
  ),

  "04-navigation": stage(
    "04-navigation",
    4,
    { ar: "التنقل بين الشاشات", en: "Screen navigation" },
    {
      ar: "React Navigation، Stack/Tabs، params، و deep linking",
      en: "React Navigation, Stack/Tabs, params, and deep linking",
    },
    [
      {
        slug: "01-react-navigation",
        duration: 50,
        title: { ar: "React Navigation", en: "React Navigation" },
        summary: {
          ar: "NavigationContainer، Stack Navigator، typed routes، و expo-router overview.",
          en: "NavigationContainer, Stack Navigator, typed routes, and expo-router overview.",
        },
        focus: {
          ar: "React Navigation يدير stack من الشاشات — كل push/pop ي map ل native transitions على iOS/Android.",
          en: "React Navigation manages a stack of screens — each push/pop maps to native transitions on iOS/Android.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "NavigationContainer", en: "NavigationContainer" },
            body: {
              ar: "**`NavigationContainer`** يلف التطبيق — ي hold navigation state و linking. بدونه navigators لا تعمل. في expo-router، `_layout.tsx` ي setup container implicitly. **`ref`** on container enables **`navigationRef.navigate()`** from outside React tree (notifications).",
              en: "**`NavigationContainer`** wraps the app — holds navigation state and linking. Navigators won't work without it. In expo-router, `_layout.tsx` sets up the container implicitly. A **`ref`** on the container enables **`navigationRef.navigate()`** from outside the React tree (notifications).",
            },
          },
          {
            title: { ar: "Stack Navigator", en: "Stack Navigator" },
            body: {
              ar: "**`createNativeStackNavigator`** — native performance transitions. Define **`Stack.Screen`** with `name`, `component`, `options` (title, headerStyle). **`navigation.navigate('Lesson', { slug })`** pushes. **`navigation.goBack()`** pops. Header back button automatic on iOS.",
              en: "**`createNativeStackNavigator`** — native performance transitions. Define **`Stack.Screen`** with `name`, `component`, `options` (title, headerStyle). **`navigation.navigate('Lesson', { slug })`** pushes. **`navigation.goBack()`** pops. Header back button is automatic on iOS.",
            },
          },
          {
            title: { ar: "expo-router file routes", en: "expo-router file routes" },
            body: {
              ar: "**expo-router** = file-based routing on React Navigation. `app/index.tsx` → `/`, `app/tracks/[slug].tsx` → dynamic segment. **`router.push('/tracks/react-native')`** imperative. AlefYa mobile capstone may use expo-router — same mental model as Stack screens.",
              en: "**expo-router** = file-based routing on React Navigation. `app/index.tsx` → `/`, `app/tracks/[slug].tsx` → dynamic segment. **`router.push('/tracks/react-native')`** imperative. The AlefYa mobile capstone may use expo-router — same mental model as Stack screens.",
            },
          },
          {
            title: { ar: "Typed navigation", en: "Typed navigation" },
            body: {
              ar: "Define **`RootStackParamList`**: `{ TrackList: undefined; Lesson: { slug: string; track: string } }`. **`useNavigation<NativeStackNavigationProp<RootStackParamList>>()`** — autocomplete route names and params. Prevents typo `'Lessn'`.",
              en: "Define **`RootStackParamList`**: `{ TrackList: undefined; Lesson: { slug: string; track: string } }`. **`useNavigation<NativeStackNavigationProp<RootStackParamList>>()`** — autocomplete route names and params. Prevents typo `'Lessn'`.",
            },
          },
        ],
        codeSource: `import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Lesson: { track: string; slug: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <Pressable onPress={() => navigation.navigate("Lesson", { track: "react-native", slug: "01-react-navigation" })}>
      <Text>Open lesson</Text>
    </Pressable>
  );
}

function LessonScreen({ route }: { route: { params: { slug: string } } }) {
  return <Text>Lesson: {route.params.slug}</Text>;
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "AlefYa" }} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
        codeExplain: {
          ar: "Minimal typed stack: Home → Lesson with params. import Pressable/Text from react-native in real app.",
          en: "Minimal typed stack: Home → Lesson with params. Import Pressable/Text from react-native in a real app.",
        },
        faqs: [
          {
            q: { ar: "expo-router vs React Navigation manual؟", en: "expo-router vs manual React Navigation?" },
            a: {
              ar: "expo-router أسرع لل file-based apps — React Navigation manual أوضح لتعلّم المفاهيم. كلاهما نفس الم engine.",
              en: "expo-router is faster for file-based apps — manual React Navigation is clearer for learning concepts. Same engine underneath.",
            },
          },
          {
            q: { ar: "Header custom component؟", en: "Custom header component?" },
            a: {
              ar: "`options={{ headerTitle: () => <Logo /> }}` أو `headerShown: false` ل custom header كامل.",
              en: "`options={{ headerTitle: () => <Logo /> }}` or `headerShown: false` for a fully custom header.",
            },
          },
          {
            q: { ar: "npx expo install navigation؟", en: "npx expo install navigation?" },
            a: {
              ar: "دائماً `npx expo install @react-navigation/native @react-navigation/native-stack` + peer deps.",
              en: "Always `npx expo install @react-navigation/native @react-navigation/native-stack` + peer deps.",
            },
          },
          {
            q: { ar: "Web navigation؟", en: "Web navigation?" },
            a: {
              ar: "React Navigation ي supports web — URLs sync with expo-router automatically.",
              en: "React Navigation supports web — URLs sync with expo-router automatically.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Tab navigator مع Stack nested.",
          en: "Next: Tab navigator with nested Stack.",
        },
      },
      {
        slug: "02-stack-tabs",
        duration: 52,
        title: { ar: "Stack و Tabs", en: "Stack & Tabs" },
        summary: {
          ar: "Bottom tabs، nested navigators، tab icons، و hiding headers.",
          en: "Bottom tabs, nested navigators, tab icons, and hiding headers.",
        },
        focus: {
          ar: "Pattern شائع: Tab navigator للأقسام الرئيسية، Stack داخل كل tab لل drill-down.",
          en: "Common pattern: Tab navigator for main sections, Stack inside each tab for drill-down.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Bottom Tab Navigator", en: "Bottom Tab Navigator" },
            body: {
              ar: "**`createBottomTabNavigator`** — Tracks، Progress، Profile. **`tabBarIcon`** with Ionicons. **`tabBarActiveTintColor: '#00D4FF'`**. Each tab hosts its own Stack: `TracksStack`, `ProgressStack`.",
              en: "**`createBottomTabNavigator`** — Tracks, Progress, Profile. **`tabBarIcon`** with Ionicons. **`tabBarActiveTintColor: '#00D4FF'`**. Each tab hosts its own Stack: `TracksStack`, `ProgressStack`.",
            },
          },
          {
            title: { ar: "Nested navigation", en: "Nested navigation" },
            body: {
              ar: "**`navigation.navigate('TracksTab', { screen: 'Lesson', params: { slug: 'x' } })`** — cross-tab deep navigate. Each stack keeps own history — switching tabs preserves state. Don't nest >3 levels without planning — UX gets confusing.",
              en: "**`navigation.navigate('TracksTab', { screen: 'Lesson', params: { slug: 'x' } })`** — cross-tab deep navigate. Each stack keeps its own history — switching tabs preserves state. Don't nest >3 levels without planning — UX gets confusing.",
            },
          },
          {
            title: { ar: "Tab bar styling", en: "Tab bar styling" },
            body: {
              ar: "**`screenOptions`**: tabBarStyle height، safe area padding bottom via insets. **`tabBarLabel`** hide for icon-only. **`tabBarBadge`** for unread count. Dark mode: tabBarBackground from theme.",
              en: "**`screenOptions`**: tabBarStyle height, safe area padding bottom via insets. **`tabBarLabel`** hide for icon-only. **`tabBarBadge`** for unread count. Dark mode: tabBarBackground from theme.",
            },
          },
          {
            title: { ar: "AlefYa IA", en: "AlefYa information architecture" },
            body: {
              ar: "Tabs: **Learn** (tracks/lessons stack)، **Progress** (stats)، **Settings** (locale, account). Lesson reader full-screen stack push — hide tab bar optional via **`tabBarStyle: { display: 'none' }`** on focus listener.",
              en: "Tabs: **Learn** (tracks/lessons stack), **Progress** (stats), **Settings** (locale, account). Lesson reader full-screen stack push — optionally hide tab bar via **`tabBarStyle: { display: 'none' }`** on focus listener.",
            },
          },
        ],
        codeSource: `import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const LearnStack = createNativeStackNavigator();

function TrackList() {
  return <Text>Tracks</Text>;
}

function LearnNavigator() {
  return (
    <LearnStack.Navigator>
      <LearnStack.Screen name="TrackList" component={TrackList} options={{ title: "Learn" }} />
    </LearnStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#00D4FF",
        tabBarIcon: ({ color, size }) => {
          const name = route.name === "Learn" ? "book" : "stats-chart";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Learn" component={LearnNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Progress" component={TrackList} />
    </Tab.Navigator>
  );
}`,
        codeExplain: {
          ar: "Tab → nested Stack pattern. Learn tab wraps TrackList stack for future Lesson pushes.",
          en: "Tab → nested Stack pattern. Learn tab wraps TrackList stack for future Lesson pushes.",
        },
        faqs: [
          {
            q: { ar: "Material top tabs؟", en: "Material top tabs?" },
            a: {
              ar: "@react-navigation/material-top-tabs لل sub-categories داخل شاشة — optional.",
              en: "@react-navigation/material-top-tabs for sub-categories inside a screen — optional.",
            },
          },
          {
            q: { ar: "Back button on Android tabs؟", en: "Back button on Android tabs?" },
            a: {
              ar: "Hardware back pops stack first — then exits app from root tab. Handle with `BackHandler` if needed.",
              en: "Hardware back pops stack first — then exits app from root tab. Handle with `BackHandler` if needed.",
            },
          },
          {
            q: { ar: "Hide tab on keyboard؟", en: "Hide tab on keyboard?" },
            a: {
              ar: "`tabBarHideOnKeyboard: true` in screenOptions — useful for forms tab.",
              en: "`tabBarHideOnKeyboard: true` in screenOptions — useful for forms tab.",
            },
          },
          {
            q: { ar: "Drawer navigator؟", en: "Drawer navigator?" },
            a: {
              ar: "Side drawer less common in modern mobile — tabs + stack preferred for AlefYa.",
              en: "Side drawer less common in modern mobile — tabs + stack preferred for AlefYa.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: route params، passing data، و deep linking.",
          en: "Next: route params, passing data, and deep linking.",
        },
      },
      {
        slug: "03-params-linking",
        duration: 48,
        title: { ar: "Params و Deep Linking", en: "Params & deep linking" },
        summary: {
          ar: "route.params، passing serializable data، linking config، و universal links.",
          en: "route.params, passing serializable data, linking config, and universal links.",
        },
        focus: {
          ar: "Params تنقل data بين الشاشات — يجب أن تكون JSON-serializable لل deep links و state restore.",
          en: "Params pass data between screens — must be JSON-serializable for deep links and state restore.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Route params", en: "Route params" },
            body: {
              ar: "**`route.params`** on screen component — or **`useRoute<RouteProp<ParamList, 'Lesson'>>()`**. Pass minimal IDs (`slug`, `trackId`) not full lesson object — fetch detail on mount. **`initialParams`** for defaults.",
              en: "**`route.params`** on the screen component — or **`useRoute<RouteProp<ParamList, 'Lesson'>>()`**. Pass minimal IDs (`slug`, `trackId`) not the full lesson object — fetch detail on mount. **`initialParams`** for defaults.",
            },
          },
          {
            title: { ar: "Serializable warning", en: "Serializable warning" },
            body: {
              ar: "Don't pass functions، class instances، or huge blobs in params — breaks persistence and deep linking. Use global store (Context/Zustand) for non-serializable shared state.",
              en: "Don't pass functions, class instances, or huge blobs in params — breaks persistence and deep linking. Use global store (Context/Zustand) for non-serializable shared state.",
            },
          },
          {
            title: { ar: "Linking config", en: "Linking config" },
            body: {
              ar: "**`linking={{ prefixes: ['alefya://', 'https://alefya.app'], config: { screens: { Lesson: 'learn/:track/:slug' } } }}`** on NavigationContainer. Opens app to lesson from URL. expo-router: `app.json` scheme + `app/learn/[track]/[slug].tsx`.",
              en: "**`linking={{ prefixes: ['alefya://', 'https://alefya.app'], config: { screens: { Lesson: 'learn/:track/:slug' } } }}`** on NavigationContainer. Opens app to lesson from URL. expo-router: `app.json` scheme + `app/learn/[track]/[slug].tsx`.",
            },
          },
          {
            title: { ar: "Share lesson link", en: "Share lesson link" },
            body: {
              ar: "**`Linking.createURL('learn/react-native/01-hooks-state')`** with expo-linking. **`Share.share({ message: url })`** — user opens AlefYa app if installed. Test: `npx uri-scheme open alefya://learn/react-native/01-hooks-state --ios`.",
              en: "**`Linking.createURL('learn/react-native/01-hooks-state')`** with expo-linking. **`Share.share({ message: url })`** — user opens AlefYa app if installed. Test: `npx uri-scheme open alefya://learn/react-native/01-hooks-state --ios`.",
            },
          },
        ],
        codeSource: `import { useEffect, useState } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import * as Linking from "expo-linking";

type LessonParams = { track: string; slug: string };

export function LessonScreen() {
  const route = useRoute<RouteProp<{ Lesson: LessonParams }, "Lesson">>();
  const { track, slug } = route.params;
  const [lesson, setLesson] = useState<{ title: string } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(\`https://api.example.com/tracks/\${track}/lessons/\${slug}\`);
      setLesson(await res.json());
    }
    load();
  }, [track, slug]);

  if (!lesson) return <Text>Loading…</Text>;
  return <Text>{lesson.title}</Text>;
}

export const linking = {
  prefixes: [Linking.createURL("/"), "alefya://"],
  config: {
    screens: {
      Lesson: "learn/:track/:slug",
    },
  },
};`,
        codeExplain: {
          ar: "Params → fetch pattern. linking config maps URL segments to screen params.",
          en: "Params → fetch pattern. linking config maps URL segments to screen params.",
        },
        faqs: [
          {
            q: { ar: "setParams vs navigate؟", en: "setParams vs navigate?" },
            a: {
              ar: "`navigation.setParams` updates current screen params — useful after async load.",
              en: "`navigation.setParams` updates current screen params — useful after async load.",
            },
          },
          {
            q: { ar: "Universal links setup؟", en: "Universal links setup?" },
            a: {
              ar: "Needs apple-app-site-association + Android assetlinks — EAS/docs for production.",
              en: "Needs apple-app-site-association + Android assetlinks — EAS/docs for production.",
            },
          },
          {
            q: { ar: "Reset navigation stack؟", en: "Reset navigation stack?" },
            a: {
              ar: "`CommonActions.reset` — after logout send user to Login root.",
              en: "`CommonActions.reset` — after logout send user to Login root.",
            },
          },
          {
            q: { ar: "Query params in expo-router؟", en: "Query params in expo-router?" },
            a: {
              ar: "`useLocalSearchParams()` returns `{ locale: 'ar' }` from `?locale=ar`.",
              en: "`useLocalSearchParams()` returns `{ locale: 'ar' }` from `?locale=ar`.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: useState، useEffect، Context.",
          en: "Next stage: useState, useEffect, Context.",
        },
      },
    ],
  ),

  "05-state-data": stage(
    "05-state-data",
    5,
    { ar: "الحالة والبيانات", en: "State & data" },
    {
      ar: "Hooks، Context، global store، fetch، و offline caching",
      en: "Hooks, Context, global store, fetch, and offline caching",
    },
    [
      {
        slug: "01-hooks-state",
        duration: 50,
        title: { ar: "Hooks والحالة", en: "Hooks & state" },
        summary: {
          ar: "useState، useEffect، useMemo، useCallback في RN — نفس React مع caveats لل cleanup.",
          en: "useState, useEffect, useMemo, useCallback in RN — same React with cleanup caveats.",
        },
        focus: {
          ar: "State management في RN يبدأ بـ React hooks — UI state محلي، effects لل side effects async.",
          en: "RN state management starts with React hooks — local UI state, effects for async side effects.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "useState في RN", en: "useState in RN" },
            body: {
              ar: "Identical to web React: **`const [locale, setLocale] = useState<Locale>('ar')`**. State updates trigger re-render → native UI update. Batch updates in event handlers. Don't mutate state directly — always setter. Form inputs: **`TextInput`** controlled via `value` + `onChangeText`.",
              en: "Identical to web React: **`const [locale, setLocale] = useState<Locale>('ar')`**. State updates trigger re-render → native UI update. Batch updates in event handlers. Don't mutate state directly — always use the setter. Form inputs: **`TextInput`** controlled via `value` + `onChangeText`.",
            },
          },
          {
            title: { ar: "useEffect lifecycle", en: "useEffect lifecycle" },
            body: {
              ar: "**`useEffect(() => { fetch(); return () => abort(); }, [slug])`** — fetch lesson on slug change. **Cleanup** critical: cancel fetch، remove listeners، clear timers — prevents memory leaks and setState on unmounted screen. **`AppState.addEventListener`** — pause/resume on background — cleanup in return.",
              en: "**`useEffect(() => { fetch(); return () => abort(); }, [slug])`** — fetch lesson on slug change. **Cleanup** is critical: cancel fetch, remove listeners, clear timers — prevents memory leaks and setState on unmounted screens. **`AppState.addEventListener`** — pause/resume on background — cleanup in return.",
            },
          },
          {
            title: { ar: "useMemo / useCallback", en: "useMemo / useCallback" },
            body: {
              ar: "**`useMemo(() => computeProgress(completed), [completed])`** — expensive derived stats. **`useCallback`** for handlers passed to **`FlatList renderItem`** — prevents unnecessary row re-renders when referenced in deps. Don't over-optimize early — profile FlatList first.",
              en: "**`useMemo(() => computeProgress(completed), [completed])`** — expensive derived stats. **`useCallback`** for handlers passed to **`FlatList renderItem`** — prevents unnecessary row re-renders when referenced in deps. Don't over-optimize early — profile FlatList first.",
            },
          },
          {
            title: { ar: "AlefYa lesson progress state", en: "AlefYa lesson progress state" },
            body: {
              ar: "Screen-local: scroll position، expanded FAQ index. App-level: completed lesson IDs — lift to Context next lesson. Pattern: **`const [expanded, setExpanded] = useState<number | null>(null)`** for accordion FAQs in lesson reader.",
              en: "Screen-local: scroll position, expanded FAQ index. App-level: completed lesson IDs — lift to Context next lesson. Pattern: **`const [expanded, setExpanded] = useState<number | null>(null)`** for accordion FAQs in lesson reader.",
            },
          },
        ],
        codeSource: `import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";

type Lesson = { slug: string; title: string; duration: number };

export function LessonLoader({ slug }: { slug: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(\`https://api.example.com/lessons/\${slug}\`, {
          signal: controller.signal,
        });
        setLesson(await res.json());
      } catch (e) {
        if ((e as Error).name !== "AbortError") console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [slug]);

  const toggleFaq = useCallback((index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  }, []);

  if (loading) return <ActivityIndicator />;
  if (!lesson) return <Text>Not found</Text>;

  return (
    <View>
      <Text>{lesson.title}</Text>
      <Pressable onPress={() => toggleFaq(0)}>
        <Text>FAQ {expandedFaq === 0 ? "▲" : "▼"}</Text>
      </Pressable>
    </View>
  );
}`,
        codeExplain: {
          ar: "Fetch with AbortController cleanup، local accordion state، useCallback for stable handler.",
          en: "Fetch with AbortController cleanup, local accordion state, useCallback for stable handler.",
        },
        faqs: [
          {
            q: { ar: "useLayoutEffect في RN؟", en: "useLayoutEffect in RN?" },
            a: {
              ar: "Exists — runs before paint. Rare in RN vs web; use for measure/layout sync.",
              en: "Exists — runs before paint. Rare in RN vs web; use for measure/layout sync.",
            },
          },
          {
            q: { ar: "Infinite loop in useEffect؟", en: "Infinite loop in useEffect?" },
            a: {
              ar: "Object/array deps recreated each render — stabilize or depend on primitives.",
              en: "Object/array deps recreated each render — stabilize or depend on primitives.",
            },
          },
          {
            q: { ar: "useReducer vs useState؟", en: "useReducer vs useState?" },
            a: {
              ar: "useReducer for complex state transitions — optional for AlefYa until forms wizard.",
              en: "useReducer for complex state transitions — optional for AlefYa until forms wizard.",
            },
          },
          {
            q: { ar: "Strict Mode double effects؟", en: "Strict Mode double effects?" },
            a: {
              ar: "Dev only — ensures cleanup works. Production runs once.",
              en: "Dev only — ensures cleanup works. Production runs once.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: Context API و Zustand store.",
          en: "Next: Context API and Zustand store.",
        },
      },
      {
        slug: "02-context-store",
        duration: 52,
        title: { ar: "Context و Store", en: "Context & store" },
        summary: {
          ar: "React Context لل locale/progress، Zustand lightweight store، و persistence.",
          en: "React Context for locale/progress, Zustand lightweight store, and persistence.",
        },
        focus: {
          ar: "Global state (locale، completed lessons) ي needs store — Context أو Zustand avoid prop drilling.",
          en: "Global state (locale, completed lessons) needs a store — Context or Zustand avoids prop drilling.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Context pattern", en: "Context pattern" },
            body: {
              ar: "**`createContext` + Provider** at app root. **`useLocale()`** custom hook throws if outside Provider — clear errors. Split contexts: **`LocaleContext`** vs **`ProgressContext`** — one big context re-renders entire tree on any change.",
              en: "**`createContext` + Provider** at app root. **`useLocale()`** custom hook throws if outside Provider — clear errors. Split contexts: **`LocaleContext`** vs **`ProgressContext`** — one big context re-renders entire tree on any change.",
            },
          },
          {
            title: { ar: "Zustand store", en: "Zustand store" },
            body: {
              ar: "**Zustand** — minimal global store without Provider boilerplate. **`create((set) => ({ completed: new Set(), mark: (slug) => set(...) }))`**. Selectors: **`useStore(s => s.completed)`** — component re-renders only when selected slice changes. Great for AlefYa progress.",
              en: "**Zustand** — minimal global store without Provider boilerplate. **`create((set) => ({ completed: new Set(), mark: (slug) => set(...) }))`**. Selectors: **`useStore(s => s.completed)`** — component re-renders only when selected slice changes. Great for AlefYa progress.",
            },
          },
          {
            title: { ar: "Persist progress", en: "Persist progress" },
            body: {
              ar: "**`zustand/middleware` persist** with AsyncStorage adapter — or manual **`useEffect`** save on completed change. Serialize **`Set`** → `Array.from(set)` for JSON. Hydrate on app launch before showing progress UI.",
              en: "**`zustand/middleware` persist** with AsyncStorage adapter — or manual **`useEffect`** save on completed change. Serialize **`Set`** → `Array.from(set)` for JSON. Hydrate on app launch before showing progress UI.",
            },
          },
          {
            title: { ar: "When not to use global state", en: "When not to use global state" },
            body: {
              ar: "Form field values، modal open state، scroll — keep local. Global: auth token، locale، theme، cross-tab progress. Over-globalizing causes unnecessary re-renders.",
              en: "Form field values, modal open state, scroll — keep local. Global: auth token, locale, theme, cross-tab progress. Over-globalizing causes unnecessary re-renders.",
            },
          },
        ],
        codeSource: `import { createContext, useContext, useState, ReactNode } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Locale = "ar" | "en";
const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void } | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale outside LocaleProvider");
  return ctx;
}

type ProgressState = {
  completed: string[];
  markComplete: (slug: string) => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      markComplete: (slug) => {
        if (get().completed.includes(slug)) return;
        set({ completed: [...get().completed, slug] });
      },
    }),
    { name: "alefya-progress", storage: createJSONStorage(() => AsyncStorage) }
  )
);`,
        codeExplain: {
          ar: "Locale via Context، lesson completion via Zustand persist + AsyncStorage.",
          en: "Locale via Context, lesson completion via Zustand persist + AsyncStorage.",
        },
        faqs: [
          {
            q: { ar: "Redux Toolkit في RN؟", en: "Redux Toolkit in RN?" },
            a: {
              ar: "Valid for large teams — Zustand/Context enough for AlefYa scope.",
              en: "Valid for large teams — Zustand/Context enough for AlefYa scope.",
            },
          },
          {
            q: { ar: "Context performance؟", en: "Context performance?" },
            a: {
              ar: "Split contexts + memo children — or migrate hot data to Zustand selectors.",
              en: "Split contexts + memo children — or migrate hot data to Zustand selectors.",
            },
          },
          {
            q: { ar: "TanStack Query؟", en: "TanStack Query?" },
            a: {
              ar: "Server state layer — pairs well with Zustand client state. Fetch lesson covers basics first.",
              en: "Server state layer — pairs well with Zustand client state. Fetch lesson covers basics first.",
            },
          },
          {
            q: { ar: "MMKV vs AsyncStorage؟", en: "MMKV vs AsyncStorage?" },
            a: {
              ar: "MMKV faster — AsyncStorage simpler and used in this track's storage lesson.",
              en: "MMKV faster — AsyncStorage simpler and used in this track's storage lesson.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: fetch، error handling، offline.",
          en: "Next: fetch, error handling, offline.",
        },
      },
      {
        slug: "03-fetch-offline",
        duration: 55,
        title: { ar: "Fetch و Offline", en: "Fetch & offline" },
        summary: {
          ar: "fetch API، error/loading UI، NetInfo، cache strategy، و retry.",
          en: "fetch API, error/loading UI, NetInfo, cache strategy, and retry.",
        },
        focus: {
          ar: "Mobile apps ت operate offline often — detect connectivity و cache lesson JSON locally.",
          en: "Mobile apps often operate offline — detect connectivity and cache lesson JSON locally.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "fetch in RN", en: "fetch in RN" },
            body: {
              ar: "Global **`fetch`** works like web. Always **`try/catch`**, check **`response.ok`**, parse JSON in try. Timeout: **`AbortSignal.timeout(10000)`** or polyfill. HTTPS required on iOS production. Log errors with lesson slug context.",
              en: "Global **`fetch`** works like web. Always **`try/catch`**, check **`response.ok`**, parse JSON in try. Timeout: **`AbortSignal.timeout(10000)`** or polyfill. HTTPS required on iOS production. Log errors with lesson slug context.",
            },
          },
          {
            title: { ar: "Loading / Error / Empty UI", en: "Loading / Error / Empty UI" },
            body: {
              ar: "Three-state pattern: **`loading | error | data`**. Skeleton placeholders beat spinners for lists. Error: message + Retry Pressable. Empty: «No lessons yet». Never blank screen — user thinks app crashed.",
              en: "Three-state pattern: **`loading | error | data`**. Skeleton placeholders beat spinners for lists. Error: message + Retry Pressable. Empty: «No lessons yet». Never blank screen — users think the app crashed.",
            },
          },
          {
            title: { ar: "NetInfo", en: "NetInfo" },
            body: {
              ar: "**`@react-native-community/netinfo`**: **`NetInfo.fetch()`** + **`addEventListener`**. Show offline banner. **`isInternetReachable`** may lag — combine with failed fetch. Queue actions when offline — sync when back online (advanced).",
              en: "**`@react-native-community/netinfo`**: **`NetInfo.fetch()`** + **`addEventListener`**. Show offline banner. **`isInternetReachable`** may lag — combine with failed fetch. Queue actions when offline — sync when back online (advanced).",
            },
          },
          {
            title: { ar: "Cache-first lessons", en: "Cache-first lessons" },
            body: {
              ar: "On fetch success: **`AsyncStorage.setItem('lesson:'+slug, JSON.stringify(data))`**. On load: read cache first → show immediately → background refresh. Stale-while-revalidate pattern for AlefYa lesson reader offline support.",
              en: "On fetch success: **`AsyncStorage.setItem('lesson:'+slug, JSON.stringify(data))`**. On load: read cache first → show immediately → background refresh. Stale-while-revalidate pattern for AlefYa lesson reader offline support.",
            },
          },
        ],
        codeSource: `import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLesson(slug: string) {
  const [data, setData] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = \`lesson:\${slug}\`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) setData(JSON.parse(cached));

      const net = await NetInfo.fetch();
      setOffline(!net.isConnected);
      if (!net.isConnected) return;

      const res = await fetch(\`https://api.example.com/lessons/\${slug}\`);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const json = await res.json();
      setData(json);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(json));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, offline, retry: load };
}`,
        codeExplain: {
          ar: "Custom hook: cache-first، NetInfo offline flag، retry callback for error UI.",
          en: "Custom hook: cache-first, NetInfo offline flag, retry callback for error UI.",
        },
        faqs: [
          {
            q: { ar: "axios vs fetch؟", en: "axios vs fetch?" },
            a: {
              ar: "fetch built-in — axios adds interceptors. Either fine; track uses fetch.",
              en: "fetch is built-in — axios adds interceptors. Either is fine; this track uses fetch.",
            },
          },
          {
            q: { ar: "Certificate pinning؟", en: "Certificate pinning?" },
            a: {
              ar: "Enterprise security — beyond this track. Use HTTPS always.",
              en: "Enterprise security — beyond this track. Use HTTPS always.",
            },
          },
          {
            q: { ar: "Background fetch؟", en: "Background fetch?" },
            a: {
              ar: "expo-background-fetch for periodic sync — battery tradeoffs.",
              en: "expo-background-fetch for periodic sync — battery tradeoffs.",
            },
          },
          {
            q: { ar: "GraphQL in RN؟", en: "GraphQL in RN?" },
            a: {
              ar: "Apollo Client works — REST + fetch sufficient for capstone.",
              en: "Apollo Client works — REST + fetch sufficient for capstone.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: FlatList و Forms.",
          en: "Next stage: FlatList and Forms.",
        },
      },
    ],
  ),

  "06-lists-forms": stage(
    "06-lists-forms",
    6,
    { ar: "القوائم والنماذج", en: "Lists & forms" },
    {
      ar: "FlatList، SectionList، TextInput، KeyboardAvoidingView، list performance",
      en: "FlatList, SectionList, TextInput, KeyboardAvoidingView, list performance",
    },
    [
      {
        slug: "01-flatlist",
        duration: 50,
        title: { ar: "FlatList", en: "FlatList" },
        summary: {
          ar: "FlatList vs ScrollView، renderItem، keyExtractor، ListHeaderComponent، pull-to-refresh.",
          en: "FlatList vs ScrollView, renderItem, keyExtractor, ListHeaderComponent, pull-to-refresh.",
        },
        focus: {
          ar: "**FlatList** virtualizes long lists — renders only visible rows. Mandatory for AlefYa lesson/track lists.",
          en: "**FlatList** virtualizes long lists — renders only visible rows. Mandatory for AlefYa lesson/track lists.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "FlatList vs ScrollView", en: "FlatList vs ScrollView" },
            body: {
              ar: "**ScrollView** renders ALL children — OK for <20 items static content. **FlatList** recycles rows — 1000 lessons still smooth. Requires **`data`** array + **`renderItem`**. **`keyExtractor={(item) => item.slug}`** — stable unique keys required.",
              en: "**ScrollView** renders ALL children — OK for <20 static items. **FlatList** recycles rows — 1000 lessons still smooth. Requires **`data`** array + **`renderItem`**. **`keyExtractor={(item) => item.slug}`** — stable unique keys required.",
            },
          },
          {
            title: { ar: "renderItem pattern", en: "renderItem pattern" },
            body: {
              ar: "**`renderItem={({ item, index }) => <LessonRow lesson={item} />}`**. Extract row to **`React.memo`** component. Avoid inline arrow creating new function each render if memoized child — use **`useCallback`**. **`ItemSeparatorComponent`** for dividers.",
              en: "**`renderItem={({ item, index }) => <LessonRow lesson={item} />}`**. Extract row to **`React.memo`** component. Avoid inline arrows creating new functions each render if child is memoized — use **`useCallback`**. **`ItemSeparatorComponent`** for dividers.",
            },
          },
          {
            title: { ar: "List extras", en: "List extras" },
            body: {
              ar: "**`ListHeaderComponent`** — track title above lessons. **`ListEmptyComponent`** — no results. **`refreshing` + `onRefresh`** — pull to refresh tracks. **`onEndReached`** — pagination/infinite scroll. **`contentContainerStyle`** padding.",
              en: "**`ListHeaderComponent`** — track title above lessons. **`ListEmptyComponent`** — no results. **`refreshing` + `onRefresh`** — pull to refresh tracks. **`onEndReached`** — pagination/infinite scroll. **`contentContainerStyle`** padding.",
            },
          },
          {
            title: { ar: "SectionList", en: "SectionList" },
            body: {
              ar: "**SectionList** for grouped data: stages as sections, lessons as rows. **`sections={[{ title: 'Environment', data: lessons }]}`**. Sticky section headers optional. AlefYa track detail screen fits SectionList naturally.",
              en: "**SectionList** for grouped data: stages as sections, lessons as rows. **`sections={[{ title: 'Environment', data: lessons }]}`**. Sticky section headers optional. AlefYa track detail screen fits SectionList naturally.",
            },
          },
        ],
        codeSource: `import { FlatList, Text, Pressable, StyleSheet, RefreshControl } from "react-native";
import { memo, useCallback, useState } from "react";

type Lesson = { slug: string; title: string; duration: number };

const LessonRow = memo(function LessonRow({
  lesson,
  onPress,
}: {
  lesson: Lesson;
  onPress: (slug: string) => void;
}) {
  return (
    <Pressable style={styles.row} onPress={() => onPress(lesson.slug)}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.meta}>{lesson.duration} min</Text>
    </Pressable>
  );
});

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  const [refreshing, setRefreshing] = useState(false);

  const onPress = useCallback((slug: string) => {
    console.log("open", slug);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Lesson }) => <LessonRow lesson={item} onPress={onPress} />,
    [onPress]
  );

  return (
    <FlatList
      data={lessons}
      keyExtractor={(item) => item.slug}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await new Promise((r) => setTimeout(r, 800));
          setRefreshing(false);
        }} />
      }
    />
  );
}

const styles = StyleSheet.create({
  row: { padding: 16, flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "600" },
  meta: { color: "#64748b" },
  sep: { height: 1, backgroundColor: "#e2e8f0" },
});`,
        codeExplain: {
          ar: "Memoized row، useCallback handlers، RefreshControl — production list baseline.",
          en: "Memoized row, useCallback handlers, RefreshControl — production list baseline.",
        },
        faqs: [
          {
            q: { ar: "keyExtractor index fallback؟", en: "keyExtractor index fallback?" },
            a: {
              ar: "Avoid index keys if list reorders — use stable slug/id.",
              en: "Avoid index keys if list reorders — use stable slug/id.",
            },
          },
          {
            q: { ar: "FlatList inside ScrollView؟", en: "FlatList inside ScrollView?" },
            a: {
              ar: "Anti-pattern — nested scroll conflict. Use ListHeaderComponent instead.",
              en: "Anti-pattern — nested scroll conflict. Use ListHeaderComponent instead.",
            },
          },
          {
            q: { ar: "FlashList؟", en: "FlashList?" },
            a: {
              ar: "@shopify/flash-list faster drop-in — learn FlatList concepts first.",
              en: "@shopify/flash-list faster drop-in — learn FlatList concepts first.",
            },
          },
          {
            q: { ar: "Horizontal FlatList؟", en: "Horizontal FlatList?" },
            a: {
              ar: "`horizontal` prop — carousel of track cards.",
              en: "`horizontal` prop — carousel of track cards.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: TextInput، validation، KeyboardAvoidingView.",
          en: "Next: TextInput, validation, KeyboardAvoidingView.",
        },
      },
      {
        slug: "02-forms-keyboard",
        duration: 52,
        title: { ar: "النماذج ولوحة المفاتيح", en: "Forms & keyboard" },
        summary: {
          ar: "TextInput props، controlled forms، KeyboardAvoidingView، dismiss، validation.",
          en: "TextInput props, controlled forms, KeyboardAvoidingView, dismiss, validation.",
        },
        focus: {
          ar: "Mobile forms ت require keyboard-aware layout — inputs hidden under keyboard = top UX failure.",
          en: "Mobile forms require keyboard-aware layout — inputs hidden under keyboard is a top UX failure.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "TextInput", en: "TextInput" },
            body: {
              ar: "**`TextInput`**: `value`, `onChangeText`, `placeholder`, `secureTextEntry`, `keyboardType` (email, numeric), `autoCapitalize`, `multiline`. **`returnKeyType=\"done\"`** + **`onSubmitEditing`**. Style border/padding like web input — no default OS styling in bare RN.",
              en: "**`TextInput`**: `value`, `onChangeText`, `placeholder`, `secureTextEntry`, `keyboardType` (email, numeric), `autoCapitalize`, `multiline`. **`returnKeyType=\"done\"`** + **`onSubmitEditing`**. Style border/padding like web input — no default OS styling in bare RN.",
            },
          },
          {
            title: { ar: "KeyboardAvoidingView", en: "KeyboardAvoidingView" },
            body: {
              ar: "**`KeyboardAvoidingView`** wrapper with **`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`** and **`keyboardVerticalOffset`** for header height. **`KeyboardAwareScrollView`** from third-party alternative. Test on real device — simulators differ.",
              en: "**`KeyboardAvoidingView`** wrapper with **`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`** and **`keyboardVerticalOffset`** for header height. **`KeyboardAwareScrollView`** from third-party alternative. Test on real device — simulators differ.",
            },
          },
          {
            title: { ar: "Dismiss keyboard", en: "Dismiss keyboard" },
            body: {
              ar: "**`Keyboard.dismiss()`** on tap outside — wrap in **`Pressable`** or **`TouchableWithoutFeedback`**. **`keyboardShouldPersistTaps=\"handled\"`** on ScrollView so taps on buttons work while keyboard open.",
              en: "**`Keyboard.dismiss()`** on tap outside — wrap in **`Pressable`** or **`TouchableWithoutFeedback`**. **`keyboardShouldPersistTaps=\"handled\"`** on ScrollView so taps on buttons work while keyboard open.",
            },
          },
          {
            title: { ar: "Simple validation", en: "Simple validation" },
            body: {
              ar: "Controlled state + error strings: **`errors.email`**. Disable submit if invalid. Libraries: **react-hook-form** + **zod** for complex — AlefYa feedback form can use manual validation first.",
              en: "Controlled state + error strings: **`errors.email`**. Disable submit if invalid. Libraries: **react-hook-form** + **zod** for complex forms — AlefYa feedback form can use manual validation first.",
            },
          },
        ],
        codeSource: `import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";

export function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }
    setError(null);
    Keyboard.dismiss();
    console.log({ email, message });
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Feedback"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Send</Text>
          </Pressable>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 12 },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  error: { color: "#dc2626", fontSize: 13 },
  button: { backgroundColor: "#00D4FF", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { fontWeight: "700" },
});`,
        codeExplain: {
          ar: "KeyboardAvoidingView + dismiss tap + controlled TextInputs + inline validation.",
          en: "KeyboardAvoidingView + dismiss tap + controlled TextInputs + inline validation.",
        },
        faqs: [
          {
            q: { ar: "Keyboard covers input on Android؟", en: "Keyboard covers input on Android?" },
            a: {
              ar: "Try `android:windowSoftInputMode` in app.json `adjustResize` — Expo configures.",
              en: "Try `android:windowSoftInputMode` in app.json `adjustResize` — Expo configures.",
            },
          },
          {
            q: { ar: "react-hook-form in RN؟", en: "react-hook-form in RN?" },
            a: {
              ar: "Works with Controller wrapping TextInput — recommended for 5+ fields.",
              en: "Works with Controller wrapping TextInput — recommended for 5+ fields.",
            },
          },
          {
            q: { ar: "Focus next field؟", en: "Focus next field?" },
            a: {
              ar: "Refs: `ref.current?.focus()` on submit editing next input.",
              en: "Refs: `ref.current?.focus()` on submit editing next input.",
            },
          },
          {
            q: { ar: "Secure text entry toggle؟", en: "Secure text entry toggle?" },
            a: {
              ar: "State toggles `secureTextEntry` — show/hide password icon Pressable.",
              en: "State toggles `secureTextEntry` — show/hide password icon Pressable.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: getItemLayout، memo، list performance.",
          en: "Next: getItemLayout, memo, list performance.",
        },
      },
      {
        slug: "03-performance-lists",
        duration: 48,
        title: { ar: "أداء القوائم", en: "List performance" },
        summary: {
          ar: "getItemLayout، windowSize، removeClippedSubviews، memo، و profiling.",
          en: "getItemLayout, windowSize, removeClippedSubviews, memo, and profiling.",
        },
        focus: {
          ar: "List jank ي ruin learning apps with long lesson catalogs — optimize before shipping.",
          en: "List jank ruins learning apps with long lesson catalogs — optimize before shipping.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "getItemLayout", en: "getItemLayout" },
            body: {
              ar: "Fixed row height **`getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}`** — skips measurement pass, smoother scroll to index. Only when every row same height.",
              en: "Fixed row height **`getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}`** — skips measurement pass, smoother scroll to index. Only when every row has the same height.",
            },
          },
          {
            title: { ar: "FlatList tuning props", en: "FlatList tuning props" },
            body: {
              ar: "**`initialNumToRender={10}`**, **`maxToRenderPerBatch={10}`**, **`windowSize={5}`** — balance memory vs blank areas. **`removeClippedSubviews`** on Android (careful with overflow hidden). **`updateCellsBatchingPeriod`**. Profile defaults before tweaking.",
              en: "**`initialNumToRender={10}`**, **`maxToRenderPerBatch={10}`**, **`windowSize={5}`** — balance memory vs blank areas. **`removeClippedSubviews`** on Android (careful with overflow hidden). **`updateCellsBatchingPeriod`**. Profile defaults before tweaking.",
            },
          },
          {
            title: { ar: "Memoization discipline", en: "Memoization discipline" },
            body: {
              ar: "**`React.memo`** on row. Stable **`renderItem`** via useCallback. Don't pass new object literals as props each render. **`extraData`** prop when row depends on external state (e.g. completed Set) — triggers re-render visible rows.",
              en: "**`React.memo`** on row. Stable **`renderItem`** via useCallback. Don't pass new object literals as props each render. **`extraData`** prop when row depends on external state (e.g. completed Set) — triggers re-render of visible rows.",
            },
          },
          {
            title: { ar: "Profiling", en: "Profiling" },
            body: {
              ar: "Enable Performance Monitor in dev menu — JS FPS should stay ~60 during fling. React DevTools Profiler on list screen. **`console.time`** around heavy renderItem logic. Images in rows: fixed size + expo-image cache.",
              en: "Enable Performance Monitor in dev menu — JS FPS should stay ~60 during fling. React DevTools Profiler on list screen. **`console.time`** around heavy renderItem logic. Images in rows: fixed size + expo-image cache.",
            },
          },
        ],
        codeSource: `import { FlatList, View, Text, StyleSheet } from "react-native";
import { memo, useCallback } from "react";

const ROW_HEIGHT = 72;

type Item = { slug: string; title: string; done: boolean };

const Row = memo(function Row({ item }: { item: Item }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{item.title}</Text>
      {item.done && <Text style={styles.done}>✓</Text>}
    </View>
  );
});

export function OptimizedList({ items, completed }: { items: Item[]; completed: Set<string> }) {
  const data = items.map((i) => ({ ...i, done: completed.has(i.slug) }));

  const renderItem = useCallback(({ item }: { item: Item }) => <Row item={item} />, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ROW_HEIGHT,
      offset: ROW_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.slug}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={12}
      maxToRenderPerBatch={8}
      windowSize={7}
      extraData={completed}
    />
  );
}

const styles = StyleSheet.create({
  row: { height: ROW_HEIGHT, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  title: { flex: 1, fontSize: 16 },
  done: { color: "#00D4FF", fontWeight: "700" },
});`,
        codeExplain: {
          ar: "Fixed height getItemLayout، extraData for completion badge، tuned batch props.",
          en: "Fixed height getItemLayout, extraData for completion badge, tuned batch props.",
        },
        faqs: [
          {
            q: { ar: "Variable row height؟", en: "Variable row height?" },
            a: {
              ar: "Skip getItemLayout — consider FlashList estimatedItemSize.",
              en: "Skip getItemLayout — consider FlashList estimatedItemSize.",
            },
          },
          {
            q: { ar: "Re-render whole list on toggle؟", en: "Re-render whole list on toggle?" },
            a: {
              ar: "extraData + memo row — only visible rows re-render.",
              en: "extraData + memo row — only visible rows re-render.",
            },
          },
          {
            q: { ar: "Hermes helps lists؟", en: "Hermes helps lists?" },
            a: {
              ar: "Faster JS overall — still need list best practices.",
              en: "Faster JS overall — still need list best practices.",
            },
          },
          {
            q: { ar: "Animated list items؟", en: "Animated list items?" },
            a: {
              ar: "react-native-reanimated — keep animations on UI thread; avoid in every row initially.",
              en: "react-native-reanimated — keep animations on UI thread; avoid in every row initially.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: permissions، camera، storage.",
          en: "Next stage: permissions, camera, storage.",
        },
      },
    ],
  ),

  "07-native-device": stage(
    "07-native-device",
    7,
    { ar: "واجهات الجهاز", en: "Device APIs" },
    {
      ar: "Permissions، camera/location، AsyncStorage و secure store",
      en: "Permissions, camera/location, AsyncStorage and secure store",
    },
    [
      {
        slug: "01-permissions",
        duration: 46,
        title: { ar: "الأذونات", en: "Permissions" },
        summary: {
          ar: "expo-modules permissions، request flow، iOS Info.plist، Android manifest.",
          en: "expo-modules permissions, request flow, iOS Info.plist, Android manifest.",
        },
        focus: {
          ar: "Native capabilities ت require user permission — request in context، handle denied gracefully.",
          en: "Native capabilities require user permission — request in context, handle denied gracefully.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Permission flow", en: "Permission flow" },
            body: {
              ar: "**`Camera.requestCameraPermissionsAsync()`** returns **`{ status: 'granted' | 'denied' | 'undetermined' }`**. Check before use. Request when user taps «Take photo» — not on app launch (Apple rejects). If denied: explain + **`Linking.openSettings()`**.",
              en: "**`Camera.requestCameraPermissionsAsync()`** returns **`{ status: 'granted' | 'denied' | 'undetermined' }`**. Check before use. Request when user taps «Take photo» — not on app launch (Apple rejects). If denied: explain + **`Linking.openSettings()`**.",
            },
          },
          {
            title: { ar: "Config plugins", en: "Config plugins" },
            body: {
              ar: "Expo **`app.json` plugins** inject iOS **`NSCameraUsageDescription`** and Android **`CAMERA`** permission. Without usage string iOS crashes on request. **`expo-image-picker`** plugin adds strings automatically when configured.",
              en: "Expo **`app.json` plugins** inject iOS **`NSCameraUsageDescription`** and Android **`CAMERA`** permission. Without a usage string iOS crashes on request. **`expo-image-picker`** plugin adds strings automatically when configured.",
            },
          },
          {
            title: { ar: "Granular permissions", en: "Granular permissions" },
            body: {
              ar: "Android 13+ notification permission separate. iOS photos: limited library access. Location: **`whenInUse`** vs **`always`**. Request minimum scope needed — AlefYa profile avatar needs camera/photos only.",
              en: "Android 13+ notification permission is separate. iOS photos: limited library access. Location: **`whenInUse`** vs **`always`**. Request minimum scope needed — AlefYa profile avatar needs camera/photos only.",
            },
          },
          {
            title: { ar: "UX for denied", en: "UX for denied" },
            body: {
              ar: "Don't loop request forever. Show inline message: «Enable camera in Settings to upload avatar» + button open settings. Degrade feature — app still usable without camera.",
              en: "Don't loop request forever. Show inline message: «Enable camera in Settings to upload avatar» + button to open settings. Degrade feature — app still usable without camera.",
            },
          },
        ],
        codeSource: `import { useState } from "react";
import { View, Text, Pressable, Linking, Alert, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

export function AvatarCaptureButton() {
  const [status, setStatus] = useState<string | null>(null);

  async function ensureCamera() {
    const { status: current } = await Camera.getCameraPermissionsAsync();
    if (current === "granted") return true;

    const { status: requested } = await Camera.requestCameraPermissionsAsync();
    setStatus(requested);
    if (requested === "granted") return true;

    Alert.alert(
      "Camera required",
      "Enable camera access in Settings to take a profile photo.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  async function onPress() {
    if (!(await ensureCamera())) return;
    console.log("Open camera UI…");
  }

  return (
    <View style={styles.box}>
      <Pressable style={styles.btn} onPress={onPress}>
        <Text style={styles.btnText}>Take avatar photo</Text>
      </Pressable>
      {status && <Text style={styles.hint}>Permission: {status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16 },
  btn: { backgroundColor: "#00D4FF", padding: 14, borderRadius: 8 },
  btnText: { textAlign: "center", fontWeight: "600" },
  hint: { marginTop: 8, fontSize: 12, color: "#64748b" },
});`,
        codeExplain: {
          ar: "Check → request → denied path with Alert + openSettings — production permission UX.",
          en: "Check → request → denied path with Alert + openSettings — production permission UX.",
        },
        faqs: [
          {
            q: { ar: "Test permissions in Expo Go؟", en: "Test permissions in Expo Go?" },
            a: {
              ar: "Expo Go has its own permission scope — Dev Client closer to production.",
              en: "Expo Go has its own permission scope — Dev Client closer to production.",
            },
          },
          {
            q: { ar: "Permission in app.json example؟", en: "Permission in app.json example?" },
            a: {
              ar: "`\"plugins\": [[\"expo-camera\", { \"cameraPermission\": \"Allow AlefYa to take profile photos.\" }]]`",
              en: "`\"plugins\": [[\"expo-camera\", { \"cameraPermission\": \"Allow AlefYa to take profile photos.\" }]]`",
            },
          },
          {
            q: { ar: "Provisional notifications iOS؟", en: "Provisional notifications iOS?" },
            a: {
              ar: "Quiet notifications — use expo-notifications lesson in release context.",
              en: "Quiet notifications — use expo-notifications lesson in release context.",
            },
          },
          {
            q: { ar: "Android permission rationale؟", en: "Android permission rationale?" },
            a: {
              ar: "Show in-app explanation before system dialog for sensitive permissions.",
              en: "Show in-app explanation before system dialog for sensitive permissions.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: expo-camera و expo-location.",
          en: "Next: expo-camera and expo-location.",
        },
      },
      {
        slug: "02-camera-location",
        duration: 52,
        title: { ar: "Camera و Location", en: "Camera & location" },
        summary: {
          ar: "expo-camera / image-picker، expo-location، maps preview، privacy.",
          en: "expo-camera / image-picker, expo-location, maps preview, privacy.",
        },
        focus: {
          ar: "Device sensors unlock profile photos و location-based features — wrap in reusable hooks.",
          en: "Device sensors unlock profile photos and location-based features — wrap in reusable hooks.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "expo-image-picker", en: "expo-image-picker" },
            body: {
              ar: "**`launchImageLibraryAsync({ mediaTypes: Images, quality: 0.8 })`** — simpler than full camera for avatars. **`launchCameraAsync`** for live capture. Returns **`uri`** — upload or display with expo-image. Cancelled: **`result.canceled`**.",
              en: "**`launchImageLibraryAsync({ mediaTypes: Images, quality: 0.8 })`** — simpler than full camera for avatars. **`launchCameraAsync`** for live capture. Returns **`uri`** — upload or display with expo-image. Cancelled: **`result.canceled`**.",
            },
          },
          {
            title: { ar: "expo-location", en: "expo-location" },
            body: {
              ar: "**`Location.requestForegroundPermissionsAsync()`** then **`getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })`**. Watch: **`watchPositionAsync`** for live updates — battery cost. Display coords or pass to map — don't store precise location without need.",
              en: "**`Location.requestForegroundPermissionsAsync()`** then **`getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })`**. Watch: **`watchPositionAsync`** for live updates — battery cost. Display coords or pass to map — don't store precise location without need.",
            },
          },
          {
            title: { ar: "Maps (overview)", en: "Maps (overview)" },
            body: {
              ar: "**`react-native-maps`** — **`MapView`** + **`Marker`**. Requires API keys in app config for Google on Android. Expo plugin configures. AlefYa optional: «Study groups near me» — capstone stretch goal.",
              en: "**`react-native-maps`** — **`MapView`** + **`Marker`**. Requires API keys in app config for Google on Android. Expo plugin configures. AlefYa optional: «Study groups near me» — capstone stretch goal.",
            },
          },
          {
            title: { ar: "Privacy by design", en: "Privacy by design" },
            body: {
              ar: "Collect minimum data. Show why location helps. Allow skip. Never exfiltrate camera roll silently. GDPR-style delete account clears stored URIs.",
              en: "Collect minimum data. Show why location helps. Allow skip. Never exfiltrate camera roll silently. GDPR-style delete account clears stored URIs.",
            },
          },
        ],
        codeSource: `import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Image } from "expo-image";

export function ProfileDeviceDemo() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [coords, setCoords] = useState<string | null>(null);

  async function pickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  }

  async function locate() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const pos = await Location.getCurrentPositionAsync({});
    setCoords(\`\${pos.coords.latitude.toFixed(4)}, \${pos.coords.longitude.toFixed(4)}\`);
  }

  return (
    <View style={styles.box}>
      {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <Pressable style={styles.btn} onPress={pickAvatar}>
        <Text>Pick avatar</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={locate}>
        <Text>Get location</Text>
      </Pressable>
      {coords && <Text style={styles.coords}>{coords}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16, gap: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  btn: { backgroundColor: "#e2e8f0", padding: 12, borderRadius: 8, alignItems: "center" },
  coords: { fontSize: 13, color: "#475569" },
});`,
        codeExplain: {
          ar: "Image picker + location with permission gates and UI feedback.",
          en: "Image picker + location with permission gates and UI feedback.",
        },
        faqs: [
          {
            q: { ar: "Camera full screen custom UI؟", en: "Full screen custom camera UI?" },
            a: {
              ar: "expo-camera CameraView — more control than image-picker.",
              en: "expo-camera CameraView — more control than image-picker.",
            },
          },
          {
            q: { ar: "Background location؟", en: "Background location?" },
            a: {
              ar: "Requires extra iOS keys + Android foreground service — avoid unless essential.",
              en: "Requires extra iOS keys + Android foreground service — avoid unless essential.",
            },
          },
          {
            q: { ar: "Upload avatar to API؟", en: "Upload avatar to API?" },
            a: {
              ar: "FormData + fetch multipart — backend stores URL; mobile keeps uri until upload.",
              en: "FormData + fetch multipart — backend stores URL; mobile keeps uri until upload.",
            },
          },
          {
            q: { ar: "Simulator location؟", en: "Simulator location?" },
            a: {
              ar: "iOS Simulator Features → Location custom — test without GPS.",
              en: "iOS Simulator Features → Location custom — test without GPS.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: AsyncStorage و SecureStore.",
          en: "Next: AsyncStorage and SecureStore.",
        },
      },
      {
        slug: "03-storage-secure",
        duration: 50,
        title: { ar: "Storage و Secure Store", en: "Storage & secure store" },
        summary: {
          ar: "AsyncStorage لل preferences، expo-secure-store لل tokens، serialization.",
          en: "AsyncStorage for preferences, expo-secure-store for tokens, serialization.",
        },
        focus: {
          ar: "Not all data equal — progress JSON in AsyncStorage، JWT in SecureStore encrypted.",
          en: "Not all data is equal — progress JSON in AsyncStorage, JWT in SecureStore encrypted.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "AsyncStorage", en: "AsyncStorage" },
            body: {
              ar: "**`@react-native-async-storage/async-storage`** — async key-value string store. **`setItem`**, **`getItem`**, **`removeItem`**, **`multiGet`**. Store JSON via **`JSON.stringify`**. Not encrypted — OK for locale، theme، cached lessons. 6MB soft limit — don't store large media.",
              en: "**`@react-native-async-storage/async-storage`** — async key-value string store. **`setItem`**, **`getItem`**, **`removeItem`**, **`multiGet`**. Store JSON via **`JSON.stringify`**. Not encrypted — OK for locale, theme, cached lessons. ~6MB soft limit — don't store large media.",
            },
          },
          {
            title: { ar: "expo-secure-store", en: "expo-secure-store" },
            body: {
              ar: "**`SecureStore.setItemAsync('authToken', token)`** — Keychain iOS، EncryptedSharedPreferences Android. For refresh tokens، API keys. **`WHEN_UNLOCKED`** accessibility option. Too large values fail — store reference not blob.",
              en: "**`SecureStore.setItemAsync('authToken', token)`** — Keychain on iOS, EncryptedSharedPreferences on Android. For refresh tokens, API keys. **`WHEN_UNLOCKED`** accessibility option. Very large values fail — store a reference not a blob.",
            },
          },
          {
            title: { ar: "Migration و schema", en: "Migration & schema" },
            body: {
              ar: "Version your storage: **`@alefya/storage:v2`**. On upgrade migrate keys. Handle **`null`** parse errors. Clear all on logout: remove auth from SecureStore + progress optional keep.",
              en: "Version your storage: **`@alefya/storage:v2`**. On upgrade migrate keys. Handle **`null`** parse errors. Clear all on logout: remove auth from SecureStore + optionally keep progress.",
            },
          },
          {
            title: { ar: "File system (brief)", en: "File system (brief)" },
            body: {
              ar: "**`expo-file-system`** for download lesson PDFs offline — **`documentDirectory`**. Separate from AsyncStorage for binary/large files. **`cacheDirectory`** purgeable by OS.",
              en: "**`expo-file-system`** for downloading lesson PDFs offline — **`documentDirectory`**. Separate from AsyncStorage for binary/large files. **`cacheDirectory`** purgeable by OS.",
            },
          },
        ],
        codeSource: `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const PROGRESS_KEY = "@alefya/progress:v1";
const TOKEN_KEY = "authToken";

export async function saveProgress(completed: string[]) {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
}

export async function loadProgress(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  // keep progress in AsyncStorage unless user clears data
}`,
        codeExplain: {
          ar: "Split storage: progress AsyncStorage، auth SecureStore، safe JSON parse.",
          en: "Split storage: progress AsyncStorage, auth SecureStore, safe JSON parse.",
        },
        faqs: [
          {
            q: { ar: "AsyncStorage encrypted؟", en: "Is AsyncStorage encrypted?" },
            a: {
              ar: "No — use SecureStore for secrets.",
              en: "No — use SecureStore for secrets.",
            },
          },
          {
            q: { ar: "MMKV when؟", en: "When MMKV?" },
            a: {
              ar: "High-frequency read/write — games/settings toggles at scale.",
              en: "High-frequency read/write — games/settings toggles at scale.",
            },
          },
          {
            q: { ar: "iCloud backup tokens؟", en: "iCloud backup tokens?" },
            a: {
              ar: "SecureStore Keychain flags can exclude from backup — check expo docs for enterprise.",
              en: "SecureStore Keychain flags can exclude from backup — check expo docs for enterprise.",
            },
          },
          {
            q: { ar: "SQLite in RN؟", en: "SQLite in RN?" },
            a: {
              ar: "expo-sqlite for structured offline catalog — overkill until large offline library.",
              en: "expo-sqlite for structured offline catalog — overkill until large offline library.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة التالية: EAS Build و stores.",
          en: "Next stage: EAS Build and app stores.",
        },
      },
    ],
  ),

  "08-release": stage(
    "08-release",
    8,
    { ar: "البناء والنشر", en: "Build & release" },
    {
      ar: "EAS Build، App Store / Play Store، OTA updates",
      en: "EAS Build, App Store / Play Store, OTA updates",
    },
    [
      {
        slug: "01-eas-build",
        duration: 55,
        title: { ar: "EAS Build", en: "EAS Build" },
        summary: {
          ar: "eas.json profiles، development/preview/production builds، credentials.",
          en: "eas.json profiles, development/preview/production builds, credentials.",
        },
        focus: {
          ar: "**EAS Build** compiles native binaries in cloud — no local Xcode required for iOS team members on Windows.",
          en: "**EAS Build** compiles native binaries in the cloud — no local Xcode required for iOS team members on Windows.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "EAS setup", en: "EAS setup" },
            body: {
              ar: "Install **`npm i -g eas-cli`**, **`eas login`**, **`eas build:configure`** creates **`eas.json`**. Profiles: **development** (Dev Client)، **preview** (internal APK/IPA)، **production** (store). **`app.json`** version + **`ios.buildNumber`** / **`android.versionCode`** increment each store submit.",
              en: "Install **`npm i -g eas-cli`**, **`eas login`**, **`eas build:configure`** creates **`eas.json`**. Profiles: **development** (Dev Client), **preview** (internal APK/IPA), **production** (store). Increment **`app.json`** version + **`ios.buildNumber`** / **`android.versionCode`** each store submit.",
            },
          },
          {
            title: { ar: "Build commands", en: "Build commands" },
            body: {
              ar: "**`eas build --platform android --profile preview`** — download APK link. **`--platform ios`** needs Apple Developer account. **`eas build --platform all`** parallel. Monitor expo.dev dashboard logs. First build slower — caches help after.",
              en: "**`eas build --platform android --profile preview`** — download APK link. **`--platform ios`** needs Apple Developer account. **`eas build --platform all`** parallel. Monitor expo.dev dashboard logs. First build is slower — caches help after.",
            },
          },
          {
            title: { ar: "Credentials", en: "Credentials" },
            body: {
              ar: "EAS can manage signing: iOS distribution cert + provisioning profile، Android keystore. **`eas credentials`** inspect/fix. **Never commit keystore** — EAS stores securely. Backup keystore if self-managed.",
              en: "EAS can manage signing: iOS distribution cert + provisioning profile, Android keystore. **`eas credentials`** inspect/fix. **Never commit keystore** — EAS stores securely. Backup keystore if self-managed.",
            },
          },
          {
            title: { ar: "Dev Client build", en: "Dev Client build" },
            body: {
              ar: "Before production: **`eas build --profile development`** installs custom Expo Go with your native modules. Team shares build URL. Then **`npx expo start --dev-client`** daily dev.",
              en: "Before production: **`eas build --profile development`** installs custom Expo Go with your native modules. Team shares build URL. Then **`npx expo start --dev-client`** for daily dev.",
            },
          },
        ],
        codeSource: `# eas.json example
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  }
}

# Commands
eas login
eas build:configure
eas build --platform android --profile preview
eas build --platform ios --profile production`,
        codeExplain: {
          ar: "Three profiles map to dev/preview/store. autoIncrement bumps version codes on production.",
          en: "Three profiles map to dev/preview/store. autoIncrement bumps version codes on production.",
        },
        faqs: [
          {
            q: { ar: "Build locally without EAS؟", en: "Build locally without EAS?" },
            a: {
              ar: "`npx expo run:android/ios` after prebuild — needs native toolchains.",
              en: "`npx expo run:android/ios` after prebuild — needs native toolchains.",
            },
          },
          {
            q: { ar: "Free tier limits؟", en: "Free tier limits?" },
            a: {
              ar: "Monthly build minutes cap — plan accordingly before deadline crunch.",
              en: "Monthly build minutes cap — plan accordingly before deadline crunch.",
            },
          },
          {
            q: { ar: "Environment secrets؟", en: "Environment secrets?" },
            a: {
              ar: "EAS Secrets for API URLs — inject at build via app.config.ts.",
              en: "EAS Secrets for API URLs — inject at build via app.config.ts.",
            },
          },
          {
            q: { ar: "Bundle identifier؟", en: "Bundle identifier?" },
            a: {
              ar: "`expo.ios.bundleIdentifier` / `android.package` — unique reverse domain.",
              en: "`expo.ios.bundleIdentifier` / `android.package` — unique reverse domain.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: App Store Connect و Google Play Console.",
          en: "Next: App Store Connect and Google Play Console.",
        },
      },
      {
        slug: "02-app-store-play",
        duration: 52,
        title: { ar: "App Store و Play", en: "App Store & Play Store" },
        summary: {
          ar: "Store listings، screenshots، review guidelines، eas submit.",
          en: "Store listings, screenshots, review guidelines, eas submit.",
        },
        focus: {
          ar: "Shipping means metadata + compliance — not just binary upload.",
          en: "Shipping means metadata + compliance — not just binary upload.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "App Store Connect", en: "App Store Connect" },
            body: {
              ar: "Apple Developer Program ($99/yr). Create app record، bundle id match. **Screenshots** per device size (6.7\", 6.5\"). **Privacy nutrition labels** — declare data collected. **Review notes** + test account if login required. **`eas submit --platform ios`** uploads IPA.",
              en: "Apple Developer Program ($99/yr). Create app record, matching bundle id. **Screenshots** per device size (6.7\", 6.5\"). **Privacy nutrition labels** — declare data collected. **Review notes** + test account if login required. **`eas submit --platform ios`** uploads IPA.",
            },
          },
          {
            title: { ar: "Google Play Console", en: "Google Play Console" },
            body: {
              ar: "One-time $25. **Internal testing** track fast iteration. **Store listing** — short/full description ar/en. **Content rating** questionnaire. **Data safety** form. AAB required — EAS production builds AAB default. **`eas submit --platform android`**.",
              en: "One-time $25. **Internal testing** track for fast iteration. **Store listing** — short/full description ar/en. **Content rating** questionnaire. **Data safety** form. AAB required — EAS production builds AAB by default. **`eas submit --platform android`**.",
            },
          },
          {
            title: { ar: "Review pitfalls", en: "Review pitfalls" },
            body: {
              ar: "Apple rejects: broken links، placeholder content، requesting permissions without usage. Google: mislabeled target audience. AlefYa: real lesson content in review build، working login demo user، privacy policy URL.",
              en: "Apple rejects: broken links, placeholder content, requesting permissions without usage. Google: mislabeled target audience. AlefYa: real lesson content in review build, working login demo user, privacy policy URL.",
            },
          },
          {
            title: { ar: "Screenshots & assets", en: "Screenshots & assets" },
            body: {
              ar: "Capture via Simulator **`Cmd+S`** or **`eas metadata`**. Feature graphic Android 1024×500. App icon 1024×1024 no transparency iOS. Localized screenshots ar/en boost conversion.",
              en: "Capture via Simulator **`Cmd+S`** or **`eas metadata`**. Feature graphic Android 1024×500. App icon 1024×1024 no transparency iOS. Localized screenshots ar/en boost conversion.",
            },
          },
        ],
        codeSource: `# Submit after successful production build
eas submit --platform ios --latest
eas submit --platform android --latest

# app.json store metadata basics
{
  "expo": {
    "name": "AlefYa",
    "slug": "alefya",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "app.alefya.mobile",
      "buildNumber": "1"
    },
    "android": {
      "package": "app.alefya.mobile",
      "versionCode": 1
    }
  }
}`,
        codeExplain: {
          ar: "submit uploads latest build — version fields must increment each release.",
          en: "submit uploads latest build — version fields must increment each release.",
        },
        faqs: [
          {
            q: { ar: "Review time؟", en: "Review time?" },
            a: {
              ar: "Apple 1-3 days typical — Google often hours for internal track.",
              en: "Apple 1-3 days typical — Google often hours for internal track.",
            },
          },
          {
            q: { ar: "TestFlight؟", en: "TestFlight?" },
            a: {
              ar: "iOS beta — add testers emails before public App Store release.",
              en: "iOS beta — add tester emails before public App Store release.",
            },
          },
          {
            q: { ar: "Reject fix cycle؟", en: "Reject fix cycle?" },
            a: {
              ar: "Read Resolution Center message — fix — increment build — resubmit.",
              en: "Read Resolution Center message — fix — increment build — resubmit.",
            },
          },
          {
            q: { ar: "Paid app / IAP؟", en: "Paid app / IAP?" },
            a: {
              ar: "AlefYa free educational — IAP optional later via expo-in-app-purchases.",
              en: "AlefYa free educational — IAP optional later via expo-in-app-purchases.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: EAS Update OTA.",
          en: "Next: EAS Update OTA.",
        },
      },
      {
        slug: "03-updates-ota",
        duration: 48,
        title: { ar: "OTA Updates", en: "OTA updates" },
        summary: {
          ar: "EAS Update، channels، runtimeVersion، limits of OTA vs native changes.",
          en: "EAS Update, channels, runtimeVersion, limits of OTA vs native changes.",
        },
        focus: {
          ar: "**EAS Update** pushes JS/asset changes without store review — not native code changes.",
          en: "**EAS Update** pushes JS/asset changes without store review — not native code changes.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "EAS Update setup", en: "EAS Update setup" },
            body: {
              ar: "**`eas update:configure`** adds updates URL to app config. **`runtimeVersion`** policy links updates to native build — **`{\"policy\": \"appVersion\"}`** common. Mismatch runtime → update won't apply — rebuild native.",
              en: "**`eas update:configure`** adds updates URL to app config. **`runtimeVersion`** policy links updates to native build — **`{\"policy\": \"appVersion\"}`** common. Runtime mismatch → update won't apply — rebuild native.",
            },
          },
          {
            title: { ar: "Channels", en: "Channels" },
            body: {
              ar: "**`eas update --branch production --message \"Fix lesson typo\"`**. **`eas channel:edit production --branch production`**. Preview channel for QA. **`expo-updates`** checks on launch — configurable check frequency.",
              en: "**`eas update --branch production --message \"Fix lesson typo\"`**. **`eas channel:edit production --branch production`**. Preview channel for QA. **`expo-updates`** checks on launch — configurable check frequency.",
            },
          },
          {
            title: { ar: "What OTA can / can't", en: "What OTA can / can't" },
            body: {
              ar: "CAN: JS bugfix، copy changes، images، navigation structure pure JS. CANNOT: new native module، permission string changes، SDK upgrade — needs new **`eas build`**. Plan native releases quarterly، OTA weekly copy fixes.",
              en: "CAN: JS bugfix, copy changes, images, pure JS navigation structure. CANNOT: new native module, permission string changes, SDK upgrade — needs new **`eas build`**. Plan native releases quarterly, OTA weekly copy fixes.",
            },
          },
          {
            title: { ar: "Rollback", en: "Rollback" },
            body: {
              ar: "Expo dashboard republish previous update or **`eas update:rollback`**. Monitor crash rates after OTA — Sentry integration recommended for production AlefYa.",
              en: "Expo dashboard republish previous update or **`eas update:rollback`**. Monitor crash rates after OTA — Sentry integration recommended for production AlefYa.",
            },
          },
        ],
        codeSource: `# app.json updates snippet
{
  "expo": {
    "runtimeVersion": { "policy": "appVersion" },
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    }
  }
}

# Publish OTA
eas update --branch production --message "Fix FlatList key warning"

# Development test
eas update --branch preview --message "QA build"`,
        codeExplain: {
          ar: "runtimeVersion ties JS bundle to native binary generation — critical for safe OTA.",
          en: "runtimeVersion ties JS bundle to native binary generation — critical for safe OTA.",
        },
        faqs: [
          {
            q: { ar: "OTA in Expo Go؟", en: "OTA in Expo Go?" },
            a: {
              ar: "No — OTA applies to your production/dev client builds only.",
              en: "No — OTA applies to your production/dev client builds only.",
            },
          },
          {
            q: { ar: "Force update UX؟", en: "Force update UX?" },
            a: {
              ar: "Compare runtimeVersion — block app with modal if native store version required.",
              en: "Compare runtimeVersion — block app with modal if native store version required.",
            },
          },
          {
            q: { ar: "CodePush vs EAS Update؟", en: "CodePush vs EAS Update?" },
            a: {
              ar: "EAS integrated with Expo workflow — use EAS in this track.",
              en: "EAS integrated with Expo workflow — use EAS in this track.",
            },
          },
          {
            q: { ar: "Update on cellular؟", en: "Update on cellular?" },
            a: {
              ar: "Configure expo-updates — warn large downloads on mobile data.",
              en: "Configure expo-updates — warn on large downloads over mobile data.",
            },
          },
        ],
        nextHint: {
          ar: "المرحلة الأخيرة: مشروع AlefYa Mobile capstone.",
          en: "Final stage: AlefYa Mobile capstone project.",
        },
      },
    ],
  ),

  "09-project": stage(
    "09-project",
    9,
    { ar: "مشروع تطبيقي", en: "Capstone project" },
    {
      ar: "تصميم، تنفيذ، و polish لتطبيق AlefYa Mobile",
      en: "Design, implement, and polish the AlefYa Mobile app",
    },
    [
      {
        slug: "01-design",
        duration: 50,
        title: { ar: "تصميم التطبيق", en: "App design" },
        summary: {
          ar: "User flows، wireframes، design tokens، navigation map ل AlefYa Mobile.",
          en: "User flows, wireframes, design tokens, navigation map for AlefYa Mobile.",
        },
        focus: {
          ar: "Capstone يبدأ ب design واضح — screens، data model، و offline scope قبل coding sprint.",
          en: "Capstone starts with clear design — screens, data model, and offline scope before coding sprint.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "User flows", en: "User flows" },
            body: {
              ar: "Primary: Open app → Browse tracks → Open React Native track → Read lesson → Mark complete → View progress. Secondary: Switch locale ar/en، Resume last lesson، Offline read cached lesson. Draw flow diagram — 5-7 screens max for MVP.",
              en: "Primary: Open app → Browse tracks → Open React Native track → Read lesson → Mark complete → View progress. Secondary: Switch locale ar/en, Resume last lesson, Offline read cached lesson. Draw flow diagram — 5-7 screens max for MVP.",
            },
          },
          {
            title: { ar: "Screen inventory", en: "Screen inventory" },
            body: {
              ar: "**TrackList** (FlatList cards color per track). **TrackDetail** (SectionList stages/lessons). **LessonReader** (ScrollView sections: concepts، code، checklist). **ProgressDashboard** (computed %). **Settings** (locale، clear cache). Tab: Learn | Progress | Settings.",
              en: "**TrackList** (FlatList cards color per track). **TrackDetail** (SectionList stages/lessons). **LessonReader** (ScrollView sections: concepts, code, checklist). **ProgressDashboard** (computed %). **Settings** (locale, clear cache). Tab: Learn | Progress | Settings.",
            },
          },
          {
            title: { ar: "Design tokens", en: "Design tokens" },
            body: {
              ar: "Colors: background `#f8fafc`، card `#fff`، RN track accent `#00D4FF`، text `#0f172a` / muted `#64748b`. Spacing scale 4/8/12/16/24. Radius 8/12. Typography: title 20-24 bold، body 15-16 lineHeight 22. Reuse in **`theme.ts`** constants.",
              en: "Colors: background `#f8fafc`, card `#fff`, RN track accent `#00D4FF`, text `#0f172a` / muted `#64748b`. Spacing scale 4/8/12/16/24. Radius 8/12. Typography: title 20-24 bold, body 15-16 lineHeight 22. Reuse in **`theme.ts`** constants.",
            },
          },
          {
            title: { ar: "Data model", en: "Data model" },
            body: {
              ar: "Reuse AlefYa JSON lesson shape: slug، title Record<locale>، duration، concepts[]. Client state: `completed: Set<string>`، `lastOpened: { track, slug }`. API mock: bundle static JSON in assets for offline MVP.",
              en: "Reuse AlefYa JSON lesson shape: slug, title Record<locale>, duration, concepts[]. Client state: `completed: Set<string>`, `lastOpened: { track, slug }`. API mock: bundle static JSON in assets for offline MVP.",
            },
          },
        ],
        codeSource: `// theme.ts — design tokens for AlefYa Mobile
export const colors = {
  background: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  tracks: {
    "react-native": "#00D4FF",
    angular: "#DD0031",
    aspnet: "#512BD4",
  },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24 } as const;

export type Screen =
  | "TrackList"
  | "TrackDetail"
  | "LessonReader"
  | "Progress"
  | "Settings";`,
        codeExplain: {
          ar: "Central theme + screen union documents IA before implementation sprint.",
          en: "Central theme + screen union documents IA before implementation sprint.",
        },
        faqs: [
          {
            q: { ar: "Figma required؟", en: "Figma required?" },
            a: {
              ar: "Paper sketch + this token file enough for capstone — Figma optional polish.",
              en: "Paper sketch + this token file enough for capstone — Figma optional polish.",
            },
          },
          {
            q: { ar: "Dark mode MVP؟", en: "Dark mode MVP?" },
            a: {
              ar: "Stretch — light mode only MVP; structure colors via theme for later.",
              en: "Stretch — light mode only MVP; structure colors via theme for later.",
            },
          },
          {
            q: { ar: "Auth in MVP؟", en: "Auth in MVP?" },
            a: {
              ar: "Optional — local progress enough; add login if backend ready.",
              en: "Optional — local progress enough; add login if backend ready.",
            },
          },
          {
            q: { ar: "How many tracks in demo؟", en: "How many tracks in demo?" },
            a: {
              ar: "2-3 tracks with real JSON — RN track complete path highlighted.",
              en: "2-3 tracks with real JSON — RN track complete path highlighted.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: vertical slice implementation.",
          en: "Next: vertical slice implementation.",
        },
      },
      {
        slug: "02-implement",
        duration: 55,
        title: { ar: "التنفيذ", en: "Implementation" },
        summary: {
          ar: "Navigation shell، screens، Zustand progress، fetch/cache lessons — vertical slice.",
          en: "Navigation shell, screens, Zustand progress, fetch/cache lessons — vertical slice.",
        },
        focus: {
          ar: "Ship working slice: list tracks → open lesson → mark complete → see progress — end to end.",
          en: "Ship working slice: list tracks → open lesson → mark complete → see progress — end to end.",
        },
        stack: "tsx",
        ideas: [
          {
            title: { ar: "Implementation order", en: "Implementation order" },
            body: {
              ar: "1) NavigationContainer + tabs + Learn stack. 2) TrackList from static JSON. 3) TrackDetail SectionList. 4) LessonReader render lesson JSON. 5) Zustand markComplete + persist. 6) Progress tab computed %. 7) Locale Context toggle. Each step demoable.",
              en: "1) NavigationContainer + tabs + Learn stack. 2) TrackList from static JSON. 3) TrackDetail SectionList. 4) LessonReader render lesson JSON. 5) Zustand markComplete + persist. 6) Progress tab computed %. 7) Locale Context toggle. Each step demoable.",
            },
          },
          {
            title: { ar: "Lesson renderer", en: "Lesson renderer" },
            body: {
              ar: "Map `lesson.concepts` → ConceptCard. Code block: monospace View + ScrollView horizontal. Checklist: Pressable toggle local then sync store. Keep renderer dumb — pass `locale` prop for bilingual fields.",
              en: "Map `lesson.concepts` → ConceptCard. Code block: monospace View + horizontal ScrollView. Checklist: Pressable toggle local then sync store. Keep renderer dumb — pass `locale` prop for bilingual fields.",
            },
          },
          {
            title: { ar: "Folder structure", en: "Folder structure" },
            body: {
              ar: "`src/navigation/` RootTabs، LearnStack. `src/screens/`. `src/components/LessonCard.tsx`. `src/store/progress.ts`. `src/data/tracks.json`. `src/theme.ts`. Avoid deep nesting until needed.",
              en: "`src/navigation/` RootTabs, LearnStack. `src/screens/`. `src/components/LessonCard.tsx`. `src/store/progress.ts`. `src/data/tracks.json`. `src/theme.ts`. Avoid deep nesting until needed.",
            },
          },
          {
            title: { ar: "Definition of done", en: "Definition of done" },
            body: {
              ar: "No Red Screens in happy path. Progress survives app restart. Lesson list scroll smooth 60fps. Arabic locale renders RTL titles. One preview EAS build installs on device.",
              en: "No Red Screens on happy path. Progress survives app restart. Lesson list scrolls smoothly at 60fps. Arabic locale renders RTL titles. One preview EAS build installs on device.",
            },
          },
        ],
        codeSource: `// App.tsx skeleton — wire navigation + providers
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "./src/context/LocaleContext";
import { RootTabs } from "./src/navigation/RootTabs";
import { linking } from "./src/navigation/linking";

export default function App() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <NavigationContainer linking={linking}>
          <RootTabs />
        </NavigationContainer>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}

// LessonReader excerpt
function LessonReader({ route }: { route: { params: { slug: string } } }) {
  const { locale } = useLocale();
  const markComplete = useProgressStore((s) => s.markComplete);
  const lesson = useLessonContent(route.params.slug);

  if (!lesson) return <ActivityIndicator />;
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{lesson.title[locale]}</Text>
      <PrimaryButton label="Mark complete" onPress={() => markComplete(lesson.slug)} />
    </ScrollView>
  );
}`,
        codeExplain: {
          ar: "Providers at root، typed navigation، LessonReader connects locale store + content hook.",
          en: "Providers at root, typed navigation, LessonReader connects locale store + content hook.",
        },
        faqs: [
          {
            q: { ar: "expo-router for capstone؟", en: "expo-router for capstone?" },
            a: {
              ar: "Allowed if comfortable — same features; file routes replace manual stacks.",
              en: "Allowed if comfortable — same features; file routes replace manual stacks.",
            },
          },
          {
            q: { ar: "Mock API vs bundled JSON؟", en: "Mock API vs bundled JSON?" },
            a: {
              ar: "Bundled JSON faster MVP — swap to fetch URL when backend live.",
              en: "Bundled JSON faster MVP — swap to fetch URL when backend live.",
            },
          },
          {
            q: { ar: "Tests required؟", en: "Tests required?" },
            a: {
              ar: "Optional: one RTL test for progress store logic — focus on working app.",
              en: "Optional: one RTL test for progress store logic — focus on working app.",
            },
          },
          {
            q: { ar: "Stuck on navigation types؟", en: "Stuck on navigation types?" },
            a: {
              ar: "Use AI Helper with ParamList snippet — common RN pain point.",
              en: "Use AI Helper with ParamList snippet — common RN pain point.",
            },
          },
        ],
        nextHint: {
          ar: "التالي: polish، accessibility، performance، store prep.",
          en: "Next: polish, accessibility, performance, store prep.",
        },
      },
      {
        slug: "03-polish",
        duration: 52,
        title: { ar: "Polish والإطلاق", en: "Polish & launch" },
        summary: {
          ar: "Accessibility pass، performance audit، error boundaries، app icon، EAS preview build.",
          en: "Accessibility pass, performance audit, error boundaries, app icon, EAS preview build.",
        },
        focus: {
          ar: "Polish turns prototype into shippable — a11y، empty states، splash، and production checklist.",
          en: "Polish turns prototype into shippable — a11y, empty states, splash, and production checklist.",
        },
        stack: "bash",
        ideas: [
          {
            title: { ar: "Accessibility pass", en: "Accessibility pass" },
            body: {
              ar: "VoiceOver walkthrough: every interactive has label. Touch targets ≥44pt. Color contrast WCAG AA for text on `#f8fafc`. **`accessibilityState={{ checked }}`** on completed lessons. Test Arabic VoiceOver if available.",
              en: "VoiceOver walkthrough: every interactive has a label. Touch targets ≥44pt. Color contrast WCAG AA for text on `#f8fafc`. **`accessibilityState={{ checked }}`** on completed lessons. Test Arabic VoiceOver if available.",
            },
          },
          {
            title: { ar: "Performance audit", en: "Performance audit" },
            body: {
              ar: "Flip Performance Monitor during track list fling. Memo rows. Prefetch next lesson JSON on TrackDetail mount. Reduce re-renders: React DevTools Profiler. Hermes enabled in production build.",
              en: "Flip Performance Monitor during track list fling. Memo rows. Prefetch next lesson JSON on TrackDetail mount. Reduce re-renders: React DevTools Profiler. Hermes enabled in production build.",
            },
          },
          {
            title: { ar: "Error boundary & empty states", en: "Error boundary & empty states" },
            body: {
              ar: "React **`ErrorBoundary`** class component wraps navigation — friendly «Something went wrong» + restart. Empty progress: illustration + «Start first lesson». Offline banner component global.",
              en: "React **`ErrorBoundary`** class component wraps navigation — friendly «Something went wrong» + restart. Empty progress: illustration + «Start first lesson». Offline banner component global.",
            },
          },
          {
            title: { ar: "Launch checklist", en: "Launch checklist" },
            body: {
              ar: "✓ app.json icon + splash. ✓ `eas build --profile preview` tested. ✓ Privacy policy link in Settings. ✓ Version 1.0.0. ✓ Store screenshots captured. ✓ OTA configured for post-launch copy fixes. Celebrate — you built AlefYa Mobile.",
              en: "✓ app.json icon + splash. ✓ `eas build --profile preview` tested. ✓ Privacy policy link in Settings. ✓ Version 1.0.0. ✓ Store screenshots captured. ✓ OTA configured for post-launch copy fixes. Celebrate — you built AlefYa Mobile.",
            },
          },
        ],
        codeSource: `# Polish checklist commands
npx expo start --no-dev --minify   # prod-like JS locally
eas build --platform android --profile preview
eas build --platform ios --profile preview

# app.json polish
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#f8fafc"
    },
    "userInterfaceStyle": "light"
  }
}`,
        codeExplain: {
          ar: "Production-minify local test + preview builds + branded icon/splash before store.",
          en: "Production-minify local test + preview builds + branded icon/splash before store.",
        },
        faqs: [
          {
            q: { ar: "Sentry worth it؟", en: "Sentry worth it?" },
            a: {
              ar: "Yes for production — `sentry-expo` captures crashes post-launch.",
              en: "Yes for production — `sentry-expo` captures crashes post-launch.",
            },
          },
          {
            q: { ar: "Analytics؟", en: "Analytics?" },
            a: {
              ar: "expo-firebase-analytics or PostHog — track lesson completion funnel.",
              en: "expo-firebase-analytics or PostHog — track lesson completion funnel.",
            },
          },
          {
            q: { ar: "What's next after capstone؟", en: "What's next after capstone?" },
            a: {
              ar: "Push notifications for streaks، social share deep links، tablet master-detail.",
              en: "Push notifications for streaks, social share deep links, tablet master-detail.",
            },
          },
          {
            q: { ar: "Finished track — certificate؟", en: "Finished track — certificate?" },
            a: {
              ar: "Complete all checklists — AlefYa progress marks you RN path graduate.",
              en: "Complete all checklists — AlefYa progress marks you RN path graduate.",
            },
          },
        ],
        nextHint: {
          ar: "أكملت مسار React Native — راجع مشروعك وشاركه!",
          en: "You finished the React Native track — review your project and share it!",
        },
      },
    ],
  ),
};
