const express = require("express");
const router = express.Router();

const { 
    pieGraph_desg_completion, 
    barGraph_kpi, allKpiEmp, 
    getLineEmpYrMnt,
    getLineEmpYr,
    getLineEmpYrQtr,
    getLineEmpWeek
} = require('../controllers/graphController');

router.get('/desg/:desg_id/pie', pieGraph_desg_completion);
// router.get('/desg/:desg_id/pie/color', pieGraph_desg_color);
router.get('/kpi/:kpi_id', barGraph_kpi);
router.get('/emp/:emp_id', allKpiEmp);
router.get('/emp/:emp_id/freq/:freq_id/yr/:year/', getLineEmpYr);
router.get('/emp/:emp_id/freq/:freq_id/yr/:year/qtr/:quarter', getLineEmpYrQtr);
router.get('/emp/:emp_id/freq/:freq_id/yr/:year/mnt/:month', getLineEmpYrMnt);
router.get('/emp/:emp_id/freq/:freq_id/start/:start_date',getLineEmpWeek);
// http://localhost:5000/api/graph/emp/123/freq/1/yr/2025/mnt/0

module.exports = router;