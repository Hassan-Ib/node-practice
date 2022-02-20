const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTopCheap = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  // req.query.fields = "-v"
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();
  // EXECUTE QUERY
  const tours = await features.query;
  return res.status(200).json({
    status: 'success',
    timeStamp: req.timeStamp,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  return res.status(201).json({
    status: 'success',
    timeStamp: req.timeStamp,
    data: {
      tour: newTour,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tourID = req.params.id;
  const tour = await Tour.findById(tourID);

  if (!tour) {
    next(new AppError('No tour found with this id ${tourID}', 404));
  }
  // console.log(tour);

  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with this id ${tourID}', 404));
  }
  return res.status(201).json({
    status: 'success',
    timeStamp: req.timeStamp,
    data: {
      tour,
    },
  });
});

// delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with this id ${tourID}', 404));
  }
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
// aggregation pipeline [{},{}]
exports.getToursStats = catchAsync(async (_, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        numRating: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        numPrice: { $sum: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: {
      stats,
    },
  });
});
// aggregation pipeline [{},{}] 2
exports.getMonthlyPlans = catchAsync(async (req, res, next) => {
  const { year } = req.params;
  const stats = await Tour.aggregate([
    {
      // using data in startDate array to spread the doc.
      $unwind: '$startDates',
    },
    {
      // selecting dates that are with specified year frame
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      // creating new data by grouping
      $group: {
        // using start dates as id
        _id: { $month: '$startDates' },
        // number of tours that starts at the same date
        numTours: { $sum: 1 },
        // names of the tours in the same group
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: {
        // adding a field of month using id
        month: '$_id',
      },
    },
    {
      $project: {
        // removing id field
        _id: 0,
      },
    },
    {
      // sort pipeline by month(originaly startDate)
      $sort: { month: 1 },
    },
  ]);
  return res.status(200).json({
    success: true,
    num: stats.length,
    data: {
      stats,
    },
  });
});
