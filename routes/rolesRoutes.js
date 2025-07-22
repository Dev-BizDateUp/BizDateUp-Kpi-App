const express = require("express");
const router = express.Router();
const {
    getAllRoles,getRoleInfo
} = require('../controllers/rolesController.js')
router.get('/', getAllRoles);
router.get('/id/:id', getRoleInfo);

module.exports = router;
