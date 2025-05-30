const express = require("express");
const { createDepartmentsController } = require("../controllers/createdepartmentscontroller");
const router = express.Router();

router.post("/createdepartments", createDepartmentsController);

module.exports = router;
