const express = require("express");
const router = express.Router();
const { createBadge, getParticularemployeebadges, getpartcularemployeecount, getallbadges, getparticularempapprovedbadge, fetchallbadgesforadmin, getallbadgesforadmin, updateBadgeStatus } = require("../controllers/Badges/CreateBadgeController");
router.post("/create-badge", createBadge)
router.get("/get-employee-badge/:employee_id", getParticularemployeebadges)
router.get("/get-badge-count/:employee_id",getpartcularemployeecount )
router.get("/get-all-badges/:employee_id", getallbadges)
router.get("/get-approved-badge-count/:employee_id", getparticularempapprovedbadge)
// Admin Routes
router.get("/query", getallbadgesforadmin)
router.patch("/actions/:user_id", updateBadgeStatus)

module.exports = router;