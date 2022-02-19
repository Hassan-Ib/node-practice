const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
    // fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
