const express = require("express");
const router = express.Router();
const {
    createEmployeeController,
    getEmployeeController,
    editEmployee,
    changeEmployeeStatus,
} = require("../controllers/createmployeecontroller");
const multer = require('multer');

// use memory storage to access image as a buffer (needed for Supabase upload)
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getEmployeeController)
router.post('/', createEmployeeController)
router.patch('/id/:id', editEmployee)
module.exports = router