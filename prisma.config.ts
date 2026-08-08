// Prisma CLI config. Migrations must use Neon's direct host — the
// pooler cannot take Postgres advisory locks (error P1002).
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
