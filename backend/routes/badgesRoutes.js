const express = require("express");
const router = express.Router();
const { createBadge, getParticularemployeebadges } = require("../controllers/Badges/CreateBadgeController");
router.post("/create-badge", createBadge)
router.get("/get-employee-badge/:employee_id", getParticularemployeebadges)
module.exports = router;