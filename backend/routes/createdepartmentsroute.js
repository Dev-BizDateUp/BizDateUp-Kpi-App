const express = require("express");
const {
  createDepartmentsController,
  getDepartmentsController,
  getDepartmentDetails,
} = require("../controllers/createdepartmentscontroller");
const router = express.Router();

router.post("/createdepartments", createDepartmentsController);
router.get("/getdepartments", getDepartmentsController);
router.get("/:name/getdepartmentsdetails", getDepartmentDetails);

module.exports = router;
