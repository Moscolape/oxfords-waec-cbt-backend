const AuditLog = require("../models/auditLog");

const logActivity = async ({ action, actorId, role, details }) => {
  try {
    await AuditLog.create({
      action,
      actor: actorId,
      role,
      details,
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

module.exports = logActivity;
