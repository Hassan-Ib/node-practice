const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ✨ shutting down...');
  console.log(err.name, err.message);
  // shutting down server gracefully : this shutdown all async codes hence unCaught exceptions
  process.exit(1);
});
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
const server = app.listen(port, () => {
  console.log(`server running at port ${port}`);
});

// unhandled rejection

process.on('handledRejection', (err) => {
  console.log('UNHANDLED REJECTION! ✨ shutting down...');
  console.log(err.name, err.message);
  // shutting down server gracefully : this shutdown all async codes hence unhandled rejections
  server.close(() => {
    process.exit(1);
  });
});

// unCaugth Exceptions  : for sync codes
