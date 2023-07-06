const express = require('express')
const tourRouter = express.Router()
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController');

tourRouter.route('/').get(authController.protect, tourController.getAllTours)
tourRouter.route('/').post(tourController.createTour)
tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)
tourRouter.route('/getTourStats').get(tourController.getTourStats)
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
tourRouter.route('/:id').get(tourController.getTour)
tourRouter.route('/:id').patch(tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)


module.exports = tourRouter

