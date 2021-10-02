const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTopCheap,
  getToursStats,
  getMonthlyPlans,
} = require('../controller/tourController');
const authController = require('../controller/authController');

const router = express.Router();
// if by chance a parameter of id was passed to the url then check if data of the is available
// router.param('id', checkId); // supply the param you want to check
// alias route
router.route('/top-5-cheap').get(getTopCheap, getAllTours);
router.route('/tours-stats').get(getToursStats);
router.route('/monthly-plans/:year').get(getMonthlyPlans);
router.route('/').get(authController.protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
