const express = require("express");
const { createEmployeeController, getEmployeeController } = require("../controllers/createmployeecontroller");
const router = express.Router();

router.post("/createemployee", createEmployeeController);
router.get("/getemployee", getEmployeeController);

module.exports = router;
