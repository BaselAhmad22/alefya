/**
 * All HR interview packs — imported by generate-hr-interviews.mjs
 */
import { l, pack, STAR_DEFAULTS, traps3 } from "./hr-pack-builder.mjs";

const S = STAR_DEFAULTS;

export const ALL_HR_PACKS = {
  "hr-behavioral": [
    pack("leadership", "hr-behavioral", "leadership", "behavioral", "hr", "mid", [
      l("Tell me about a time you led without formal authority.", "احكِ عن قيادة دون سلطة رسمية."),
      l("Describe motivating a team under a tight deadline.", "صف تحفيز فريق تحت موعد نهائي ضيق."),
      l("Give an example of coordinating conflicting priorities.", "أعطِ مثالاً على تنسيق أولويات متعارضة."),
      l("Share when you took ownership beyond your role.", "شارك امتلاكك مسؤولية خارج دورك."),
    ], l("Use STAR with I-statements and a measurable Result.", "استخدم STAR بجمل «أنا» وResult قابل للقياس."), traps3(
      { en: "Speak only about 'we' with no personal actions.", ar: "تحدّث عن «نحن» فقط بلا أفعال شخصية." },
      { en: "Blame the team for failure.", ar: "الوم الفريق على الفشل." },
      { en: "Answer hypothetically with no real story.", ar: "أجب افتراضياً بلا قصة حقيقية." },
    ), { whyAsked: S.whyAsked, recruiterIntent: l("Leadership and influence.", "القيادة والتأثير."), modelAnswer: l("STAR: war room, clear roles, shipped on time, zero P1.", "STAR: war room، أدوار واضحة، تسليم في الموعد، صفر P1."), redFlags: [l("No I-statements", "لا «أنا»"), l("No metrics", "لا أرقام")], passTip: S.passTip, explanation: l("STAR + metrics builds trust for manager rounds.", "STAR + أرقام يبني ثقة لجولة Manager."), improvement: l("Time your story to 90 seconds.", "قِس قصتك 90 ثانية.") }),
    pack("teamwork", "hr-behavioral", "teamwork", "behavioral", "hr", "entry", [
      l("Tell me about a difficult teammate.", "احكِ عن زميل صعب."),
      l("Describe cross-team collaboration.", "صف تعاوناً بين فرق."),
      l("Share supporting a struggling colleague.", "شارك دعم زميل يعاني."),
      l("Give an example of compromise for team success.", "أعطِ مثالاً على تنازل للفريق."),
    ], l("Show empathy, your constructive action, and positive outcome.", "أظهر تعاطفاً، فعلك البنّاء، ونتيجة إيجابية."), traps3(
      { en: "Avoid the person entirely.", ar: "تجنّب الشخص تماماً." },
      { en: "Gossip or label them negatively.", ar: "غيبة أو وصف سلبي." },
      { en: "Claim zero conflict ever.", ar: "ادّعِ صفر صراع." },
    ), { whyAsked: l("Teams need repairers not avoiders.", "الفرق تحتاج من يصلح لا يتجنب."), recruiterIntent: l("Collaboration under friction.", "تعاون تحت احتكاك."), modelAnswer: l("Disagreement → sync → phased MVP → continued partnership.", "خلاف → sync → MVP مرحلي → شراكة مستمرة."), redFlags: [l("Always right", "دائماً على حق")], passTip: l("De-escalation stories pass HR to hiring manager.", "قصص de-escalation تمرّك لمدير التوظيف."), explanation: l("Constructive resolution beats blame.", "حل بنّاء أفضل من اللوم."), improvement: l("One story ending in mutual respect.", "قصة تنتهي باحترام متبادل.") }),
    pack("failure", "hr-behavioral", "failure", "behavioral", "manager", "mid", [
      l("Tell me about a time you failed.", "احكِ عن فشل."),
      l("Describe a mistake affecting others.", "صف خطأ أثر على الآخرين."),
      l("Share a project that missed goals.", "شارك مشروعاً فاتته الأهداف."),
      l("Give hard feedback you received.", "أعطِ feedback صعباً تلقيته."),
    ], l("Own it, show learning and behavior change.", "امتلكه، أظهر تعلماً وتغيير سلوك."), traps3(
      { en: "I never fail.", ar: "لا أفشل أبداً." },
      { en: "Blame externals only.", ar: "الوم خارجيات فقط." },
      { en: "Minimize impact.", ar: "قلّل الأثر." },
    ), { whyAsked: l("Self-awareness over perfection.", "وعي ذاتي لا كمال."), recruiterIntent: l("Accountability and growth.", "مسؤولية ونمو."), modelAnswer: l("Rollback, runbook, checklist — no repeat 12mo.", "rollback، runbook، checklist — لا تكرار 12 شهر."), redFlags: [l("No learning", "لا تعلّم")], passTip: S.passTip, explanation: l("Honest failure + fix = trustworthy.", "فشل صادق + إصلاح = موثوق."), improvement: l("End with process change.", "اختم بتغيير عملية.") }),
    pack("pressure", "hr-behavioral", "pressure", "behavioral", "manager", "senior", [
      l("Work under extreme pressure?", "عمل تحت ضغط شديد؟"),
      l("Everything urgent — how prioritize?", "كل شيء عاجل — كيف رتّبت؟"),
      l("Crisis with multiple stakeholders?", "أزمة وأصحاب مصلحة متعددون؟"),
      l("Calm when others panicked?", "هادئ بينما الآخرون في ذعر؟"),
    ], l("Triage, communicate, sustainable outcome — not hero burnout.", "Triage، تواصل، نتيجة مستدامة — لا burnout."), traps3(
      { en: "Pressure makes me quit.", ar: "الضغط يجعلني أستقيل." },
      { en: "Only answer: 80h weeks.", ar: "80 ساعة فقط." },
      { en: "Hide bad news.", ar: "أخفِ الأخبار السيئة." },
    ), { whyAsked: l("Senior = calm prioritization.", "Senior = ترتيب هادئ."), recruiterIntent: l("Judgment and communication.", "حكم وتواصل."), modelAnswer: l("Outage: triage, 30-min updates, MTTR 47min.", "Outage: triage، تحديث 30 دقيقة، MTTR 47."), redFlags: [l("Chaos", "فوضى")], passTip: S.passTip, explanation: l("Structure under pressure signals readiness.", "هيكل تحت ضغط = جاهزية."), improvement: l("Add time/revenue metric.", "أضف metric وقت/ revenue.") }),
    pack("problem-solving", "hr-behavioral", "problem-solving", "behavioral", "hr", "mid", [
      l("Solve a complex problem?", "حل مشكلة معقدة؟"),
      l("Fix what others couldn't?", "أصلح ما لم يستطع الآخرون؟"),
      l("Data changed your assumption?", "البيانات غيّرت افتراضك؟"),
      l("Creative solution example?", "حل إبداعي؟"),
    ], l("Frame problem, test hypotheses, validate with data.", "صغ المشكلة، اختبر فرضيات، تحقق بالبيانات."), traps3(
      { en: "Jump to solution.", ar: "اقفز للحل." },
      { en: "Full solo credit.", ar: "كل الفضل لي." },
      { en: "Can't explain reasoning.", ar: "لا أشرح التفكير." },
    ), { whyAsked: S.whyAsked, recruiterIntent: l("Analytical thinking.", "تفكير تحليلي."), modelAnswer: l("Funnel data → 3 hypotheses → A/B → +4.2% conversion.", "Funnel → 3 فرضيات → A/B → +4.2%."), redFlags: [l("No data", "لا بيانات")], passTip: S.passTip, explanation: l("Structure beats IQ bragging.", "هيكل أفضل من التباهي."), improvement: l("Before/after metrics.", "Before/after metrics.") }),
    pack("adaptability", "hr-behavioral", "adaptability", "behavioral", "hr", "entry", [
      l("Adapt to major change?", "تكيف مع تغيير كبير؟"),
      l("Learn new tool quickly?", "تعلم أداة بسرعة؟"),
      l("Priorities shifted suddenly?", "أولويات تغيرت فجأة؟"),
      l("Positive during change?", "إيجابي أثناء التغيير؟"),
    ], l("Reaction, learning steps, help others adapt.", "رد فعل، تعلم، مساعدة الآخرين."), traps3(
      { en: "Resist all change.", ar: "أقاوم كل التغيير." },
      { en: "Pretend it was effortless.", ar: "ادّعِ سهولة." },
      { en: "Only criticize leadership.", ar: "أنتقد القيادة فقط." },
    ), { whyAsked: l("Change is constant.", "التغيير مستمر."), recruiterIntent: l("Growth mindset.", "عقلية نمو."), modelAnswer: l("Course + pairing + docs → service in sprint 3.", "دورة + pairing + docs → service sprint 3."), redFlags: [l("Rigid", "جمود")], passTip: S.passTip, explanation: l("Learning + helping others = strong signal.", "تعلم + مساعدة = إشارة قوية."), improvement: l("One pivot story.", "قصة pivot.") }),
    pack("initiative", "hr-behavioral", "initiative", "behavioral", "manager", "senior", [
      l("Improve something unprompted?", "حسّنت شيئاً دون طلب؟"),
      l("Spotted risk early?", "اكتشفت مخاطرة مبكراً؟"),
      l("Idea that saved time/money?", "فكرة وفّرت وقت/مال؟"),
      l("Beyond expectations?", "تجاوزت التوقعات؟"),
    ], l("Gap noticed, alignment, execution, measured impact.", "فجوة، موافقة، تنفيذ، أثر."), traps3(
      { en: "Changed prod without approval.", ar: "غيّرت prod بلا موافقة." },
      { en: "No impact described.", ar: "لا أثر." },
      { en: "Waited for perfect conditions.", ar: "انتظرت الكمال." },
    ), { whyAsked: l("Proactive hires reduce manager load.", "الاستباق يخفف عبء المدير."), recruiterIntent: l("Ownership.", "ownership."), modelAnswer: l("CI pitch → POC → training → errors -70%.", "CI pitch → POC → training → -70%."), redFlags: [l("Reckless", "متهور")], passTip: S.passTip, explanation: l("Aligned initiative wins.", "مبادرة متوافقة."), improvement: l("2 initiatives with numbers.", "مبادرتان بأرقام.") }),
  ],

  "hr-situational": [
    pack("ethics", "hr-situational", "ethics", "situational", "hr", "mid", [
      l("What would you do if a colleague asked you to hide a mistake from a client?", "ماذا تفعل لو طلب زميل إخفاء خطأ عن عميل؟"),
      l("You discover your manager inflated metrics — your move?", "اكتشفت أن مديرك بالغ في الأرقام — ماذا؟"),
      l("A vendor offers a gift before contract renewal — response?", "مورّد يقدم هدية قبل تجديد العقد؟"),
      l("You see someone bypass security for convenience — action?", "ترى أحداً يتجاوز الأمان للراحة؟"),
    ], l("Acknowledge stakes, escalate appropriately, protect stakeholders, document.", "اعترف بالمخاطر، escalate مناسب، احمِ أصحاب المصلحة، وثّق."), traps3(
      { en: "Ignore it to stay popular.", ar: "تجاهل للشعبية." },
      { en: "Publicly confront without facts.", ar: "مواجهة علنية بلا أدلة." },
      { en: "Quit immediately with no process.", ar: "استقيل فوراً بلا عملية." },
    ), { whyAsked: l("SJT tests judgment when rules conflict with pressure.", "SJT يختبر الحكم عند تعارض القواعد والضغط."), recruiterIntent: l("Integrity and escalation.", "نزاهة و escalation."), modelAnswer: l("Private conversation → document → involve HR/legal per policy → protect client.", "محادسة خاصة → توثيق → HR/legal حسب السياسة → حماية العميل."), redFlags: [l("Cover-up", "تستر"), l("Hero vigilante", "بطل منفرد")], passTip: l("Show you know internal channels.", "أظهر معرفتك بالقنوات الداخلية."), explanation: l("Process + integrity passes HR.", "عملية + نزاهة يمرّان HR."), improvement: l("Review company speak-up policy.", "راجع speak-up policy.") }),
    pack("priority", "hr-situational", "prioritization", "situational", "manager", "mid", [
      l("Two executives want conflicting deliverables today — what do you do?", "Executiveان يريدان deliverables متعارضة اليوم؟"),
      l("Critical bug vs demo for investor — choose how?", "bug حرج vs demo لمستثمر؟"),
      l("Your task blocks three teams — they're waiting — approach?", "مهمتك تعطل 3 فرق — ماذا؟"),
      l("Scope creep mid-sprint — response?", "scope creep منتصف sprint؟"),
    ], l("Clarify impact, communicate trade-offs, get explicit decision from owner.", "وضّح الأثر، trade-offs، قرار صريح من المالك."), traps3(
      { en: "Work silently on everything.", ar: "اعمل كل شيء بصمت." },
      { en: "Pick favorites without data.", ar: "اختر المفضلين." },
      { en: "Miss all deadlines.", ar: "فوّت كل المواعيد." },
    ), { whyAsked: l("Managers need transparent trade-off thinking.", "المديرون يريدون trade-offs شفافة."), recruiterIntent: l("Judgment and communication.", "حكم وتواصل."), modelAnswer: l("Impact matrix → sync with both execs → written priority → update blocked teams.", "Impact matrix → sync → priority مكتوب → update الفرق."), redFlags: [l("No communication", "لا تواصل")], passTip: S.passTip, explanation: l("Escalate with options not panic.", "Escalate بخيارات لا ذعر."), improvement: l("Practice impact/urgency grid.", "تدرب على impact/urgency.") }),
    pack("conflict-sit", "hr-situational", "conflict", "situational", "hr", "entry", [
      l("Teammate takes credit for your work in a meeting — response?", "زميل ينسب عملك في اجتماع؟"),
      l("Client is angry on a call — you're not at fault — what do you do?", "عميل غاضب ولست المخطئ؟"),
      l("Peer keeps missing handoffs — your steps?", "زميل يفوّت handoffs؟"),
      l("Disagreement on technical approach in front of client?", "خلاف تقني أمام عميل؟"),
    ], l("Stay professional, de-escalate, seek facts, propose path forward.", "احتراف، de-escalate، حقائق، مسار."), traps3(
      { en: "Argue loudly in the meeting.", ar: "جدال بصوت عالٍ." },
      { en: "Silent resentment later.", ar: "استياء صامت." },
      { en: "Throw teammate under bus.", ar: "القِ الزميل تحت الحافلة." },
    ), { whyAsked: l("Client-facing poise matters.", "الهدوء أمام العميل مهم."), recruiterIntent: l("Emotional intelligence.", "ذكاء عاطفي."), modelAnswer: l("Acknowledge client → clarify facts offline → joint solution → follow-up email.", "اعترف بالعميل → حقائق offline → حل مشترك → email."), redFlags: [l("Public blame", "لوم علني")], passTip: S.passTip, explanation: l("Professional de-escalation.", "de-escalation احترافي."), improvement: l("Role-play angry client.", "Role-play عميل غاضب.") }),
    pack("deadline", "hr-situational", "deadlines", "situational", "manager", "senior", [
      l("You realize you cannot meet a committed date — when/how tell manager?", "لا تستطيع الموعد — متى/كيف تخبر المدير؟"),
      l("Quality vs ship-on-time pressure — approach?", "جودة vs التسليم في الوقت؟"),
      l("Team member hides they're behind — you notice — action?", "عضو يخفي تأخره — ماذا؟"),
      l("Weekend work request before launch — response?", "عمل weekend قبل launch؟"),
    ], l("Early transparency, options with trade-offs, no surprise failures.", "شفافية مبكرة، خيارات، لا مفاجآت."), traps3(
      { en: "Wait until deadline day.", ar: "انتظر يوم الموعد." },
      { en: "Ship broken silently.", ar: "سلّم معطوباً." },
      { en: "Blame team publicly.", ar: "الوم الفريق علنياً." },
    ), { whyAsked: l("Surprises destroy trust.", "المفاجآت تدمر الثقة."), recruiterIntent: l("Ownership and planning.", "ownership وتخطيط."), modelAnswer: l("48h early flag → scope cut options → risk log → agree new date.", "flag قبل 48h → cut scope → risk log → تاريخ جديد."), redFlags: [l("Surprises", "مفاجآت")], passTip: S.passTip, explanation: l("Early escalation is strength.", "Escalation مبكر قوة."), improvement: l("Template for bad-news updates.", "قالب أخبار سيئة.") }),
    pack("remote", "hr-situational", "remote-work", "situational", "hr", "mid", [
      l("Timezone gap causes missed messages — fix?", "فجوة timezone تسبب missed messages؟"),
      l("Teammate never turns camera on and seems disengaged?", "زميل بلا camera ويبدو منقطعاً؟"),
      l("You're overloaded but manager can't see it remotely?", "محمّل والمدير لا يرى remotely؟"),
      l("Async disagreement goes in circles on Slack?", "خلاف async دائري على Slack؟"),
    ], l("Assume good intent, over-communicate, propose structure (sync/doc).", "good intent، over-communicate، هيكل."), traps3(
      { en: "Complain to others only.", ar: "شكوى للآخرين فقط." },
      { en: "Demand synchronous always.", ar: "sync دائماً." },
      { en: "Go silent and disengage.", ar: "صمت وانقطاع." },
    ), { whyAsked: l("Remote judgment is common post-2020.", "حكم remote شائع."), recruiterIntent: l("Communication norms.", "معايير تواصل."), modelAnswer: l("1:1 → shared doc → core hours → call if 3+ async loops.", "1:1 → doc → core hours → call بعد 3 loops."), redFlags: [l("Passive aggressive", "passive aggressive")], passTip: S.passTip, explanation: l("Structure fixes remote friction.", "هيكل يصلح remote."), improvement: l("Share your remote working agreement.", "شارك working agreement.") }),
    pack("customer", "hr-situational", "customer", "situational", "final", "senior", [
      l("Client demands out-of-scope work for free?", "عميل يريد out-of-scope مجاناً؟"),
      l("You must say no to a key account — how?", "يجب قول لا لحساب رئيسي؟"),
      l("Bug affects one big client only — prioritize?", "bug لعميل كبير فقط؟"),
      l("Client asks for unrealistic timeline — response?", "جدول غير واقعي؟"),
    ], l("Empathize, restate scope/contract, offer alternatives, escalate if needed.", "تعاطف، scope، بدائل، escalate."), traps3(
      { en: "Yes to everything.", ar: "نعم لكل شيء." },
      { en: "Rude no.", ar: "لا فظ." },
      { en: "Ghost the client.", ar: "تجاهل العميل." },
    ), { whyAsked: l("Senior roles protect margin and relationships.", "Senior يحمي margin والعلاقات."), recruiterIntent: l("Negotiation and boundaries.", "تفاوض وحدود."), modelAnswer: l("Acknowledge need → written scope → phased option with cost/date → exec if needed.", "need → scope مكتوب → phased + cost → exec."), redFlags: [l("People pleaser", "إرضاء"), l("Aggressive", "عدواني")], passTip: l("Final rounds test client maturity.", "النهائية تختبر نضج العميل."), explanation: l("Boundaries + options win.", "حدود + خيارات."), improvement: l("Prepare one 'say no' script.", "script «لا».") }),
  ],

  "hr-classic": [
    pack("about-you", "hr-classic", "self-intro", "motivational", "screening", "entry", [
      l("Tell me about yourself.", "عرّف بنفسك."),
      l("Walk me through your background.", "مرّ على خلفيتك."),
      l("Give me your two-minute pitch.", "اعطني pitch دقيقتين."),
      l("How would you summarize your career so far?", "لخّص مسيرتك؟"),
    ], l("Present → relevant past → why this role/company → 2 min max.", "حاضر → ماضٍ relevant → لماذا هذا الدور → دقيقتان."), traps3(
      { en: "Life story from childhood.", ar: "قصة حياة من الطفولة." },
      { en: "Read resume line by line.", ar: "اقرأ CV سطراً سطراً." },
      { en: "No link to this job.", ar: "لا رابط بالوظيفة." },
    ), { whyAsked: l("Opening question sets structure and relevance.", "الافتتاحية تضبط الهيكل."), recruiterIntent: l("Communication and focus.", "تواصل وتركيز."), modelAnswer: l("I'm a [role] with X years in [domain]. Recently I [achievement]. I'm here because [company mission + role fit].", "أنا [role] بـ X سنوات في [domain]. مؤخراً [achievement]. هنا لأن [mission + fit]."), redFlags: [l("Too long", "طويل"), l("Irrelevant", "غير relevant")], passTip: l("End with why you're excited for THIS role.", "اختم بحماس لهذا الدور."), explanation: l("Pitch = relevance not autobiography.", "Pitch = relevance."), improvement: l("Record 2-min answer.", "سجّل دقيقتين.") }),
    pack("strengths", "hr-classic", "strengths", "motivational", "hr", "entry", [
      l("What are your greatest strengths?", "ما أ greatest strengths؟"),
      l("Why should we hire you?", "لماذا نوظّفك؟"),
      l("What makes you stand out?", "ما يميزك؟"),
      l("Top three strengths for this role?", "أ top 3 strengths لهذا الدور؟"),
    ], l("Pick 2-3 strengths with brief proof stories tied to job description.", "2-3 strengths مع proof م tied لـ JD."), traps3(
      { en: "List adjectives without examples.", ar: "صفات بلا أمثلة." },
      { en: "Claim perfection in everything.", ar: "كمال في كل شيء." },
      { en: "Strengths unrelated to role.", ar: "strengths غير م related." },
    ), { whyAsked: l("Tests self-awareness and role fit.", "وعي ذاتي و fit."), recruiterIntent: l("Value proposition.", "value proposition."), modelAnswer: l("Strength: systematic debugging. Proof: reduced MTTR 40%. Strength: cross-team communication — shipped X with design/legal.", "Strength: debugging — MTTR -40%. Strength: cross-team — shipped X."), redFlags: [l("Humble brag overload", " humble brag")], passTip: S.passTip, explanation: l("Proof beats adjectives.", "Proof أفضل."), improvement: l("Map strengths to JD bullets.", "اربط strengths بـ JD.") }),
    pack("weakness", "hr-classic", "weakness", "motivational", "hr", "mid", [
      l("What's your greatest weakness?", "ما greatest weakness؟"),
      l("What would your manager say you should improve?", "ماذا يقول مديرك تحسّن؟"),
      l("Area you're actively working on?", "مجال تعمل عليه؟"),
      l("Feedback you've implemented?", "feedback طبّقته؟"),
    ], l("Real weakness (not fatal to role), actions taken, progress — not 'I'm a perfectionist'.", "weakness حقيقي (ليس fatal)، actions، progress."), traps3(
      { en: "I have no weaknesses.", ar: "لا weaknesses." },
      { en: "Disguised strength only.", ar: "strength متنكر." },
      { en: "Fatal flaw for this job.", ar: "fatal flaw." },
    ), { whyAsked: l("Honesty and growth signal.", "صدق ونمو."), recruiterIntent: l("Self-awareness.", "وعي ذاتي."), modelAnswer: l("Weakness: delegating early. Action: weekly check-ins, RACI on projects. Progress: last project I led 3 workstreams without bottleneck.", "Weakness: delegation. Action: check-ins, RACI. Progress: 3 workstreams."), redFlags: [l("Fake weakness", "weakness مزيف")], passTip: S.passTip, explanation: l("Growth story required.", "قصة نمو."), improvement: l("Pick non-fatal weakness.", "weakness non-fatal.") }),
    pack("why-leave", "hr-classic", "career-move", "motivational", "screening", "mid", [
      l("Why are you leaving your current job?", "لماذا تترك وظيفتك؟"),
      l("Why did you leave your last role?", "لماذا تركت آخر دور؟"),
      l("What's missing in your current position?", "ما الناقص في وظيفتك؟"),
      l("What prompted your job search?", "ما دفعك للبحث؟"),
    ], l("Forward-looking: growth, impact, alignment — never badmouth employer.", "forward-looking: نمو، impact — لا badmouth."), traps3(
      { en: "Trash talk boss/company.", ar: "badmouth." },
      { en: "Money only as first reason.", ar: "مال فقط." },
      { en: "Vague 'new challenges'.", ar: "تحديات غامضة." },
    ), { whyAsked: l("Red flag check on attitude and stability.", "red flags."), recruiterIntent: l("Motivation and professionalism.", "motivation."), modelAnswer: l("I've learned X at [company]. I'm seeking [specific growth] that this role offers — [team/product/mission].", "تعلمت X في [company]. أseek [growth] which this role offers."), redFlags: [l("Bitter", "مر"), l("Job hopper vague", "hopper")], passTip: l("Stay positive — HR screens attitude.", "إيجابي — HR يفحص attitude."), explanation: l("Pull toward new role not push away angry.", "pull not push angry."), improvement: l("Write 3 forward reasons.", "3 أسباب forward.") }),
    pack("gap", "hr-classic", "employment-gap", "motivational", "hr", "entry", [
      l("Explain this gap in your resume.", "اشرح فجوة في CV."),
      l("What did you do between jobs?", "ماذا فعلت بين وظيفتين؟"),
      l("Why the career break?", "لماذا career break؟"),
      l("Six-month gap — what happened?", "فجوة 6 أشهر؟"),
    ], l("Brief honest reason + productive use of time + readiness now.", "سبب صادق + استخدام productive + جاهزية."), traps3(
      { en: "Lie about dates.", ar: "كذب تواريخ." },
      { en: "Over-share personal trauma.", ar: "over-share." },
      { en: "Blame economy only.", ar: "economy فقط." },
    ), { whyAsked: l("Consistency and honesty check.", "صدق."), recruiterIntent: l("Stability.", "استقرار."), modelAnswer: l("I took 4 months for [cert/family/health — brief]. I completed [course/project] and I'm fully available.", "4 أشهر [سبب]. أكملت [course]. available."), redFlags: [l("Dishonesty", "كذب")], passTip: S.passTip, explanation: l("Honest + productive gap is fine.", "gap صادق OK."), improvement: l("One-line gap script.", "script gap.") }),
    pack("where-5y", "hr-classic", "career-plan", "motivational", "manager", "mid", [
      l("Where do you see yourself in 5 years?", "أين ترى نفسك بعد 5 سنوات؟"),
      l("Long-term career goals?", "أهداف طويلة؟"),
      l("How does this role fit your path?", "كيف يلائم هذا الدور مسارك؟"),
      l("Ambition level for this position?", "ambition لهذا المنصب؟"),
    ], l("Growth aligned with company ladder — not 'your CEO job' or 'don't know'.", "نمو aligned مع ladder الشركة."), traps3(
      { en: "I want your job.", ar: "أريد وظيفتك." },
      { en: "No ambition.", ar: "لا ambition." },
      { en: "Unrelated dream career.", ar: "حلم unrelated." },
    ), { whyAsked: l("Retention and ambition calibration.", "retention."), recruiterIntent: l("Alignment.", "alignment."), modelAnswer: l("Deepen as [role], lead larger scope, mentor — paths I see here based on [team growth].", "تعمق [role]، scope أكبر، mentor — paths هنا."), redFlags: [l("Misaligned", "misaligned")], passTip: S.passTip, explanation: l("Show commitment to craft.", "commitment."), improvement: l("Research company career paths.", "research paths.") }),
  ],
};

