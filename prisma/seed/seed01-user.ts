import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'user1@example.com',
      name: 'User 1',
      password: 'password1',
      username: 'user1',
    },
    {
      email: 'user2@example.com',
      name: 'User 2',
      password: 'password2',
      username: 'user2',
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
