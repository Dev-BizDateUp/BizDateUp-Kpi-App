const express = require("express");
const {
  createEmployeeController,
  getEmployeeController,
  editEmployee,
  changeEmployeeStatus,
  getEmployeeIDController,
  getBadgeEmployeesController
} = require("../controllers/createmployeecontroller");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createemployee", upload.single('image'), createEmployeeController);
router.get("/getemployee", getEmployeeController);
router.get("/badgeemp", getBadgeEmployeesController);
router.get("/employee/id/:id", getEmployeeIDController)
router.patch("/changeemployeestatus", changeEmployeeStatus);
router.patch('/editemployee/:emp_id', upload.single('image'), editEmployee)
module.exports = router;