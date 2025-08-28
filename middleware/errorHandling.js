export const errorHandler = (err, req, res, next) => {
  //If status is accidentally 200, and there is an error force it to 500. Otherwise, keep it as is.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  // castError happens when the user sends an invalid ID or something that doesn’t match the expected type.
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path} with value ${err.value}`;
  }

  //Happens when the data doesn’t pass your schema rules.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  //Happens when someone tries to create something that must be unique but already exists. Duplicate error (11000)
  if (err.code === 11000) {
    statusCode = 400;
    const msg = Object.values(err.keyValue).join(", ");
    message = `${msg} already exists`;
  }

  //always send a JSON response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
