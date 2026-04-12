// src/server.js
require('dotenv').config();   // ← สำคัญ! ต้องอยู่บรรทัดแรก

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

console.log('🚀 กำลังเริ่ม Express Server สำหรับ RMUTL Map...');
console.log('📍 DATABASE_URL ที่ใช้:', process.env.DATABASE_URL ? 'พบแล้ว' : 'ไม่พบ!');

app.get('/api/rooms', async (req, res) => {
  try {
    const { buildingName } = req.query;
    console.log(`📡 API ถูกเรียกใช้งาน: /api/rooms?buildingName=${buildingName || 'ทั้งหมด'}`);

    let rooms;

    if (buildingName) {
      rooms = await prisma.room.findMany({
        where: {
          building: { name: buildingName }
        },
        include: {
          building: true
        },
        orderBy: [
          { floor: 'asc' },
          { roomNumber: 'asc' }
        ]
      });
    } else {
      rooms = await prisma.room.findMany({
        include: { building: true },
        orderBy: [
          { buildingId: 'asc' },
          { floor: 'asc' },
          { roomNumber: 'asc' }
        ]
      });
    }

    console.log(`✅ พบห้องทั้งหมด ${rooms.length} ห้อง`);

    res.json(rooms);

  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'ไม่สามารถดึงข้อมูลห้องได้',
      message: error.message 
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Express Server ทำงานที่ http://localhost:${PORT}`);
  console.log(`🔗 ทดสอบ API: http://localhost:3001/api/rooms?buildingName=อาคาร 16`);
});