const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { mailer } = require('../utils/email');
const crypto = require('crypto');

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
    next(new AppError('you are not logged in pls login to get access', 401)); // XXX 401 - unauthorized

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
  if (user.checkPasswordChangedAfterLogged(decoded.iat)) {
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

// steps to setup forget password functionality
// TODO: set up forget password
// [x] - Check if user exists
// [x] - generate resetToken
// [x] - send resetToken to user email

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(`No user found with this email ${email}`, 404));
  }

  const resetToken = user.generatePasswordResetToken();
  // console.log('reset token', resetToken);

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forget your password submit a PATCH request with your password and confirm password to:${resetURL}\nIf you don't forget your password, please ignore this message`;

  try {
    await mailer({
      text: message,
      to: user.email,
      subject: 'your password reset Token (valid for 10min)',
      html: `<p>forget your password submit a PATCH request with your password and confirm password, click <a href="${resetURL}">here</a> to reset your password \nIf you don't forget your password, please ignore this message
            </p>`,
    });
    return res.status(200).json({
      status: 'success',
      message: 'token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('error sending password reset mail to the user'),
      500 // XXX: 500 - internal server error
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 - get user based on the token
  const { token: resetToken } = req.params;
  const { password, passwordConfirm } = req.body;

  if (!resetToken) next(new AppError('route is missing a reset token', 400)); //
  const cryptedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log('crypted token ', cryptedToken);

  const user = await User.findOne({
    passwordResetToken: cryptedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 - if token has not expired, and there is user, set the new password

  if (!user) return next(new AppError('token is invalid or has expires', 400)); // XXX: 400 - bad request

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  // 3 - update changedPasswordAt property for the user
  // user.

  // 4 - log the user in
  const token = signToken(user._id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});
