const express = require('express');
const tourRouter = require('./router/tourRouter');
const userRouter = require('./router/userRouter');
// creating a server
const morgan = require('morgan');

const app = express();
// want  my app req to have body

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.timeStamp = new Date().toISOString();
  next();
});

// tour router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
module.exports = app;
