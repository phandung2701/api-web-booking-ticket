const logger = require('./logger');
const ErrorHandler = require('../utils/errorResponse');
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error('stack:', err);

  if (err.name === 'CastError') {
    const message = `Không tìm thấy id với giá trị ${error.value}`;
    error = new ErrorHandler(message, 404);
  }

  // Bắt lỗi trùng kháo trong Database
  if (err.code === 11000) {
    const message = 'Giá trị của trường bị trùng lặp';
    error = new ErrorResponse(message, 400);
  }

  // bắt lỗi xác nhận các trường thông tin
  if (err.name === 'ValidationError') {
    const message = Object.values(error.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Lỗi hệ thống'
  });
};

module.exports = errorHandler;
