const mongoose = require('mongoose');
// create schema
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'A tour must have a name !'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price !'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a summary'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const toWeek = (duration) => {
  return Math.ceil(duration / 7);
};

// virtual fields
tourSchema.virtual('durationWeek').get(function () {
  return toWeek(this.duration);
});

// document middleWare

tourSchema.pre('save', function () {
  console.log('current document name', this.name);
});

//todo 2 create a model from the schema => creates collection model
const Tours = mongoose.model('Tour', tourSchema);

module.exports = Tours;
