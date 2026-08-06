import { ALL_VARIANTS } from "./interview-variants";
import {
  getInterviewQuestionCount as countFromMeta,
  getInterviewQuestionCountByDifficulty as countByDifficultyFromMeta,
} from "./interview-counts";
import {
  chatJsonCompletion,
  cleanProse,
  cleanProseList,
  hasOpenAiKey,
} from "@/lib/openai";

const VARIANTS = ALL_VARIANTS;

export type InterviewKind = "mcq" | "scenario";
export type InterviewDifficulty = "junior" | "mid" | "senior";

export type InterviewQuestion = {
  id: string;
  trackSlug: string;
  kind: InterviewKind;
  difficulty: InterviewDifficulty;
  topic: string;
  prompt: { ar: string; en: string };
  options: { ar: string[]; en: string[] };
  correctIndex: number;
  explanation: { ar: string; en: string };
};

type Localized = { en: string; ar: string };
type TopicPack = {
  topic: string;
  best: Localized;
  trap: Localized;
  why: Localized;
  scenario: Localized;
};

const l = (en: string, ar: string): Localized => ({ en, ar });
const p = (
  topic: string,
  best: Localized,
  trap: Localized,
  why: Localized,
  scenario: Localized,
): TopicPack => ({ topic, best, trap, why, scenario });

