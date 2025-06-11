const express = require("express");
const router = express.Router();
const {
    createKPI, getKPIs, getFreqs, 
    getKPI_id,deleteKPI_id, editKPI, addKPIValue, 
    getKPIValue,getKPIValueForKPI,
    editKPIValue,deleteKPIValue,

    addKPIPeriod,
    editKPIPeriod,
    deleteKPIPeriod,deleteKPIPeriodForce,
    getKPIPeriod
} = require('../controllers/kpiController')

router.get('/', getKPIs)
router.get('/freq', getFreqs)
router.get('/id/:kpi_id', getKPI_id)
router.post('/', createKPI)
router.patch('/id/:kpi_id', editKPI)
router.delete('/id/:kpi_id', deleteKPI_id)

router.post('/value', addKPIValue);
router.get('/value/id/:id', getKPIValue);
router.patch('/value/id/:id', editKPIValue);
router.delete('/value/id/:id', deleteKPIValue);

router.post('/period', addKPIPeriod);
router.get('/period/id/:id', getKPIPeriod);
router.patch('/period/id/:id', editKPIPeriod);
router.delete('/period/id/:id', deleteKPIPeriod);
router.delete('/period/id/:id/force', deleteKPIPeriodForce);

router.get('/value/kpi/:kpi_id',getKPIValueForKPI)
module.exports = router;