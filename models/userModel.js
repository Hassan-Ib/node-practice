const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valide email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'], // enum is a validator;
    default: 'user',
  },
  photo: String,
  password: {
    select: false, // to exclude password when query
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    trim: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // checking if password is modified : only run the function is password was modified
  if (!this.isModified('password')) return next();

  // password hashing : is async
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordChangedAfterLogged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

// TODO: setup forget token
// [x] - generate randow string
// [x] - hash the random string and save it to db
// [x] - return generated random string

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // ADDING TO MINUTE 1000 * 60 * 10 (1000 miliseconds = 1 seconds, 60 seconds = 1 minute )
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log(resetToken, this.passwordResetToken);
  return resetToken;
};

userSchema.pre('save', function (next) {
  // if password is not modified or document is new, exit this code and move to the next phase
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // subtracting one sec
  next();
});

const Users = mongoose.model('User', userSchema);

module.exports = Users;
