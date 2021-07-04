const mongoose = require('mongoose');
// create schema
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

//todo 2 create a model from the schema => creates collection model
const Tours = mongoose.model('Tour', tourSchema);

module.exports = Tours;