// Remaining tracks — compact packs, expanded to target counts in generator
export const HR_REMAINING = {
  "hr-motivation": { count: 20, kind: "motivational", stage: "screening" },
  "hr-communication": { count: 22, kind: "behavioral", stage: "hr" },
  "hr-leadership": { count: 20, kind: "behavioral", stage: "manager" },
  "hr-psychometric-style": { count: 22, kind: "judgment", stage: "hr" },
  "hr-culture-values": { count: 20, kind: "motivational", stage: "hr" },
  "hr-salary-negotiation": { count: 18, kind: "motivational", stage: "final" },
  "hr-screening-recruiter": { count: 24, kind: "motivational", stage: "screening" },
};

export const HR_COMPETENCY_TEMPLATES = [
  { id: "mot-role", competency: "role-fit", prompts: [l("Why this role?", "لماذا هذا الدور؟"), l("What excites you about the job description?", "ما يثيرك في JD؟"), l("How does this match your skills?", "كيف يلائم مهاراتك؟"), l("Why apply now?", "لماذا التقديم الآن؟")] },
  { id: "mot-company", competency: "company-fit", prompts: [l("Why our company?", "لماذا شركتنا؟"), l("What do you know about us?", "ماذا تعرف عنا؟"), l("Which of our values resonates?", "أي value  resonates؟"), l("Why not a competitor?", "لماذا ليس competitor؟")] },
  { id: "mot-remote", competency: "work-model", prompts: [l("Preference remote/hybrid/office?", "remote/hybrid/office؟"), l("How do you stay productive remote?", "productive remote؟"), l("Timezone collaboration?", "timezone؟"), l("Home office setup?", "home office؟")] },
  { id: "mot-career", competency: "career-direction", prompts: [l("Career direction next 2 years?", "اتجاه 2 سنوات؟"), l("What are you optimizing for?", "ماذا optimize؟"), l("Why leave stable job?", "لماذا تترك stable؟"), l("What would make you stay long-term?", "ما يجعلك تبقى؟")] },
  { id: "mot-industry", competency: "industry-interest", prompts: [l("Why this industry?", "لماذا هذا industry؟"), l("Trends you follow?", "trends؟"), l("How stay current?", "كيف تبقى current؟"), l("Risk if industry shifts?", "risk industry shift؟")] },
];

