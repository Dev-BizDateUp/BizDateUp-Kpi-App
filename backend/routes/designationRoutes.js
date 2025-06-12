const express = require("express");
const {
  createDesignationController,
  getDesignationController,getDesignationID
} = require("../controllers/createdesignationcontroller");
const router = express.Router();

router.post("/", createDesignationController);
router.get("/", getDesignationController);
router.get("/id/:id", getDesignationID);

module.exports = router;
