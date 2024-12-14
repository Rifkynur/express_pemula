exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found = ${req.originalUrl}`);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  if (err.errors || err.name === "SequelizeValidationError") {
    const errorList = err.errors.map((err) => {
      let obj = {};
      obj[err.path] = err.message;
      return obj;
    });
    statusCode = 400;
    message = errorList;
  }
  res.status(statusCode).json({
    message,
    stack: err.stack,
  });
};
