import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tracker.createMany({
    data: [
      {
        ownerId: 1,
      },
      {
        ownerId: 1,
      },
      {
        ownerId: 2,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
