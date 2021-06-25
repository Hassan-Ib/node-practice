const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);
// port
const port = process.env.PORT || 3000;

// listening to server at port 3000
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
