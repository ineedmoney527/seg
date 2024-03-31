import {
  VALIDATION_ERROR,
  NOT_FOUND,
  FORBIDDEN,
  UNAUTHORIZED,
} from "../constant";
const errorHandler = (error, req, res, next) => {
  // if has status code then remains , else set to 500
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case VALIDATION_ERROR:
      res.json({
        title: "Invalid",
        message: error.message,
        stacktrace: error.stacktrace,
      });
      break;
    case NOT_FOUND:
      res.json({
        title: "Not Found",
        message: error.message,
        stacktrace: error.stacktrace,
      });
    case FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: error.message,
        stacktrace: error.stacktrace,
      });
      break;
    case UNAUTHORIZED:
      res.json({
        title: "Unauthorizsed",
        message: error.message,
        stacktrace: error.stacktrace,
      });
    default:
      break;
  }
};
export default errorHandler;
