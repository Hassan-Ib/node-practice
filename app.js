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

// ROUTE HANDLERS

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// STARTING SERVER
// listening to servre
const port = 3000;
// notice that i dont have to specify locahost 127.0.0.1 in express // little abtraction is done here
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
