const assessmentSessionService =
    require("./assessmentLifecycle.service");
const dynamicQuestionService =
    require("./question.service");
const answerValidationService = require("./answerValidation.service");
const assessmentHistoryService = require("./assessmentHistory.service");
const investorPersonaService = require("./investorPersona.service");
const explainabilityService = require("./explainability.service");

class AIRiskProfileService {
  async startAssessment(userId) {
    return assessmentSessionService.createSession(userId);
  }

  async getQuestions(sessionId) {
    return dynamicQuestionService.getNextQuestions(sessionId);
  }

  async submitAnswer(sessionId, payload) {
    return answerValidationService.submitAnswer(
      sessionId,
      payload
    );
  }

  async completeAssessment(sessionId) {
    await assessmentSessionService.completeSession(sessionId);

    await assessmentHistoryService.createSnapshot(
      sessionId
    );

    return {
      completed: true,
    };
  }

  async getLatestProfile(userId) {
    return assessmentHistoryService.getLatestSnapshot(
      userId
    );
  }

  async getHistory(userId) {
    return assessmentHistoryService.getHistory(
      userId
    );
  }

  async getPersona(userId) {
    return investorPersonaService.getLatestPersona(
      userId
    );
  }

  async getExplanation(sessionId) {
    return explainabilityService.generateExplanation(
      sessionId
    );
  }
}

module.exports = new AIRiskProfileService();