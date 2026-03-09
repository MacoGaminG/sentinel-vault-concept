# Sentinel Vault — Local Setup & Testing

A Next.js + Bun prototype implementing an AES-256 encrypted local vault backed by SQLite and Drizzle ORM.

This README replaces the default template and provides step-by-step instructions to install, generate the database, run the project locally and test the main flows: register, login, add/list/delete encrypted notes.

---

## Prerequisites

- Bun (recommended runtime). Install from https://bun.sh
- Git (to clone the repo)
- Optional: SQLite CLI (`sqlite3`) if you want to inspect `sqlite.db` manually

Notes:

- This project is configured to run under Bun. The code imports `bun:sqlite` and uses Bun-specific scripts in `package.json`. For the smoothest experience use Bun.

---

## Files of interest

- `src/lib/crypto.ts` — AES-256-CBC encrypt/decrypt logic (key derived from `ENCRYPTION_KEY`)
- `src/lib/db/schema.ts` — Drizzle schema for `users` and `secure_notes`
- `drizzle.config.ts` — Drizzle Kit configuration (points to schema and output folder)
- `src/lib/db/index.ts` — Bun SQLite DB connection (`sqlite.db`)
- `src/lib/actions/*` — server actions: signup/login/note operations
- UI pages: `src/app/(auth)/register`, `src/app/(auth)/login`, `src/app/dashboard`

---

## Quickstart — local development

1. Clone the repository (if you haven't already):

```sh
git clone <your-repo-url> sentinel-vault-concept
cd sentinel-vault-concept
```

2. Create a `.env` file in the project root and set a secure `ENCRYPTION_KEY`.

Example `.env` (do not commit this to git):

```sh
# .env
ENCRYPTION_KEY="replace_with_a_secure_random_string_or_base64"
```

Notes:

- The value of `ENCRYPTION_KEY` can be any string, but it should be strong and secret. The app derives a 32-byte key by computing SHA-256 over this value.
- Changing `ENCRYPTION_KEY` after notes were created will prevent existing notes from being decrypted.

3. Install dependencies with Bun:

```sh
bun install
```

4. Generate the SQLite database and create tables

By default the database and tables are not created. Use Drizzle Kit to push the schema into `sqlite.db`:

```sh
# Uses bunx to run the locally-installed drizzle-kit
bunx drizzle-kit push:sqlite
```

What this does:

- Reads `drizzle.config.ts` and `src/lib/db/schema.ts`.
- Creates or updates `sqlite.db` in the project root with the tables defined in the schema.

If this step fails:

- Ensure `drizzle-kit` is present in `node_modules` (run `bun install`).
- Confirm `drizzle.config.ts` has `schema: "./src/lib/db/schema.ts"` and `dbCredentials.url: "sqlite.db"`.

5. Start the development server

```sh
bun run dev
# Server runs at http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## Manual test flow (end-to-end)

1. Register a new user:
   - Visit `http://localhost:3000/register`
   - Fill email and password and submit.
   - On success (prototype behavior), you will be redirected to the dashboard.

2. Add a secure note:
   - On the dashboard, use the "Nouveau Secret" form to add a title and content.
   - Content is encrypted server-side (AES-256-CBC) and saved into `sqlite.db`.

3. View notes:
   - The dashboard reads encrypted rows from the DB and decrypts them server-side to display plaintext to the UI.

4. Delete notes:
   - Use the trash icon on a note card to delete it.

Notes about authentication:

- This is a prototype. Authentication and session management are simplified; the dashboard currently uses a simulated user id for demonstration. Do not rely on the current auth for production use.

---

## Inspecting the SQLite database

`sqlite.db` is created in the project root after you run the Drizzle push command. Use the SQLite CLI to inspect:

```sh
# Open sqlite CLI (if installed)
sqlite3 sqlite.db
```

```sql
# Example queries inside sqlite3:
.tables
SELECT id, email, hashed_password, created_at FROM users;
SELECT id, user_id, title, encrypted_content, iv FROM secure_notes;
```

Stored values:

- `encrypted_content` and `iv` are hex strings. The app decrypts `encrypted_content` with `iv` using the key derived from `ENCRYPTION_KEY`.

---

## Useful scripts (from package.json)

- Development:

```sh
bun run dev
```

- Build:

```sh
bun run build
```

- Start (production):

```sh
bun run start
```

- Lint:

```sh
bun run lint
```

---

## Drizzle & migrations

- Schema file: `src/lib/db/schema.ts`
- Drizzle config: `drizzle.config.ts`

For this prototype the recommended command to create the DB + tables is:

```sh
bunx drizzle-kit push:sqlite
```

If you plan to evolve this project, consider adding versioned migrations and committing the `drizzle` folder to source control. Consult Drizzle Kit docs for migration workflows.

---

## Environment variables

- `ENCRYPTION_KEY` (required)
  - Used to derive the AES key (SHA-256).
  - Keep it secret. Do not commit `.env`.

Optional: You can also override where the DB file is written by editing `drizzle.config.ts` and `src/lib/db/index.ts`, but the current setup uses `sqlite.db` in the project root.

---

## Troubleshooting

- bun not found:
  - Install Bun and ensure it is on your PATH: https://bun.sh

- Drizzle push fails:
  - Run `bun install` to ensure `drizzle-kit` is installed locally.
  - Check `drizzle.config.ts` and schema file path.
  - Read the error from `bunx drizzle-kit push:sqlite` and fix any TypeScript or schema issues.

- Notes don't decrypt:
  - Confirm the same `ENCRYPTION_KEY` is being used when encrypting and decrypting. If you changed the key, old notes cannot be decrypted.

- DB permission errors:
  - Ensure your process user has write access to the project directory.
  - If in doubt, remove `sqlite.db` and re-run `bunx drizzle-kit push:sqlite` (note: this deletes existing data).

- Using Node instead of Bun:
  - This repo expects Bun (imports and scripts). Running under Node may require changes (replace `bun:sqlite` and scripts).

---

## Security notes

- Prototype status: The app demonstrates end-to-end encryption concepts. It is not production-ready.
- Key management: Do not store secrets in plaintext in source control. In production, use a secure secrets manager (KMS) and rotate keys properly.
- Auth & session: Replace the simplified flows with a robust authentication/session system (e.g., cookie-based sessions, JWT with refresh, or an auth library like Lucía) and add CSRF protection, rate limiting, etc.
- Encryption mode: The project uses AES-256-CBC with an IV stored per-note. In a production design consider authenticated encryption (e.g., AES-GCM) and strong key derivation/rotation policies.
