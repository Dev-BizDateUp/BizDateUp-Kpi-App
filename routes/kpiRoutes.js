const express = require("express");
const router = express.Router();
const {
    createKPI, getKPIs, getFreqs, 
    getKPI_id,deleteKPI_id, editKPI, addKPIValue, 
    getKPIValue,getKPIValueForKPI,
    editKPIValue,deleteKPIValue,

    addKPIPeriod,getAllPeriods,
    editKPIPeriod,
    deleteKPIPeriod,deleteKPIPeriodForce,
    getKPIPeriod,deleteKPI_idForce,
    getKPI_Desg,
    addNewEntry,
    getEmployeeKPIDataRow,
    getEmployeeKPIData,
    getKPIS_Employee,
    getAllValueForKPI,
    getAllValueForKPIForEmp,
    edit_per_employee_kpi_value
} = require('../controllers/kpiController')

router.get('/', getKPIs)
router.get('/freq', getFreqs)
router.get('/emp/:emp_id',getKPIS_Employee)
router.get('/id/:kpi_id', getKPI_id)
router.get('/desg/:desg_id',getKPI_Desg)

router.post('/', createKPI)
router.patch('/id/:kpi_id/', editKPI) 
router.patch('/:kpi_id/kpi', edit_per_employee_kpi_value)
router.delete('/id/:kpi_id', deleteKPI_id)
router.delete('/id/:kpi_id/force', deleteKPI_idForce)

router.post('/value', addKPIValue);
router.get('/value/emp/:emp_id',getEmployeeKPIData)
router.get('/value/emp/:emp_id/row',getEmployeeKPIDataRow)
router.get('/value/id/:id', getKPIValue);
router.patch('/value/id/:id', editKPIValue);
router.delete('/value/id/:id', deleteKPIValue);
router.get('/value/kpi/:kpi_id',getKPIValueForKPI)
router.get('/value/all/kpi/:kpi_id',getAllValueForKPI);
router.get('/value/all/kpi/:kpi_id/emp/:emp_id',getAllValueForKPIForEmp);

router.post('/entry/',addNewEntry);

router.get('/period',getAllPeriods)
router.post('/period', addKPIPeriod);
router.get('/period/id/:id', getKPIPeriod);
router.patch('/period/id/:id', editKPIPeriod);
router.delete('/period/id/:id', deleteKPIPeriod);
router.delete('/period/id/:id/force', deleteKPIPeriodForce);

module.exports = router;


// /* Data For Weekly */

// width: 1166px;
// height: 926px;

// background: #FFFFFF;
// border-radius: 27px;

// /* Inside auto layout */
// flex: none;
// order: 4;
// flex-grow: 0;
