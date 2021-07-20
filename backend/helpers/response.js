/**
 * handle success/error response
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// on Success
exports.sendResponse = ({
  res,
  statusCode = 200,
  message = "success",
  responseBody,
}) => {
  res.status(statusCode).send({
    data: responseBody,
    status: true,
    message,
  });
};

// on Failure
exports.sendErrorResponse = ({
  res,
  statusCode = 500,
  message = "error",
  responseBody,
}) => {
  res.status(statusCode).send({
    data: responseBody,
    status: false,
    message,
  });
};
