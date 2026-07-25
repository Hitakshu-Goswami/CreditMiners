const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "test"],
  }),

  PORT: port({
    default: 5000,
  }),

  DATABASE_URL: str({
    default: "postgresql://postgres:postgres@localhost:5432/creditminers",
  }),

  JWT_ACCESS_SECRET: str({
    default: "creditminers-demo-access-secret",
  }),

  JWT_REFRESH_SECRET: str({
    default: "creditminers-demo-refresh-secret",
  }),

  ACCESS_TOKEN_EXPIRY: str({
    default: "15m",
  }),

  REFRESH_TOKEN_EXPIRY: str({
    default: "7d",
  }),

  CLIENT_URL: str({
    default: "http://localhost:5173",
  }),

  /* ---------------- Mail Configuration ---------------- */

  MAIL_HOST: str({
    default: "localhost",
  }),

  MAIL_PORT: port({
    default: 587,
  }),

  MAIL_USER: str({
    default: "demo@creditminers.local",
  }),

  MAIL_PASS: str({
    default: "demo-password",
  }),

  /* ---------------- Application ---------------- */

  APP_URL: str({
    default: "http://localhost:5000",
  }),
});

module.exports = env;
