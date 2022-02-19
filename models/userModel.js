const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
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

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

const Users = mongoose.model('User', userSchema);

module.exports = Users;
