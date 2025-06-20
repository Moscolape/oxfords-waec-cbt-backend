const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../controllers/auditController");
const { isAuthenticated } = require("../middleware/auth");

const allowPrincipalOnly = (req, res, next) => {
  if (req.userRole !== "principal") {
    return res.status(403).json({ message: "Access denied. Principal only." });
  }
  next();
};

router.get("/audit-logs", isAuthenticated, allowPrincipalOnly, getAuditLogs);

module.exports = router;
