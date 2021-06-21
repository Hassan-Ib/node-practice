const app = require('./app');

// port
const port = 3000;

// listening to server at port 3000
app.listen(port, () => {
  console.log('server running at port 3000');
});
