const app = require('./app');
// STARTING SERVER
// listening to servre

const port = 3000;
// notice that i dont have to specify locahost 127.0.0.1 in express // little abtraction is done here
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