export const HR_COMM_TEMPLATES = [
  { id: "comm-feedback", competency: "feedback", prompts: [l("Give tough feedback example?", "feedback صعب؟"), l("Receive critical feedback?", "feedback انتقادي؟"), l("Feedback to senior?", "feedback لـ senior؟"), l("Written vs verbal feedback?", "written vs verbal؟")] },
  { id: "comm-stakeholder", competency: "stakeholders", prompts: [l("Manage difficult stakeholder?", "stakeholder صعب؟"), l("Say no to stakeholder?", "لا لـ stakeholder؟"), l("Align exec expectations?", "align exec؟"), l("Translate tech to business?", "tech to business؟")] },
  { id: "comm-listen", competency: "listening", prompts: [l("Miscommunication you fixed?", "miscommunication؟"), l("Active listening example?", "active listening؟"), l("Customer misunderstood requirements?", "customer misunderstood؟"), l("Clarify ambiguous request?", "ambiguous request؟")] },
  { id: "comm-present", competency: "presentation", prompts: [l("Present to non-technical audience?", "present non-tech؟"), l("Executive summary example?", "exec summary؟"), l("Handle hostile questions?", "hostile questions؟"), l("Shorten long update?", "shorten update؟")] },
  { id: "comm-async", competency: "async", prompts: [l("Write effective Slack/email?", "Slack/email فعال؟"), l("Document decision?", "document decision؟"), l("Reduce meeting load?", "reduce meetings؟"), l("Follow up without nagging?", "follow up؟")] },
  { id: "comm-conflict", competency: "conflict", prompts: [l("Resolve peer conflict?", "peer conflict؟"), l("Mediate two teammates?", "mediate؟"), l("Disagree with manager?", "disagree manager؟"), l("Cultural misunderstanding?", "cultural misunderstanding؟")] },
];

