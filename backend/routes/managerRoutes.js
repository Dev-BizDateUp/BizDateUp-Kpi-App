const express = require('express');
const router = express.Router();

const {newManagerReview,getAllManagerReviews,getEmpManagerReviews,updateManagerReview} = require('../controllers/managerController.js')

router.post('/review/',newManagerReview);
router.patch('/review/:rev_id',updateManagerReview);
router.get('/review/',getAllManagerReviews);
router.get('/review/emp/:emp_id',getEmpManagerReviews);
module.exports = router;