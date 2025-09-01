const express = require("express");
const router = express.Router();
const { createBadge, getParticularemployeebadges, getpartcularemployeecount, getallbadges, getparticularempapprovedbadge } = require("../controllers/Badges/CreateBadgeController");
router.post("/create-badge", createBadge)
router.get("/get-employee-badge/:employee_id", getParticularemployeebadges)
router.get("/get-badge-count/:employee_id",getpartcularemployeecount )
router.get("/get-all-badges/:employee_id", getallbadges)
router.get("/get-approved-badge-count/:employee_id", getparticularempapprovedbadge)
module.exports = router;