export const HR_LEAD_TEMPLATES = [
  { id: "lead-delegate", competency: "delegation", prompts: [l("Delegate effectively?", "delegate؟"), l("Trust but verify?", "trust verify؟"), l("When not delegate?", "when not delegate؟"), l("Develop junior through delegation?", "develop junior؟")] },
  { id: "lead-mentor", competency: "mentoring", prompts: [l("Mentor someone?", "mentor؟"), l("Grow junior to mid?", "grow junior؟"), l("Knowledge sharing?", "knowledge sharing؟"), l("Onboard new hire?", "onboard؟")] },
  { id: "lead-decide", competency: "decision-making", prompts: [l("Hard decision with incomplete data?", "decision incomplete data؟"), l("Disagree but commit?", "disagree commit؟"), l("Reverse a decision?", "reverse decision؟"), l("Involve team in decision?", "involve team؟")] },
  { id: "lead-vision", competency: "vision", prompts: [l("Set direction for project?", "set direction؟"), l("Influence without authority?", "influence no authority؟"), l("Align team on priority?", "align priority؟"), l("Long-term vs short-term?", "long vs short؟")] },
  { id: "lead-account", competency: "accountability", prompts: [l("Hold team accountable?", "hold accountable؟"), l("Missed commitment — response?", "missed commitment؟"), l("Own team failure?", "own team failure؟"), l("Celebrate team win?", "celebrate win؟")] },
];

