const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    seat: {
      type: String,
      required: [true, 'Mời nhập chỗ ngồi'],
    },
    room: {
      type: String,
      required: [true, 'Mời nhập phòng'],
    },
    price: {
      type: Number,
      required: [true, 'Mời nhập giá vé'],
    },
    showTime: {
      type: String,
      require: true,
    },
    filmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);
