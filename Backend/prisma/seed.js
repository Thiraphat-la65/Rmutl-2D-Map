// prisma/seed.js
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('เริ่มการ seed ข้อมูล...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'โหลดสำเร็จ' : 'โหลดไม่สำเร็จ!');

  try {
    // 1. ลบข้อมูลเก่าทั้งหมด (ลบ Room ก่อน Building เพราะมี relation)
    console.log('กำลังลบข้อมูล Room เก่า...');
    await prisma.room.deleteMany({});
    console.log('ลบ Room เสร็จสิ้น');

    console.log('กำลังลบข้อมูล Building เก่า...');
    await prisma.building.deleteMany({});
    console.log('ลบ Building เสร็จสิ้น');

    // ลบ User เก่าด้วย (เพื่อเริ่มใหม่ทุกครั้ง)
    console.log('กำลังลบข้อมูล User เก่า...');
    await prisma.user.deleteMany({});
    console.log('ลบ User เสร็จสิ้น');

    // 2. ข้อมูลอาคารทั้งหมด (ใช้ createMany เพื่อความเร็ว)
    console.log('กำลังสร้างอาคารทั้งหมด...');
    const buildingsData = [
      {
        name: 'สาขาพืชศาสตร์',
        lat: 16.862125295303038,
        lng: 100.18487977177142,
        description: 'ฝ่ายวิชาการ วิทยาเขตพิษณุโลก',
        imageUrl: '/assets/images/พืชศาสตร์.jpg',
      },
      {
        name: 'สาขาประมง1',
        lat: 16.86396506882284,
        lng: 100.18763199968545,
        description: 'สำนักงานประมง',
        imageUrl: '/assets/images/คณะประมง.jpg',
      },
      {
        name: 'สำนักงานคณะวิทยาศาสตร์',
        lat: 16.862591611196265,
        lng: 100.18715885215336,
        description: 'ตึก 16',
        imageUrl: '/assets/images/ภาพตึกคณะวิท.jpg',
      },
      {
        name: 'คณะวิทยาศาสตร์และเทคโนโลยีการเกษตร',
        lat: 16.861634985592083,
        lng: 100.18242070453148,
        description: 'ฝ่ายวิชาการ วิทยาเขตพิษณุโลก',
        imageUrl: '/assets/images/สาขาวิทยาศาส.jpg',
      },
      {
        name: 'ทางเข้าฟาร์มปลา',
        lat: 16.86308128763508,
        lng: 100.18692661412354,
        description: 'ทางเข้า ประมง',
        imageUrl: '/assets/images/สาขาประมง.jpg',
      },
      {
        name: 'สาขาวิชาเทคโนโลยีคอมพิวเตอร์',
        lat: 16.86127421996134,
        lng: 100.18201663492415,
        description: 'ตึกคอม',
        imageUrl: '/assets/images/สาขาวิชาเทโนโลยีคอมพิวเตอร์.jpg',
      },
      {
        name: 'อาคารเรียนรวม',
        lat: 16.861800348704413,
        lng: 100.18178066213814,
        description: 'ตึกคอม',
        imageUrl: '/assets/images/อาคารเรียนรวม.jpg',
      },
      // เพิ่มอาคารอื่น ๆ ที่เหลือตรงนี้ได้เลย
    ];

    const createdBuildings = await prisma.building.createMany({
      data: buildingsData,
      skipDuplicates: true, // ป้องกัน error ถ้าชื่อซ้ำ
    });

    console.log(`สร้างอาคารสำเร็จ ${createdBuildings.count} อาคาร`);

    // ดึง building กลับมาเพื่อเอา id ไปใช้ใน Room
    const buildings = await prisma.building.findMany({
      select: { id: true, name: true },
    });

    // สร้าง map ชื่ออาคาร -> id
    const buildingMap = {};
    buildings.forEach(b => {
      buildingMap[b.name] = b.id;
    });

    // 3. ข้อมูลห้องตัวอย่าง
    console.log('กำลังสร้างห้องทั้งหมด...');
    const roomsData = [
      // อาคารเรียนรวม
      { number: '101', type: 'ห้องบรรยาย', floor: 1, capacity: '60 ที่นั่ง', buildingId: buildingMap['อาคารเรียนรวม'] },
      { number: 'ห้องน้ำ ชั้น 1', type: 'ห้องน้ำสาธารณะ', floor: 1, buildingId: buildingMap['อาคารเรียนรวม'] },

      // สาขาพืชศาสตร์
      { number: '201', type: 'ห้องปฏิบัติการพืช', floor: 2, capacity: '30 ที่นั่ง', buildingId: buildingMap['สาขาพืชศาสตร์'] },

      // เพิ่มห้องอื่น ๆ ตามต้องการ
    ];

    const createdRooms = await prisma.room.createMany({
      data: roomsData,
      skipDuplicates: true,
    });

    console.log(`สร้างห้องสำเร็จ ${createdRooms.count} ห้อง`);

    // 4. สร้าง User Admin คนเดียว
    console.log('กำลังสร้าง User Admin...');

    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@rmutl.com',
        password: 'admin123', // สำหรับ dev/local เท่านั้น → ควร hash ใน production
        fullName: 'ผู้ดูแลระบบ RMUTL Map',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('สร้าง Admin สำเร็จ:', {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
    });

    console.log('====================================');
    console.log('Seed ข้อมูลสำเร็จทั้งหมด!');
    console.log(`อาคารทั้งหมด: ${createdBuildings.count}`);
    console.log(`ห้องทั้งหมด: ${createdRooms.count}`);
    console.log(`User ทั้งหมด: 1 (Admin)`);
    console.log('====================================');
  } catch (error) {
    console.error('เกิด error ระหว่าง seed:');
    console.error(error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed ล้มเหลว:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('ปิดการเชื่อมต่อ Prisma');
  });