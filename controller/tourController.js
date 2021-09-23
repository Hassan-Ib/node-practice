const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTopCheap = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  // req.query.fields = "-v"
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

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

exports.getTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};

// delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
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
// aggregation pipeline [{},{}]
exports.getToursStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(505).json({
      success: false,
      message: error,
    });
  }
};
// aggregation pipeline [{},{}] 2
exports.getMonthlyPlans = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(505).json({
      success: false,
      message: error,
    });
  }
};
