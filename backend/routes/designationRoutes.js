const express = require("express");
const {
  createDesignationController,
  getDesignationController,
} = require("../controllers/createdesignationcontroller");
const router = express.Router();

router.post("/", createDesignationController);
router.get("/", getDesignationController);

module.exports = router;