const TRACK_PACKS: Record<string, TopicPack[]> = {
  angular: [
    p("change-detection", l("Use OnPush with immutable inputs and explicit state updates", "استخدم OnPush مع مدخلات غير قابلة للتغيير وتحديثات حالة صريحة"), l("Mutate an input object in place and expect OnPush to notice", "عدّل كائن الإدخال نفسه وتوقّع أن يكتشفه OnPush"), l("OnPush reacts to reference changes, events, and explicit marks; in-place mutation preserves the reference and commonly leaves stale UI.", "يتفاعل OnPush مع تغيّر المرجع والأحداث والتعليم الصريح؛ تعديل الكائن نفسه يبقي المرجع ويؤدي غالباً إلى واجهة قديمة."), l("A child component sometimes shows an old customer name after its parent updates the customer", "يعرض مكوّن ابن أحياناً اسم عميل قديماً بعد تحديث الأب للعميل")),
    p("rxjs-subscriptions", l("Compose with switchMap and terminate subscriptions with the component lifecycle", "استخدم switchMap وأنهِ الاشتراكات مع دورة حياة المكوّن"), l("Nest subscribe calls and never unsubscribe", "استخدم اشتراكات subscribe متداخلة ولا تُلغِها"), l("switchMap cancels stale work and lifecycle cleanup prevents leaks; nested subscriptions create races and unmanaged resources.", "يلغي switchMap العمل القديم ويمنع التنظيف المرتبط بدورة الحياة التسرب؛ أما الاشتراكات المتداخلة فتخلق سباقات وموارد غير مُدارة."), l("A typeahead sends overlapping HTTP requests and older results overwrite newer ones", "يرسل البحث الفوري طلبات HTTP متداخلة وتستبدل النتائج القديمة النتائج الأحدث")),
    p("dependency-injection", l("Provide the service at the intended ownership boundary", "وفّر الخدمة عند حد الملكية المقصود"), l("Provide a stateful service separately in every component", "وفّر خدمة ذات حالة بشكل منفصل في كل مكوّن"), l("Provider scope determines instance lifetime and sharing; component-level providers silently create isolated instances.", "يحدد نطاق المزوّد عمر النسخة ومشاركتها؛ والمزوّد على مستوى المكوّن ينشئ نسخاً معزولة دون وضوح."), l("Two sibling components unexpectedly see different cart state", "يرى مكوّنان شقيقان حالة مختلفة لسلة التسوق بشكل غير متوقع")),
    p("forms", l("Use reactive forms with explicit validators and typed controls", "استخدم النماذج التفاعلية مع مدققات صريحة وعناصر تحكم typed"), l("Read values directly from DOM elements and validate only on submit", "اقرأ القيم مباشرة من DOM وتحقق منها عند الإرسال فقط"), l("Reactive forms centralize state, typing, and validation; DOM reads bypass Angular's form model and are hard to test.", "توحّد النماذج التفاعلية الحالة والأنواع والتحقق؛ أما قراءة DOM فتتجاوز نموذج Angular ويصعب اختبارها."), l("A multi-step checkout has conditional fields and server-side validation errors", "يحتوي دفع متعدد الخطوات على حقول شرطية وأخطاء تحقق من الخادم")),
    p("routing", l("Use route guards for navigation UX and enforce authorization on the server", "استخدم حراس المسار لتجربة التنقل وطبّق التفويض على الخادم"), l("Treat a client-side guard as the security boundary", "اعتبر حارس المسار في العميل حد الأمان"), l("Guards improve navigation but client code is controllable by users; only the server can enforce access securely.", "تحسن الحراس التنقل لكن المستخدم يستطيع التحكم بكود العميل؛ الخادم وحده يفرض الوصول بأمان."), l("An admin route is hidden in the UI but its API still accepts ordinary-user tokens", "مسار الإدارة مخفي في الواجهة لكن API يقبل رموز المستخدم العادي")),
    p("signals-state", l("Keep derived state in computed signals and side effects in effects", "ضع الحالة المشتقة في computed signals والآثار الجانبية في effects"), l("Copy derived values into writable signals from several handlers", "انسخ القيم المشتقة إلى إشارات قابلة للكتابة من عدة معالجات"), l("Computed values stay consistent with their dependencies; duplicated writable state drifts when one update path is missed.", "تبقى قيم computed متسقة مع اعتمادياتها؛ أما تكرار الحالة القابلة للكتابة فينحرف عند نسيان مسار تحديث."), l("A dashboard total disagrees with its filtered rows after several interactions", "يختلف إجمالي لوحة المعلومات عن الصفوف المصفاة بعد عدة تفاعلات")),
    p("templates-performance", l("Use trackBy or a stable track expression for repeated items", "استخدم trackBy أو تعبير تتبع ثابت للعناصر المتكررة"), l("Track rows by their array index while inserting and sorting", "تتبّع الصفوف بفهرس المصفوفة أثناء الإدراج والترتيب"), l("Stable identity lets Angular reuse the correct DOM and component instances; indices change after reorder and can misassociate state.", "تتيح الهوية الثابتة لـ Angular إعادة استخدام DOM ونسخ المكوّن الصحيحة؛ تتغير الفهارس بعد الترتيب وقد تربط الحالة بعنصر خاطئ."), l("Sorting a large editable table moves focus and local row state to the wrong record", "يؤدي ترتيب جدول كبير قابل للتحرير إلى نقل التركيز وحالة الصف إلى سجل خاطئ")),
    p("testing", l("Test observable behavior with TestBed and controlled dependencies", "اختبر السلوك المرئي باستخدام TestBed واعتماديات مضبوطة"), l("Assert private fields and implementation-specific method calls", "تحقق من الحقول الخاصة واستدعاءات الطرق الداخلية"), l("Behavioral tests survive refactors and verify user-visible contracts; private-field assertions couple tests to implementation.", "تصمد اختبارات السلوك أمام إعادة الهيكلة وتتحقق من العقد المرئي؛ ربط الاختبارات بالحقول الخاصة يجعلها هشة."), l("A harmless component refactor breaks dozens of tests although behavior is unchanged", "تؤدي إعادة هيكلة سليمة لمكوّن إلى كسر عشرات الاختبارات رغم ثبات السلوك")),
  ],
  aspnet: [
    p("middleware", l("Order exception handling before endpoints and authentication before authorization", "رتّب معالجة الاستثناءات قبل نقاط النهاية والمصادقة قبل التفويض"), l("Register middleware in arbitrary order because the pipeline reorders it", "سجّل البرمجيات الوسيطة بأي ترتيب لأن خط الأنابيب يعيد ترتيبها"), l("ASP.NET Core executes middleware in registration order; incorrect order can bypass handlers or authorize without an identity.", "ينفّذ ASP.NET Core البرمجيات الوسيطة بترتيب التسجيل؛ الترتيب الخاطئ قد يتجاوز المعالجات أو يفوّض دون هوية."), l("Production errors bypass the JSON error handler and return an HTML page", "تتجاوز أخطاء الإنتاج معالج JSON وتعيد صفحة HTML")),
    p("dependency-injection", l("Use scoped DbContext instances per request", "استخدم نسخة DbContext بنطاق الطلب"), l("Register DbContext as a singleton shared by all requests", "سجّل DbContext كنسخة singleton مشتركة بين كل الطلبات"), l("DbContext is not thread-safe and naturally models a unit of work; singleton scope causes concurrent access and stale tracking.", "DbContext غير آمن للخيوط ويمثل وحدة عمل؛ نطاق singleton يسبب وصولاً متزامناً وتتبعاً قديماً."), l("Concurrent requests intermittently throw tracking and disposed-object errors", "ترمي الطلبات المتزامنة بشكل متقطع أخطاء التتبع والكائنات المتخلّص منها")),
    p("async-io", l("Use async all the way and pass CancellationToken to I/O", "استخدم async عبر السلسلة ومرّر CancellationToken إلى عمليات الإدخال والإخراج"), l("Call .Result on asynchronous database operations", "استخدم ‎.Result على عمليات قاعدة البيانات غير المتزامنة"), l("True asynchronous I/O releases request threads and cancellation stops abandoned work; blocking waits reduce throughput and can deadlock.", "تحرر عمليات I/O غير المتزامنة خيوط الطلب وتوقف الإلغاء العمل المهجور؛ الانتظار الحاجب يقلل الإنتاجية وقد يسبب تعطلًا."), l("Latency spikes under load although the database remains healthy", "يرتفع زمن الاستجابة تحت الحمل رغم سلامة قاعدة البيانات")),
    p("model-binding", l("Use dedicated request DTOs with validation", "استخدم DTOs مخصصة للطلبات مع التحقق"), l("Bind EF entities directly from untrusted JSON", "اربط كيانات EF مباشرة من JSON غير موثوق"), l("DTOs define the accepted contract and prevent over-posting; entity binding may let callers set privileged fields.", "تحدد DTOs العقد المقبول وتمنع over-posting؛ ربط الكيان قد يسمح للمتصل بضبط حقول حساسة."), l("A profile endpoint accidentally lets users set IsAdmin", "تسمح نقطة ملف شخصي للمستخدمين بضبط IsAdmin بالخطأ")),
    p("authorization", l("Use policy-based authorization with explicit requirements", "استخدم تفويضاً قائماً على السياسات بمتطلبات صريحة"), l("Check role names ad hoc inside every controller action", "تحقق من أسماء الأدوار يدوياً داخل كل إجراء controller"), l("Policies centralize testable authorization rules; scattered string checks drift and miss alternate entry points.", "توحّد السياسات قواعد التفويض القابلة للاختبار؛ الفحوص النصية المبعثرة تنحرف وتفوت مسارات بديلة."), l("The same business operation has inconsistent access rules across controllers", "للعملية التجارية نفسها قواعد وصول غير متسقة عبر المتحكمات")),
    p("caching", l("Define cache keys, expiration, and invalidation from consistency needs", "عرّف مفاتيح التخزين المؤقت والانتهاء والإبطال حسب متطلبات الاتساق"), l("Cache every response forever without tenant-aware keys", "خزّن كل استجابة إلى الأبد دون مفاتيح تراعي المستأجر"), l("Correct caching includes ownership and freshness; broad keys can leak tenant data and indefinite entries become stale.", "يشمل التخزين الصحيح الملكية والحداثة؛ المفاتيح العامة قد تسرب بيانات المستأجر والإدخالات الدائمة تصبح قديمة."), l("One tenant occasionally receives another tenant's dashboard summary", "يتلقى مستأجر أحياناً ملخص لوحة مستأجر آخر")),
    p("ef-core-queries", l("Project only needed columns and avoid N+1 queries", "أسقط الأعمدة المطلوبة فقط وتجنب استعلامات N+1"), l("Load full graphs and lazy-load each relation in a loop", "حمّل الرسم الكامل واستخدم التحميل الكسول لكل علاقة داخل حلقة"), l("Server-side projection produces bounded SQL; per-row lazy loading multiplies round trips and memory.", "ينتج الإسقاط على الخادم SQL محدوداً؛ والتحميل لكل صف يضاعف الرحلات والذاكرة."), l("An orders endpoint executes hundreds of SQL statements for one page", "تنفذ نقطة الطلبات مئات عبارات SQL لصفحة واحدة")),
    p("health-observability", l("Separate liveness from readiness and emit structured logs with correlation IDs", "افصل liveness عن readiness وأصدر سجلات منظمة بمعرّفات ترابط"), l("Make liveness fail whenever any downstream dependency is slow", "اجعل liveness يفشل كلما تباطأت أي اعتمادية خارجية"), l("Liveness should detect a stuck process while readiness controls traffic; coupling liveness to dependencies causes restart storms.", "يجب أن يكشف liveness العملية العالقة بينما يتحكم readiness بحركة المرور؛ ربط liveness بالاعتماديات يسبب عواصف إعادة تشغيل."), l("A brief database outage causes every API pod to restart repeatedly", "يتسبب انقطاع قصير لقاعدة البيانات في إعادة تشغيل كل حاويات API مراراً")),
  ],
  csharp: [
    p("value-reference", l("Choose value types for small immutable values and reference types for shared identity", "اختر value types للقيم الصغيرة الثابتة وreference types للهوية المشتركة"), l("Use a large mutable struct to avoid every allocation", "استخدم struct كبيراً قابلاً للتغيير لتجنب كل تخصيص"), l("Large mutable structs are copied implicitly and create surprising behavior; allocation avoidance alone is not a sound model.", "تُنسخ structs الكبيرة القابلة للتغيير ضمنياً وتنتج سلوكاً مفاجئاً؛ تجنب التخصيص وحده ليس نموذجاً سليماً."), l("Updating a struct retrieved from a collection does not update the stored item", "لا يؤدي تحديث struct مسترجع من مجموعة إلى تحديث العنصر المخزّن")),
    p("async-await", l("Return Task and await asynchronous work except for event handlers", "أعد Task وانتظر العمل غير المتزامن إلا في معالجات الأحداث"), l("Use async void for service methods", "استخدم async void لطرق الخدمات"), l("Task carries completion and exceptions to callers; async void cannot be awaited and exceptions escape normal handling.", "يحمل Task الاكتمال والاستثناءات للمتصل؛ لا يمكن انتظار async void وتفلت استثناءاته من المعالجة المعتادة."), l("A background save fails but the calling API reports success", "تفشل عملية حفظ خلفية لكن API المتصل يبلغ النجاح")),
    p("linq", l("Understand deferred execution and materialize at an intentional boundary", "افهم التنفيذ المؤجل وحوّل النتيجة إلى مجموعة عند حد مقصود"), l("Enumerate the same expensive LINQ query repeatedly", "عدّد استعلام LINQ المكلف نفسه مراراً"), l("Deferred queries rerun on each enumeration; deliberate materialization prevents duplicate work when a snapshot is required.", "تُعاد الاستعلامات المؤجلة عند كل تعداد؛ التحويل المقصود يمنع تكرار العمل عند الحاجة إلى لقطة."), l("A database query executes once for Count and again for iteration", "يُنفذ استعلام قاعدة البيانات مرة للعدد ومرة أخرى للتكرار")),
    p("disposal", l("Use using or await using for owned disposable resources", "استخدم using أو await using للموارد القابلة للتخلص التي تملكها"), l("Rely on the garbage collector to promptly close handles", "اعتمد على جامع القمامة لإغلاق المقابض فوراً"), l("GC manages memory, not deterministic release of scarce native resources; disposal closes handles at a known time.", "يدير GC الذاكرة لا التحرير الحتمي للموارد الأصلية النادرة؛ يحرر disposal المقابض في وقت معروف."), l("File handles accumulate until the process can no longer open files", "تتراكم مقابض الملفات حتى تعجز العملية عن فتح ملفات جديدة")),
    p("nullability", l("Enable nullable reference types and model absence explicitly", "فعّل nullable reference types ومثّل الغياب صراحة"), l("Silence every warning with the null-forgiving operator", "أسكت كل التحذيرات باستخدام معامل null-forgiving"), l("Nullable analysis exposes unsafe paths at compile time; ! only suppresses analysis and adds no runtime protection.", "يكشف تحليل nullable المسارات غير الآمنة وقت الترجمة؛ الرمز ! يسكت التحليل فقط ولا يضيف حماية وقت التشغيل."), l("A supposedly non-null dependency throws NullReferenceException in production", "تطلق اعتمادية يُفترض أنها غير فارغة NullReferenceException في الإنتاج")),
    p("collections", l("Use Dictionary for keyed lookup and choose concurrent collections for shared mutation", "استخدم Dictionary للبحث بالمفتاح ومجموعات متزامنة للتعديل المشترك"), l("Scan a List for every lookup and mutate it from multiple threads", "افحص List لكل بحث وعدّلها من عدة خيوط"), l("The data structure determines complexity and concurrency guarantees; List scans are linear and ordinary lists are not thread-safe.", "تحدد بنية البيانات التعقيد وضمانات التزامن؛ فحص List خطي والقوائم العادية غير آمنة للخيوط."), l("A hot lookup becomes slow and occasionally throws during parallel updates", "يصبح بحث متكرر بطيئاً ويرمي أخطاء أحياناً أثناء تحديثات متوازية")),
    p("exceptions", l("Catch exceptions only where you can add context, recover, or translate", "التقط الاستثناءات فقط حيث يمكنك إضافة سياق أو التعافي أو الترجمة"), l("Catch Exception everywhere and return a default value", "التقط Exception في كل مكان وأعد قيمة افتراضية"), l("Broad swallowing hides failures and corrupts control flow; a useful boundary preserves the cause while applying a deliberate policy.", "يخفي ابتلاع الاستثناءات الأعطال ويفسد تدفق التحكم؛ الحد المفيد يحفظ السبب ويطبق سياسة مقصودة."), l("Bad data silently becomes zero and later corrupts a financial total", "تتحول بيانات سيئة بصمت إلى صفر ثم تفسد إجمالياً مالياً")),
    p("equality", l("Implement value equality and GetHashCode consistently for value objects", "طبّق مساواة القيمة وGetHashCode باتساق لكائنات القيمة"), l("Override Equals but keep identity-based GetHashCode", "تجاوز Equals واترك GetHashCode القائم على الهوية"), l("Hash collections require equal objects to have equal hash codes; violating that contract makes lookups unreliable.", "تتطلب مجموعات hash أن يكون للكائنات المتساوية hash متساوٍ؛ خرق العقد يجعل البحث غير موثوق."), l("A HashSet contains two logically equal money values", "تحتوي HashSet قيمتي مال متساويتين منطقياً")),
  ],
  dart: [
    p("null-safety", l("Model nullable values explicitly and promote them through checks", "مثّل القيم القابلة للفراغ صراحة وارفع نوعها عبر الفحوص"), l("Apply the bang operator to every nullable expression", "طبّق معامل ! على كل تعبير قابل للفراغ"), l("Flow analysis proves safety after checks; ! merely moves a possible null error to runtime.", "يثبت تحليل التدفق الأمان بعد الفحص؛ أما ! فينقل خطأ null المحتمل إلى وقت التشغيل."), l("A field from optional JSON crashes only for a subset of users", "يتسبب حقل اختياري من JSON في تعطل لدى بعض المستخدمين فقط")),
    p("futures", l("Await futures and handle errors at an ownership boundary", "انتظر Futures وتعامل مع الأخطاء عند حد الملكية"), l("Start a Future without awaiting or intentionally detaching it", "ابدأ Future دون انتظارها أو فصلها بقصد"), l("Await preserves ordering and error propagation; an unawaited future can outlive its context and lose failures.", "يحفظ await الترتيب وانتشار الخطأ؛ قد تتجاوز Future غير المنتظرة سياقها وتفقد الأعطال."), l("A save operation races navigation and errors disappear", "تتسابق عملية حفظ مع التنقل وتختفي الأخطاء")),
    p("streams", l("Cancel stream subscriptions and use the correct single- or broadcast-stream semantics", "ألغِ اشتراكات Stream واستخدم دلالة single أو broadcast الصحيحة"), l("Create repeated listeners without retaining subscriptions", "أنشئ مستمعين متكررين دون الاحتفاظ بالاشتراكات"), l("Subscriptions own resources and callbacks; unmanaged listeners leak and duplicate work.", "تمتلك الاشتراكات الموارد والاستدعاءات؛ المستمعون غير المُدارين يسببون تسرباً وتكراراً للعمل."), l("Returning to a screen causes every event to be handled twice", "تؤدي العودة إلى شاشة إلى معالجة كل حدث مرتين")),
    p("isolates", l("Use isolates for CPU-bound work and async I/O for waiting", "استخدم isolates للعمل المعتمد على CPU وasync I/O للانتظار"), l("Move every network request to a new isolate", "انقل كل طلب شبكة إلى isolate جديد"), l("Isolates add message-copying overhead and help CPU contention; async I/O already avoids blocking while waiting on the network.", "تضيف isolates كلفة نسخ الرسائل وتفيد ضغط CPU؛ async I/O يتجنب الحجب أثناء انتظار الشبكة أصلاً."), l("Parsing a very large payload freezes UI while ordinary requests do not", "يجمد تحليل حمولة ضخمة الواجهة بينما الطلبات العادية لا تفعل")),
    p("immutability", l("Prefer final fields and copyWith-style state transitions", "فضّل حقول final وانتقالات حالة بأسلوب copyWith"), l("Share mutable model objects and edit them from unrelated layers", "شارك كائنات نموذج قابلة للتغيير وعدّلها من طبقات غير مرتبطة"), l("Immutable snapshots make changes explicit and comparable; shared mutation creates hidden coupling.", "تجعل اللقطات الثابتة التغييرات صريحة وقابلة للمقارنة؛ التعديل المشترك ينشئ ترابطاً خفياً."), l("A previous state snapshot changes after a later edit", "تتغير لقطة حالة سابقة بعد تعديل لاحق")),
    p("generics", l("Use constrained generics to express reusable type-safe contracts", "استخدم generics مقيّدة للتعبير عن عقود قابلة لإعادة الاستخدام وآمنة نوعياً"), l("Use dynamic to bypass every generic mismatch", "استخدم dynamic لتجاوز كل عدم تطابق generic"), l("Generics preserve compile-time guarantees; dynamic postpones contract errors until runtime.", "تحفظ generics ضمانات وقت الترجمة؛ يؤجل dynamic أخطاء العقد إلى وقت التشغيل."), l("A repository returns the wrong model type and fails on a cast", "يعيد مستودع نوع نموذج خاطئاً ويفشل عند التحويل")),
    p("json-modeling", l("Validate external JSON and map it into domain types", "تحقق من JSON الخارجي وحوّله إلى أنواع المجال"), l("Pass Map<String, dynamic> through the whole application", "مرّر Map<String, dynamic> عبر التطبيق كله"), l("Mapping localizes schema uncertainty and gives the domain typed invariants; raw maps spread runtime casts everywhere.", "يحصر التحويل عدم يقين المخطط ويمنح المجال ثوابت typed؛ الخرائط الخام تنشر التحويلات وقت التشغيل."), l("An API renames a field and failures appear far from the network layer", "يعيد API تسمية حقل فتظهر الأعطال بعيداً عن طبقة الشبكة")),
    p("equality", l("Define equality for immutable value objects when logical identity matters", "عرّف المساواة لكائنات القيمة الثابتة عندما تهم الهوية المنطقية"), l("Assume separate instances with equal fields compare equal automatically", "افترض أن النسخ المختلفة ذات الحقول المتساوية تتساوى تلقائياً"), l("Default object equality is identity-based; state comparison and sets need an explicit value-equality contract.", "مساواة الكائن الافتراضية مبنية على الهوية؛ مقارنة الحالة والمجموعات تحتاج عقد مساواة قيمة صريحاً."), l("A state manager emits updates for two objects containing identical data", "يصدر مدير الحالة تحديثات لكائنين يحتويان بيانات متطابقة")),
  ],
  docker: [
    p("image-layers", l("Order stable dependency layers before frequently changing source", "رتّب طبقات الاعتماديات الثابتة قبل المصدر كثير التغيير"), l("Copy the entire repository before installing dependencies", "انسخ المستودع كاملاً قبل تثبيت الاعتماديات"), l("Docker reuses unchanged layers; copying volatile source early invalidates the expensive dependency layer.", "يعيد Docker استخدام الطبقات غير المتغيرة؛ نسخ المصدر المتقلب مبكراً يبطل طبقة الاعتماديات المكلفة."), l("A one-line source change makes every image rebuild reinstall dependencies", "يجعل تغيير سطر واحد كل بناء صورة يعيد تثبيت الاعتماديات")),
    p("multi-stage", l("Build in one stage and copy only runtime artifacts into a minimal final stage", "ابنِ في مرحلة وانسخ ملفات التشغيل فقط إلى مرحلة نهائية صغيرة"), l("Ship compilers, caches, and build secrets in the production image", "اشحن المترجمات والذاكرة المؤقتة وأسرار البناء في صورة الإنتاج"), l("Multi-stage builds reduce size and attack surface; build tools and secrets do not belong in runtime layers.", "تقلل البنى متعددة المراحل الحجم وسطح الهجوم؛ أدوات البناء والأسرار لا تنتمي لطبقات التشغيل."), l("A production image is gigabytes large and contains registry credentials", "صورة الإنتاج بحجم جيجابايتات وتحتوي بيانات اعتماد السجل")),
    p("process-model", l("Run one foreground application process and handle termination signals", "شغّل عملية تطبيق أمامية واحدة وتعامل مع إشارات الإنهاء"), l("Start the app as a detached background daemon inside the container", "شغّل التطبيق كخدمة خلفية منفصلة داخل الحاوية"), l("The container lifecycle follows PID 1; detaching hides process failure and breaks signal-driven shutdown.", "تتبع دورة حياة الحاوية PID 1؛ الفصل يخفي فشل العملية ويكسر الإغلاق بالإشارات."), l("The container reports success and exits while the application was meant to keep running", "تبلغ الحاوية النجاح وتخرج بينما يفترض أن يبقى التطبيق عاملاً")),
    p("storage", l("Use volumes for persistent data and keep containers disposable", "استخدم volumes للبيانات الدائمة واجعل الحاويات قابلة للاستبدال"), l("Store database files only in the writable container layer", "خزّن ملفات قاعدة البيانات في طبقة الحاوية القابلة للكتابة فقط"), l("Container layers disappear with replacement; volumes have an independent lifecycle for durable state.", "تختفي طبقات الحاوية عند استبدالها؛ للـ volumes دورة حياة مستقلة للحالة الدائمة."), l("Recreating a database container deletes all customer data", "تؤدي إعادة إنشاء حاوية قاعدة البيانات إلى حذف كل بيانات العملاء")),
    p("networking", l("Bind the service to all container interfaces and publish only required ports", "اربط الخدمة بكل واجهات الحاوية وانشر المنافذ المطلوبة فقط"), l("Bind only to localhost inside the container and expose every port", "اربط localhost فقط داخل الحاوية واكشف كل المنافذ"), l("Container localhost is not the host interface; broad port publication expands exposure without fixing reachability.", "localhost داخل الحاوية ليس واجهة المضيف؛ نشر المنافذ على نطاق واسع يزيد التعرض ولا يصلح الوصول."), l("The health check works inside the container but the host cannot reach the app", "يعمل فحص الصحة داخل الحاوية لكن المضيف لا يصل إلى التطبيق")),
    p("security", l("Run as a non-root user and pin trusted base-image versions", "شغّل كمستخدم غير root وثبّت إصدارات صور أساس موثوقة"), l("Run as root and always pull an unpinned latest image", "شغّل كـ root واسحب دائماً صورة latest غير مثبتة"), l("Least privilege limits compromise impact and pinning makes builds reproducible; latest can change unexpectedly.", "تحد أقل الصلاحيات أثر الاختراق ويجعل التثبيت البناء قابلاً للتكرار؛ قد تتغير latest بلا توقع."), l("The same Dockerfile produces different binaries on two build days", "ينتج Dockerfile نفسه ملفات مختلفة في يومي بناء")),
    p("build-context", l("Use .dockerignore to exclude secrets, VCS data, and generated artifacts", "استخدم ‎.dockerignore لاستبعاد الأسرار وبيانات VCS والملفات المولدة"), l("Send the entire workstation directory as build context", "أرسل مجلد محطة العمل كاملاً كسياق بناء"), l("The daemon receives the build context before steps run; exclusions improve speed and prevent accidental secret inclusion.", "يستلم daemon سياق البناء قبل تنفيذ الخطوات؛ الاستبعاد يحسن السرعة ويمنع إدخال الأسرار بالخطأ."), l("Remote builds are slow and an old .env file appears in image history", "البناء البعيد بطيء ويظهر ملف ‎.env قديم في سجل الصورة")),
    p("health-shutdown", l("Use a meaningful health check and allow graceful shutdown time", "استخدم فحص صحة ذي معنى وامنح وقتاً للإغلاق السلس"), l("Use process existence as the only readiness signal and kill immediately", "استخدم وجود العملية كإشارة جاهزية وحيدة واقتلها فوراً"), l("A live process may be unable to serve; application-level checks and a stop grace period protect traffic and in-flight work.", "قد تكون العملية حية لكنها عاجزة عن الخدمة؛ فحوص التطبيق وفترة الإيقاف تحمي الحركة والعمل الجاري."), l("Deployments intermittently drop requests even though containers looked running", "تسقط عمليات النشر طلبات أحياناً رغم أن الحاويات بدت عاملة")),
  ],
  flutter: [
    p("widget-rebuilds", l("Keep build pure and isolate changing state to the smallest subtree", "اجعل build نقية واعزل الحالة المتغيرة في أصغر شجرة فرعية"), l("Start network requests inside build and rebuild the whole screen", "ابدأ طلبات الشبكة داخل build وأعد بناء الشاشة كاملة"), l("build may run frequently and must be side-effect free; broad rebuilds and repeated requests waste work.", "قد تعمل build كثيراً ويجب أن تخلو من الآثار الجانبية؛ إعادة البناء الواسعة والطلبات المتكررة تهدر العمل."), l("Scrolling triggers repeated API calls and visible frame drops", "يؤدي التمرير إلى طلبات API متكررة وهبوط واضح في الإطارات")),
    p("keys", l("Use stable keys when sibling identity must survive reorder", "استخدم مفاتيح ثابتة عندما يجب أن تبقى هوية الأشقاء بعد إعادة الترتيب"), l("Use list indexes as keys for reorderable stateful rows", "استخدم فهارس القائمة كمفاتيح لصفوف ذات حالة قابلة لإعادة الترتيب"), l("Keys match old elements to new widgets; index identity moves after reorder and can attach state to the wrong item.", "تطابق المفاتيح العناصر القديمة مع widgets الجديدة؛ تتحرك هوية الفهرس بعد الترتيب وقد تربط الحالة بعنصر خاطئ."), l("Reordering editable rows moves typed text to another record", "تنقل إعادة ترتيب الصفوف القابلة للتحرير النص إلى سجل آخر")),
    p("async-lifecycle", l("Check mounted before using context after an await and cancel owned work", "تحقق من mounted قبل استخدام context بعد await وألغِ العمل المملوك"), l("Call setState after every future completes regardless of disposal", "استدعِ setState بعد اكتمال كل Future بغض النظر عن التخلص"), l("The widget can be disposed while awaiting; mounted guards UI access and cancellation avoids needless work.", "قد يتم التخلص من widget أثناء الانتظار؛ يحمي mounted الوصول للواجهة ويمنع الإلغاء العمل غير الضروري."), l("Quick navigation causes setState called after dispose", "يسبب التنقل السريع خطأ setState بعد dispose")),
    p("state-management", l("Choose state scope by ownership and expose immutable state transitions", "اختر نطاق الحالة حسب الملكية واعرض انتقالات حالة ثابتة"), l("Put all local and global state in one mutable singleton", "ضع كل الحالة المحلية والعامة في singleton قابل للتغيير"), l("Ownership-based scope limits rebuilds and coupling; a global mutable bag obscures dependencies and lifecycle.", "يحد النطاق القائم على الملكية إعادة البناء والترابط؛ الحاوية العامة القابلة للتغيير تخفي الاعتماديات ودورة الحياة."), l("A dialog's temporary edits unexpectedly alter another screen", "تغيّر تعديلات مؤقتة في مربع حوار شاشة أخرى بشكل غير متوقع")),
    p("layout", l("Use constraints-aware widgets such as Expanded, Flexible, and LayoutBuilder", "استخدم widgets واعية بالقيود مثل Expanded وFlexible وLayoutBuilder"), l("Hard-code pixel dimensions for one reference phone", "ثبّت أبعاد البكسل لهاتف مرجعي واحد"), l("Flutter layout is constraint-driven across varied screens; fixed dimensions overflow under different size and text scale.", "تخطيط Flutter قائم على القيود عبر شاشات مختلفة؛ الأبعاد الثابتة تتجاوز الحدود مع الحجم ومقياس النص المختلفين."), l("A row fits the test device but overflows with accessibility text scaling", "يناسب صف جهاز الاختبار لكنه يتجاوز مع تكبير النص لإمكانية الوصول")),
    p("list-performance", l("Use lazy builders and const widgets where identity is stable", "استخدم builders كسولة وwidgets ثابتة const حيث تستقر الهوية"), l("Build thousands of children eagerly in a Column", "ابنِ آلاف الأبناء مسبقاً داخل Column"), l("Lazy lists create visible children on demand; eager construction inflates memory and frame work.", "تنشئ القوائم الكسولة العناصر المرئية عند الطلب؛ البناء المسبق يرفع الذاكرة وعمل الإطار."), l("Opening a long feed freezes before the first frame appears", "يؤدي فتح موجز طويل إلى تجمد قبل ظهور الإطار الأول")),
    p("testing", l("Use unit, widget, and integration tests at their appropriate boundaries", "استخدم اختبارات الوحدة وwidget والتكامل عند حدودها المناسبة"), l("Test every calculation only through a full device integration test", "اختبر كل عملية حسابية عبر اختبار تكامل كامل على جهاز"), l("Fast focused tests give precise failures while integration tests cover critical wiring; using only end-to-end tests is slow and brittle.", "تعطي الاختبارات المركزة السريعة أعطالاً دقيقة بينما يغطي التكامل الربط الحرج؛ الاعتماد على end-to-end فقط بطيء وهش."), l("A small validation change makes the test suite take forty minutes", "يجعل تغيير تحقق صغير مجموعة الاختبارات تستغرق أربعين دقيقة")),
    p("platform-boundaries", l("Wrap platform channels behind a typed, testable abstraction", "غلّف قنوات المنصة خلف تجريد typed قابل للاختبار"), l("Scatter raw method-channel strings throughout widgets", "وزّع نصوص method-channel الخام عبر widgets"), l("A boundary centralizes serialization, failures, and mocking; scattered strings create runtime-only coupling.", "يوحّد الحد التسلسل والأخطاء والمحاكاة؛ النصوص المبعثرة تنشئ ترابطاً لا يظهر إلا وقت التشغيل."), l("An Android method rename breaks unrelated screens at runtime", "تكسر إعادة تسمية طريقة Android شاشات غير مرتبطة وقت التشغيل")),
  ],
  git: [
    p("rebase-merge", l("Rebase unpublished local work for a clean history; merge shared history without rewriting it", "أعد تأسيس العمل المحلي غير المنشور لتاريخ نظيف؛ وادمج التاريخ المشترك دون إعادة كتابته"), l("Rebase a shared branch and force-push without coordination", "أعد تأسيس فرع مشترك وادفع بالقوة دون تنسيق"), l("Rebase changes commit identities; rewriting commits others use creates divergence and lost work.", "يغير rebase هويات commits؛ إعادة كتابة commits يعتمد عليها الآخرون تخلق تفرعاً وفقدان عمل."), l("Several developers have based work on the same release branch", "بنى عدة مطورين عملهم على فرع الإصدار نفسه")),
    p("reset-revert", l("Use revert to undo a published commit while preserving history", "استخدم revert للتراجع عن commit منشور مع حفظ التاريخ"), l("Hard-reset a shared branch to erase the bad commit", "استخدم hard reset لفرع مشترك لمحو commit السيئ"), l("Revert adds an auditable inverse commit; reset rewrites branch history and disrupts collaborators.", "يضيف revert commit عكسياً قابلاً للتدقيق؛ يعيد reset كتابة تاريخ الفرع ويعطل المتعاونين."), l("A faulty migration commit is already deployed and pulled by the team", "تم نشر commit ترحيل معيب وسحبه الفريق")),
    p("conflicts", l("Understand both sides, resolve semantically, then run relevant tests", "افهم الطرفين وحل التعارض دلالياً ثم شغّل الاختبارات ذات الصلة"), l("Always choose ours for every conflict marker", "اختر ours دائماً لكل علامة تعارض"), l("A syntactically clean resolution can still discard required behavior; tests validate the combined intent.", "قد يتجاهل حل نظيف نحوياً سلوكاً مطلوباً؛ تتحقق الاختبارات من القصد المدمج."), l("Two branches independently changed validation around the same function", "غيّر فرعان التحقق حول الدالة نفسها بشكل مستقل")),
    p("bisect", l("Use git bisect with a reliable test to locate the first bad commit", "استخدم git bisect مع اختبار موثوق لتحديد أول commit سيئ"), l("Read every commit manually from newest to oldest", "اقرأ كل commit يدوياً من الأحدث إلى الأقدم"), l("Bisect performs a logarithmic search over history; manual linear inspection is slower and subjective.", "ينفذ bisect بحثاً لوغاريتمياً في التاريخ؛ الفحص الخطي اليدوي أبطأ وذاتي."), l("A regression appeared somewhere among two hundred commits", "ظهر تراجع في مكان ما بين مئتي commit")),
    p("staging", l("Stage coherent hunks and review the staged diff before committing", "أضف hunks مترابطة وراجع diff المرحلي قبل commit"), l("Use git add . blindly and commit unrelated generated files", "استخدم git add . دون مراجعة والتزم بملفات مولدة غير مرتبطة"), l("The index lets a commit represent one reviewable idea; blind staging mixes concerns and may include secrets.", "يتيح index أن يمثل commit فكرة واحدة قابلة للمراجعة؛ الإضافة العمياء تخلط الاهتمامات وقد تتضمن أسراراً."), l("A working tree contains a bug fix, debug logs, and a local credential file", "تحتوي شجرة العمل إصلاحاً وسجلات تصحيح وملف اعتماد محلي")),
    p("cherry-pick", l("Cherry-pick only the required commit and verify dependencies and conflicts", "طبّق commit المطلوب فقط عبر cherry-pick وتحقق من اعتمادياته وتعارضاته"), l("Copy changed files manually without preserving context", "انسخ الملفات المتغيرة يدوياً دون حفظ السياق"), l("Cherry-pick records provenance and a real three-way merge; manual copying can omit coupled changes.", "يسجل cherry-pick المصدر ويجري دمجاً ثلاثي الأطراف؛ النسخ اليدوي قد يفوت تغييرات مترابطة."), l("A production hotfix must move from main to a supported release branch", "يجب نقل إصلاح إنتاج من main إلى فرع إصدار مدعوم")),
    p("reflog", l("Use reflog to locate recently moved local references and recover the commit", "استخدم reflog لتحديد المراجع المحلية المنقولة حديثاً واستعادة commit"), l("Assume a commit is permanently gone once no branch points to it", "افترض أن commit فُقد نهائياً بمجرد ألا يشير إليه فرع"), l("Reflog records local reference movement for a retention period; it often recovers commits after reset or rebase.", "يسجل reflog حركة المراجع المحلية لفترة احتفاظ؛ وغالباً يستعيد commits بعد reset أو rebase."), l("A developer reset the branch and can no longer see yesterday's commit", "أعاد مطور ضبط الفرع ولم يعد يرى commit الأمس")),
    p("commit-quality", l("Create small atomic commits with messages explaining intent", "أنشئ commits صغيرة ذرية برسائل تشرح القصد"), l("Combine formatting, refactoring, and a feature in one vague commit", "ادمج التنسيق وإعادة الهيكلة وميزة في commit غامض واحد"), l("Atomic commits are reviewable, revertible, and useful for diagnosis; mixed commits obscure risk and history.", "الـ commits الذرية قابلة للمراجعة والتراجع ومفيدة للتشخيص؛ commits المختلطة تخفي المخاطر والتاريخ."), l("Reviewers cannot tell which lines are behavior changes", "لا يستطيع المراجعون تحديد الأسطر التي تغير السلوك")),
  ],
  javascript: [
    p("event-loop", l("Split CPU-heavy work or move it to a worker while keeping callbacks short", "قسّم العمل الثقيل على CPU أو انقله إلى worker مع إبقاء callbacks قصيرة"), l("Wrap CPU-heavy synchronous work in Promise.resolve", "غلّف العمل المتزامن الثقيل في Promise.resolve"), l("Promises schedule callbacks but do not move CPU work off the main thread; long tasks still block rendering and timers.", "تجدول Promises الاستدعاءات لكنها لا تنقل عمل CPU من الخيط الرئيسي؛ المهام الطويلة تحجب الرسم والمؤقتات."), l("A computation inside then freezes clicks and animation", "تجمّد عملية حسابية داخل then النقرات والحركة")),
    p("closures", l("Use closures deliberately and avoid retaining large objects beyond their lifetime", "استخدم closures بقصد وتجنب الاحتفاظ بكائنات كبيرة بعد عمرها"), l("Assume closed-over variables are copied and immediately collectible", "افترض أن المتغيرات المغلقة تُنسخ ويمكن جمعها فوراً"), l("Closures retain lexical bindings, which is powerful but can keep object graphs alive.", "تحتفظ closures بالارتباطات المعجمية، وهذا مفيد لكنه قد يبقي رسوماً كبيرة من الكائنات حية."), l("Detached event handlers keep an old page and its data in memory", "تبقي معالجات أحداث منفصلة صفحة قديمة وبياناتها في الذاكرة")),
    p("equality-coercion", l("Prefer strict equality and explicit conversion at input boundaries", "فضّل المساواة الصارمة والتحويل الصريح عند حدود الإدخال"), l("Rely on loose equality to normalize mixed input types", "اعتمد على المساواة الرخوة لتوحيد أنواع الإدخال المختلطة"), l("Implicit coercion has surprising cases and hides schema errors; explicit conversion makes intent testable.", "للتحويل الضمني حالات مفاجئة ويخفي أخطاء المخطط؛ التحويل الصريح يجعل القصد قابلاً للاختبار."), l("Values from query strings compare inconsistently with numeric IDs", "تُقارن قيم query string بشكل غير متسق مع معرفات رقمية")),
    p("immutability", l("Create new arrays or objects when state change detection depends on identity", "أنشئ arrays أو objects جديدة عندما يعتمد اكتشاف الحالة على الهوية"), l("Mutate shared nested state in place", "عدّل الحالة المتداخلة المشتركة في مكانها"), l("Immutable updates make changes observable and prevent distant consumers from seeing surprise mutations.", "تجعل التحديثات الثابتة التغييرات قابلة للرصد وتمنع المستهلكين البعيدين من رؤية تعديلات مفاجئة."), l("A UI selector misses an update after push modifies an existing array", "يفوت محدد الواجهة تحديثاً بعد أن يعدّل push مصفوفة موجودة")),
    p("promises", l("Return or await each promise in a chain and handle rejection once at the boundary", "أعد أو انتظر كل Promise في السلسلة وتعامل مع الرفض مرة عند الحد"), l("Start an inner promise without returning it", "ابدأ Promise داخلية دون إعادتها"), l("Returning links completion and errors to the chain; a floating promise races later steps and loses rejection handling.", "تربط الإعادة الاكتمال والأخطاء بالسلسلة؛ تتسابق Promise العائمة مع الخطوات التالية ويضيع رفضها."), l("An API responds before a nested database write finishes", "يرد API قبل اكتمال كتابة قاعدة بيانات داخلية")),
    p("prototype", l("Use class or prototype methods for behavior shared across instances", "استخدم طرق class أو prototype للسلوك المشترك بين النسخ"), l("Create identical arrow-function methods on every instance without need", "أنشئ طرق arrow متطابقة على كل نسخة دون حاجة"), l("Prototype methods are shared, reducing allocation; per-instance functions are justified only when lexical binding or unique closure state is needed.", "تُشارك طرق prototype فتقلل التخصيص؛ تبرر دوال النسخة عند الحاجة إلى ربط معجمي أو حالة إغلاق فريدة."), l("Creating many model instances consumes unexpectedly high memory", "يستهلك إنشاء نسخ نموذج كثيرة ذاكرة عالية بشكل غير متوقع")),
    p("modules", l("Keep modules explicit, acyclic, and free of order-dependent initialization", "اجعل الوحدات صريحة وغير دورية وخالية من تهيئة تعتمد على الترتيب"), l("Use circular imports that read bindings during module initialization", "استخدم imports دورية تقرأ الارتباطات أثناء تهيئة الوحدة"), l("Cycles can expose partially initialized bindings and create fragile order dependence.", "قد تكشف الدورات ارتباطات مهيأة جزئياً وتخلق اعتماداً هشاً على الترتيب."), l("An imported constant is undefined only under one bundle order", "يكون ثابت مستورد undefined فقط تحت ترتيب bundling معين")),
    p("object-security", l("Validate keys and use safe maps for untrusted key-value input", "تحقق من المفاتيح واستخدم خرائط آمنة لمدخلات المفتاح والقيمة غير الموثوقة"), l("Merge arbitrary user keys into ordinary objects", "ادمج مفاتيح مستخدم عشوائية في كائنات عادية"), l("Special prototype keys can alter inherited behavior; allowlists or Map/null-prototype objects reduce prototype-pollution risk.", "قد تغير مفاتيح prototype الخاصة السلوك الموروث؛ تقلل القوائم المسموحة أو Map والكائنات بلا prototype خطر التلوث."), l("A configuration merge lets a request change defaults for other objects", "يسمح دمج إعدادات لطلب بتغيير القيم الافتراضية لكائنات أخرى")),
  ],
  kubernetes: [
    p("probes", l("Use startup, readiness, and liveness probes for their distinct purposes", "استخدم فحوص startup وreadiness وliveness لأغراضها المختلفة"), l("Use the same aggressive dependency check for every probe", "استخدم فحص اعتماديات صارماً نفسه لكل الفحوص"), l("Readiness controls traffic, liveness detects a stuck container, and startup protects slow initialization; conflating them causes outages.", "يتحكم readiness بالحركة ويكشف liveness الحاوية العالقة ويحمي startup التهيئة البطيئة؛ خلطها يسبب انقطاعات."), l("A slow startup causes pods to be killed before they become ready", "تؤدي بداية بطيئة إلى قتل pods قبل أن تصبح جاهزة")),
    p("resources", l("Set measured requests and limits, then observe throttling and eviction", "اضبط requests وlimits مقاسة ثم راقب الخنق والإخلاء"), l("Set no requests and extremely low memory limits by guesswork", "لا تضبط requests وضع حدود ذاكرة منخفضة جداً بالتخمين"), l("Requests drive scheduling and limits bound usage; poor values cause noisy-neighbor contention, throttling, or OOM kills.", "توجّه requests الجدولة وتحد limits الاستخدام؛ القيم السيئة تسبب تنافساً أو خنقاً أو قتل OOM."), l("Pods restart with OOMKilled during predictable traffic peaks", "تعاد pods مع OOMKilled أثناء ذروات حركة متوقعة")),
    p("deployments", l("Use rolling updates with readiness gates and a safe surge/unavailable budget", "استخدم تحديثات متدرجة مع بوابات readiness وميزانية آمنة للزيادة وعدم التوفر"), l("Delete all old pods before checking new ones", "احذف كل pods القديمة قبل فحص الجديدة"), l("A gated rolling update preserves capacity and stops routing to unready versions; deleting first creates downtime.", "يحفظ التحديث المتدرج المقيد السعة ويمنع التوجيه للإصدارات غير الجاهزة؛ الحذف أولاً يسبب توقفاً."), l("A release briefly returns 503 from every replica", "يعيد إصدار 503 لفترة قصيرة من كل نسخة")),
    p("configuration", l("Use ConfigMaps for non-secrets, Secrets for sensitive values, and external secret controls where required", "استخدم ConfigMaps لغير الأسرار وSecrets للقيم الحساسة وتحكماً خارجياً بالأسرار عند الحاجة"), l("Bake production credentials into the container image", "ضمّن بيانات اعتماد الإنتاج داخل صورة الحاوية"), l("Runtime configuration separates environments and secret rotation; image layers are widely copied and difficult to purge.", "تفصل إعدادات التشغيل البيئات وتسمح بتدوير الأسرار؛ تُنسخ طبقات الصور على نطاق واسع ويصعب محوها."), l("A leaked old image still contains an active database password", "لا تزال صورة قديمة مسربة تحتوي كلمة مرور قاعدة بيانات فعالة")),
    p("services-networking", l("Use Services for stable discovery and verify selectors and target ports", "استخدم Services للاكتشاف الثابت وتحقق من selectors وtarget ports"), l("Connect clients directly to ephemeral pod IPs", "اربط العملاء مباشرة بعناوين pod المؤقتة"), l("Pod IPs change across rescheduling; a Service provides stable naming and endpoint selection.", "تتغير عناوين pod عند إعادة الجدولة؛ توفر Service اسماً ثابتاً واختيار نقاط نهاية."), l("Clients fail after pods are replaced although the new pods are healthy", "يفشل العملاء بعد استبدال pods رغم سلامة الجديدة")),
    p("stateful-workloads", l("Use persistent volumes and workload semantics suited to stable identity", "استخدم persistent volumes ودلالات حمل تناسب الهوية الثابتة"), l("Run a quorum database as stateless replicas sharing one writable filesystem", "شغّل قاعدة quorum كنسخ stateless تشترك في نظام ملفات قابل للكتابة"), l("Stateful systems require durable storage, identity, and application-aware replication; ordinary stateless scaling does not provide them.", "تحتاج الأنظمة ذات الحالة تخزيناً دائماً وهوية وتكراراً واعياً بالتطبيق؛ التوسع stateless العادي لا يوفرها."), l("Database replicas corrupt data after rescheduling and concurrent writes", "تفسد نسخ قاعدة البيانات بعد إعادة الجدولة والكتابات المتزامنة")),
    p("autoscaling", l("Scale on a metric tied to saturation and set realistic requests and stabilization", "وسّع حسب مقياس مرتبط بالتشبع واضبط requests واقعية وفترة استقرار"), l("Scale solely on raw CPU with missing requests and no stabilization", "وسّع فقط حسب CPU الخام دون requests أو استقرار"), l("HPA percentages depend on requests and delayed effects can oscillate; meaningful metrics and stabilization reduce thrashing.", "تعتمد نسب HPA على requests وقد تتذبذب الآثار المتأخرة؛ المقاييس المفيدة والاستقرار يقللان التخبط."), l("Replica count swings rapidly while latency remains high", "يتأرجح عدد النسخ بسرعة بينما يبقى زمن الاستجابة مرتفعاً")),
    p("security-context", l("Apply least-privilege service accounts, non-root execution, and restricted capabilities", "طبّق حسابات خدمة بأقل صلاحية وتشغيلاً غير root وقدرات مقيدة"), l("Use the default service account with cluster-admin for every pod", "استخدم حساب الخدمة الافتراضي بصلاحية cluster-admin لكل pod"), l("Workload identity should expose only required API permissions; broad credentials turn one compromise into cluster control.", "يجب أن تكشف هوية الحمل أذونات API المطلوبة فقط؛ تحول الاعتمادات الواسعة اختراقاً واحداً إلى تحكم بالعنقود."), l("A compromised web pod can list and delete secrets across namespaces", "تستطيع web pod مخترقة عرض وحذف الأسرار عبر namespaces")),
  ],
  mongodb: [
    p("schema-design", l("Embed data read and updated together; reference independently growing entities", "ضمّن البيانات التي تُقرأ وتُحدّث معاً واربط الكيانات التي تنمو مستقلة"), l("Normalize every relation exactly like a relational database", "طبّع كل علاقة تماماً كقاعدة علائقية"), l("MongoDB schema design follows access patterns; over-normalization adds lookups while unbounded embedding creates oversized documents.", "يتبع تصميم MongoDB أنماط الوصول؛ التطبيع الزائد يضيف lookups والتضمين غير المحدود ينشئ وثائق ضخمة."), l("Every product-page read requires several joins for small stable attributes", "تتطلب كل قراءة صفحة منتج عدة joins لسمات صغيرة ثابتة")),
    p("indexes", l("Create compound indexes matching equality, sort, and range patterns", "أنشئ فهارس مركبة تطابق أنماط المساواة والترتيب والنطاق"), l("Add separate single-field indexes and assume MongoDB always combines them optimally", "أضف فهارس أحادية منفصلة وافترض أن MongoDB يدمجها دائماً بأفضل شكل"), l("A purpose-built compound index can satisfy filtering and sorting in order; index intersection has limits and may still sort in memory.", "يمكن لفهرس مركب مناسب تلبية التصفية والترتيب؛ لدمج الفهارس حدود وقد يرتب في الذاكرة."), l("A tenant-filtered recent-orders query scans many keys and performs a blocking sort", "يفحص استعلام أحدث الطلبات لمستأجر مفاتيح كثيرة وينفذ ترتيباً حاجباً")),
    p("aggregation", l("Place selective matches early and project only fields needed by later stages", "ضع match الانتقائي مبكراً وأسقط الحقول التي تحتاجها المراحل اللاحقة فقط"), l("Unwind huge arrays before filtering unrelated documents", "نفّذ unwind لمصفوفات ضخمة قبل تصفية الوثائق غير المرتبطة"), l("Reducing documents and fields early bounds downstream CPU and memory; early unwind can multiply the working set.", "تقليل الوثائق والحقول مبكراً يحد CPU والذاكرة لاحقاً؛ قد يضاعف unwind المبكر مجموعة العمل."), l("An analytics pipeline spills to disk after a data-growth event", "يبدأ خط تحليلات بالكتابة إلى القرص بعد نمو البيانات")),
    p("transactions", l("Use transactions for true multi-document invariants and keep them short", "استخدم المعاملات لثوابت متعددة الوثائق فعلاً واجعلها قصيرة"), l("Wrap every read in a long transaction for relational-style comfort", "غلّف كل قراءة في معاملة طويلة لمجرد محاكاة النمط العلائقي"), l("Single-document writes are already atomic; broad transactions add contention, retries, and operational cost.", "كتابات الوثيقة الواحدة ذرية أصلاً؛ المعاملات الواسعة تضيف تنافساً وإعادات محاولة وكلفة تشغيلية."), l("Creating an order must atomically reserve inventory in separate documents", "يجب أن يحجز إنشاء طلب المخزون ذرياً في وثائق منفصلة")),
    p("read-write-concern", l("Choose read and write concern from durability and consistency requirements", "اختر read وwrite concern وفق متطلبات الديمومة والاتساق"), l("Use the weakest acknowledgement for financial writes to maximize speed", "استخدم أضعف إقرار للكتابات المالية لتعظيم السرعة"), l("Acknowledgement and majority rules define what failures can lose or hide data; critical writes need an explicit durability policy.", "تحدد قواعد الإقرار والأغلبية الأعطال التي قد تفقد أو تخفي البيانات؛ تحتاج الكتابات الحرجة سياسة ديمومة صريحة."), l("A successful payment record disappears after a primary failover", "يختفي سجل دفع ناجح بعد تبديل primary")),
    p("pagination", l("Use range pagination on a stable indexed sort key", "استخدم pagination بالنطاق على مفتاح ترتيب ثابت ومفهرس"), l("Use very large skip values for deep pages", "استخدم قيماً كبيرة جداً لـ skip للصفحات العميقة"), l("skip still walks preceding results and becomes slower with depth; range queries seek from the last key.", "يمر skip على النتائج السابقة ويبطؤ مع العمق؛ تبدأ استعلامات النطاق من المفتاح الأخير."), l("Page 5000 of an activity feed takes seconds while page 1 is fast", "تستغرق الصفحة 5000 من موجز النشاط ثوانٍ بينما الأولى سريعة")),
    p("document-growth", l("Bound arrays or move unbounded events to their own collection", "حد المصفوفات أو انقل الأحداث غير المحدودة إلى مجموعة مستقلة"), l("Append every lifetime event to one user document forever", "ألحق كل حدث طوال العمر بوثيقة مستخدم واحدة إلى الأبد"), l("Documents have a size limit and growing arrays increase rewrite and contention costs.", "للوثائق حد حجم وتزيد المصفوفات النامية كلفة إعادة الكتابة والتنافس."), l("A long-lived account can no longer accept new audit events", "لم يعد حساب قديم يقبل أحداث تدقيق جديدة")),
    p("query-plans", l("Use explain execution stats and production-shaped data before changing indexes", "استخدم explain execution stats وبيانات تشبه الإنتاج قبل تغيير الفهارس"), l("Guess from query text and add many overlapping indexes", "خمّن من نص الاستعلام وأضف فهارس متداخلة كثيرة"), l("Execution stats reveal scanned keys, documents, and chosen plans; excess indexes slow writes and consume memory.", "تكشف إحصاءات التنفيذ المفاتيح والوثائق المفحوصة والخطط؛ الفهارس الزائدة تبطئ الكتابات وتستهلك الذاكرة."), l("A query is slow only for one data distribution in production", "يكون استعلام بطيئاً فقط لتوزيع بيانات معين في الإنتاج")),
  ],
  nextjs: [
    p("server-client-boundary", l("Keep data fetching and secrets in Server Components; add Client Components only for interactivity", "أبقِ جلب البيانات والأسرار في Server Components وأضف Client Components للتفاعل فقط"), l("Mark the entire route use client to access one button state", "ضع use client على المسار كله للوصول إلى حالة زر واحدة"), l("A narrow client boundary reduces shipped JavaScript and prevents server-only values from crossing serialization boundaries.", "يقلل حد العميل الضيق JavaScript المرسل ويمنع قيم الخادم فقط من عبور حدود التسلسل."), l("A mostly static product page ships a large bundle because one accordion is interactive", "ترسل صفحة منتج ثابتة غالباً حزمة كبيرة لأن accordion واحد تفاعلي")),
    p("caching", l("Declare cache and revalidation behavior from the freshness contract", "صرّح بسلوك التخزين وإعادة التحقق وفق عقد الحداثة"), l("Assume every fetch is always fresh in every rendering context", "افترض أن كل fetch حديث دائماً في كل سياق رسم"), l("Next.js caching is context-sensitive; explicit policy avoids stale personalized data or needless origin load.", "تخزين Next.js حساس للسياق؛ تمنع السياسة الصريحة بيانات شخصية قديمة أو حملاً غير ضروري على المصدر."), l("A CMS update appears immediately on one route but remains stale on another", "يظهر تحديث CMS فوراً في مسار ويبقى قديماً في آخر")),
    p("route-handlers", l("Authenticate and authorize inside each server-side mutation boundary", "نفّذ المصادقة والتفويض داخل كل حد تعديل على الخادم"), l("Trust that hiding the client button prevents unauthorized requests", "ثق بأن إخفاء زر العميل يمنع الطلبات غير المصرح بها"), l("Clients can call route handlers directly; server-side checks are the enforceable security boundary.", "يستطيع العملاء استدعاء route handlers مباشرة؛ فحوص الخادم هي حد الأمان القابل للفرض."), l("A non-admin calls an unlinked delete endpoint with curl", "يستدعي غير مسؤول نقطة حذف غير مرتبطة باستخدام curl")),
    p("dynamic-rendering", l("Use request-specific APIs only where dynamic rendering is actually required", "استخدم APIs الخاصة بالطلب فقط حيث يلزم الرسم الديناميكي فعلاً"), l("Read cookies in the root layout for an unrelated leaf feature", "اقرأ cookies في root layout لميزة فرعية غير مرتبطة"), l("Dynamic request data high in the tree can prevent static optimization across a broad route subtree.", "قد تمنع بيانات الطلب الديناميكية عالياً في الشجرة التحسين الثابت عبر شجرة مسارات واسعة."), l("A marketing section unexpectedly loses static rendering after adding personalization", "يفقد قسم تسويقي الرسم الثابت بعد إضافة تخصيص")),
    p("images-fonts", l("Use Next image and font tooling with correct dimensions and loading priority", "استخدم أدوات الصور والخطوط في Next بأبعاد وأولوية تحميل صحيحة"), l("Render full-resolution images without dimensions and preload all assets", "اعرض صوراً كاملة الدقة دون أبعاد وحمّل كل الأصول مسبقاً"), l("Dimensions prevent layout shift and responsive optimization reduces bytes; indiscriminate preload competes with critical resources.", "تمنع الأبعاد تغير التخطيط ويقلل التحسين المتجاوب البايتات؛ التحميل المسبق العشوائي ينافس الموارد الحرجة."), l("The hero shifts during load and mobile downloads a desktop-sized image", "يتحرك hero أثناء التحميل وينزل الهاتف صورة بحجم سطح المكتب")),
    p("metadata", l("Generate route-specific metadata on the server from validated data", "ولّد metadata خاصة بالمسار على الخادم من بيانات موثقة"), l("Update document title only in a client effect", "حدّث عنوان document فقط داخل effect في العميل"), l("Server metadata is available to crawlers and initial HTML; client-only updates can arrive too late for previews and indexing.", "تتوفر metadata الخادم للزواحف وHTML الأولي؛ قد تصل تحديثات العميل متأخرة للمعاينات والفهرسة."), l("Shared product links show generic titles in social previews", "تعرض روابط المنتجات المشتركة عناوين عامة في المعاينات الاجتماعية")),
    p("server-actions", l("Treat Server Actions as public mutation endpoints with validation and authorization", "عامل Server Actions كنقاط تعديل عامة مع تحقق وتفويض"), l("Trust typed client arguments and skip server validation", "ثق بمعاملات العميل typed وتجاوز تحقق الخادم"), l("Network inputs remain untrusted regardless of TypeScript; actions must validate shape, identity, and permissions.", "تبقى مدخلات الشبكة غير موثوقة مهما كان TypeScript؛ يجب أن تتحقق actions من الشكل والهوية والصلاحيات."), l("A crafted action request submits a negative order quantity", "يرسل طلب action مصمم كمية طلب سالبة")),
    p("streaming-errors", l("Use loading and error boundaries at useful route segments", "استخدم حدود loading وerror عند مقاطع مسار مفيدة"), l("Let one slow or failing widget block the entire route", "دع widget بطيئة أو فاشلة تحجب المسار كله"), l("Segment boundaries enable streaming and isolate recoverable failures; a monolithic boundary delays or replaces unrelated content.", "تتيح حدود المقاطع streaming وتعزل الأعطال القابلة للتعافي؛ الحد الأحادي يؤخر أو يستبدل محتوى غير مرتبط."), l("A slow recommendation service prevents product details from appearing", "تمنع خدمة توصيات بطيئة ظهور تفاصيل المنتج")),
  ],
  nodejs: [
    p("event-loop", l("Keep the event loop free of long CPU tasks and use workers or queues when needed", "أبقِ event loop خالية من مهام CPU الطويلة واستخدم workers أو queues عند الحاجة"), l("Run synchronous compression in every request handler", "شغّل ضغطاً متزامناً داخل كل معالج طلب"), l("One synchronous CPU task blocks all requests in that process; workers isolate CPU-bound work.", "تحجب مهمة CPU متزامنة واحدة كل الطلبات في العملية؛ تعزل workers العمل الثقيل."), l("Unrelated health requests time out while generating a report", "تنتهي مهلة طلبات الصحة غير المرتبطة أثناء إنشاء تقرير")),
    p("streams", l("Pipe streams with backpressure-aware APIs", "مرّر streams باستخدام APIs واعية بالضغط العكسي"), l("Read an entire large upload into memory before writing", "اقرأ رفعاً ضخماً كاملاً في الذاكرة قبل الكتابة"), l("Backpressure bounds memory by matching producer and consumer rates; buffering everything scales with payload size.", "يحد الضغط العكسي الذاكرة بمطابقة سرعتي المنتج والمستهلك؛ تخزين الكل يتناسب مع حجم الحمولة."), l("Several concurrent uploads exhaust process memory", "تستنزف عدة عمليات رفع متزامنة ذاكرة العملية")),
    p("errors", l("Propagate operational errors to a centralized boundary and crash on unrecoverable programmer state", "مرّر الأخطاء التشغيلية إلى حد مركزي وأنهِ العملية عند حالة برمجية غير قابلة للتعافي"), l("Catch every error and keep the process alive in unknown state", "التقط كل خطأ وأبقِ العملية حية في حالة مجهولة"), l("Central policy gives consistent responses and observability; continuing after corrupted invariants can produce worse failures.", "تعطي السياسة المركزية ردوداً ورصداً متسقين؛ الاستمرار بعد فساد الثوابت قد ينتج أعطالاً أسوأ."), l("An uncaught invariant violation leaves requests succeeding with corrupt data", "يترك خرق ثابت غير ملتقط طلبات تنجح ببيانات فاسدة")),
    p("async-concurrency", l("Bound concurrency and use Promise.all only for independent work", "قيّد التزامن واستخدم Promise.all للعمل المستقل فقط"), l("Launch an unbounded promise for every row in a huge table", "أطلق Promise غير مقيدة لكل صف في جدول ضخم"), l("Unbounded fan-out exhausts sockets, pools, and rate limits; a limit preserves throughput under load.", "يستنزف التوسع غير المحدود المقابس والمسابح وحدود المعدل؛ يحفظ القيد الإنتاجية تحت الحمل."), l("A batch job opens ten thousand simultaneous database queries", "تفتح مهمة دفعية عشرة آلاف استعلام قاعدة متزامن")),
    p("security-input", l("Validate input, parameterize queries, and encode output for its context", "تحقق من المدخلات واستخدم معاملات للاستعلامات ورمّز المخرجات حسب السياق"), l("Build SQL and HTML by concatenating request strings", "ابنِ SQL وHTML بدمج نصوص الطلب"), l("Validation and contextual handling prevent injection; escaping for one context does not make data safe in another.", "يمنع التحقق والمعالجة السياقية الحقن؛ الترميز لسياق لا يجعل البيانات آمنة في آخر."), l("A search parameter changes the SQL query structure", "تغيّر معلمة بحث بنية استعلام SQL")),
    p("process-lifecycle", l("Handle termination signals, stop accepting work, and drain resources", "تعامل مع إشارات الإنهاء وأوقف قبول العمل وصفِّ الموارد"), l("Exit immediately on SIGTERM", "اخرج فوراً عند SIGTERM"), l("Graceful shutdown lets load balancers stop traffic and in-flight work finish; immediate exit drops requests.", "يسمح الإغلاق السلس لموازن الحمل بإيقاف الحركة وإنهاء العمل الجاري؛ الخروج الفوري يسقط الطلبات."), l("Every deployment produces a burst of failed requests", "ينتج كل نشر موجة من الطلبات الفاشلة")),
    p("modules-config", l("Validate configuration once at startup and keep module boundaries explicit", "تحقق من الإعدادات مرة عند البدء واجعل حدود الوحدات صريحة"), l("Read optional environment strings throughout business logic", "اقرأ نصوص البيئة الاختيارية عبر منطق الأعمال"), l("Startup validation fails fast and gives typed invariants; scattered reads fail late and inconsistently.", "يفشل تحقق البدء مبكراً ويعطي ثوابت typed؛ القراءات المبعثرة تفشل متأخراً وبشكل غير متسق."), l("A missing timeout variable causes NaN behavior only on one endpoint", "يسبب متغير مهلة مفقود سلوك NaN في نقطة واحدة فقط")),
    p("observability", l("Use structured logs, request correlation, metrics, and traces", "استخدم سجلات منظمة وترابط الطلبات والمقاييس والتتبعات"), l("Log free-form messages without request or error context", "سجّل رسائل حرة دون سياق طلب أو خطأ"), l("Structured correlated telemetry lets teams follow one request and aggregate failures; isolated text is hard to query.", "تتيح القياسات المنظمة المترابطة تتبع طلب وتجميع الأعطال؛ يصعب الاستعلام عن النص المعزول."), l("A timeout crosses three services but logs cannot connect the calls", "تعبر مهلة ثلاث خدمات لكن السجلات لا تربط الاستدعاءات")),
  ],
  postgresql: [
    p("indexes", l("Design indexes from real predicates, join keys, and sort order, then verify with EXPLAIN ANALYZE", "صمم الفهارس من الشروط ومفاتيح الربط والترتيب الفعلية ثم تحقق بـ EXPLAIN ANALYZE"), l("Create an index on every column independently", "أنشئ فهرساً على كل عمود منفرداً"), l("Useful indexes match access paths; excessive indexes consume space and slow every write.", "تطابق الفهارس المفيدة مسارات الوصول؛ الفهارس الزائدة تستهلك مساحة وتبطئ كل كتابة."), l("A filtered ordered query scans millions of rows despite several indexes", "يفحص استعلام مصفى ومرتب ملايين الصفوف رغم وجود عدة فهارس")),
    p("transactions", l("Keep transactions short and choose isolation from the invariant being protected", "اجعل المعاملات قصيرة واختر العزل حسب الثابت المحمي"), l("Hold a transaction open during user interaction", "أبقِ معاملة مفتوحة أثناء تفاعل المستخدم"), l("Long transactions retain locks and old row versions; isolation should prevent a named anomaly, not be chosen blindly.", "تحتفظ المعاملات الطويلة بالأقفال وإصدارات الصفوف القديمة؛ يجب أن يمنع العزل شذوذاً محدداً لا أن يُختار عشوائياً."), l("Idle transactions cause lock queues and table bloat", "تسبب المعاملات الخاملة طوابير أقفال وتضخم الجداول")),
    p("mvcc-vacuum", l("Monitor dead tuples and tune autovacuum for high-churn tables", "راقب الصفوف الميتة واضبط autovacuum للجداول كثيرة التغيير"), l("Disable autovacuum to avoid background I/O", "عطّل autovacuum لتجنب I/O الخلفي"), l("MVCC leaves obsolete row versions that vacuum must reclaim; disabling it causes bloat and transaction-ID risk.", "يترك MVCC إصدارات صفوف قديمة يجب أن يستعيدها vacuum؛ تعطيله يسبب تضخماً وخطر معرفات المعاملات."), l("An update-heavy table grows rapidly although row count is stable", "ينمو جدول كثير التحديث بسرعة رغم ثبات عدد الصفوف")),
    p("query-plans", l("Compare estimates with actual rows and refresh statistics or rewrite where estimates fail", "قارن التقديرات بالصفوف الفعلية وحدّث الإحصاءات أو أعد الصياغة عند فشلها"), l("Force one join strategy globally based on a single slow query", "افرض استراتيجية join واحدة عالمياً بناءً على استعلام بطيء واحد"), l("Planner choices depend on cardinality and cost; bad estimates need evidence-based correction, not a global workaround.", "تعتمد خيارات المخطط على الحجم والكلفة؛ تحتاج التقديرات السيئة تصحيحاً بالدليل لا حلاً عالمياً."), l("A nested-loop plan estimates one row but processes a million", "تقدّر خطة nested-loop صفاً واحداً لكنها تعالج مليوناً")),
    p("constraints", l("Enforce core invariants with database constraints as well as application validation", "افرض الثوابت الأساسية بقيود قاعدة البيانات إلى جانب تحقق التطبيق"), l("Rely only on UI validation for uniqueness and foreign keys", "اعتمد فقط على تحقق الواجهة للتفرد والمفاتيح الخارجية"), l("Concurrent and alternate writers bypass UI checks; constraints make invalid states impossible at the shared boundary.", "تتجاوز الكتابات المتزامنة والبديلة فحوص الواجهة؛ تجعل القيود الحالات غير الصالحة مستحيلة عند الحد المشترك."), l("Two concurrent signups create duplicate usernames", "ينشئ تسجيلان متزامنان اسم مستخدم مكرراً")),
    p("pagination", l("Use keyset pagination with a unique stable ordering for deep result sets", "استخدم keyset pagination بترتيب ثابت وفريد للنتائج العميقة"), l("Use OFFSET for arbitrarily deep, frequently changing feeds", "استخدم OFFSET لموجز عميق ومتغير باستمرار"), l("OFFSET scans skipped rows and shifts under inserts; keyset pagination seeks and preserves a stable boundary.", "يفحص OFFSET الصفوف المتجاوزة ويتحرك مع الإدراج؛ يبحث keyset ويحفظ حداً ثابتاً."), l("Users see duplicates and slow responses on deep activity pages", "يرى المستخدمون تكرارات واستجابات بطيئة في صفحات نشاط عميقة")),
    p("locking", l("Lock rows in a consistent order and retry transactions on deadlock", "اقفل الصفوف بترتيب متسق وأعد المعاملة عند deadlock"), l("Update shared rows in arbitrary order and retry individual statements", "حدّث الصفوف المشتركة بترتيب عشوائي وأعد العبارات منفردة"), l("Consistent lock order reduces cycles; a deadlock aborts the transaction, so the whole unit must retry.", "يقلل ترتيب القفل المتسق الدورات؛ يلغي deadlock المعاملة لذا يجب إعادة الوحدة كاملة."), l("Two transfers lock account rows in opposite order", "تقفل عمليتا تحويل صفوف الحسابات بترتيب متعاكس")),
    p("connections", l("Use a bounded connection pool sized with database capacity", "استخدم مسبح اتصالات محدوداً بحجم يناسب سعة قاعدة البيانات"), l("Open a new unbounded connection for every request", "افتح اتصالاً جديداً غير محدود لكل طلب"), l("Connections consume server memory and scheduling; bounded pooling absorbs bursts and protects the database.", "تستهلك الاتصالات ذاكرة الخادم وجدولته؛ يمتص المسبح المحدود الذروات ويحمي القاعدة."), l("Traffic bursts exhaust max_connections and block every service", "تستنزف ذروة الحركة max_connections وتحجب كل الخدمات")),
  ],
  python: [
    p("mutability", l("Use None as a default and create mutable objects inside the function", "استخدم None كقيمة افتراضية وأنشئ الكائن القابل للتغيير داخل الدالة"), l("Use a list or dict literal as a default argument", "استخدم list أو dict كمعامل افتراضي"), l("Default arguments are evaluated once at definition time, so mutable defaults leak state across calls.", "تُقيّم المعاملات الافتراضية مرة عند تعريف الدالة، لذا تسرّب القيم القابلة للتغيير الحالة بين الاستدعاءات."), l("A function's result contains items supplied by a previous caller", "تحتوي نتيجة دالة عناصر قدمها متصل سابق")),
    p("generators", l("Use generators for streaming one-pass data and materialize only when needed", "استخدم generators لبيانات متدفقة بمرور واحد وحوّلها لقائمة عند الحاجة"), l("Build a full list for a file that may be larger than memory", "ابنِ قائمة كاملة لملف قد يفوق الذاكرة"), l("Generators produce values lazily and bound memory; eager lists scale with the entire input.", "تنتج generators القيم بكسل وتحد الذاكرة؛ القوائم المسبقة تتناسب مع الإدخال كله."), l("Processing a large log file terminates with an out-of-memory error", "تنتهي معالجة ملف سجل ضخم بخطأ نفاد الذاكرة")),
    p("asyncio", l("Use asyncio for high-concurrency I/O and move blocking work off the event loop", "استخدم asyncio لـ I/O عالي التزامن وانقل العمل الحاجب خارج event loop"), l("Call blocking requests or CPU-heavy code directly in a coroutine", "استدعِ requests حاجبة أو كود CPU ثقيل مباشرة داخل coroutine"), l("A blocking call prevents every other coroutine from progressing; async libraries or executors preserve responsiveness.", "يمنع الاستدعاء الحاجب كل coroutine أخرى من التقدم؛ تحافظ مكتبات async أو executors على الاستجابة."), l("One slow HTTP call freezes all websocket heartbeats", "يجمد طلب HTTP بطيء كل نبضات websocket")),
    p("gil-parallelism", l("Use processes for CPU-bound Python and threads or async for suitable I/O", "استخدم processes لعمل Python الثقيل على CPU وthreads أو async لـ I/O المناسب"), l("Expect Python threads to linearly speed up pure CPU work", "توقع أن تسرّع threads عمل CPU الصرف خطياً"), l("In standard CPython the GIL limits parallel Python bytecode; processes provide separate interpreters.", "في CPython القياسي يحد GIL التنفيذ المتوازي لـ bytecode؛ توفر processes مفسرات منفصلة."), l("Adding threads does not speed up a pure-Python image transform", "لا تؤدي إضافة threads إلى تسريع تحويل صور مكتوب ببايثون الصرف")),
    p("exceptions", l("Catch specific exceptions and preserve context when translating them", "التقط استثناءات محددة واحفظ السياق عند ترجمتها"), l("Use a bare except and silently continue", "استخدم except عامة وتابع بصمت"), l("Specific handling distinguishes expected failures; broad swallowing hides bugs and even control-flow exceptions.", "تميز المعالجة المحددة الأعطال المتوقعة؛ الالتقاط العام يخفي العيوب وحتى استثناءات تدفق التحكم."), l("A data import reports success after silently skipping programming errors", "يبلغ استيراد بيانات النجاح بعد تجاوز أخطاء برمجية بصمت")),
    p("data-models", l("Use dataclasses or validated models for explicit structured data", "استخدم dataclasses أو نماذج متحققاً منها لبيانات منظمة صريحة"), l("Pass nested untyped dictionaries through every layer", "مرّر قواميس متداخلة بلا أنواع عبر كل طبقة"), l("Explicit models document fields and centralize validation; raw dictionaries move key errors far from input.", "توثق النماذج الصريحة الحقول وتوحد التحقق؛ تنقل القواميس الخام أخطاء المفاتيح بعيداً عن الإدخال."), l("A misspelled key fails deep inside billing logic", "يفشل مفتاح مكتوب خطأ داخل منطق الفوترة العميق")),
    p("context-managers", l("Use context managers for deterministic acquisition and cleanup", "استخدم context managers للاكتساب والتنظيف الحتميين"), l("Open resources and close them only on the success path", "افتح الموارد وأغلقها فقط في مسار النجاح"), l("A context manager runs cleanup even when exceptions occur; success-only cleanup leaks locks and handles.", "ينفذ context manager التنظيف حتى عند الاستثناءات؛ تنظيف مسار النجاح فقط يسرّب الأقفال والمقابض."), l("An exception leaves a file locked until the worker restarts", "يترك استثناء ملفاً مقفلاً حتى إعادة تشغيل العامل")),
    p("testing-mocking", l("Test observable behavior and mock slow or nondeterministic boundaries", "اختبر السلوك المرئي وحاكِ الحدود البطيئة أو غير الحتمية"), l("Mock every internal function and assert its call order", "حاكِ كل دالة داخلية وتحقق من ترتيب استدعائها"), l("Boundary mocks keep tests deterministic without coupling them to implementation; internal-call tests break on safe refactors.", "تحافظ محاكاة الحدود على حتمية الاختبار دون ربطه بالتنفيذ؛ تنكسر اختبارات الاستدعاءات الداخلية عند إعادة هيكلة سليمة."), l("Renaming private helpers breaks tests while output remains correct", "تكسر إعادة تسمية مساعدات خاصة الاختبارات رغم صحة المخرجات")),
  ],
  react: [
    p("state-identity", l("Treat state as immutable and derive rather than duplicate values", "عامل الحالة كثابتة واشتق القيم بدلاً من تكرارها"), l("Mutate state in place and store every derived total separately", "عدّل الحالة في مكانها وخزّن كل إجمالي مشتق منفصلاً"), l("React schedules by state identity and duplicated state can drift; immutable source state keeps rendering predictable.", "يجدول React حسب هوية الحالة وقد تنحرف الحالة المكررة؛ يبقي المصدر الثابت الرسم متوقعاً."), l("A cart total stays stale after an item object is mutated", "يبقى إجمالي السلة قديماً بعد تعديل كائن عنصر")),
    p("effects", l("Use effects only to synchronize with external systems and declare real dependencies", "استخدم effects فقط للمزامنة مع أنظمة خارجية وصرّح بالاعتماديات الحقيقية"), l("Use an effect to derive render data and suppress dependency warnings", "استخدم effect لاشتقاق بيانات الرسم وأسكت تحذيرات الاعتماديات"), l("Render-time derivation avoids extra commits; missing dependencies create stale closures and inconsistent synchronization.", "يتجنب الاشتقاق وقت الرسم commits إضافية؛ الاعتماديات المفقودة تنشئ closures قديمة ومزامنة غير متسقة."), l("A subscription keeps using an old user ID after props change", "يستمر اشتراك باستخدام معرف مستخدم قديم بعد تغير props")),
    p("keys", l("Use stable domain identifiers as list keys", "استخدم معرفات المجال الثابتة كمفاتيح للقائمة"), l("Use array indexes as keys for editable reordered items", "استخدم فهارس المصفوفة كمفاتيح لعناصر قابلة للتحرير وإعادة الترتيب"), l("Keys preserve component identity across renders; index keys move identity when insertion or sorting occurs.", "تحفظ المفاتيح هوية المكوّن عبر الرسوم؛ تنقل مفاتيح الفهرس الهوية عند الإدراج أو الترتيب."), l("Sorting rows moves input state to a different customer", "ينقل ترتيب الصفوف حالة الإدخال إلى عميل مختلف")),
    p("render-performance", l("Profile first, then memoize expensive stable work at measured boundaries", "حلّل الأداء أولاً ثم استخدم memo للعمل المكلف المستقر عند حدود مقاسة"), l("Wrap every component and value in memoization by default", "غلّف كل مكوّن وقيمة في memoization افتراضياً"), l("Memoization has comparison and complexity costs and fails with always-new dependencies; profiling identifies valuable boundaries.", "للمذكرة كلفة مقارنة وتعقيد وتفشل مع اعتماديات جديدة دائماً؛ يحدد التحليل الحدود المفيدة."), l("The team added useMemo everywhere but interactions became harder to debug and no faster", "أضاف الفريق useMemo في كل مكان لكن التفاعل صار أصعب دون تحسن")),
    p("controlled-inputs", l("Choose controlled or uncontrolled ownership intentionally and keep it consistent", "اختر ملكية controlled أو uncontrolled بقصد وحافظ على اتساقها"), l("Switch an input between undefined and a value during its lifetime", "حوّل input بين undefined وقيمة أثناء عمره"), l("A stable ownership model prevents React and the DOM from competing over value; switching creates warnings and lost input.", "يمنع نموذج الملكية الثابت تنافس React وDOM على القيمة؛ التحويل يسبب تحذيرات وفقد إدخال."), l("A form field resets when asynchronous initial data arrives", "يُعاد ضبط حقل نموذج عند وصول البيانات الأولية غير المتزامنة")),
    p("context", l("Split context by update frequency and keep provider values stable", "قسّم context حسب تكرار التحديث واجعل قيم المزوّد مستقرة"), l("Put the entire app state in one provider with a new object each render", "ضع حالة التطبيق كلها في مزوّد واحد بكائن جديد كل رسم"), l("Every changed provider value notifies consumers; focused contexts and stable identity limit unrelated rerenders.", "تبلغ كل قيمة مزود متغيرة المستهلكين؛ تحد contexts المركزة والهوية المستقرة الرسوم غير المرتبطة."), l("Typing in one field rerenders the whole application tree", "تؤدي الكتابة في حقل واحد إلى إعادة رسم شجرة التطبيق كلها")),
    p("concurrency", l("Use transitions for non-urgent rendering while keeping urgent input updates immediate", "استخدم transitions للرسم غير العاجل مع إبقاء تحديثات الإدخال العاجلة فورية"), l("Delay the controlled input value itself inside a transition", "أخّر قيمة الإدخال controlled نفسها داخل transition"), l("Input state must update synchronously for responsiveness; derived expensive results can be marked non-urgent.", "يجب تحديث حالة الإدخال فوراً للاستجابة؛ يمكن تعليم النتائج المشتقة المكلفة كغير عاجلة."), l("Search typing lags while rendering a large filtered result list", "تتأخر الكتابة في البحث أثناء رسم قائمة نتائج كبيرة")),
    p("error-boundaries", l("Place error boundaries around recoverable UI regions and report errors", "ضع error boundaries حول مناطق واجهة قابلة للتعافي وبلّغ الأخطاء"), l("Expect an error boundary to catch event-handler and server errors automatically", "توقع أن تلتقط error boundary أخطاء معالجات الأحداث والخادم تلقائياً"), l("Boundaries catch render-tree failures in their scope, not every asynchronous or event error; those need their own handling.", "تلتقط الحدود أعطال شجرة الرسم ضمن نطاقها لا كل خطأ غير متزامن أو حدث؛ تحتاج تلك لمعالجة خاصة."), l("A click handler rejection bypasses the page error boundary", "يتجاوز رفض داخل معالج نقر error boundary للصفحة")),
  ],
  "react-native": [
    p("list-performance", l("Use FlatList virtualization with stable keys and measured item hints", "استخدم virtualization في FlatList مع مفاتيح ثابتة وتلميحات عناصر مقاسة"), l("Render a large feed with ScrollView and map", "اعرض موجزاً ضخماً باستخدام ScrollView وmap"), l("FlatList renders a bounded window; ScrollView mounts every child and consumes memory up front.", "تعرض FlatList نافذة محدودة؛ يركب ScrollView كل الأبناء ويستهلك الذاكرة مسبقاً."), l("A feed with thousands of rows crashes low-memory phones", "يعطل موجز بآلاف الصفوف الهواتف قليلة الذاكرة")),
    p("js-native-thread", l("Keep heavy JavaScript off the interaction path and use native-driven animation where appropriate", "أبعد JavaScript الثقيل عن مسار التفاعل واستخدم حركة مدفوعة أصلياً عند الملاءمة"), l("Perform large synchronous JSON transforms during gestures", "نفّذ تحويلات JSON متزامنة ضخمة أثناء الإيماءات"), l("Long JS work delays event handling and JS-driven frames; moving work or animation preserves responsiveness.", "يؤخر عمل JS الطويل معالجة الأحداث والإطارات المدفوعة بـ JS؛ نقل العمل أو الحركة يحفظ الاستجابة."), l("Animations stutter whenever a large response is normalized", "تتقطع الحركة عند توحيد استجابة كبيرة")),
    p("navigation-lifecycle", l("Tie subscriptions to screen focus and component cleanup", "اربط الاشتراكات بتركيز الشاشة وتنظيف المكوّن"), l("Add a listener on every focus without removing the previous one", "أضف مستمعاً عند كل تركيز دون إزالة السابق"), l("Navigation may keep screens mounted; focus-aware cleanup prevents duplicate listeners and stale work.", "قد يبقي التنقل الشاشات مركبة؛ يمنع التنظيف الواعي بالتركيز المستمعين المكررين والعمل القديم."), l("Each visit makes push notifications handled one extra time", "تجعل كل زيارة إشعارات push تُعالج مرة إضافية")),
    p("platform-code", l("Encapsulate platform differences behind small typed modules", "غلّف اختلافات المنصة خلف وحدات typed صغيرة"), l("Scatter Platform.OS conditionals throughout UI components", "وزّع شروط Platform.OS عبر مكوّنات الواجهة"), l("A focused boundary is testable and keeps behavior aligned; scattered branches drift between iOS and Android.", "الحد المركز قابل للاختبار ويحافظ على اتساق السلوك؛ الفروع المبعثرة تنحرف بين iOS وAndroid."), l("A permission flow is fixed on Android but remains broken in several iOS screens", "يُصلح تدفق إذن في Android ويبقى معطلاً في عدة شاشات iOS")),
    p("offline-storage", l("Design an explicit cache, conflict, and retry policy for offline mutations", "صمم سياسة صريحة للتخزين والتعارض وإعادة المحاولة للتعديلات دون اتصال"), l("Retry every failed mutation forever without idempotency", "أعد كل تعديل فاشل إلى الأبد دون idempotency"), l("Mobile connectivity is intermittent; durable queues need deduplication, backoff, and conflict semantics.", "اتصال الهاتف متقطع؛ تحتاج الطوابير الدائمة إزالة التكرار وbackoff ودلالات تعارض."), l("Reconnecting submits the same order multiple times", "تؤدي إعادة الاتصال إلى إرسال الطلب نفسه عدة مرات")),
    p("images-memory", l("Serve device-appropriate image sizes and release or cache them deliberately", "قدّم أحجام صور مناسبة للجهاز وحررها أو خزّنها بقصد"), l("Decode original multi-megapixel images for small thumbnails", "فك صوراً أصلية متعددة الميجابكسل لصور مصغرة صغيرة"), l("Decoded bitmap memory depends on pixel dimensions, not compressed bytes; oversized sources can exhaust native memory.", "تعتمد ذاكرة bitmap المفكوكة على أبعاد البكسل لا البايتات المضغوطة؛ قد تستنزف المصادر الضخمة الذاكرة الأصلية."), l("A photo grid crashes only on older Android devices", "تعطل شبكة صور فقط على أجهزة Android الأقدم")),
    p("accessibility", l("Provide semantic roles, labels, focus order, and scalable layouts", "وفر أدواراً وتسميات دلالية وترتيب تركيز وتخطيطات قابلة للتكبير"), l("Make a touchable icon with no accessibility label", "أنشئ أيقونة قابلة للمس دون تسمية وصول"), l("Visual meaning is not available to screen readers; explicit semantics and flexible sizing make controls operable.", "المعنى البصري غير متاح لقارئات الشاشة؛ تجعل الدلالات الصريحة والحجم المرن عناصر التحكم قابلة للاستخدام."), l("Screen-reader users hear several identical unlabeled buttons", "يسمع مستخدمو قارئ الشاشة عدة أزرار متطابقة بلا تسمية")),
    p("testing", l("Combine unit tests, component tests, and a small critical device-flow suite", "ادمج اختبارات الوحدة والمكوّن ومجموعة صغيرة لمسارات الجهاز الحرجة"), l("Rely only on manual testing on one simulator", "اعتمد فقط على اختبار يدوي على محاكي واحد"), l("Layered automation catches logic and integration regressions across platforms; one simulator misses device and OS differences.", "تكشف الأتمتة الطبقية تراجعات المنطق والتكامل عبر المنصات؛ يفوت محاكي واحد اختلافات الأجهزة والنظام."), l("A release works on the developer simulator but fails on physical Android back navigation", "يعمل إصدار على محاكي المطور ويفشل في رجوع Android على جهاز فعلي")),
  ],
  typescript: [
    p("unknown-any", l("Use unknown for untrusted values and narrow before access", "استخدم unknown للقيم غير الموثوقة وضيّق النوع قبل الوصول"), l("Use any at API boundaries and trust compile-time types", "استخدم any عند حدود API وثق بأنواع وقت الترجمة"), l("unknown forces proof before use; any disables checking and cannot validate runtime data.", "يفرض unknown الإثبات قبل الاستخدام؛ يعطل any الفحص ولا يتحقق من بيانات وقت التشغيل."), l("An API returns a different shape and typed code crashes", "يعيد API شكلاً مختلفاً ويتعطل الكود typed")),
    p("unions", l("Model variants with discriminated unions and exhaustive checks", "مثّل المتغيرات باتحادات مميّزة وفحوص شاملة"), l("Use many optional fields that permit impossible combinations", "استخدم حقولاً اختيارية كثيرة تسمح بتركيبات مستحيلة"), l("A discriminant connects each state to valid fields and enables exhaustiveness; optional bags admit invalid states.", "يربط المميّز كل حالة بحقولها الصالحة ويتيح الشمول؛ تسمح أكياس optional بحالات غير صالحة."), l("A successful request state exists without data and with an error", "توجد حالة طلب ناجح بلا بيانات ومع خطأ")),
    p("generics", l("Use generics when input and output types have a real relationship", "استخدم generics عندما توجد علاقة حقيقية بين أنواع الإدخال والإخراج"), l("Add unconstrained type parameters that are used only once", "أضف معاملات نوع غير مقيدة تُستخدم مرة واحدة"), l("Useful generics preserve relationships; a one-use parameter adds complexity without information and may hide a concrete type.", "تحفظ generics المفيدة العلاقات؛ المعامل المستخدم مرة يضيف تعقيداً دون معلومات وقد يخفي نوعاً محدداً."), l("A helper claims to return T but achieves it with a cast from JSON", "تدعي دالة مساعدة إعادة T لكنها تفعل ذلك بتحويل من JSON")),
    p("narrowing", l("Narrow with runtime checks, predicates, or schema validation", "ضيّق النوع بفحوص وقت التشغيل أو predicates أو تحقق المخطط"), l("Use a type assertion to make uncertain data compile", "استخدم type assertion لجعل بيانات غير مؤكدة تترجم"), l("Assertions provide no runtime evidence; narrowing proves the operations allowed on the actual value.", "لا تقدم assertions دليلاً وقت التشغيل؛ يثبت التضييق العمليات المسموحة على القيمة الفعلية."), l("A cast says an event target is an input but a button triggers it", "يقول cast إن هدف الحدث input لكن زر يشغله")),
    p("structural-typing", l("Use branding when structurally identical primitives represent incompatible domains", "استخدم branding عندما تمثل قيم بدائية متطابقة بنيوياً مجالات غير متوافقة"), l("Pass every string ID interchangeably because aliases are documentation only", "مرّر كل معرف نصي بالتبادل لأن aliases توثيق فقط"), l("Structural typing treats equal shapes as compatible; brands can prevent mixing user IDs with order IDs.", "يعامل النوع البنيوي الأشكال المتساوية كمتوافقة؛ تمنع brands خلط معرف مستخدم بمعرف طلب."), l("A function accepts an order ID where a customer ID was expected", "تقبل دالة معرف طلب حيث كان مطلوباً معرف عميل")),
    p("variance-callbacks", l("Enable strict function checks and design callback parameter types honestly", "فعّل strict function checks وصمم أنواع معاملات callback بصدق"), l("Pass a handler requiring a subtype where callers may supply the base type", "مرّر معالجاً يتطلب نوعاً فرعياً حيث قد يرسل المتصل النوع الأساسي"), l("A callback must accept every value the producer promises; requiring a narrower subtype is unsafe.", "يجب أن يقبل callback كل قيمة يعد بها المنتج؛ طلب نوع فرعي أضيق غير آمن."), l("An event bus sends a base event to a handler that assumes a mouse event", "ترسل حافلة أحداث حدثاً أساسياً لمعالج يفترض حدث فأرة")),
    p("mapped-utility-types", l("Use utility types to derive bounded variations while preserving domain invariants", "استخدم utility types لاشتقاق تنويعات محدودة مع حفظ ثوابت المجال"), l("Apply Partial to a domain entity everywhere", "طبّق Partial على كيان المجال في كل مكان"), l("Broad Partial makes every invariant optional; purpose-built update types express exactly what can change.", "يجعل Partial الواسع كل ثابت اختيارياً؛ تعبّر أنواع التحديث المخصصة عما يمكن تغييره بالضبط."), l("An update function accepts an object with no ID and no fields", "تقبل دالة تحديث كائناً بلا معرف أو حقول")),
    p("enums-literals", l("Prefer literal unions or const objects when runtime enum behavior is unnecessary", "فضّل اتحادات literals أو كائنات const عندما لا يلزم سلوك enum وقت التشغيل"), l("Assume numeric enum values reject arbitrary numbers at runtime", "افترض أن قيم enum الرقمية ترفض الأرقام العشوائية وقت التشغيل"), l("TypeScript types are erased and runtime input needs validation; literal unions often produce simpler output and narrowing.", "تُمحى أنواع TypeScript وتحتاج مدخلات التشغيل تحققاً؛ غالباً تنتج اتحادات literals مخرجات وتضييقاً أبسط."), l("A JSON number outside the declared enum reaches business logic", "يصل رقم JSON خارج enum المعلن إلى منطق الأعمال")),
  ],
  vue: [
    p("reactivity", l("Keep reactive access intact with refs or toRefs when destructuring", "حافظ على الوصول التفاعلي باستخدام refs أو toRefs عند التفكيك"), l("Destructure primitive properties from a reactive object and expect updates", "فك خصائص بدائية من كائن reactive وتوقع تحديثها"), l("Plain destructured primitives no longer read through the proxy; refs preserve the reactive connection.", "لا تعود القيم البدائية المفككة تقرأ عبر proxy؛ تحافظ refs على الاتصال التفاعلي."), l("A displayed user name stops updating after destructuring store state", "يتوقف اسم مستخدم معروض عن التحديث بعد تفكيك حالة المتجر")),
    p("computed-watch", l("Use computed for derived values and watch for deliberate side effects", "استخدم computed للقيم المشتقة وwatch للآثار الجانبية المقصودة"), l("Use a watcher to copy every derived value into separate mutable state", "استخدم watcher لنسخ كل قيمة مشتقة إلى حالة قابلة للتغيير منفصلة"), l("Computed values are cached and dependency-driven; copied state adds timing and consistency bugs.", "قيم computed مخزنة ومقادة بالاعتماديات؛ تضيف الحالة المنسوخة أخطاء توقيت واتساق."), l("A filtered count briefly disagrees with the rendered list", "يختلف عدد مصفى مؤقتاً عن القائمة المعروضة")),
    p("component-contracts", l("Use typed props down and emitted events up with explicit contracts", "استخدم props typed للأسفل وأحداثاً صاعدة بعقود صريحة"), l("Let children mutate parent-owned prop objects directly", "دع الأبناء يعدّلون كائنات props المملوكة للأب مباشرة"), l("One-way ownership makes updates traceable; child mutation creates hidden coupling and warnings.", "تجعل الملكية أحادية الاتجاه التحديثات قابلة للتتبع؛ تعديل الابن ينشئ ترابطاً خفياً وتحذيرات."), l("A reusable editor unexpectedly changes its parent before Save", "يغير محرر قابل لإعادة الاستخدام أباه قبل الحفظ")),
    p("keys", l("Use stable unique keys for stateful list items", "استخدم مفاتيح فريدة ثابتة لعناصر قائمة ذات حالة"), l("Use the loop index while inserting or sorting", "استخدم فهرس الحلقة أثناء الإدراج أو الترتيب"), l("Vue uses keys to preserve vnode and component identity; index keys attach state by position rather than entity.", "يستخدم Vue المفاتيح لحفظ هوية vnode والمكوّن؛ تربط مفاتيح الفهرس الحالة بالموقع لا الكيان."), l("Sorting rows moves an open dropdown to another item", "ينقل ترتيب الصفوف قائمة مفتوحة إلى عنصر آخر")),
    p("composables", l("Put reusable stateful logic in composables with explicit inputs and cleanup", "ضع المنطق ذي الحالة القابل لإعادة الاستخدام في composables بمدخلات وتنظيف صريحين"), l("Create global side effects whenever a composable is called", "أنشئ آثاراً جانبية عامة كلما استُدعي composable"), l("A composable should make ownership and disposal clear; implicit global listeners multiply across component instances.", "يجب أن يوضح composable الملكية والتخلص؛ تتضاعف المستمعات العامة الضمنية عبر نسخ المكوّن."), l("Each mounted component adds another window resize listener", "يضيف كل مكوّن مركب مستمع resize جديداً للنافذة")),
    p("pinia-state", l("Keep stores domain-focused and expose intentional actions and derived getters", "اجعل stores مركزة على المجال واعرض actions وgetters مقصودة"), l("Put all server, form, and temporary UI state in one giant store", "ضع كل حالة الخادم والنماذج والواجهة المؤقتة في store ضخمة واحدة"), l("Focused ownership improves lifecycle and testing; a universal store couples unrelated screens and retains stale state.", "تحسن الملكية المركزة دورة الحياة والاختبار؛ تربط store العامة شاشات غير مرتبطة وتحتفظ بحالة قديمة."), l("Opening a new form shows unsaved values from a previous route", "يعرض فتح نموذج جديد قيماً غير محفوظة من مسار سابق")),
    p("async-components", l("Lazy-load meaningful route or feature boundaries and provide loading and error states", "حمّل حدود المسار أو الميزة المهمة بكسل ووفر حالات تحميل وخطأ"), l("Split every tiny component into a separate network chunk", "قسّم كل مكوّن صغير إلى حزمة شبكة منفصلة"), l("Strategic splitting reduces initial code; excessive tiny chunks add request and coordination overhead.", "يقلل التقسيم الاستراتيجي الكود الأولي؛ تضيف الحزم الصغيرة المفرطة كلفة طلب وتنسيق."), l("The app makes hundreds of tiny requests before a route becomes usable", "ينفذ التطبيق مئات الطلبات الصغيرة قبل أن يصبح المسار قابلاً للاستخدام")),
    p("ssr-hydration", l("Render deterministic server and client markup and isolate browser-only APIs", "اعرض markup حتمياً على الخادم والعميل واعزل APIs الخاصة بالمتصفح"), l("Read window and random values directly during SSR render", "اقرأ window وقيماً عشوائية مباشرة أثناء SSR"), l("Hydration expects matching initial markup and the server has no browser globals; nondeterminism causes mismatch.", "يتوقع hydration تطابق markup الأولي ولا يملك الخادم globals المتصفح؛ تسبب اللاحتمية عدم تطابق."), l("Production logs hydration mismatch while client-only development looks fine", "تسجل بيئة الإنتاج عدم تطابق hydration بينما يبدو تطوير العميل سليماً")),
  ],
};

