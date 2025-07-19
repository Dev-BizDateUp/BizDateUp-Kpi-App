const express = require("express");
const {
  createDesignationController,
  getDesignationController,
  getemployeesanddesignation,
} = require("../controllers/createdesignationcontroller");
const router = express.Router();

router.post("/createdesignation", createDesignationController);
router.get("/getdesignation", getDesignationController);
router.get("/getdesignationbyid", getemployeesanddesignation);

module.exports = router;
