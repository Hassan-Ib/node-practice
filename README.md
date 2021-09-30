# Server side programming (Backend)

## Node and its basic modules

### fs (fileSystem) to read files from system

```javascript
   const fs = require('fs);
```

fs has both synchronious method and asynchronious methods

sync fs

```javascript
const { writeFileSync, readFileSync } = require('fs');
```

readFileSync takes file path and file encoding type as parameters and returns a string

```javascript
const file = readFileSync(filepath, 'utf8');
```

writeFileSync takes
async fs

```javascript
const { writeFile, readFile } = require('fs');
```

writeFile

```javascript
//async return a promise which can be chained with .then and .catch or used with async await
const {writeFile} = require('fs').promises;
//use
writeFile('filePath', 'stringToWrite', encodingMethod : utf8) : string
.then(('string')=>{
console.log(string)
})
.catch((err)=>{
   console.log(err)
})
```

readFile

```javascript
//async return a promise which can be chained with .then and .catch or used with async await
const {readFile} = require('fs').promises
readFile('filePath', encodingMethod : utf8) : string
.then(('string')=>{
console.log(string)
})
.catch((err)=>{
   console.log(err)
})
```

## path

global \_\_dirname that returns current path

### Using Path Methods

```javascript
const path = require('path');

//1 path.join() : takes strings of filenames,join em and returns path
//2 path.resolve() : : takes strings of filenames,join em and returns path
```

## http

### http.createServer().listen(port)

## event

## express

### express.Router

```javascript
// in user.js
const express = require('express');

const router = express.Router();

// absolute path here means the path after port

router.route('/').get(getHandler).post(callback);

// using the router as middleware

app.use('api/v1/users', router);
```

### app.listen(port, callback)

### express middlewares

# MongoDB

1. Add mongoDB file to path
2. start server - open the terminal and enter mongod
3. using mongoDB
   1. using mongoDB in the terminal
      open the terminal and enter mongo
      ```powershell
      > show dbs
       > use DatabaseName
      ```
   2. to use mongoDB compass instead
      install mongoDB compass
      connect to the server 27017
4. mongoDB methods

# Mongoose

# error handling middleware for express app [catchAsync file](./utils/catchAsync.js)

```javascript

// custome error
class AppError extents Error {
   constructor(message, statusCode){
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? "fail" : "error";
      this.isOperational = true // this is to identify handled error at prod mode

      Error.captureStactTrace(this, this.constructor)
   }
}

// catch error (async error)
const catchAsync = handler => (res, req, next)=>{
   return handler(req, res, next).catch(next);
   // next recieves the err argument an skips to the express error middleware
   // next can be use in handlers to throw error that gets forwarded to the error middleware.
}
// express middleware that handles all caught error and rejected promises in the app
app.use((err, req, res, next)=>{
   err.statusCode = err.statusCode || 500;
   err.status = err.status || "error";

   if(process.env.NODE_ENV === "development"){
      res.status(err.statusCode).json({
         status : err.status,
         message : err.message,
         error : error,
         stack : err.stack
      })
   }
   if(process.env.NODE_ENV === "production"){
      let error = { ...err };
      if (err.name === 'CastError') error = handleCastErrorDB(error);
      if (err.code === 11000) error = handleDuplicateErrorDB(error, err.errmsg);
      if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

      if(err.isOperational){
         res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
      });
      }else {
         return res
         .status(500)
         .json({ status: 'fail', message: 'something went very wrong' });
      }
      err.message = err.message || "something went very very wrong"

   }
   res.status(err.statusCode).json({
      status : "fail",
      error : err.message
   })
})

```

# unHandled Routes, Operation error , unHandled rejection and unCaught Exceptions

```javascript
// we use events to handle unHandled rejection and unCaught rejection
// unCaught event handler should be place before the app starts running
// unHandled rejection listener can be placed anywhere since it waits for promises

// unCaught Exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

// unHandle rejection

process.on('unhandleRejection', (err) => {
  console.log(err.name, err.message);
  // we have to wait for server to abort all async subscriptions
  // gracefully shutting down the server
  server.close(() => {
    process.exit(1);
  });
});
```

#
