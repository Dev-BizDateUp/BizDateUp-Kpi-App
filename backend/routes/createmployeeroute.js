const express = require("express");
const {
  createEmployeeController,
  getEmployeeController,
  changeEmployeeStatus,
  updateEmployee,
} = require("../controllers/createmployeecontroller");
const router = express.Router();

router.post("/createemployee", createEmployeeController);
router.get("/getemployee", getEmployeeController);
router.patch("/changeemployeestatus", changeEmployeeStatus);
router.patch("/editemployee/:id", updateEmployee);
module.exports = router;