const path = require('path');
const { writeFile, readFile } = require('fs').promises;
const { readFileSync } = require('fs');

const tours = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    'utf8'
  )
);

const getTours = async () => {
  try {
    const tours = JSON.parse(
      await readFile(
        path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
        'utf8'
      )
    );
    return tours;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllTours = async (req, res) => {
  // const tours = await getTours();
  res.status(200).json({
    status: 'success',
    timeStamp: req.timeStamp,
    data: {
      tours,
    },
  });
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid, Body does not contain either name or price',
    });
  }
  next();
};
const createTour = async (req, res) => {
  // const tours = await getTours();
  try {
    const body = req.body;
    const id = Number(tours.length);
    const newTour = {
      id,
      ...body,
    };

    await writeFile(
      path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
      JSON.stringify([...tours, newTour])
    );
    res.status(201).json({
      status: 'success',
      timeStamp: req.timeStamp,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'failed',
      message: 'internal server error ',
    });
  }
};

const checkId = async (req, res, next, value) => {
  // const tours = await getTours();
  const tour = tours.find((el) => el.id === Number(value));
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  next();
};

const getTour = async (req, res) => {
  // const tours = await getTours();
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const updateTour = async (req, res) => {
  // get tour to update
  // mutate tour
  // rewrite tour file
  try {
    // const tours = getTours();
    const id = Number(req.params.id);
    const newTours = tours.map((el) => {
      if (el.id === id) {
        const newTour = {
          ...el,
          ...req.body,
        };
        console.log(newTour);
        return newTour;
      }
      return el;
    });

    await writeFile(
      path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
      JSON.stringify(newTours)
    );

    res.status(201).json({
      status: 'success',
      timeStamp: req.timeStamp,
      data: {
        tour: newTours,
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
    const newTours = tours.filter((el, index) => {
      console.log(index, 'id : ', id, el.id === id);
      if (el.id !== id) {
        return el;
      }
    });
    await writeFile(
      path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
      JSON.stringify(newTours)
    );
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
  checkId,
  getAllTours,
  createTour,
  checkBody,
  getTour,
  updateTour,
  deleteTour,
};
