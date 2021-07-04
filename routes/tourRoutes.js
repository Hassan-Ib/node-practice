const express = require('express');
const {
  getAllTours,
  createTour,
  // checkBody,
  getTour,
  updateTour,
  deleteTour,
  // checkId,
} = require('../controller/tourController');

const router = express.Router();
// if by chance a parameter of id was passed to the url then check if data of the is available
// router.param('id', checkId); // supply the param you want to check
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
