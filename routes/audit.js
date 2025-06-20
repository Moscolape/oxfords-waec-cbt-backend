const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../controllers/auditController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/audit-logs", isAuthenticated, getAuditLogs);

module.exports = router;
