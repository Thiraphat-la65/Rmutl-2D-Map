// src/pages/Detail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Detail = () => {
  const { roomNumber } = useParams();   // ใช้ roomNumber เพื่อหาว่าอยู่ในอาคารไหน

  const [rooms, setRooms] = useState([]);
  const [buildingName, setBuildingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBuildingRooms = async () => {
      if (!roomNumber) {
        setError("ไม่พบเลขห้อง");
        setLoading(false);
        return;
      }

      try {
        console.log(`🔄 กำลังโหลดข้อมูลห้อง ${roomNumber}`);

        const res = await fetch('http://localhost:3001/api/rooms');
        if (!res.ok) throw new Error(`Backend ตอบ ${res.status}`);

        const allRooms = await res.json();
        console.log(`✅ ได้ห้องทั้งหมด ${allRooms.length} ห้อง`);

        // หาห้องที่ตรงกันเพื่อรู้ว่าอยู่ในอาคารไหน
        const currentRoom = allRooms.find(r => String(r.roomNumber) === String(roomNumber));
        if (!currentRoom) throw new Error(`ไม่พบห้อง ${roomNumber}`);

        const currentBuildingName = currentRoom.building?.name || 'ไม่ระบุอาคาร';

        // กรองห้องทั้งหมดของอาคารนั้น
        const buildingRooms = allRooms.filter(r => r.building?.name === currentBuildingName);

        setRooms(buildingRooms);
        setBuildingName(currentBuildingName);

        console.log(`✅ พบห้องในอาคาร ${currentBuildingName} ทั้งหมด ${buildingRooms.length} ห้อง`);

      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBuildingRooms();
  }, [roomNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-[#00843D] border-t-transparent rounded-full mb-4"></div>
        <p className="text-xl">กำลังโหลดข้อมูลห้อง...</p>
      </div>
    );
  }

  if (error || rooms.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">ไม่พบข้อมูล</h2>
        <Link to="/map" className="mt-6 px-8 py-3 bg-[#00843D] text-white rounded-2xl">
          ← กลับไปแผนที่
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#00843D] to-[#006633] text-white py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/map" className="inline-flex items-center gap-2 mb-4 hover:underline">
            ← กลับไปแผนที่
          </Link>
          <h1 className="text-4xl font-bold">{buildingName}</h1>
          <p className="text-green-100 mt-1">รายการห้องทั้งหมด ({rooms.length} ห้อง)</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-green-700 mb-2">ห้อง {r.roomNumber}</div>
              <div className="text-lg text-gray-700">{r.type}</div>
              <div className="text-gray-500 mt-1">ชั้น {r.floor || '-'}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link 
            to="/map"
            className="block w-full py-4 text-center bg-gray-200 hover:bg-gray-300 rounded-2xl font-medium text-lg"
          >
            ← กลับไปแผนที่
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Detail;