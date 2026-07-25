const asPercentage = (completed, total) =>
  total === 0 ? 0 : Math.round((completed / total) * 100);

const hasValue = (value) => value !== null && value !== undefined && value !== "";

const calculateProfileCompletion = (user) => {
  const fields = [
    user.fullName,
    user.email,
    user.phone,
    user.dateOfBirth,
    user.gender,
    user.education,
    user.city,
    user.state,
    user.country,
  ];

  return asPercentage(fields.filter(hasValue).length, fields.length);
};

const calculateFinancialProfileCompletion = (profile, goals = []) => {
  if (!profile) return 0;

  const fields = [
    profile.occupation,
    profile.employmentType,
    profile.monthlyIncome,
    profile.incomeFrequency,
    profile.monthlyExpenses,
    profile.savingsHabit,
    profile.existingInvestments,
    profile.existingLiabilities,
    profile.emergencyFund,
    goals.length > 0,
  ];

  return asPercentage(fields.filter(hasValue).length, fields.length);
};

const buildTrustProfile = ({ user, profileCompletion, financialProfileCompletion }) => {
  const badges = [];

  if (user.emailVerified) badges.push("EMAIL_VERIFIED");
  if (user.phoneVerified) badges.push("PHONE_VERIFIED");
  if (profileCompletion === 100) badges.push("PROFILE_COMPLETE");
  if (financialProfileCompletion === 100) {
    badges.push("FINANCIAL_PROFILE_COMPLETE");
  }

  return {
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    profileCompletionPercentage: profileCompletion,
    financialProfileCompletionPercentage: financialProfileCompletion,
    verificationBadges: badges,
  };
};

module.exports = {
  calculateProfileCompletion,
  calculateFinancialProfileCompletion,
  buildTrustProfile,
};
