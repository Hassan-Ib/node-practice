const express = require('express');
const path = require('path');
const { readFileSync } = require('fs');
// standard; creating server ;
const app = express();

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
    path.resolve(__dirname, 'dev-data', 'data', 'tours.json'),
    'utf8'
  )
);

app.get('/api/v1/tours', (req, res) => {
  ``;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
// listening to servre
const port = 3000;
// notice that i dont have to specify locahost 127.0.0.1 in express // little abtraction is done here
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
