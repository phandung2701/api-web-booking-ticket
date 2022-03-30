const asyncHandler = require('../helpers/async');
const ErrorResponse = require('../utils/errorResponse');
const Ticket = require('../models/Ticket.model');
const Movie = require('../models/Movie.model');
const Cinema = require('../models/Cinema.model');
const User = require('../models/User.model');

/**
 * @description Đặt vé xem phim
 * @route [POST] /api/v1/ticket
 * @access PRIVATE
 */
exports.create = asyncHandler(async (req, res, next) => {
  const body = req.body;
  const { filmId, cinemaId, showTime, seat, room, price = 70000 } = body;

  const movie = await Movie.findById(filmId);
  const cinema = await Cinema.findById(cinemaId);

  if (!movie || !cinema) {
    return next(
      new ErrorResponse('Thông tin chưa đầy đủ hãy kiểm tra lại', 400)
    );
  }

  const findTicket = await Ticket.find({
    filmId,
    cinemaId,
    showTime,
    seat,
  })
    .where('status')
    .in(['booked']);

  if (findTicket.length) {
    return next(new ErrorResponse('Chỗ ngồi đã có người đặt', 400));
  }
  for (let i = 0; i < seat.length; i++) {
    Ticket.create({
      filmId,
      cinemaId,
      showTime,
      seat: seat[i],
      room,
      price: price / seat.length,
      userId: req.user.id,
    });
  }
  // seat.forEach((element) => {
  //   Ticket.create({
  //     filmId,
  //     cinemaId,
  //     showTime,
  //     seat: element,
  //     room,
  //     price,
  //     userId: req.user.id,
  //   });
  // });
  // const ticket = await Ticket.create({
  //   filmId,
  //   cinemaId,
  //   showTime,
  //   seat,
  //   room,
  //   price,
  //   userId: req.user.id,
  // });

  return res.status(201).json({
    success: true,
  });
});

/**
 * @description Hiện thị danh sách về mà tài khoản đó đã đặt
 * @route [GET] /api/v1/ticket
 * @access PRIVATE
 */
exports.all = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.find({ userId: req.user.id })
    .populate([{ path: 'filmId' }, { path: 'cinemaId' }])
    .exec();

  if (!ticket) {
    return next(ErrorResponse('Không tìm thấy thông tin', 404));
  }

  res.status(200).json({
    success: true,
    ticket,
  });
});

/**
 * @description Hiện thị danh sách tất cả các vé đã đặt bao gồm người dùng khác và admin (Admin)
 * @route [GET] /api/v1/ticket/list
 * @access PRIVATE
 */
exports.showForAdmin = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.find()

    .sort({ updatedAt: -1 })
    .populate([{ path: 'filmId' }, { path: 'cinemaId' }, { path: 'userId' }])
    .exec();

  return res.status(200).json({
    success: true,
    ticket,
  });
});

/**
 * @description Hủy vé đã đặt của tài khoản hiện tại
 * @route [PUT] /api/v1/ticket/:id
 * @access PRIVATE
 */
exports.status = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const status = req.body.status;

  if (!status | !['booked', 'cancelled'].includes(status)) {
    return next(new ErrorResponse('Trạng thái vé không hợp lệ', 400));
  }

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!ticket) {
    return res.status(400).json({ success: true });
  }

  return res.status(200).json({
    success: true,
    status,
  });
});

/**
 * @description Hủy vé đã đặt của tất cả tài khoản khi đã đặt vé (Admin)
 * @route [PUT] /api/v1/ticket/:tid/user/:uid
 * @access PRIVATE
 */
exports.statusForAdmin = asyncHandler(async (req, res, next) => {
  const fid = req.params.fid;
  const status = req.body.status;

  if (!status | !['booked', 'cancelled'].includes(status)) {
    return next(new ErrorResponse('Trạng thái vé không hợp lệ', 400));
  }

  const ticket = await Ticket.findOneAndUpdate(
    { filmId: fid },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!ticket) {
    return res.status(400).json({ success: true });
  }

  if (status === 'cancelled') {
    const listTicket = await Ticket.find({ filmId: fid }).select({
      userId: 1,
      _id: 0,
    });

    const movie = await Movie.findById(fid).select({
      _id: 0,
      nameFilm: 1,
    });

    const d = new Date();
    const dateFormat =
      [
        (d.getMonth() + 1).toString().padStart(2, '0'),
        d.getDate().toString().padStart(2, '0'),
        d.getFullYear(),
      ].join('/') +
      ' ' +
      [
        d.getHours().toString().padStart(2, '0'),
        d.getMinutes().toString().padStart(2, '0'),
        d.getSeconds().toString().padStart(2, '0'),
      ].join(':');

    const message = {
      content: `Vé của phim "${movie['nameFilm']}" đã bị quản trị viên hủy vì sự cố. Chúng tôi sẽ thực hiện chính sách hoàn tiền trong 3 ngày kể từ hôm nay. Chúng tôi thành thực xin lỗi vì sự bất tiện này!`,
      time: dateFormat,
    };

    await User.updateMany(
      { userId: { $in: listTicket } },
      { $push: { message } }
    );
  }

  return res.status(200).json({
    success: true,
    status,
  });
});
