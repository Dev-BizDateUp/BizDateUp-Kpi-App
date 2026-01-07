const express = require("express");
const { daily_entries, get_daily_entries, get_weekly_entries_for_manager } = require("../controllers/Automation/AutomationController");
const router = express.Router();

router.post("/daily_entries",daily_entries);
router.get("/get_indiviual_entries",get_daily_entries);
router.get("/get_weekly_entries_for_manager/:emp_id/:month/:year",get_weekly_entries_for_manager);
module.exports = router;