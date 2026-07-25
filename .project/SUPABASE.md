# Supabase Setup

The Prisma schema is already configured for Supabase/PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## What You Need From Supabase

From your Supabase dashboard:

1. Open your project.
2. Go to Project Settings.
3. Open Database.
4. Copy the PostgreSQL connection string.
5. Replace `[YOUR-PASSWORD]` with your database password.

For local Prisma migrations, prefer the direct database connection:

```text
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Local Env File

Create `backend/.env`.

Do not commit this file. It is ignored by `.gitignore`.

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:5000

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

JWT_ACCESS_SECRET=replace-this-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-this-with-a-long-random-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

MAIL_HOST=localhost
MAIL_PORT=587
MAIL_USER=demo@creditminers.local
MAIL_PASS=demo-password
```

## Connect And Push Schema

From `backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

If you want to sync schema without creating a migration during a hackathon demo:

```bash
npx prisma db push
npm run seed
```

## Verify Connection

Run:

```bash
npx prisma studio
```

Or start the backend:

```bash
npm start
```

Then check:

```text
http://localhost:5000/api/health
```

## Security Notes

- Never commit `backend/.env`.
- Never paste the Supabase database password into docs or commits.
- Use a separate Supabase project for hackathon/demo data.
- The current `/api/demo` scoring flow does not require Supabase yet; auth, Prisma models, future persisted assessments, and seeded roles use the database.
