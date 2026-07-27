const { param } = require("express-validator");

const {
  DOMAIN_TYPES,
} = require("../constants/assessmentDomains");

class DomainValidator {
  getAssessmentProfile() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),
    ];
  }

  getDomainProfile() {
    return [
      param("sessionId")
        .trim()
        .notEmpty()
        .withMessage("Session ID is required.")
        .isUUID()
        .withMessage("Invalid session ID."),

      param("domainKey")
        .trim()
        .notEmpty()
        .withMessage("Domain key is required.")
        .isIn(Object.values(DOMAIN_TYPES))
        .withMessage("Invalid domain key."),
    ];
  }

  getAllDomains() {
    return [];
  }

  getDomain() {
    return [
      param("domainKey")
        .trim()
        .notEmpty()
        .withMessage("Domain key is required.")
        .isIn(Object.values(DOMAIN_TYPES))
        .withMessage("Invalid domain key."),
    ];
  }
}

module.exports = new DomainValidator();