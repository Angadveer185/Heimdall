import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
    // Delete records in reverse order of dependencies to respect relations
    await prisma.pledge.deleteMany({});
    await prisma.requestedItem.deleteMany({});
    await prisma.shelterRequest.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.shelter.deleteMany({});
    await prisma.globalItem.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('Database collections wiped successfully.');
}

resetDatabase()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());