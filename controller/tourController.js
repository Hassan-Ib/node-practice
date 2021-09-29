const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTopCheap = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  // req.query.fields = "-v"
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();
  // EXECUTE QUERY
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    timeStamp: req.timeStamp,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    timeStamp: req.timeStamp,
    data: {
      tour: newTour,
    },
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tourID = req.params.id;
  console.log(tourID);
  const tour = await Tour.findById(tourID);
  // console.log(tour);
  if (!tour) {
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
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
});

// delete tour
exports.deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
// aggregation pipeline [{},{}]
exports.getToursStats = catchAsync(async (req, res) => {
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

  res.status(200).json({
    success: true,
    data: {
      stats,
    },
  });
});
// aggregation pipeline [{},{}] 2
exports.getMonthlyPlans = catchAsync(async (req, res) => {
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
  res.status(200).json({
    success: true,
    num: stats.length,
    data: {
      stats,
    },
  });
});
