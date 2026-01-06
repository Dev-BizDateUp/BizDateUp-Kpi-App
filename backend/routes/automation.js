const express = require("express");
const { daily_entries, get_daily_entries } = require("../controllers/Automation/AutomationController");
const router = express.Router();

router.post("/daily_entries",daily_entries);
router.get("/get_indiviual_entries",get_daily_entries);
module.exports = router;