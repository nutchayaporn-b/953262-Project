const express = require('express');
const router = express.Router();

router.use('/', require('./test'));
router.use('/auth', require('./auth'));
router.use('/customer', require('./customer'));

module.exports = router;
