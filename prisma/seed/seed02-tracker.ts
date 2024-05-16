import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tracker.createMany({
    data: [
      {
        name: 'Tracker 1',
        description: 'This is tracker 1',
        ownerId: 1,
      },
      {
        name: 'Tracker 2',
        description: 'This is tracker 2',
        ownerId: 1,
      },
      {
        name: 'Tracker 3',
        description: 'This is tracker 3',
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
