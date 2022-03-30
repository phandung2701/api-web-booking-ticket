const express = require('express');
const router = express.Router();
const { protect, hasAuthorization } = require('../middleware/auth');

const {
  login,
  register,
  me,
  list,
  changeRole,
} = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', register);

router.get('/me', protect, me);
router.get('/user', protect, hasAuthorization('admin'), list);
router.put('/user/:id/role', protect, hasAuthorization('admin'), changeRole);

module.exports = router;