export const HR_PSYCH_TEMPLATES = [
  { id: "psych-stress", competency: "stress", prompts: [l("Handle stress?", "stress؟"), l("Multiple deadlines?", "deadlines متعددة؟"), l("Recover from burnout?", "burnout؟"), l("Work-life boundaries?", "boundaries؟")] },
  { id: "psych-integrity", competency: "integrity", prompts: [l("Ethical gray area?", "ethical gray؟"), l("Pressure to cut corners?", "cut corners؟"), l("Whistleblowing scenario?", "whistleblowing؟"), l("Admit mistake to client?", "admit mistake client؟")] },
  { id: "psych-learn", competency: "learning", prompts: [l("Learn new skill fast?", "learn fast؟"), l("Handle steep learning curve?", "steep curve؟"), l("Self-study habits?", "self-study؟"), l("Learn from failure?", "learn failure؟")] },
  { id: "psych-style", competency: "work-style", prompts: [l("Independent vs collaborative?", "independent vs collab؟"), l("Structured vs flexible?", "structured vs flexible؟"), l("Detail vs big picture?", "detail vs big picture؟"), l("Preferred manager style?", "manager style؟")] },
  { id: "psych-motivation", competency: "intrinsic-drive", prompts: [l("What motivates you daily?", "motivates daily؟"), l("Demotivators?", "demotivators؟"), l("Flow state at work?", "flow state؟"), l("Energy management?", "energy management؟")] },
  { id: "psych-judgment", competency: "judgment", prompts: [l("Quick decision with risk?", "quick decision risk؟"), l("Ambiguous instructions?", "ambiguous instructions؟"), l("Competing values?", "competing values؟"), l("Incomplete information?", "incomplete info؟")] },
];

