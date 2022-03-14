const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authCheck = require('../../utils/jwtAuthCheck');

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

router.post('/confirm', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);
  if (!success) {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }
  try {
    const { cart } = req.body;
    if (!cart) {
      return res.status(200).json({
        success: false,
        message: 'Cart is empty',
      });
    }
    const order = await prisma.order.create({
      data: {
        user_id: data.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    const orderItems = await cart.map(async item => {
      return await prisma.order_item.create({
        data: {
          food_id: item.id,
          order_id: order.id,
          amount: item.amount,
          order_status_id: 1, // queue
        },
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: 'Something went wrong',
    });
  }
  return res.status(200).json({
    success: true,
  });
});

module.exports = router;
