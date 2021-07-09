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
  try {
    //COMMON PRACTICE OF querying with bool with exp from req
    // /tours?key[gte|gt|lte|lt]=value&price=200 => {key : {gte : value}, price : 200}
    //BUILDING BASIC QUERY WITHOUT THE SPECIAL FIELDS
    const queryObj = { ...req.query }; //shallow copy
    const excludeQuery = ['page', 'limit', 'sort', 'fields']; // fileds to be on the look out for
    excludeQuery.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    // MUTATING QUERY
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // get query from db;
    let query = Tours.find(JSON.parse(queryStr));

    //2) Sort
    if (req.query.sort) {
      // get field/fields to sort with e.g price,-rating => "price -rating"
      let sortQuery = req.query.sort.split(',').join(' ');
      //check if it as ascending or descending ordder
      query.sort(sortQuery);
    } else {
      query.sort('-createdAt');
    }
    //3) Field
    if (req.query.fields) {
      const fieldsQuery = req.query.fields.split(',').join(' ');
      console.log(fieldsQuery);
      query.select(fieldsQuery);
    }
    query.select('-__v');

    //4) Pagination  //.skip().limit()

    let { limit, page } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 100;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberOfDoc = await Tours.countDocuments();
      console.log(numberOfDoc, skip);
      if (skip >= numberOfDoc) throw new Error("This page doesn't exist");
    }

    // const query = Tours.find()'
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
