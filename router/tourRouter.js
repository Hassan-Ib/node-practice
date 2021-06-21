const express = require('express');
const {
  getAllTours,
  createTour,
  checkBody,
  getTour,
  updateTour,
  deleteTour,
  checkId,
} = require('../controller/tourController');

const router = express.Router();
router.param('id', checkId); // supply the param you want to check
router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
