// src/pages/api/rooms.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log('✅ API /api/rooms ถูกเรียกใช้งานแล้ว!');

  try {
    const { buildingName = "อาคาร 13" } = req.query;

    const rooms = await prisma.room.findMany({
      where: {
        building: { name: buildingName }
      },
      include: { building: true },
      orderBy: [
        { floor: 'asc' },
        { roomNumber: 'asc' }
      ]
    });

    console.log(`พบห้อง ${rooms.length} ห้องในอาคาร ${buildingName}`);

    res.status(200).json(rooms);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}