const express = require("express");
const {
  createDepartmentsController,
  getDepartmentsController,
  getDepartmentDetails,
} = require("../controllers/createdepartmentscontroller");
const router = express.Router();

router.post("/", createDepartmentsController);
router.get("/", getDepartmentsController);
router.get("/name/:name", getDepartmentDetails);

module.exports = router;
