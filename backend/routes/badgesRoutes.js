const express = require("express");
const router = express.Router();
const { createBadge, getParticularemployeebadges, getpartcularemployeecount, getallbadges } = require("../controllers/Badges/CreateBadgeController");
router.post("/create-badge", createBadge)
router.get("/get-employee-badge/:employee_id", getParticularemployeebadges)
router.get("/get-badge-count/:employee_id",getpartcularemployeecount )
router.get("/get-all-badges/:employee_id", getallbadges)
module.exports = router;