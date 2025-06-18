const express = require("express");
const router = express.Router();

const { pieGraph_desg_completion, pieGraph_desg_color, barGraph_kpi,allKpiEmp } = require('../controllers/graphController');

router.get('/desg/:desg_id/pie', pieGraph_desg_completion);
router.get('/desg/:desg_id/pie/color', pieGraph_desg_color);
router.get('/kpi/:kpi_id', barGraph_kpi);
router.get('/emp/:emp_id',allKpiEmp);


module.exports = router;