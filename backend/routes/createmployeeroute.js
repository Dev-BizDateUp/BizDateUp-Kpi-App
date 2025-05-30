const express = require("express");
const { createEmployeeController } = require("../controllers/createmployeecontroller");
const router = express.Router();

router.post("/createemployee", createEmployeeController);

module.exports = router;
