const express = require('express');
const reviewController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');
const router = express.Router({mergeParams: true});



router.route('/').get(reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'), reviewController.createReview);
//router.route(':').update(reviewController.updateReview)

module.exports =router;