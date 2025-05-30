const express = require("express");
const { createDesignationController } = require("../controllers/createdesignationcontroller");
const router = express.Router();

router.post("/createdesignation", createDesignationController);

module.exports = router;
