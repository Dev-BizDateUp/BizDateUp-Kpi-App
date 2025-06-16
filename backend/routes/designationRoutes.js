const express = require("express");
const {
  createDesignationController,
  getDesignationController,getDesignationID,getDesignationEmployees
} = require("../controllers/createdesignationcontroller");
const router = express.Router();

router.post("/", createDesignationController);
router.get("/", getDesignationController);
router.get("/id/:id", getDesignationID);
router.get("/id/:id/emps", getDesignationEmployees);

module.exports = router;
