const jwt = require('jsonwebtoken');
const config = require('../config');
async function authCheck(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return {
      success: false,
      message: 'Please login to access this',
    };
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return {
      success: true,
      data: decoded,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Please login again',
    };
  }
}

module.exports = authCheck;
