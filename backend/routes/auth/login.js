const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(200).json({ error: 'User not found' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(200).json({ error: 'Password does not match' });
  }

  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

  return res.status(200).json({
    success: true,
    token,
    data,
  });
});

router.get('/', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(200).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return res.status(200).json({
      success: true,
      data: decoded,
    });
  } catch (err) {
    return res.status(200).json({ error: 'Token invalid' });
  }
});

module.exports = router;
