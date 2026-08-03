import nodemailer from "nodemailer";

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export type SendOtpResult =
  | { mode: "resend" | "smtp"; messageId?: string }
  | { mode: "console"; otp: string }
  | { mode: "ethereal"; otp: string; previewUrl: string };

function buildBodies(otp: string, name?: string | null) {
  const who = name ? ` ${name}` : "";
  const text = [
    `مرحباً${who}،`,
    ``,
    `رمز التأكيد الخاص بك في ألف ياء هو: ${otp}`,
    `صالح لمدة 15 دقيقة.`,
    ``,
    `Hello${who},`,
    `Your AlefYa verification code is: ${otp}`,
    `Valid for 15 minutes.`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<body style="font-family:Segoe UI,Tahoma,sans-serif;background:#0f1419;color:#e8eef4;padding:32px">
  <div style="max-width:480px;margin:0 auto;background:#1a222c;border:1px solid #2a3542;border-radius:12px;padding:28px">
    <p style="margin:0 0 8px;color:#8b9aab;font-size:13px">ألف ياء · AlefYa</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:#fff">تأكيد البريد</h1>
    <p style="margin:0 0 20px;line-height:1.6;color:#c5d0db">مرحباً${who}، استخدم الرمز التالي لتأكيد حسابك:</p>
    <p style="margin:0 0 24px;letter-spacing:0.35em;font-size:32px;font-weight:700;color:#5eead4;text-align:center">${otp}</p>
    <p style="margin:0;font-size:13px;color:#8b9aab">صالح لمدة 15 دقيقة · Valid for 15 minutes</p>
  </div>
</body>
</html>`;

  return { text, html };
}

/** Create / reuse Ethereal SMTP (real SMTP protocol; inbox is a preview URL, not Gmail). */
async function sendViaEthereal(
  to: string,
  subject: string,
  text: string,
  html: string,
  otp: string,
): Promise<SendOtpResult> {
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });
  const info = await transporter.sendMail({
    from: `AlefYa <${account.user}>`,
    to,
    subject,
    text,
    html,
  });
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`[AlefYa OTP] ethereal to=${to} code=${otp} preview=${previewUrl}`);
  return {
    mode: "ethereal",
    otp,
    previewUrl: previewUrl || "",
  };
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  name?: string | null,
): Promise<SendOtpResult> {
  const subject = "AlefYa — رمز تأكيد البريد / Email verification OTP";
  const { text, html } = buildBodies(otp, name);
  const from =
    process.env.EMAIL_FROM || "AlefYa <onboarding@resend.dev>";

  // 1) Resend HTTP API (recommended for real inbox delivery)
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[AlefYa mail] Resend error:", detail);
      // Free tier: only the Resend account email is allowed until a domain is verified
      if (detail.includes("only send testing emails")) {
        throw new Error("email_send_failed:resend_test_recipient");
      }
      throw new Error(`email_send_failed:${detail.slice(0, 200)}`);
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    console.log(`[AlefYa OTP] resend to=${to} id=${data.id || "?"}`);
    return { mode: "resend", messageId: data.id };
  }

  // 2) Classic SMTP (Gmail / Resend SMTP / any provider)
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (host && user && pass) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      process.env.SMTP_SECURE === "true" || port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `AlefYa <${user}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`[AlefYa OTP] smtp to=${to} id=${info.messageId}`);
    return { mode: "smtp", messageId: info.messageId };
  }

  // 3) Auto Ethereal SMTP if MAIL_MODE=ethereal (preview link, not real Gmail)
  if (process.env.MAIL_MODE === "ethereal") {
    return sendViaEthereal(to, subject, text, html, otp);
  }

  // 4) Dev console fallback
  console.log(`[AlefYa OTP] to=${to} code=${otp}`);
  return { mode: "console", otp };
}
