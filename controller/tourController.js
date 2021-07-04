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
  // querying bool ex from req ?key[gte|gt|lte|lt]=value => {key : {gte : value}}
  try {
    //BUILDING QUERY
    const queryObj = { ...req.query };
    const excludeQuery = ['page', 'limit', 'sort', 'fields'];
    excludeQuery.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(req.query, JSON.parse(queryStr));

    const query = Tours.find(JSON.parse(queryStr));
    // const query = Tours.find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('duration')
    //   .equals(5);

    // EXECUTE QUERY
    const tours = await query;

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
    const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      timeStamp: req.timeStamp,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

// delete tour
const deleteTour = async (req, res) => {
  try {
    await Tours.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(505).json({
      status: 'failed',
      message: error,
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
