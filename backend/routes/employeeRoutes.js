const express = require("express");
const router = express.Router();
const {
    createEmployeeController,
    getEmployeeController,
    changeEmployeeStatus,
} = require("../controllers/createmployeecontroller");

router.get('/', getEmployeeController)
router.post('/', createEmployeeController)

module.exports = router