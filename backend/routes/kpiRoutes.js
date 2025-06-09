const express = require("express");
const router = express.Router();
const {
    createKPI, getKPIs, getFreqs, getKPI_id
} = require('../controllers/kpiController')

router.get('/', getKPIs)
router.get('/freq', getFreqs)
router.get('/id/:kpi_id', getKPI_id)
router.post('/', createKPI)
// router.patch('/:kpi_id')

module.exports = router;