const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Tên của bạn không được bỏ trống']
    },
    lastname: {
      type: String,
      required: [true, 'Họ của bạn không được bỏ trống']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email không được bỏ trống'],
      match: [
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        'Email không hợp lệ'
      ]
    },
    password: {
      type: String,
      required: [true, 'mật khẩu không được bỏ trống'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: ''
    },
    message: [{ type: Object }]
  },
  { timestamps: true }
);

// Hash password
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.signedJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
