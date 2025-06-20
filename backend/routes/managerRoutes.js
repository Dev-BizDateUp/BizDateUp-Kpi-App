const express = require('express');
const router = express.Router();

const {newManagerReview,getAllManagerReviews} = require('../controllers/managerController.js')

router.post('/review/',newManagerReview);
router.get('/review/',getAllManagerReviews);
module.exports = router;