const express = require('express')
const router = express.Router()
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewsController');
const reviewRouter = require('../routes/reviewRoutes');


router.use('/:tourId/reviews', reviewRouter);
router.route('/').post(authController.protect, tourController.createTour)
router.route('/').get(authController.protect, tourController.getAllTours)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)
router.route('/getTourStats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
router.route('/:id').get(tourController.getTour)
router.route('/:id').patch(tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);


// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);




module.exports = router

