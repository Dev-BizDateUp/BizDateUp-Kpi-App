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
    getKPIS_Employee
} = require('../controllers/kpiController')

router.get('/', getKPIs)
router.get('/freq', getFreqs)
router.get('/emp/:emp_id',getKPIS_Employee)
router.get('/id/:kpi_id', getKPI_id)
router.get('/desg/:desg_id',getKPI_Desg)

router.post('/', createKPI)
router.patch('/id/:kpi_id', editKPI)
router.delete('/id/:kpi_id', deleteKPI_id)
router.delete('/id/:kpi_id/force', deleteKPI_idForce)

//kpi value routes
/**
 * @swagger
 * tags:
 *   name: KPI
 *   description: KPI management and operations
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all KPIs
 *     tags: [KPI]
 *     responses:
 *       200:
 *         description: List of KPIs
 */

/**
 * @swagger
 * /freq:
 *   get:
 *     summary: Get all frequencies
 *     tags: [KPI]
 *     responses:
 *       200:
 *         description: List of frequencies
 */

/**
 * @swagger
 * /emp/{emp_id}:
 *   get:
 *     summary: Get KPIs for an employee
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employee KPIs
 */

/**
 * @swagger
 * /id/{kpi_id}:
 *   get:
 *     summary: Get KPI by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: kpi_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI data
 */

/**
 * @swagger
 * /desg/{desg_id}:
 *   get:
 *     summary: Get KPIs by designation
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: desg_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of KPIs for designation
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new KPI
 *     tags: [KPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: KPI created
 */

/**
 * @swagger
 * /id/{kpi_id}:
 *   patch:
 *     summary: Edit a KPI
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: kpi_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: KPI updated
 */

/**
 * @swagger
 * /id/{kpi_id}:
 *   delete:
 *     summary: Delete a KPI
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: kpi_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI deleted
 */

/**
 * @swagger
 * /id/{kpi_id}/force:
 *   delete:
 *     summary: Force delete a KPI
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: kpi_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI force deleted
 */

/**
 * @swagger
 * /value:
 *   post:
 *     summary: Add a KPI value
 *     tags: [KPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: KPI value added
 */

/**
 * @swagger
 * /value/emp/{emp_id}:
 *   get:
 *     summary: Get KPI values for an employee
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of KPI values
 */

/**
 * @swagger
 * /value/emp/{emp_id}/row:
 *   get:
 *     summary: Get KPI data row for an employee
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI data row
 */

/**
 * @swagger
 * /value/id/{id}:
 *   get:
 *     summary: Get KPI value by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI value data
 */

/**
 * @swagger
 * /value/id/{id}:
 *   patch:
 *     summary: Edit KPI value by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: KPI value updated
 */

/**
 * @swagger
 * /value/id/{id}:
 *   delete:
 *     summary: Delete KPI value by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI value deleted
 */

/**
 * @swagger
 * /value/kpi/{kpi_id}:
 *   get:
 *     summary: Get KPI values for a KPI
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: kpi_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of KPI values for KPI
 */

/**
 * @swagger
 * /entry/:
 *   post:
 *     summary: Add a new entry
 *     tags: [KPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Entry added
 */

/**
 * @swagger
 * /period:
 *   get:
 *     summary: Get all periods
 *     tags: [KPI]
 *     responses:
 *       200:
 *         description: List of periods
 */

/**
 * @swagger
 * /period:
 *   post:
 *     summary: Add a KPI period
 *     tags: [KPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: KPI period added
 */

/**
 * @swagger
 * /period/id/{id}:
 *   get:
 *     summary: Get KPI period by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI period data
 */

/**
 * @swagger
 * /period/id/{id}:
 *   patch:
 *     summary: Edit KPI period by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: KPI period updated
 */

/**
 * @swagger
 * /period/id/{id}:
 *   delete:
 *     summary: Delete KPI period by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI period deleted
 */

/**
 * @swagger
 * /period/id/{id}/force:
 *   delete:
 *     summary: Force delete KPI period by ID
 *     tags: [KPI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KPI period force deleted
 */
router.post('/value', addKPIValue);
router.get('/value/emp/:emp_id',getEmployeeKPIData)
router.get('/value/emp/:emp_id/row',getEmployeeKPIDataRow)
router.get('/value/id/:id', getKPIValue);
router.patch('/value/id/:id', editKPIValue);
router.delete('/value/id/:id', deleteKPIValue);
router.get('/value/kpi/:kpi_id',getKPIValueForKPI)

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
