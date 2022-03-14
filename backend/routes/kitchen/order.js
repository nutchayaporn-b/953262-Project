const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authCheck = require('../../utils/jwtAuthCheck');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/list', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);

  if (!success || data.role !== 'kitchen') {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }

  // get all orders which checkout = 0
  const orders = await prisma.order.findMany({
    where: {
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

router.post('/change', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);

  if (!success || data.role !== 'kitchen') {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }

  const { status, id } = req.body;

  if (status === 'served') {
    return res.status(200).json({
      success: false,
      message: 'Order has been served',
    });
  }

  const order_status = await prisma.order_status.findFirst({
    where: {
      status: status,
    },
  });

  const orderItem = await prisma.order_item.update({
    where: {
      id: id,
    },
    data: {
      order_status_id: order_status.id + 1,
    },
  });

  return res.status(200).json({
    success: true,
    data: orderItem,
  });
});

router.get('/invoice', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);

  if (!success || data.role !== 'kitchen') {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }

  // get all invoice which status = 1 // waiting for payment
  const invoices = await prisma.invoice.findMany({
    where: {
      created_at: {
        gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      invoice_status: true,
      order: {
        include: {
          user: true,
          order_item: {
            include: {
              food: true,
              order_status: true,
            },
          },
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    data: invoices,
  });
});

router.post('/confirm', async (req, res) => {
  const { data, success, message } = await authCheck(req, res);

  if (!success || data.role !== 'kitchen') {
    return res.status(200).json({
      success: false,
      message: message,
    });
  }

  const { id } = req.body;

  const invoice = await prisma.invoice.update({
    where: {
      id: id,
    },
    data: {
      invoice_status_id: 2,
    },
  });

  return res.status(200).json({
    success: true,
    data: invoice,
  });
});

module.exports = router;
