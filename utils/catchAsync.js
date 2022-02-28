const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next); // if !await the errors wont be caught
    } catch (err) {
      next(err);
    }
    // fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
