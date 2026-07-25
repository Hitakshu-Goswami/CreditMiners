const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "test"],
  }),

  PORT: port({
    default: 5000,
  }),

  DATABASE_URL: str(),

  JWT_ACCESS_SECRET: str(),

  JWT_REFRESH_SECRET: str(),

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

  MAIL_HOST: str(),

  MAIL_PORT: port({
    default: 587,
  }),

  MAIL_USER: str(),

  MAIL_PASS: str(),

  /* ---------------- Application ---------------- */

  APP_URL: str({
    default: "http://localhost:5000",
  }),
});

module.exports = env;