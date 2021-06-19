const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// standard; creating server ;
const app = express();

// MIDDLE WARES
// morgan is used to log current request info
app.use(morgan('dev'));

// added middleware to add body to request
app.use(express.json());

//  custom middleware

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  //next is necessary of the server will never respond
  next();
});

// middle ware to add timeStamp to the request

app.use((req, res, next) => {
  req.requestAt = new Date().toISOString();
  next();
});
// mounting routes to base route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
