const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const users = require('./user');
const foods = require('./food');
const categories = require('./category');
const invoiceStatus = require('./invoice_status');
const orderStatus = require('./order_status');

async function main() {
  let result = [];
  result.push(
    await prisma.user.createMany({
      data: users,
    }),
  );
  result.push(
    await prisma.category.createMany({
      data: categories,
    }),
  );
  result.push(
    await prisma.food.createMany({
      data: foods,
    }),
  );
  result.push(
    await prisma.invoice_status.createMany({
      data: invoiceStatus,
    }),
  );
  result.push(
    await prisma.order_status.createMany({
      data: orderStatus,
    }),
  );

  console.log(result);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
