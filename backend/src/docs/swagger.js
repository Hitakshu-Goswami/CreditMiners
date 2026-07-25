const swaggerUi = require("swagger-ui-express");

const definition = {
  openapi: "3.0.3",
  info: {
    title: "CreditMiners API",
    version: "1.0.0",
    description: "Current API contract. Phase 2 user-financial-identity endpoints require a Bearer access token unless noted.",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      SuccessResponse: { type: "object", properties: { success: { type: "boolean" }, message: { type: "string" }, data: {}, timestamp: { type: "string", format: "date-time" } } },
      FinancialProfileInput: { type: "object", properties: { occupation: { type: "string" }, employmentType: { type: "string", enum: ["STUDENT", "EMPLOYED", "SELF_EMPLOYED", "FREELANCER", "BUSINESS_OWNER", "UNEMPLOYED", "RETIRED"] }, monthlyIncome: { type: "number", minimum: 0 }, incomeFrequency: { type: "string", enum: ["WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY", "IRREGULAR"] }, monthlyExpenses: { type: "number", minimum: 0 }, savingsHabit: { type: "string", enum: ["NONE", "OCCASIONAL", "REGULAR", "AUTOMATED"] } } },
    },
  },
  paths: {
    "/users/me": {
      get: { summary: "Get current user profile", security: [{ bearerAuth: [] }], responses: { 200: { description: "Profile response" } } },
      patch: { summary: "Update current user personal profile", security: [{ bearerAuth: [] }], responses: { 200: { description: "Updated profile" } } },
    },
    "/users/me/financial-profile": { put: { summary: "Create or update financial identity", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FinancialProfileInput" } } } }, responses: { 200: { description: "Updated profile" } } } },
    "/users/me/profile-image": { put: { summary: "Set HTTPS profile image URL after direct upload", security: [{ bearerAuth: [] }], responses: { 200: { description: "Profile updated" } } }, delete: { summary: "Remove profile image reference", security: [{ bearerAuth: [] }], responses: { 200: { description: "Profile updated" } } } },
    "/users/me/email": { patch: { summary: "Request email change verification", security: [{ bearerAuth: [] }], responses: { 200: { description: "Verification requested" } } } },
    "/users/email/verify": { get: { summary: "Verify pending email change", parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" } }], responses: { 200: { description: "Email updated" } } } },
    "/users/me/phone": { patch: { summary: "Request phone-number verification", security: [{ bearerAuth: [] }], responses: { 200: { description: "Verification requested" } } } },
    "/users/phone/verify": { get: { summary: "Verify pending phone change", parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" } }], responses: { 200: { description: "Phone updated" } } } },
    "/users/me/preferences": { get: { summary: "Get preferences", security: [{ bearerAuth: [] }], responses: { 200: { description: "Preferences" } } }, put: { summary: "Update preferences", security: [{ bearerAuth: [] }], responses: { 200: { description: "Preferences" } } } },
    "/users/me/trust-profile": { get: { summary: "Get derived trust profile", security: [{ bearerAuth: [] }], responses: { 200: { description: "Trust profile" } } } },
    "/users/me/goals": { get: { summary: "List financial goals", security: [{ bearerAuth: [] }], responses: { 200: { description: "Goals" } } }, post: { summary: "Create financial goal", security: [{ bearerAuth: [] }], responses: { 201: { description: "Goal created" } } } },
    "/users/me/goals/{goalId}": { patch: { summary: "Update owned financial goal", security: [{ bearerAuth: [] }], responses: { 200: { description: "Goal updated" } } }, delete: { summary: "Archive owned financial goal", security: [{ bearerAuth: [] }], responses: { 200: { description: "Goal archived" } } } },
    "/admin/users": { get: { summary: "List users for admins", security: [{ bearerAuth: [] }], responses: { 200: { description: "Paginated users" }, 403: { description: "Admin role required" } } } },
    "/admin/users/analytics": { get: { summary: "Get user analytics for admins", security: [{ bearerAuth: [] }], responses: { 200: { description: "Analytics" } } } },
    "/admin/users/{userId}": { get: { summary: "Get user profile for admin", security: [{ bearerAuth: [] }], responses: { 200: { description: "User profile" } } }, delete: { summary: "Soft-delete user", security: [{ bearerAuth: [] }], responses: { 200: { description: "User deleted" } } } },
    "/admin/users/{userId}/ban": { patch: { summary: "Ban user", security: [{ bearerAuth: [] }], responses: { 200: { description: "User banned" } } } },
    "/admin/users/{userId}/suspend": { patch: { summary: "Suspend user", security: [{ bearerAuth: [] }], responses: { 200: { description: "User suspended" } } } },
    "/admin/users/{userId}/activate": { patch: { summary: "Activate user", security: [{ bearerAuth: [] }], responses: { 200: { description: "User activated" } } } },
    "/admin/users/{userId}/role": { patch: { summary: "Change user role", security: [{ bearerAuth: [] }], responses: { 200: { description: "Role updated" } } } },
  },
};

const swaggerSpec = definition;

module.exports = { swaggerSpec, swaggerUi };
