const express = require('express');
const order = require('./order');

const router = express.Router();

router.use('/order', order);

module.exports = router;
