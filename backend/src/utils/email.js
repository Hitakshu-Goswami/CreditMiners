const transporter = require("../config/mail");

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"CreditMiners" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Welcome to CreditMiners 👋</h2>

      <p>Thank you for registering.</p>

      <p>Please verify your email by clicking the button below.</p>

      <a
        href="${verificationUrl}"
        style="
          display:inline-block;
          padding:12px 24px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify Email
      </a>

      <p style="margin-top:30px;">
        If you didn't create this account, simply ignore this email.
      </p>

      <hr>

      <small>
        This verification link expires in 24 hours.
      </small>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your CreditMiners account",
    html,
  });
};
const sendPasswordResetEmail = async (
  email,
  token
) => {
  const resetUrl =
    `${process.env.APP_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>

      <p>We received a request to reset your password.</p>

      <p>
        Click the link below to reset it:
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>

      <p>
        If you didn't request this, you can safely ignore this email.
      </p>
    `,
  });
};

const sendEmailChangeVerification = async (email, token) => {
  const verificationUrl = `${process.env.APP_URL}/api/users/email/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Confirm your new CreditMiners email address",
    html: `
      <h2>Confirm your new email address</h2>
      <p>Click the link below to confirm this address for your CreditMiners account.</p>
      <a href="${verificationUrl}">Confirm email address</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEmailChangeVerification,
};
