const express = require("express");
const { createDesignationController, getDesignationController } = require("../controllers/createdesignationcontroller");
const router = express.Router();

router.post("/createdesignation", createDesignationController);
router.get("/getdesignation", getDesignationController);

module.exports = router;
