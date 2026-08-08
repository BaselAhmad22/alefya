/**
 * Run `prisma migrate deploy` against DIRECT_URL (Neon non-pooler).
 * Pooler URLs time out on advisory locks (P1002).
 */
import { spawnSync } from "node:child_process";

const direct = (process.env.DIRECT_URL || "").trim();
const pooled = (process.env.DATABASE_URL || "").trim();
const url = direct || pooled;

if (!url) {
  console.error("migrate-deploy: set DIRECT_URL (preferred) or DATABASE_URL");
  process.exit(1);
}

if (!direct) {
  console.warn(
    "migrate-deploy: DIRECT_URL missing — using DATABASE_URL (may fail on Neon pooler)",
  );
} else if (direct.includes("-pooler.")) {
  console.warn(
    "migrate-deploy: DIRECT_URL looks like a pooler host; use the non-pooler Neon URL",
  );
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
  shell: true,
});

process.exit(result.status ?? 1);
