const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'securepassword',
      copyHistory: {
        create: { fileName: 'test.txt' },
      },
    },
    include: { copyHistory: true },
  });
  console.log('Created user:', user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());