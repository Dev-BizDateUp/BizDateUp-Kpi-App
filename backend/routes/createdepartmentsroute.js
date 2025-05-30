const express = require("express");
const { createDepartmentsController, getDepartmentsController } = require("../controllers/createdepartmentscontroller");
const router = express.Router();

router.post("/createdepartments", createDepartmentsController);
router.get("/getdepartments", getDepartmentsController);

module.exports = router;    