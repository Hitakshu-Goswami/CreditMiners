const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateProfileCompletion,
  calculateFinancialProfileCompletion,
  buildTrustProfile,
} = require("../src/utils/profileCompletion");

test("calculates complete personal and financial identity profiles", () => {
  const user = {
    fullName: "Asha Rao",
    email: "asha@example.com",
    phone: "+919999999999",
    dateOfBirth: new Date("1998-01-01"),
    gender: "FEMALE",
    education: "BACHELORS",
    city: "Bengaluru",
    state: "Karnataka",
    country: "IN",
    emailVerified: true,
    phoneVerified: true,
  };
  const profile = {
    occupation: "Designer",
    employmentType: "EMPLOYED",
    monthlyIncome: 70000,
    incomeFrequency: "MONTHLY",
    monthlyExpenses: 35000,
    savingsHabit: "REGULAR",
    existingInvestments: 100000,
    existingLiabilities: 0,
    emergencyFund: 100000,
  };
  const profileCompletion = calculateProfileCompletion(user);
  const financialCompletion = calculateFinancialProfileCompletion(profile, [{ id: "goal-1" }]);

  assert.equal(profileCompletion, 100);
  assert.equal(financialCompletion, 100);
  assert.deepEqual(buildTrustProfile({ user, profileCompletion, financialProfileCompletion: financialCompletion }).verificationBadges, [
    "EMAIL_VERIFIED",
    "PHONE_VERIFIED",
    "PROFILE_COMPLETE",
    "FINANCIAL_PROFILE_COMPLETE",
  ]);
});

test("does not treat missing financial identity as complete", () => {
  assert.equal(calculateFinancialProfileCompletion(null, []), 0);
  assert.equal(calculateProfileCompletion({ fullName: "Asha" }), 11);
});
