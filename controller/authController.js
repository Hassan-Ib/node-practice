const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    body: { name, password, email, passwordConfirm },
  } = req;
  const newUser = await User.create({
    name,
    password,
    passwordConfirm,
    email,
  });

  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  // payload : { id : newUser._id}
  // secretOrPrivateKey : //STRING OF CHOISE
  // { expiresIn : // expiration of choice }
  const token = signToken(newUser._id);

  // if(!user) next(new AppError("" ,404))

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // 401 means unauthurized
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and checking if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    next(new AppError('you are not logged in pls login to get access'), 401);

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded', decoded);

  // 3) check if user still exist

  // 4) check if user change password after the jwt was issued

  next();
});
