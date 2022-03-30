const asyncHandler = require('../helpers/async');
const Cinema = require('../models/Cinema.model');

exports.all = asyncHandler(async (req, res, next) => {
  const cinema = await Cinema.find();

  return res.status(200).json({
    success: true,
    cinema
  });
});
