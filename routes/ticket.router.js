const express = require('express');
const router = express.Router();
const { protect, hasAuthorization } = require('../middleware/auth');

const {
  create,
  all,
  showForAdmin,
  status,
  statusForAdmin
} = require('../controllers/ticket.controller');

router.get('/', protect, all);
router.post('/', protect, create);
router.get('/list', protect, hasAuthorization('admin'), showForAdmin);
router.put('/:id/status', protect, status);
router.put(
  '/film/:fid/status',
  protect,
  hasAuthorization('admin'),
  statusForAdmin
);

module.exports = router;
