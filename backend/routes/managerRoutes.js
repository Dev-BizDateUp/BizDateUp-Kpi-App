const express = require('express');
const router = express.Router();

const {newManagerReview,getAllManagerReviews,updateManagerReview} = require('../controllers/managerController.js')

router.post('/review/',newManagerReview);
router.patch('/review/:rev_id',updateManagerReview);
router.get('/review/',getAllManagerReviews);
module.exports = router;