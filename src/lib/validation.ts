import { z } from "zod";

/** Strong password: 8+ chars, upper, lower, number, special */
export const strongPasswordSchema = z
  .string()
  .min(8, "too_short")
  .max(100, "too_long")
  .regex(/[a-z]/, "need_lower")
  .regex(/[A-Z]/, "need_upper")
  .regex(/[0-9]/, "need_number")
  .regex(/[^A-Za-z0-9]/, "need_special");

export const usernameSchema = z
  .string()
  .min(5, "username_short")
  .max(32, "username_long")
  .regex(/^[a-zA-Z0-9_]+$/, "username_chars");

export const registerSchema = z.object({
  username: usernameSchema,
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const PASSWORD_RULES = [
  "too_short",
  "need_lower",
  "need_upper",
  "need_number",
  "need_special",
] as const;

export type PasswordRule = (typeof PASSWORD_RULES)[number];

export function passwordRuleMet(password: string): Record<PasswordRule, boolean> {
  return {
    too_short: password.length >= 8,
    need_lower: /[a-z]/.test(password),
    need_upper: /[A-Z]/.test(password),
    need_number: /[0-9]/.test(password),
    need_special: /[^A-Za-z0-9]/.test(password),
  };
}

export function passwordIssues(password: string): string[] {
  const met = passwordRuleMet(password);
  return PASSWORD_RULES.filter((k) => !met[k]);
}

export function normalizeUsername(raw: string) {
  return raw.trim().toLowerCase();
}
