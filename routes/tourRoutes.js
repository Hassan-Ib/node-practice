const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
} = require('../controllers/tourController');
// url with parameters needs to be with :value
// to make a parameter optional we add ? at the param to be optonal
// post : to create a new tour

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
