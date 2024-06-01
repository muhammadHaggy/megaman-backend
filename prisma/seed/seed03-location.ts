import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.location.createMany({
    data: [
      {
        latitude: 37.7749,
        longitude: -122.4194,
        trackerId: 1,
        timestamp: new Date('2021-09-01T12:00:00Z'),
      },
      {
        latitude: 34.0522,
        longitude: -118.2437,
        trackerId: 2,
        timestamp: new Date('2021-09-01T12:00:00Z'),
      },
      {
        latitude: 40.7128,
        longitude: -74.006,
        trackerId: 1,
        timestamp: new Date('2021-09-01T12:30:00Z'),
      },
      {
        latitude: 41.8781,
        longitude: -87.6298,
        trackerId: 2,
        timestamp: new Date('2021-09-01T12:30:00Z'),
      },
      {
        latitude: 29.7604,
        longitude: -95.3698,
        trackerId: 1,
        timestamp: new Date('2021-09-01T13:00:00Z'),
      },
      {
        latitude: 32.7763,
        longitude: -96.7969,
        trackerId: 2,
        timestamp: new Date('2021-09-01T13:00:00Z'),
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