const GENERIC_DISTRACTORS = {
  en: [
    "Rewrite unrelated layers before collecting evidence",
    "Suppress the failure and retry indefinitely",
    "Disable monitoring until the next release",
    "Apply the same fix everywhere without validating assumptions",
    "Increase timeouts until the symptom disappears",
    "Add caching before confirming correctness",
    "Change the framework version first",
    "Copy a blog snippet without reading the docs",
  ],
  ar: [
    "أعد كتابة طبقات غير مرتبطة قبل جمع الأدلة",
    "أخفِ الفشل وأعد المحاولة إلى أجل غير مسمى",
    "عطّل المراقبة حتى الإصدار التالي",
    "طبّق نفس الإصلاح في كل مكان دون التحقق من الفرضيات",
    "زِد المهلات حتى يختفي العرض",
    "أضف تخزيناً مؤقتاً قبل التأكد من الصحة",
    "غيّر إصدار الإطار أولاً",
    "انسخ مقطعاً من مدونة دون قراءة التوثيق",
  ],
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): () => number {
  let state = seed || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function buildOptions(
  pack: TopicPack,
  seed: string,
  mode: "best" | "trap" = "best",
) {
  const correct = mode === "trap" ? pack.trap : pack.best;
  const wrongPrimary = mode === "trap" ? pack.best : pack.trap;
  const random = seededRandom(hashSeed(seed));
  const poolSize = GENERIC_DISTRACTORS.en.length;
  const firstDistractor = Math.floor(random() * poolSize);
  let secondDistractor = Math.floor(random() * (poolSize - 1));
  if (secondDistractor >= firstDistractor) secondDistractor += 1;
  const entries = [
    { en: correct.en, ar: correct.ar, correct: true },
    { en: wrongPrimary.en, ar: wrongPrimary.ar, correct: false },
    {
      en: GENERIC_DISTRACTORS.en[firstDistractor],
      ar: GENERIC_DISTRACTORS.ar[firstDistractor],
      correct: false,
    },
    {
      en: GENERIC_DISTRACTORS.en[secondDistractor],
      ar: GENERIC_DISTRACTORS.ar[secondDistractor],
      correct: false,
    },
  ];
  for (let index = entries.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [entries[index], entries[target]] = [entries[target], entries[index]];
  }
  return {
    options: {
      en: entries.map((entry) => entry.en),
      ar: entries.map((entry) => entry.ar),
    },
    correctIndex: entries.findIndex((entry) => entry.correct),
  };
}

function buildTrackBank(trackSlug: string): InterviewQuestion[] {
  const packs = TRACK_PACKS[trackSlug] ?? [];
  return packs.flatMap((pack) =>
    VARIANTS.map((variant, variantIndex) => {
      const id = `${trackSlug}:${pack.topic}:v${variantIndex + 1}`;
      const answerMode = variant.answerMode;
      const { options, correctIndex } = buildOptions(pack, id, answerMode);
      const prompt = variant.prompt(pack);
      return {
        id,
        trackSlug,
        kind: variant.kind,
        difficulty: variant.difficulty,
        topic: pack.topic,
        prompt: { ar: prompt.ar, en: prompt.en },
        options,
        correctIndex,
        explanation: {
          en:
            answerMode === "trap"
              ? `The common failure mode is “${pack.trap.en}”. Safer practice: ${pack.best.en}. ${pack.why.en}`
              : `${pack.why.en} The common alternative “${pack.trap.en}” fails because it ignores that constraint.`,
          ar:
            answerMode === "trap"
              ? `نمط الفشل الشائع هو «${pack.trap.ar}». الممارسة الأسلم: ${pack.best.ar}. ${pack.why.ar}`
              : `${pack.why.ar} أما البديل الشائع «${pack.trap.ar}» فيفشل لأنه يتجاهل هذا القيد.`,
        },
      };
    }),
  );
}

const INTERVIEW_BANKS: Record<string, InterviewQuestion[]> = {};

function ensureTrackBank(trackSlug: string): InterviewQuestion[] {
  if (!INTERVIEW_BANKS[trackSlug]) {
    INTERVIEW_BANKS[trackSlug] = buildTrackBank(trackSlug);
  }
  return INTERVIEW_BANKS[trackSlug];
}

export function getInterviewBank(trackSlug: string): InterviewQuestion[] {
  return ensureTrackBank(trackSlug).map((question) => ({
    ...question,
    prompt: { ...question.prompt },
    options: { ar: [...question.options.ar], en: [...question.options.en] },
    explanation: { ...question.explanation },
  }));
}

/** O(1) count — does not build the question bank or parse TRACK_PACKS. */
export function getInterviewQuestionCount(trackSlug: string): number {
  return countFromMeta(trackSlug);
}

export function getInterviewQuestionCountByDifficulty(
  trackSlug: string,
  difficulty?: InterviewDifficulty,
): number {
  return countByDifficultyFromMeta(trackSlug, difficulty);
}

export function pickInterviewQuestions(
  trackSlug: string,
  count: number,
  seed = `${Date.now()}:${Math.random()}`,
  difficulty: InterviewDifficulty | "mixed" = "mixed",
): InterviewQuestion[] {
  let questions = getInterviewBank(trackSlug);
  if (difficulty !== "mixed") {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }
  const random = seededRandom(hashSeed(`${trackSlug}:${difficulty}:${seed}`));
  for (let index = questions.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [questions[index], questions[target]] = [questions[target], questions[index]];
  }
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return questions.slice(0, Math.min(safeCount, questions.length));
}

export function toPublicQuestion(q: InterviewQuestion, locale: "ar" | "en") {
  return {
    id: q.id,
    kind: q.kind,
    difficulty: q.difficulty,
    topic: q.topic,
    prompt: q.prompt[locale],
    options: [...q.options[locale]],
  };
}

export type InterviewGradedItem = {
  id: string;
  kind: InterviewKind;
  difficulty: InterviewDifficulty;
  topic: string;
  prompt: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  correct: boolean;
  explanation: string;
  why: string;
  improvement: string;
};

export type InterviewGradeResult = {
  score: number;
  total: number;
  correct: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  items: InterviewGradedItem[];
};

export function gradeInterviewAnswers(
  trackSlug: string,
  answers: Record<string, number>,
  locale: "ar" | "en",
  questionIds?: string[],
): InterviewGradeResult {
  const bank = getInterviewBank(trackSlug);
  const byId = new Map(bank.map((q) => [q.id, q]));
  const ids =
    questionIds && questionIds.length
      ? questionIds.filter((id) => byId.has(id))
      : Object.keys(answers).filter((id) => byId.has(id));

  const items: InterviewGradedItem[] = ids.map((id) => {
    const question = byId.get(id)!;
    const rawSelection = answers[id];
    const selectedIndex =
      Number.isInteger(rawSelection) && rawSelection >= 0 && rawSelection <= 3
        ? rawSelection
        : null;
    const correct = selectedIndex === question.correctIndex;
    const selectedText =
      selectedIndex !== null
        ? question.options[locale][selectedIndex] ?? ""
        : "";
    const correctText = question.options[locale][question.correctIndex] ?? "";
    const explanation = question.explanation[locale];
    return {
      id: question.id,
      kind: question.kind,
      difficulty: question.difficulty,
      topic: question.topic,
      prompt: question.prompt[locale],
      options: [...question.options[locale]],
      selectedIndex,
      correctIndex: question.correctIndex,
      correct,
      explanation,
      why: explanation,
      improvement:
        locale === "ar"
          ? correct
            ? `ثبّت هذا الحكم بإعادة صياغة لماذا «${correctText}» أفضل من البدائل في مقابلة حقيقية.`
            : `قارن إجابتك («${selectedText || "—"}») بالإجابة الصحيحة («${correctText}»)، ثم اشرح الفرق بصوت عالٍ كتمرين مقابلة.`
          : correct
            ? `Lock this judgment in by restating why “${correctText}” beats the alternatives in a real interview.`
            : `Compare your choice (“${selectedText || "—"}”) with the correct answer (“${correctText}”), then explain the difference out loud as interview practice.`,
    };
  });
  const correctCount = items.filter((item) => item.correct).length;
  const total = items.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  const strengths = items
    .filter((item) => item.correct)
    .slice(0, 4)
    .map((item) =>
      locale === "ar"
        ? `أظهرت حكماً سليماً في موضوع «${item.topic}».`
        : `You showed sound judgment on “${item.topic}”.`,
    );
  const weaknesses = items
    .filter((item) => !item.correct)
    .slice(0, 4)
    .map((item) =>
      locale === "ar"
        ? `راجع «${item.topic}»: افهم لماذا الخيار الصحيح أقوى من اختيارك.`
        : `Revisit “${item.topic}”: understand why the correct option beats your choice.`,
    );

  return {
    score,
    total,
    correct: correctCount,
    strengths: strengths.length
      ? strengths
      : [
          locale === "ar"
            ? "لم تُرصد بعد نقاط قوة واضحة في هذه الجلسة."
            : "No clear strengths stood out in this session yet.",
        ],
    weaknesses: weaknesses.length
      ? weaknesses
      : [
          locale === "ar"
            ? "لا توجد فجوات بارزة — ثبّت الإجابات الصحيحة بأمثلة إضافية."
            : "No major gaps — reinforce correct answers with extra examples.",
        ],
    summary:
      locale === "ar"
        ? `أنهيت جلسة المقابلة بدرجة ${score}/100 (${correctCount}/${total}). راجع التحليل أدناه قبل إعادة المحاولة.`
        : `You finished the interview session at ${score}/100 (${correctCount}/${total}). Review the analysis below before retrying.`,
    items,
  };
}

export async function aiEnrichInterviewReport(opts: {
  locale: "ar" | "en";
  trackTitle: string;
  result: InterviewGradeResult;
}): Promise<InterviewGradeResult> {
  const { locale, trackTitle, result } = opts;
  if (!hasOpenAiKey() || !result.items.length) return result;

  const system =
    locale === "ar"
      ? `أنت مدرّب مقابلات تقنية في منصة ألف ياء. حلّل جلسة تدريب مقابلة (اختيار من متعدد فقط) بأسلوب تعليمي واضح.
أعد JSON فقط:
{"items":[{"id":string,"why":string,"improvement":string}],"strengths":[string],"weaknesses":[string],"summary":string}

قواعد ملزمة:
1) لكل سؤال: اذكر صراحةً ما اختاره المتعلم وما هي الإجابة الصحيحة، واشرح الفرق بوضوح 100٪.
2) why: تشخيص قصير مرتبط بالخيار المختار مقابل الصحيح.
3) improvement: خطوة عملية واحدة يستعد بها لمقابلة حقيقية.
4) strengths و weaknesses: ٢–٤ جمل تعليمية كاملة مبنية على هذه الجلسة فقط (ليست عناوين مواضيع فقط).
5) summary: فقرة قصيرة بالعربية فقط.
6) لا تغيّر صحة الإجابات أو الدرجات. لا تخترع خيارات غير موجودة.`
      : `You are AlefYa's technical interview coach. Analyze a multiple-choice interview practice session in clear teaching language.
Return JSON only:
{"items":[{"id":string,"why":string,"improvement":string}],"strengths":[string],"weaknesses":[string],"summary":string}

Mandatory rules:
1) For every question: explicitly name what the learner selected and what the correct answer is; make the difference 100% clear.
2) why: a short diagnosis tied to the selected option vs the correct one.
3) improvement: one concrete action to prepare for a real interview.
4) strengths and weaknesses: 2–4 full teaching sentences based on THIS session only (not bare topic labels).
5) summary: one short English-only paragraph.
6) Do not change correctness or scores. Do not invent options that were not provided.`;

  const inputItems = result.items.map((item) => ({
    id: item.id,
    kind: item.kind,
    difficulty: item.difficulty,
    topic: item.topic,
    prompt: item.prompt,
    options: item.options,
    selectedIndex: item.selectedIndex,
    selectedAnswer:
      item.selectedIndex !== null
        ? item.options[item.selectedIndex] ?? null
        : null,
    correctIndex: item.correctIndex,
    correctAnswer: item.options[item.correctIndex] ?? null,
    correct: item.correct,
    bankExplanation: item.explanation,
  }));

  const parsed = await chatJsonCompletion({
    system,
    user: JSON.stringify({
      track: trackTitle,
      score: result.score,
      correct: result.correct,
      total: result.total,
      items: inputItems,
    }),
    temperature: 0.35,
    maxTokens: 6000,
  });

  if (!parsed || !Array.isArray(parsed.items)) return result;

  const aiById = new Map<string, Record<string, unknown>>();
  for (const raw of parsed.items) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const id = String(row.id || "");
    if (id) aiById.set(id, row);
  }

  const items = result.items.map((item) => {
    const ai = aiById.get(item.id);
    if (!ai) return item;
    return {
      ...item,
      why: cleanProse(ai.why) ?? item.why,
      improvement: cleanProse(ai.improvement) ?? item.improvement,
    };
  });

  const strengths = cleanProseList(parsed.strengths, 4);
  const weaknesses = cleanProseList(parsed.weaknesses, 4);
  const summary = cleanProse(parsed.summary, 600) ?? result.summary;

  return {
    ...result,
    items,
    strengths: strengths.length ? strengths : result.strengths,
    weaknesses: weaknesses.length ? weaknesses : result.weaknesses,
    summary,
  };
}

export function interviewCoverage(): Record<string, number> {
  return Object.fromEntries(
    Object.keys(TRACK_PACKS).map((trackSlug) => [
      trackSlug,
      getInterviewQuestionCount(trackSlug),
    ]),
  );
}
