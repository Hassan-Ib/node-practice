const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv usage
dotenv.config({ path: './config.env' });

// uncaught exception
// gracefull shut down for uncaught sync error

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ✨ shutting down...');
  console.log(err.name, err.message);
  // shutting down server gracefully : this shutdown all sync codes hence unCaught exceptions
  process.exit(1);
});

const app = require('./app');

let DB = process.env.DATABASE_LOCAL;
// TODO: 1 connect to the DB with mongoose
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE_ATLAS;
}
// connecting to DB  with mongoose async
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFUL 👌'))
  .catch((err) => console.log('ERROR IN CONNECTION 🤯'));

const port = process.env.PORT ?? 3000;

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
