const express = require("express");
const router = express.Router();
const {
    createKPI, getKPIs
} = require('../controllers/kpiController')

router.get('/', getKPIs)
router.get('/:kpi_id', (req, res) => {

})
router.post('/', createKPI)
// router.patch('/:kpi_id')

module.exports = router;