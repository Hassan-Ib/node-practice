const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// create schema
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'A tour must have a name !'],
      trim: true,
      maxLength: [40, 'name too long, cannot be more than 40 characters'],
      minLength: [10, 'name too long, cannot be more than 40 characters'], // built in validator
      // validate : [validator.isAlpha, "Tour name must only contain characters"] // custome validator
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: "Difficult should be in range 'easy', 'medium', 'difficult'. ",
      },
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
      min: [1, 'ratings average cannot be less than 1'],
      max: [5, 'ratings average cannot be more than 5'],
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// mongoose built in Validator
// 1 ) required [true/ false , "error message"]
// 2) for type strings { maxLength : [numberOfCharacter, "error message"], minLength : [numChar, "error message "]},

const toWeek = (duration) => {
  return Math.ceil(duration / 7);
};

// virtual fields
tourSchema.virtual('durationWeek').get(function () {
  return toWeek(this.duration);
});

// DOCUMENT MIDDLEWARE

tourSchema.pre('save', function (next) {
  // this points to the document being save
  console.log('current document name', this.name);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   // here we have no access to this keyWord anymore
//   // but we have access to the saved document
//   console.log('slug : ', this.slug);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
//   // this points to query here
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// to use this pre for all methods related find
tourSchema.pre(/^find/, function (next) {
  // this points to query here
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  // this points to query here
  console.log(`query time is ${Date.now() - this.start} milliseconds`);
  next();
});
// AGGREGATION MiddleWare
tourSchema.pre('aggregate', function (next) {
  // this points to query here
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});
//todo 2 create a model from the schema => creates collection model
const Tours = mongoose.model('Tour', tourSchema);

module.exports = Tours;
