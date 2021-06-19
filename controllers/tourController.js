const path = require('path');
const { readFileSync, writeFile } = require('fs');

const tours = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../dev-data', 'data', 'tours-simple.json'),
    'utf8'
  )
);

const checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  next();
};
const checkBody = (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'bady request, no name or price property',
    });
  }
  next();
};
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    timeStamp: req.requestAt,
    data: {
      tours,
    },
  });
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  };
  tours.push(newTour);
  writeFile(
    path.resolve(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      // 200 means okay, 201 means successfully written
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};
// get tours
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  res.status(201).json({
    status: 'success',
    data: `<update tour...${id}>`,
  });
};
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  checkId,
  checkBody,
};
