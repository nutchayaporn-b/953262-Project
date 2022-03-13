const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const users = require('./user');
const foods = require('./food');
const categories = require('./category');

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
