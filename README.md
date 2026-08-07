# AlefYa — ألف ياء

منصة تعلّم برمجة بخطط دراسة مرتّبة من الألف للياء. عربي + إنجليزي.

## البدء

```bash
npm install
npx prisma migrate dev
npm run content:generate
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) — يُحوَّل تلقائياً إلى `/ar`.

## المسارات الحالية

- **ASP.NET Core** — من C# حتى مشروع API (~120 ساعة)
- **Angular** — من TypeScript حتى مشروع واجهة (~110 ساعة)
- **React** — من المكوّنات حتى تطبيق حديث (~100 ساعة)
- **Next.js** — App Router حتى الإطلاق (~95 ساعة)
- **React Native** — من أول شاشة حتى بناء التطبيق (~105 ساعة)

كل درس يتضمن: لماذا، مفاهيم مفصّلة، خطوات، مثال كامل، أخطاء شائعة، نقاشات، تمارين، وقائمة تحقق.

المحتوى في `content/tracks/`. أعد التوليد عبر `npm run content:generate`.

## مساعد الذكاء الاصطناعي

في صفحة كل درس يظهر زر **؟** — اسأل عن أي جزء صعب.

- بدون مفتاح: يعمل المساعد المحلي من محتوى الدرس نفسه
- مع مفتاح OpenAI: ضع في `.env`:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

## الحسابات والتقدّم

سجّل حساباً، أكمل دروساً، وتابع تقدّمك من لوحة التحكم.

## النشر المجاني (Render + Neon)

النشر يعتمد على خدمتين مجانيتين على [Render](https://render.com) وقاعدة [Neon](https://neon.tech) Postgres:

| خدمة | الدور |
|------|--------|
| `alefya-web` | Next.js |
| `alefya-realtime` | Socket.io |

1. أنشئ مشروع Neon مجاني وانسخ `DATABASE_URL` (connection string مع `sslmode=require`).
2. ادفع الريبو إلى GitHub ثم من Render: **New → Blueprint** واختر `render.yaml`.
3. عيّن `DATABASE_URL` على الخدمتين (ونفس `AUTH_SECRET` يُنسخ تلقائياً عبر الـ Blueprint).
4. الروابط المتوقعة:
   - الموقع: `https://alefya-web.onrender.com`
   - Realtime: `https://alefya-realtime.onrender.com`

**ملاحظة:** على الخطة المجانية تنام الخدمة بعد ~15 دقيقة خمول؛ أول زيارة بعدها قد تستغرق 30–60 ثانية (cold start). ملفات رفع الشات على القرص مؤقتة وتضيع عند إعادة النشر.
