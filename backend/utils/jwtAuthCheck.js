const jwt = require('jsonwebtoken');
const config = require('../config');
async function authCheck(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return {
      success: false,
      message: 'No token provided',
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
      message: 'Token invalid',
    };
  }
}

module.exports = authCheck;
