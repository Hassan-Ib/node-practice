const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

// method to create token

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    body: { name, password, email, passwordConfirm },
  } = req;
  if (!name || !password || !email || !passwordConfirm)
    next(
      new AppError(
        `{your credentail is missing ${
          !name || !password || !email || !passwordConfirm
        }`,
        401
      )
    );
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

exports.protect = catchAsync(async (req, _, next) => {
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

  // 2) verification token and decode token jwt.verify is a promise (the .then().catch() type)
  // so we use node promisify from util lib method to promisify it.

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log('decoded', decoded);

  // 3) check if user still exist
  const user = await User.findById(decoded.id);
  if (!user)
    next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );

  // 4) check if user change password after the jwt was issued (iat : issued at);
  if (user.passwordChangedAt(decoded.iat)) {
    next(
      new AppError(
        'User password has been changed recently pls try logging back in',
        401
      )
    );
  }

  req.user = user;
  next();
});

exports.claimProtect =
  (...roles) =>
  (req, _, next) => {
    const {
      user: { role },
    } = req;

    const isAuthorized = roles.includes(role);
    if (!isAuthorized) {
      next(new AppError('you are no authorized to use this endpoint to', 403)); // XXX: 403 - forbidden
    }

    next();
  };

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // steps to setup forget password functionality
  // TODO: set up forget password
  // [x] - Check if user exists
  // [x] - generate resetToken
  // [ ] - send resetToken to user email
  const { email } = req.body;
  if (!email) next(new AppError('EMAIL MUST BE PROVIDED', 401));
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(`No user found with this email ${email}`, 404));
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forget your password submit a PATCH request with your password and confirm password to:${resetURL}\nIf you don't forget your password, please ignore this message`;

  // generating token
  // return res.status(200).json({
  //   // successfull: true,
  //   status: 'success',
  //   data: resetToken,
  // });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log('resetpassword');
});
