const express = require("express");
const {
  createEmployeeController,
  getEmployeeController,
  editEmployee,
  changeEmployeeStatus,
} = require("../controllers/createmployeecontroller");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createemployee", upload.single('image'), createEmployeeController);
router.get("/getemployee", getEmployeeController);
router.patch("/changeemployeestatus", changeEmployeeStatus);
router.patch('/editemployee/:emp_id', editEmployee)
module.exports = router;