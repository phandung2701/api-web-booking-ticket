const express = require('express');
const router = express.Router();

const { all } = require('../controllers/cinema.controller');

router.get('/', all);

module.exports = router;
