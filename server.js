const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;
//todo 1 connect to the DB with mongoose
// connecting to DB  with mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFUL 👌'))
  .catch((err) => console.log('ERROR IN CONNECTION 🤯'));

const port = process.env.PORT || 3000;

// listening to server at port 3000
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
