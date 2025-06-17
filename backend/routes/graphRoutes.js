const express = require("express");
const router = express.Router();

const { pieGraph_desg_completion, pieGraph_desg_color, barGraph_kpi } = require('../controllers/graphController');

router.get('/desg/:desg_id/pie', pieGraph_desg_completion);
router.get('/desg/:desg_id/pie/color', pieGraph_desg_color);
router.get('/kpi/:kpi_id', barGraph_kpi);


module.exports = router;