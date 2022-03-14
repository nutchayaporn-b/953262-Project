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

router.get('/list', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);
  if (!success) {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }
  const orders = await prisma.order.findMany({
    where: {
      user_id: data.id,
      updated_at: {
        gt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
      },
      checkout: 0,
    },
    include: {
      order_item: {
        include: {
          food: true,
          order_status: true,
        },
      },
    },
  });
  return res.status(200).json({
    success: true,
    data: orders,
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

router.post('/checkout', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);
  if (!success) {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }

  try {
    // find orders from user_id
    const orders = await prisma.order.findMany({
      where: {
        user_id: data.id,
        checkout: 0,
      },
    });

    if (orders.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No order to checkout',
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoice_status_id: 1, // waiting for payment
      },
    });

    orders.forEach(async order => {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          invoice_id: invoice.id,
          checkout: 1,
        },
      });

      const order_items = await prisma.order_item.findMany({
        where: {
          order_id: order.id,
        },
        include: {
          food: true,
        },
      });

      const totalPrice = order_items.reduce((acc, cur) => acc + cur.food.price * cur.amount, 0);

      await prisma.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          total: totalPrice,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});

router.get('/invoice', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);
  if (!success) {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }

  try {
    // find invoice id from latest order with user_id
    const order = await prisma.order.findMany({
      where: {
        user_id: data.id,
        checkout: 1,
      },
      orderBy: {
        updated_at: 'desc',
      },
      take: 1,
    });

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: order[0].invoice_id,
      },
    });

    // find orders from invoice_id
    const orders = await prisma.order.findMany({
      where: {
        user_id: data.id,
        invoice_id: order[0].invoice_id,
        checkout: 1,
      },
      include: {
        order_item: {
          include: {
            food: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        invoice: invoice,
        orders: orders,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});

router.post('/cancel', async (req, res) => {
  const { success, message } = authCheck(req, res);

  try {
    const { order_item_id } = req.body;
    if (!order_item_id) {
      return res.status(200).json({
        success: false,
        message: 'Order item id is required',
      });
    }

    // check if order_status is queue
    let order_item = await prisma.order_item.findFirst({
      where: {
        id: order_item_id,
      },
    });

    if (order_item.order_status_id !== 1) {
      return res.status(200).json({
        success: false,
        message: 'Cannot cancel cooked order',
      });
    }

    order_item = await prisma.order_item.delete({
      where: {
        id: order_item_id,
      },
    });

    // if order_item is empty, delete order
    let temp = order_item.order_id;
    order_item = await prisma.order_item.findMany({
      where: {
        order_id: order_item.order_id,
      },
    });

    if (order_item.length === 0) {
      await prisma.order.delete({
        where: {
          id: temp,
        },
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});

module.exports = router;
