const jwt = require('jsonwebtoken');
const asyncHandler = require('../helpers/async');
const User = require('../models/User.model');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Lỗi xác thực', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  req.user = user;
  next();
});

exports.hasAuthorization = (role) => {
  return asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.role === role) {
      return next();
    }

    res.status(401).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  });
};
