const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const morgan = require('morgan');

// creating a server

const app = express();
// want  my app req to have body

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// to parse form data to the req body
app.use(express.urlencoded({ extended: false }));
// to parse post json data to reqbody
app.use(express.json());

app.use((req, res, next) => {
  req.timeStamp = new Date().toISOString();

  // console.log(req.headers);
  next();
});

// tour router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // 404 : not found
  //  XXX: 404 : not found
});

app.use(globalErrorHandler);
module.exports = app;
