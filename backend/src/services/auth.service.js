const prisma = require("../config/prisma");

const { hashPassword, comparePassword } = require("../utils/bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const { hashToken } = require("../utils/crypto");
const auditService = require("./audit.service");
const {
  getDeviceInfo,
} = require("../utils/device");

const { v4: uuidv4 } = require("uuid");

const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");

const {
  MAX_LOGIN_ATTEMPTS,
  ACCOUNT_LOCK_DURATION,
} = require("../constants/auth.constants");

const {
  generateVerificationToken,
} = require("../utils/verificationToken");

const {
  sendVerificationEmail,
} = require("../utils/email");

const {
  generatePasswordResetToken,
} = require("../utils/passwordResetToken");

const {
  sendPasswordResetEmail,
} = require("../utils/email");

class AuthService {
async register(
  { fullName, email, phone, password },
  userAgent
) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new ConflictError("User already exists.");
  }

  const role = await prisma.role.findUnique({
    where: {
      name: "USER",
    },
  });

  if (!role) {
    throw new NotFoundError("Default role not found.");
  }

  const hashedPassword = await hashPassword(password);

  const { token, hashedToken } =
    generateVerificationToken();

  const verificationExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash: hashedPassword,
      roleId: role.id,

      emailVerified: false,
      verificationToken: hashedToken,
      verificationExpires: verificationExpiry,
    },
    include: {
      role: true,
    },
  });

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken =
    generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      deviceInfo:
        getDeviceInfo(userAgent).displayName,
    },
  });

  await sendVerificationEmail(
    user.email,
    token
  );

  await auditService.log({
    userId: user.id,
    action: "USER_REGISTERED",
    description: "User registered successfully.",
  });

  return {
    user: {
      ...user,
      verificationToken: undefined,
      verificationExpires: undefined,
      passwordHash: undefined,
    },

    accessToken,
    refreshToken,

    message:
      "Registration successful. Please verify your email before logging in.",
  };
}

async login(
  { email, password },
  userAgent
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError(
      "Invalid email or password."
    );
  }

  if (
    user.lockUntil &&
    user.lockUntil > new Date()
  ) {
    throw new UnauthorizedError(
      `Account is locked. Try again after ${user.lockUntil.toLocaleString()}.`
    );
  }

  if (!user.emailVerified) {
    throw new UnauthorizedError(
      "Please verify your email before logging in."
    );
  }

  const isMatch = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isMatch) {
    const attempts =
      user.failedLoginAttempts + 1;

    const updateData = {
      failedLoginAttempts: attempts,
    };

    if (
      attempts >= MAX_LOGIN_ATTEMPTS
    ) {
      updateData.lockUntil = new Date(
        Date.now() +
          ACCOUNT_LOCK_DURATION
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
    });

    throw new UnauthorizedError(
      attempts >= MAX_LOGIN_ATTEMPTS
        ? "Account locked due to multiple failed login attempts. Please try again later."
        : "Invalid email or password."
    );
  }

  if (
    user.failedLoginAttempts > 0 ||
    user.lockUntil
  ) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
  };

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      deviceInfo:
        getDeviceInfo(userAgent).displayName,
    },
  });

  await auditService.log({
    userId: user.id,
    action: "USER_LOGIN",
    description: "User logged in successfully.",
  });

  return {
    user: {
      ...user,
      passwordHash: undefined,
      verificationToken: undefined,
      verificationExpires: undefined,
    },

    accessToken,
    refreshToken,
  };
}
   async refresh(
  refreshToken,
  userAgent
) {
    verifyRefreshToken(refreshToken);

    const hashedToken = hashToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: hashedToken,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedError(
        "Refresh token is invalid."
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError(
        "Refresh token has expired."
      );
    }

    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    const payload = {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role.name,
    };

    const newAccessToken =
      generateAccessToken(payload);

    const newRefreshToken =
      generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(newRefreshToken),
        userId: storedToken.user.id,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
       deviceInfo: getDeviceInfo(userAgent).displayName,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

 async logout(refreshToken) {
  const hashedToken = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hashedToken,
    },
  });

  if (!storedToken) {
    throw new UnauthorizedError(
      "Invalid refresh token."
    );
  }

  await prisma.refreshToken.delete({
    where: {
      id: storedToken.id,
    },
  });

  await auditService.log({
    userId: storedToken.userId,
    action: "USER_LOGOUT",
    description: "User logged out successfully.",
  });

  return true;
}

async verifyEmail(token) {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError(
      "Verification link is invalid or has expired."
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  await auditService.log({
    userId: user.id,
    action: "EMAIL_VERIFIED",
    description: "Email verified successfully.",
  });

  return {
    message: "Email verified successfully.",
  };
}
  async resendVerification(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundError(
        "User not found."
      );
    }

    if (user.emailVerified) {
      throw new ConflictError(
        "Email is already verified."
      );
    }

    const { token, hashedToken } =
      generateVerificationToken();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verificationToken: hashedToken,
        verificationExpires: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
      },
    });

    await sendVerificationEmail(
      user.email,
      token
    );

    return {
      message:
        "Verification email sent successfully.",
    };
  }
  async forgotPassword(email) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
   * Never reveal whether the email exists.
   */
  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  const { token, hashedToken } =
    generatePasswordResetToken();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(
        Date.now() + 15 * 60 * 1000
      ),
    },
  });

  await sendPasswordResetEmail(
    user.email,
    token
  );

  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
}

async resetPassword(token, newPassword) {
  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError(
      "Reset link is invalid or has expired."
    );
  }

  const passwordHash =
    await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    }),

    prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    }),
  ]);

  await auditService.log({
    userId: user.id,
    action: "PASSWORD_RESET",
    description: "Password reset successfully.",
  });

  return {
    message:
      "Password reset successfully. Please log in again.",
  };
}

async changePassword(
  userId,
  currentPassword,
  newPassword
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const isCurrentPasswordValid =
    await comparePassword(
      currentPassword,
      user.passwordHash
    );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError(
      "Current password is incorrect."
    );
  }

  const isSamePassword =
    await comparePassword(
      newPassword,
      user.passwordHash
    );

  if (isSamePassword) {
    throw new ConflictError(
      "New password must be different from the current password."
    );
  }

  const hashedPassword =
    await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: hashedPassword,
      },
    }),

    prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    }),
  ]);

  await auditService.log({
    userId: user.id,
    action: "PASSWORD_CHANGED",
    description: "Password changed successfully.",
  });

  return {
    message:
      "Password changed successfully. Please log in again.",
  };
}

async getSessions(userId) {
  const sessions = await prisma.refreshToken.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      deviceInfo: true,
      createdAt: true,
      expiresAt: true,
    },
  });

  return sessions;
}
async logoutSession(userId, sessionId) {
  const session = await prisma.refreshToken.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new NotFoundError("Session not found.");
  }

  await prisma.refreshToken.delete({
    where: {
      id: sessionId,
    },
  });

  await auditService.log({
    userId,
    action: "SESSION_REVOKED",
    description: `Session ${sessionId} revoked successfully.`,
  });

  return {
    message: "Session logged out successfully.",
  };
}
async logoutAllSessions(userId) {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  await auditService.log({
    userId,
    action: "LOGOUT_ALL_DEVICES",
    description: "User logged out from all devices.",
  });

  return {
    message: "Logged out from all devices successfully.",
  };
}
}

module.exports = new AuthService();




