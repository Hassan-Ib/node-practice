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
const getUser = (req, res) => {
  console.log('route response');
};
// absolute path here means the path after port
router.route('/').get(getUser).post(callback);
module.exports = router;
// in app.js
const express = require('express');
const userRouter = require('user');
const app = express();
// using the router ad middleware
app.use('api/v1/users', userRouter);
```

### express.listen(port, callback)

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
