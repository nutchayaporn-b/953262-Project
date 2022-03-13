const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  // check if email already exists
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return res.status(200).json({ error: 'User already exists' });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'customer',
    },
  });

  // create token
  const data = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };

  const token = jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

  return res.status(200).json({
    success: true,
    token,
  });
});

module.exports = router;
