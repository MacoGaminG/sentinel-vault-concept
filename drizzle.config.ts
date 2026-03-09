import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite", // On utilise "dialect" à la place de "driver"
  dbCredentials: {
    url: "sqlite.db",
  },
});
