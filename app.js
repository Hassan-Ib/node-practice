const express = require('express');
const path = require('path');
const { readFileSync, writeFile } = require('fs');
// standard; creating server ;
const app = express();
// added middlewire to add body to request
app.use(express.json());

//  custom middleware

app.use((req, res, next) => {
  console.log('ello from the middleware');
  //next is necessary of the server will never respond
  next();
});

// middle ware to add timeStamp to the request

app.use((req, res, next) => {
  req.requestAt = new Date().toISOString();
  next();
});

// url with parameters needs to be with :value
// to make a parameter optional we add ? at the param to be optonal
// post : to create a new tour

const tours = JSON.parse(
  readFileSync(
    path.resolve(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    'utf8'
  )
);

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
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};
// get tours
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const requestBody = req.body;
  console.log(requestBody);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(201).json({
    status: 'success',
    data: `<update tour...${id}>`,
  });
};
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// listening to servre
const port = 3000;
// notice that i dont have to specify locahost 127.0.0.1 in express // little abtraction is done here
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
