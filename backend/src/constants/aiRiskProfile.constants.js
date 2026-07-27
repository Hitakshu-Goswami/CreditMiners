const AI_RISK_PROFILE_STATUS = {
  STARTED: "STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

const AI_RISK_PROFILE_ENDPOINTS = {
  START: "/start",
  QUESTIONS: "/questions",
  ANSWER: "/answer",
  COMPLETE: "/complete",
  LATEST: "/latest",
  HISTORY: "/history",
  PERSONA: "/persona",
  EXPLANATION: "/explanation",
};

module.exports = {
  AI_RISK_PROFILE_STATUS,
  AI_RISK_PROFILE_ENDPOINTS,
};