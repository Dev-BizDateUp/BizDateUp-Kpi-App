const express = require("express");
const router = express.Router();
const { createBadge } = require("../controllers/Badges/CreateBadgeController");
router.post("/create-badge", createBadge)
// router.get("/get-employee-badge/:employee_id")
module.exports = router;