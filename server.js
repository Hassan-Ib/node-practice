const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

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

//todo create a schema
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A tour must have a name !'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price !'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

//todo 3 create a model from the schema => creates collection model
const Tours = mongoose.model('Tour', tourSchema);

// //todo 4 create a doc from the model
// const tourDoc = new Tours({
//   name: 'The Mountain Hiker',
//   price: 499,
//   rating: 4.7,
// });
// // todod save doc
// tourDoc
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error 🤯: ', err));

// todo : look up all the docs in tours collection

// port
Tours.updateOne({ rating: 4.5 }, { $set: { rating: 4.9 } })
  .then((doc) => console.log(doc))
  .catch((err) => console.log('unable to update 🤯'));

Tours.find({ rating: { $gt: 4.5 } })
  .then((tours) => console.log(tours))
  .catch((err) => console.log('Error cant find a thing 🤯'));

const port = process.env.PORT || 3000;

// listening to server at port 3000
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
