const express = require('express');
const path = require('path');
const { readFileSync, writeFile } = require('fs');
// standard; creating server ;
const app = express();

// added middlewire to add body to request
app.use(express.json());
// console.log(path.sep);
// //routing with express
// // routes are handled seperately
// // app.get(route, callback{req,res})
// app.get('/', (req, res) => {
//   // send -- responds with content type text/html
//   // json -- responds with content type application/json
//   res
//     .status(200)
//     .json({ message: 'hello world from the server side', app: 'natour' });
// });
// app.get('/htmlpage', (req, res) => {
//   res.status(200).send(`
//     <html>
//         <head>
//             <title>rest html page</title>
//         </head>
//         <body>
//             <h1> hello world from the backend</h1>
//         </body>
//     </html>`);
// });

//creating api routes
const tours = JSON.parse(
  readFileSync(
    path.resolve(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    'utf8'
  )
);
// get tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// post : to create a new tour
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1]['_id'] + 1;
  const newTour = {
    _id: newId,
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
});

// listening to servre
const port = 3000;
// notice that i dont have to specify locahost 127.0.0.1 in express // little abtraction is done here
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
