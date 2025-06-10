const express = require("express");
const router = express.Router();
const {
    createEmployeeController,
    getEmployeeController,
    editEmployee,
    changeEmployeeStatus,
} = require("../controllers/createmployeecontroller");

router.get('/', getEmployeeController)
router.post('/', createEmployeeController)
router.patch('/id/:emp_id',editEmployee)
module.exports = router