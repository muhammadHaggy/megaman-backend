import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assets = [
    {
      ownerId: 1,
      name: 'Asset 1',
      description: 'This is asset 1',
      depreciation: 0.1,
    },
    {
      ownerId: 2,
      name: 'Asset 2',
      description: 'This is asset 2',
      depreciation: 0.1,
    },
  ];

  for (const asset of assets) {
    await prisma.asset.create({
      data: asset,
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