export const HR_CULTURE_TEMPLATES = [
  { id: "cult-dei", competency: "inclusion", prompts: [l("Inclusive team example?", "inclusive؟"), l("Support underrepresented colleagues?", "underrepresented؟"), l("Bias you noticed?", "bias noticed؟"), l("Accessible meetings?", "accessible meetings؟")] },
  { id: "cult-values", competency: "values", prompts: [l("Values alignment example?", "values alignment؟"), l("Culture add vs fit?", "culture add؟"), l("Misaligned culture — action?", "misaligned culture؟"), l("Company mission connection?", "mission connection؟")] },
  { id: "cult-team", competency: "collaboration", prompts: [l("Build trust in new team?", "build trust؟"), l("Cross-cultural team?", "cross-cultural؟"), l("Remote culture?", "remote culture؟"), l("Celebrate diversity?", "celebrate diversity؟")] },
  { id: "cult-feedback-culture", competency: "psychological-safety", prompts: [l("Speak up with idea?", "speak up idea؟"), l("Admit not knowing?", "admit not knowing؟"), l("Challenge status quo?", "challenge status quo؟"), l("Learn from mistakes openly?", "mistakes openly؟")] },
  { id: "cult-change", competency: "organizational-change", prompts: [l("Company reorg?", "reorg؟"), l("Merger integration?", "merger؟"), l("New leadership?", "new leadership؟"), l("Policy you disagreed with?", "policy disagree؟")] },
];

