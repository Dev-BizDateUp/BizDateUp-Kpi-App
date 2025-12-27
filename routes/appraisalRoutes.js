const express = require("express");
const router = express.Router();
const {getAllAppraisals,createAppraisal,editAppraisal,getAppraisal_ID,getAppraisal_Employee} = require('../controllers/appraisalController')

router.get('/', getAllAppraisals);
router.post('/', createAppraisal);
router.patch('/:id',editAppraisal);
router.get('/id/:id', getAppraisal_ID);
router.get('/emp/:emp_id', getAppraisal_Employee);

module.exports = router;
