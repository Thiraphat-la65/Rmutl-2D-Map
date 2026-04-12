// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 เริ่มการ seed ข้อมูล RMUTL Map...');

  try {
    // ล้างข้อมูลเก่า
    await prisma.room.deleteMany({});
    await prisma.building.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('🧹 ล้างข้อมูลเก่าเรียบร้อย');

    // ==================== สร้างอาคาร 13 ====================
    const building13 = await prisma.building.upsert({
      where: { name: 'อาคาร 13' },
      update: {},
      create: {
        name: 'อาคาร 13',
        lat: 16.86396506882284,
        lng: 100.18763199968545,
        description: 'อาคารสาขาวิชาประมงและห้องปฏิบัติการ',
      },
    });

    // ==================== สร้างอาคาร 16 ====================
    const building16 = await prisma.building.upsert({
      where: { name: 'อาคาร 16' },
      update: {},
      create: {
        name: 'อาคาร 16',
        lat: 16.862553329722466,
        lng: 100.18717690522605,
        description: 'อาคารคณะวิทยาศาสตร์และเทคโนโลยีการเกษตร',
      },
    });

    console.log(`✅ สร้างอาคารสำเร็จ → 13 (ID:${building13.id}) และ 16 (ID:${building16.id})`);

    // ==================== ห้องในอาคาร 13 ====================
    const rooms13 = [
      { roomNumber: '1311', type: 'ห้องบรรยาย', floor: 1, buildingId: building13.id },
      { roomNumber: '1312', type: 'ห้องปฏิบัติการ', floor: 1, buildingId: building13.id },
      { roomNumber: '1314', type: 'ห้องปฏิบัติการ', floor: 1, buildingId: building13.id },
      { roomNumber: '1318', type: 'ห้องปฏิบัติการ', floor: 1, buildingId: building13.id },
      { roomNumber: '1319', type: 'ห้องปฏิบัติการ', floor: 1, buildingId: building13.id },
      { roomNumber: '1325', type: 'ห้องบรรยาย', floor: 2, buildingId: building13.id },
      { roomNumber: '1327', type: 'ห้องบรรยาย', floor: 2, buildingId: building13.id },
    ];

    await prisma.room.createMany({ data: rooms13, skipDuplicates: true });
    console.log(`✅ สร้างห้องอาคาร 13: ${rooms13.length} ห้อง`);

    // ==================== ห้องในอาคาร 16 ====================
    const rooms16 = [
      // ชั้น 2
      { roomNumber: '16201', type: 'สำนักงาน', floor: 2, buildingId: building16.id },
      { roomNumber: '16202', type: 'ประชุม', floor: 2, buildingId: building16.id },
      { roomNumber: '16204', type: 'ประชุม', floor: 2, buildingId: building16.id },
      { roomNumber: '16205', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      { roomNumber: '16207', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      { roomNumber: '16208', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      { roomNumber: '16209', type: 'ประชุม', floor: 2, buildingId: building16.id },
      { roomNumber: '16210', type: 'ประชุม', floor: 2, buildingId: building16.id },
      { roomNumber: '16211', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      { roomNumber: '16212', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      { roomNumber: '16213', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      { roomNumber: '16214', type: 'บรรยาย', floor: 2, buildingId: building16.id },
      // ชั้น 3
      { roomNumber: '16301', type: 'ปฏิบัติการ', floor: 3, buildingId: building16.id },
      { roomNumber: '16302', type: 'ปฏิบัติการ', floor: 3, buildingId: building16.id },
      { roomNumber: '16304', type: 'ปฏิบัติการ', floor: 3, buildingId: building16.id },
      { roomNumber: '16306', type: 'ประชุม', floor: 3, buildingId: building16.id },
    ];

    await prisma.room.createMany({ data: rooms16, skipDuplicates: true });
    console.log(`✅ สร้างห้องอาคาร 16: ${rooms16.length} ห้อง`);

    // ==================== สร้าง Admin ====================
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@rmutl.ac.th',
        password: hashedPassword,
        fullName: 'ผู้ดูแลระบบแผนที่ RMUTL',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ สร้าง Admin สำเร็จ (รหัสผ่าน: admin123)');

    console.log('🎉 Seed ข้อมูลสำเร็จทั้งหมด!');

  } catch (error) {
    console.error('❌ Seed ล้มเหลว:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });