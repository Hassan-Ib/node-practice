const Tours = require('./../models/tourModel');

// const checkId = async (req, res, next, value) => {
//  const tours = await getTours();
//  const tour = tours.find((el) => el.id === Number(value));
//   if (!tour) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };

// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid, Body does not contain either name or price',
//     });
//   }
//   next();
// };

const getAllTours = async (req, res) => {
  // const tours = await getTours();
  try {
    const tours = await Tours.find();
    res.status(200).json({
      status: 'success',
      timeStamp: req.timeStamp,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  // const tours = await getTours();
  try {
    const body = req.body;
    const newTour = await Tours.create(req.body);

    res.status(201).json({
      status: 'success',
      timeStamp: req.timeStamp,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tours.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};
const updateTour = async (req, res) => {
  try {
    // const tours = getTours();
    const id = Number(req.params.id);

    res.status(201).json({
      status: 'success',
      timeStamp: req.timeStamp,
      data: {
        // tour: newTours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'internal server error ',
    });
  }
};

// delete tour
const deleteTour = async (req, res) => {
  // const tours = getTours();
  try {
    const id = Number(req.params.id);

    res.status(201).json({
      status: 'success',
      message: 'tour deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(505).json({
      status: 'failed',
      message: 'internal error',
    });
  }
};
module.exports = {
  // checkId,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
