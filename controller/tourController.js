const path = require('path');
const { readFileSync, writeFile } = require('fs');
const tours = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    'utf8'
  )
);

const getAllTours = (req, res) => {
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
const createTour = (req, res) => {
  const body = req.body;
  const id = Number(tours.length);
  const newTour = {
    id,
    ...body,
  };

  writeFile(
    path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    JSON.stringify([...tours, newTour]),
    'utf8',
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          message: 'internal server error ',
        });
      }

      res.status(201).json({
        status: 'success',
        timeStamp: req.timeStamp,
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const checkId = (req, res, next, value) => {
  const isValueNaN = Number.isNaN(Number(value));
  if (isValueNaN || Number(value) > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  next();
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const updateTour = (req, res) => {
  // get tour to update
  // mutate tour
  // rewrite tour file
  const id = Number(req.params.id);
  const newTours = tours.map((el) => {
    if (el.id === id) {
      newTour = {
        ...el,
        ...req.body,
      };
      return newTour;
    }
    return el;
  });

  writeFile(
    path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(newTours),
    'utf8',
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          message: 'internal server error ',
        });
      }

      res.status(201).json({
        status: 'success',
        timeStamp: req.timeStamp,
        data: {
          tour: newTours,
        },
      });
    }
  );
};

// delete tour
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const newTours = tours.filter((el, index) => {
    console.log(index, 'id : ', id, el.id === id);
    if (el.id !== id) {
      return el;
    }
  });
  writeFile(
    path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(newTours),
    'utf8',
    (err) => {
      if (err) {
        return res.status(505).json({
          status: 'failed',
          message: 'internal error',
        });
      }
      res.status(201).json({
        status: 'success',
        message: 'tour deleted',
      });
    }
  );
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
