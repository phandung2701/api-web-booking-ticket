const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const { show } = require('../controllers/seat.controller');

router.get('/', protect, show);

module.exports = router;
