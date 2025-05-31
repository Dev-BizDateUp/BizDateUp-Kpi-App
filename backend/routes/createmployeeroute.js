const express = require("express");
const { createEmployeeController, getEmployeeController,changeEmployeeStatus } = require("../controllers/createmployeecontroller");
const router = express.Router();

router.post("/createemployee", createEmployeeController);
router.get("/getemployee", getEmployeeController);
router.patch("/changeemployeestatus", changeEmployeeStatus);

module.exports = router;
