const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    ...(data && { data }),
    ...(meta && { meta })
  };
  
  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, meta = null) => {
  return sendResponse(res, 200, true, message, data, meta);
};

const sendCreated = (res, message, data = null) => {
  return sendResponse(res, 201, true, message, data);
};

const sendError = (res, statusCode, message) => {
  return sendResponse(res, statusCode, false, message);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendCreated,
  sendError
};