export const HR_SALARY_TEMPLATES = [
  { id: "sal-expect", competency: "expectations", prompts: [l("Salary expectations?", "expectations راتب؟"), l("Current compensation?", "compensation حالي؟"), l("Range for this role?", "range؟"), l("When to discuss salary?", "when discuss salary؟")] },
  { id: "sal-negotiate", competency: "negotiation", prompts: [l("Negotiate offer?", "negotiate offer؟"), l("Counter-offer approach?", "counter-offer؟"), l("Multiple offers?", "multiple offers؟"), l("Benefits vs base?", "benefits vs base؟")] },
  { id: "sal-research", competency: "market-research", prompts: [l("How research market rate?", "research market rate؟"), l("Geo pay differences?", "geo pay؟"), l("Equity vs cash?", "equity vs cash؟"), l("Title vs compensation?", "title vs comp؟")] },
  { id: "sal-timing", competency: "timing", prompts: [l("Recruiter asks salary first call?", "salary first call؟"), l("Too early to share number?", "too early number؟"), l("Salary in application form?", "salary in form؟"), l("After offer only?", "after offer only؟")] },
  { id: "sal-decline", competency: "declining", prompts: [l("Decline low offer professionally?", "decline low offer؟"), l("Ask for time to decide?", "time to decide؟"), l("Renegotiate after accepting?", "renegotiate after accept؟"), l("Stay in touch after decline?", "stay in touch decline؟")] },
];

