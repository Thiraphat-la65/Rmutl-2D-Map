require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('hashedpassword123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created/updated:', admin);

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });
  console.log('Regular user created/updated:', user);

  await prisma.log.createMany({
    data: [
      {
        userId: admin.id,
        actionType: 'copy',
        actionDetails: 'Copied path/to/file1',
        isSuccess: true,
        device: 'Desktop',
        timestamp: new Date('2025-09-24T10:00:00Z'),
      },
      {
        userId: admin.id,
        actionType: 'view',
        actionDetails: 'Viewed dashboard',
        isSuccess: true,
        device: 'Mobile',
        timestamp: new Date('2025-09-24T14:00:00Z'),
      },
      {
        userId: user.id,
        actionType: 'view',
        actionDetails: 'Viewed map',
        isSuccess: false,
        device: 'Desktop',
        timestamp: new Date('2025-09-24T16:00:00Z'),
      },
    ],
  });
  console.log('Sample logs created');

  await prisma.spatialData.createMany({
    data: [
      {
        name: 'พื้นที่สีเขียว 1',
        category: 'green_area',
        description: 'พื้นที่สีเขียวบริเวณหน้าโรงอาหาร',
      },
      {
        name: 'อาคารเรียน A',
        category: 'building',
        description: 'อาคารเรียนคณะวิทยาศาสตร์',
      },
    ],
  });
  console.log('Sample spatial data created');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });