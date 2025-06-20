const AuditLog = require("../models/auditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    if (req.userRole !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await AuditLog.find()
      .populate("actor", "username")
      .sort({ timestamp: -1 })
      .limit(100);

    res.status(200).json({ message: "Audit logs fetched", logs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs", error: err.message });
  }
};