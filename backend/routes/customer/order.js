const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/menu', async (req, res) => {
  const foods = await prisma.food.findMany({
    include: {
      category: true,
    },
  });
  return res.status(200).json({
    success: true,
    data: foods,
  });
});

router.get('/category', async (req, res) => {
  const categories = await prisma.category.findMany();
  return res.status(200).json({
    success: true,
    data: categories,
  });
});

module.exports = router;