export const HR_SCREEN_TEMPLATES = [
  { id: "scr-avail", competency: "availability", prompts: [l("Earliest start date?", "start date؟"), l("Notice period?", "notice period؟"), l("Relocation timeline?", "relocation؟"), l("Visa sponsorship need?", "visa sponsorship؟")] },
  { id: "scr-legal", competency: "eligibility", prompts: [l("Work authorization?", "work authorization؟"), l("Background check ok?", "background check؟"), l("Non-compete?", "non-compete؟"), l("Travel requirement ok?", "travel ok؟")] },
  { id: "scr-mot", competency: "screening-motivation", prompts: [l("Why looking now?", "why looking now؟"), l("Other processes?", "other processes؟"), l("What would make you accept?", "accept criteria؟"), l("Deal breakers?", "deal breakers؟")] },
  { id: "scr-level", competency: "level-fit", prompts: [l("Right seniority for role?", "seniority؟"), l("Overqualified concern?", "overqualified؟"), l("Underqualified — why apply?", "underqualified؟"), l("Title expectations?", "title expectations؟")] },
  { id: "scr-logistics", competency: "logistics", prompts: [l("Salary range for screening?", "range screening؟"), l("Commute/remote ok?", "commute remote؟"), l("Shift/weekend ok?", "shift weekend؟"), l("Contract vs full-time?", "contract vs FT؟")] },
  { id: "scr-comm", competency: "phone-screen", prompts: [l("Two-minute background for recruiter?", "background recruiter؟"), l("Top 3 requirements match?", "top 3 match؟"), l("Questions for recruiter?", "questions recruiter؟"), l("Follow-up thank you?", "thank you follow-up؟")] },
];

export function templateToPack(trackSlug, tpl, kind, stage, difficulty = "mid") {
  return pack(
    tpl.id,
    trackSlug,
    tpl.competency,
    kind,
    stage,
    difficulty,
    tpl.prompts,
    l("Answer with specifics, professionalism, and forward-looking alignment — tailored to this role.", "أجب بتفاصيل، احتراف، وalignment forward — م tailored لهذا الدور."),
    traps3(
      { en: "Generic answer with no research.", ar: "إجابة generic بلا research." },
      { en: "Negative or defensive tone.", ar: "tone سلبي أو defensive." },
      { en: "Contradict your resume.", ar: "تناقض CV." },
    ),
    {
      whyAsked: l("Recruiters and HR use this to assess fit, motivation, and communication early.", "Recruiters وHR يستخدمون هذا لتقييم fit وmotivation مبكراً."),
      recruiterIntent: l(`Evaluates ${tpl.competency} for pipeline advancement.`, `يقيس ${tpl.competency} للتقدم في pipeline.`),
      modelAnswer: l("Brief context → your relevant proof → tie to role/company → confirm enthusiasm for next step.", "context → proof → tie role/company → enthusiasm للخطوة التالية."),
      redFlags: [l("Unprepared", "غير م prepared"), l("Negative", "سلبي")],
      passTip: l("Ask what the next interview stage assesses and prepare one story for it.", "اسأل ماذا تقيم المرحلة التالية وحضّر قصة."),
      explanation: l("Specific, researched answers advance to hiring manager.", "إجابات specific researched تتقدم لمدير التوظيف."),
      improvement: l("Research company + write 3 bullet pitch.", "research + 3 bullet pitch."),
    },
  );
}
