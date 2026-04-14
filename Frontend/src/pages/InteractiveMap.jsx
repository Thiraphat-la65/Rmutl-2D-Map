// src/pages/InteractiveMap.jsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { FaBars, FaMapMarkerAlt, FaBuilding, FaRoad, FaWater, FaEraser, FaArrowLeft, FaDoorOpen, FaCar, FaUniversity, FaBriefcase, FaLayerGroup, FaMapSigns, FaMoneyCheckAlt, FaPiggyBank, FaHeartbeat, FaHospital, FaRunning, FaUtensils, FaCoffee, FaBook, FaUsers, FaCalendarAlt, FaRestroom, FaShieldAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosWater } from "react-icons/io";
import { MdFactory } from "react-icons/md";

const InteractiveMap = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [layers, setLayers] = useState({
    greenArea: false,
    buildings: false,
    roads: false,
    waterBody: false,
    universityGate: false,
    yellowSign: false,
    yellowRoute: false,
    redSign: false,
    redRoute: false,
    blueRoute: false,
    parking: false,
    faculties: false,
    Factory: false,
    atms: false,
    banks: false,
    hospitals: false,
    sports: false,
    foodCourts: false,
    coffeeShops: false,
    groupStudyRooms: false,
    workspaces: false,
    eventVenues: false,
    currentFestivals: false,
    publicRestrooms: false,
    safeZones: false,
  });
  const layerRefs = useRef({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('buildingsPlaces');

  // ฟังก์ชันดึงข้อมูลอาคาร
  const fetchBuildingRooms = async (buildingName, buildingTitle, description, imageName, defaultLat, defaultLng) => {
    try {
      const response = await fetch(`http://localhost:3001/api/rooms?buildingName=${encodeURIComponent(buildingName)}`);
      if (!response.ok) throw new Error(`ไม่สามารถดึงข้อมูล ${buildingName}`);

      const rooms = await response.json();
      const layer = L.layerGroup();

      rooms.forEach((room) => {
        const lat = room.building?.lat || defaultLat;
        const lng = room.building?.lng || defaultLng;

        const popupContent = `
          <div class="p-4 max-w-sm">
            <img src="/assets/images/${imageName}" 
                 alt="${buildingTitle}" 
                 class="w-full h-52 object-cover rounded-xl mb-4" 
                 onerror="this.src='/assets/images/placeholder.jpg'">
            <h3 class="font-bold text-2xl text-gray-800 mb-1">${buildingTitle}</h3>
            <p class="text-gray-600 mb-4">${description}</p>
            
            <div class="text-sm text-gray-500 mb-4">
              ห้อง ${room.roomNumber || 'N/A'} • ชั้น ${room.floor || '-'} • ${room.type || 'ไม่ระบุ'}
            </div>

            <div class="flex gap-3">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                 target="_blank" 
                 class="flex-1 py-3 text-center bg-[#00843D] text-white rounded-xl hover:bg-[#006633]">
                นำทาง
              </a>
              <!-- แก้ตรงนี้สำคัญมาก -->
              <a href="/detail/${encodeURIComponent(room.roomNumber)}" 
                 class="flex-1 py-3 text-center bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                รายละเอียด
              </a>
            </div>
          </div>
        `;

        const customIcon = L.icon({
          iconUrl: '/assets/images/marker-building.png',
          iconSize: [52, 52],
          iconAnchor: [26, 52],
          popupAnchor: [0, -52],
          className: 'custom-marker-icon'
        });

        L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popupContent, { maxWidth: 380 })
          .addTo(layer);
      });

      return layer;
    } catch (error) {
      console.error(`ดึงข้อมูล ${buildingName} ล้มเหลว:`, error);
      toast.error(`ไม่สามารถโหลดข้อมูล ${buildingName}`);
      return L.layerGroup();
    }
  };

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        minZoom: 14,
        maxZoom: 19,
      }).setView([16.862993664376827, 100.18312689977077], 16);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

      const wmsUrl = 'http://geonode.gistnu.nu.ac.th/geoserver/wms';

      const createWmsLayer = (layerName, popupText) =>
        L.tileLayer.wms(wmsUrl, {
          layers: layerName,
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          opacity: 0.7,
        }).bindPopup(popupText);


      const fetchUniversityGates = () => {
        const gateLayer = L.layerGroup();

        const extraGateMarkers = [
          {
            lat: 16.86385422918074,
            lng: 100.18808236678613,
            iconUrl: '/assets/images/ป้ายประตูทางเข้า.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ป้ายประตูทางเข้า.jpg" alt="ป้ายมหาวิทยาลัย" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ป้ายมหาวิทยาลัย</h3>
                <p class="text-sm text-gray-600 mb-3">ทางเข้าหลักจากถนนพิษณุโลก-วัดโบสถ์</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8635,100.1830" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
            `
          },

        ];

        extraGateMarkers.forEach(m => {
          const customGateIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-marker.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customGateIcon })
            .bindPopup(m.popup)
            .addTo(gateLayer);
        });

        return gateLayer;
      };
      // เพิ่มส่วนที่จอดรถ (parking) แบบ marker แมนนวล
      const fetchParkingLots = () => {
        const parkingLayer = L.layerGroup();

        // จุดที่จอดรถ (ตัวอย่าง 3 จุด คุณแก้ lat/lng + iconUrl + ชื่อจริงได้เลย)
        const extraParkingMarkers = [
          {
            lat: 16.86369508343146,
            lng: 100.18759416137965,
            iconUrl: '/assets/images/parking-lot1.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/parking-lot1.jpg" alt="ที่จอดรถหลัก" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ที่จอดรถหลัก (ลาน A)</h3>
                <p class="text-sm text-gray-600 mb-3">ที่จอดรถใกล้ตึกบริหาร 300 คัน</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8628,100.1820" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
            `
          },
          {
            lat: 16.8625970566857,
            lng: 100.1873822839576,
            iconUrl: '/assets/images/parking-lot2.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/parking-lot2.jpg" alt="ที่จอดรถคณะวิศวะ" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ที่จอดรถคณะวิศวะ (ลาน B)</h3>
                <p class="text-sm text-gray-600 mb-3">ที่จอดรถสำหรับนักศึกษาและบุคลากร 150 คัน</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8612,100.1818" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
            `
          },
          {
            lat: 16.862999400187896,
            lng: 100.18492933511493,
            iconUrl: '/assets/images/parking-lot3.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/parking-lot3.jpg" alt="ที่จอดรถแขก" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ที่จอดรถแขก (ลาน C)</h3>
                <p class="text-sm text-gray-600 mb-3">ที่จอดรถสำหรับผู้มาเยือนและพิธีการ 100 คัน</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8640,100.1845" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          // เพิ่มจุดที่จอดรถอื่น ๆ ได้ที่นี่
        ];
        extraParkingMarkers.forEach(m => {
          const customParkingIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-parking.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customParkingIcon })
            .bindPopup(m.popup)
            .addTo(parkingLayer);
        });

        return parkingLayer;
      };
      const fetchATMs = () => {
        const atmLayer = L.layerGroup();

        // จุดตู้ ATM (ตัวอย่าง 3 จุด คุณแก้ lat/lng + iconUrl + ชื่อธนาคารได้เลย)
        const extraATMsMarkers = [
          {
            lat: 16.86391328038449,
            lng: 100.18766989679148,
            iconUrl: '/assets/images/ตู้เอทีเอ็ม.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ตู้เอทีเอ็ม.jpg" alt="ตู้ ATM กรุงไทย" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ตู้ ATM ธนาคารกรุงไทย</h3>
                <p class="text-sm text-gray-600 mb-3">ใกล้ตึกบริหาร ใช้งานได้ 24 ชม.</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8629,100.1835" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },

        ];

        extraATMsMarkers.forEach(m => {
          const customATMIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-atm.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customATMIcon })
            .bindPopup(m.popup)
            .addTo(atmLayer);
        });

        return atmLayer;
      };
      const fetchHospitals = () => {
        const hospitalLayer = L.layerGroup();

        // จุดห้องพยาบาล/จุดบริการสุขภาพ (ตัวอย่าง 2 จุด คุณแก้ lat/lng + iconUrl + ชื่อจริงได้เลย)
        const extraHospitalsMarkers = [
          {
            lat: 16.862157186604097,
            lng: 100.18290707284034,
            iconUrl: '/assets/images/hospital-main.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/hospital-main.jpg" alt="ห้องพยาบาลหลัก" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ห้องพยาบาลหลัก (Health Center)</h3>
                <p class="text-sm text-gray-600 mb-3">เปิดบริการ จันทร์-ศุกร์ 08:30-16:30 น. เบอร์ติดต่อ: 055-XXX-XXXX</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8624,100.1838" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          {
            lat: 16.8631,
            lng: 100.1852,
            iconUrl: '/assets/images/ห้องพยาบาล 2.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ห้องพยาบาล 2.jpg" alt="จุดปฐมพยาบาล" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">จุดปฐมพยาบาลสโม</h3>
                <p class="text-sm text-gray-600 mb-3">บริการเบื้องต้นสำหรับนักศึกษาและบุคลากรในพื้นที่เกษตร เปิดตามเวลาทำการ</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8631,100.1852" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          // เพิ่มจุดห้องพยาบาล/จุดปฐมพยาบาลอื่น ๆ ได้ที่นี่ (เช่น ใกล้ตึกเรียนรวม, คณะวิศวะ ฯลฯ)
        ];

        extraHospitalsMarkers.forEach(m => {
          const customHospitalIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-hospital.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customHospitalIcon })
            .bindPopup(m.popup)
            .addTo(hospitalLayer);
        });

        return hospitalLayer;
      };
      const fetchSportsFacilities = () => {
        const sportsLayer = L.layerGroup();

        // จุดสนาม/พื้นที่กีฬา (ตัวอย่าง 4 จุด คุณแก้ lat/lng + iconUrl + ชื่อจริงได้เลย)
        const extraSportsMarkers = [
          {
            lat: 16.86303303756103,
            lng: 100.18339250375605,
            iconUrl: '/assets/images/สนามฟุตบอล.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามฟุตบอล.jpg" alt="สนามฟุตบอล" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">สนามฟุตบอลหลัก</h3>
                <p class="text-sm text-gray-600 mb-3">สนามหญ้าเทียม ขนาดมาตรฐาน ใช้ฝึกซ้อมและแข่งขัน</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8618,100.1842" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.863307248624547,
            lng: 100.18526220406751,
            iconUrl: '/assets/images/อาคารอเนกประสงค์.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/อาคารอเนกประสงค์.jpg" alt="อาคารกีฬาในร่ม" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">อาคารกีฬาในร่ม (Gymnasium)</h3>
                <p class="text-sm text-gray-600 mb-3">มีสนามบาสเก็ตบอล วอลเลย์บอล แบดมินตัน เปิดทุกวัน 06:00-22:00 น.</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8627,100.1829" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.862618899236892,
            lng: 100.18262153887437,
            iconUrl: '/assets/images/สนามบาส.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามบาส.jpg" alt="สนามบาสเก็ตบอลกลางแจ้ง" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">สนามบาสเก็ตบอลกลางแจ้ง</h3>
                <p class="text-sm text-gray-600 mb-3">สนามมาตรฐาน 2 คอร์ท เปิดฟรีสำหรับนักศึกษา</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8605,100.1810" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.86338494059134,
            lng: 100.18448908168865,
            iconUrl: '/assets/images/สนามฟุตบอล.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามฟุตบอล.jpg" alt="ลู่วิ่งและสนามบอล" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ลู่วิ่งและสนามบอล</h3>
                <p class="text-sm text-gray-600 mb-3">ลู่วิ่งยาว 400 เมตร + สนามบอล ใช้ฝึกซ้อมและจัดงานแข่งขัน</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8645,100.1865" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.863128053554888,
            lng: 100.18258194512194,
            iconUrl: '/assets/images/สนามฟุตบอล.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามฟุตบอล.jpg" alt="สนามบอลเล่" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">สนามบอลเล่</h3>
                <p class="text-sm text-gray-600 mb-3">สนามมาตรฐาน 2 สนาม เปิดฟรีสำหรับนักศึกษา</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8645,100.1865" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.86223477886746,
            lng: 100.182227893528,
            iconUrl: '/assets/images/สนามฟุตบอล.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามฟุตบอล.jpg" alt="สนามฟุตซอล" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">สนามฟุตซอล</h3>
                <p class="text-sm text-gray-600 mb-3">สนามมาตรฐาน เปิดฟรีสำหรับนักศึกษา</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8645,100.1865" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.863332189065353,
            lng: 100.18697553875731,
            iconUrl: '/assets/images/สนามฟุตบอล.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามฟุตบอล.jpg" alt="สนามเซปะตะกร้อ" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">สนามเซปะตะกร้อ</h3>
                <p class="text-sm text-gray-600 mb-3">สนามมาตรฐาน เปิดฟรีสำหรับนักศึกษา</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8645,100.1865" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          {
            lat: 16.863521446635307,
            lng: 100.1872051973071,
            iconUrl: '/assets/images/สนามฟุตบอล.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/สนามฟุตบอล.jpg" alt="สนามแบตมินตั้น" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">สนามแบตมินตั้น</h3>
                <p class="text-sm text-gray-600 mb-3">สนามมาตรฐาน เปิดฟรีสำหรับนักศึกษา</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8645,100.1865" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
              </div>
            `
          },
          // เพิ่มจุดกีฬาอื่น ๆ ได้ที่นี่ (เช่น สนามวอลเลย์บอล, ยิมนาสติก, ว่ายน้ำ ฯลฯ)
        ];

        extraSportsMarkers.forEach(m => {
          const customSportsIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-sports.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customSportsIcon })
            .bindPopup(m.popup)
            .addTo(sportsLayer);
        });

        return sportsLayer;
      };
      const fetchFoodCourts = () => {
        const foodCourtLayer = L.layerGroup();

        const extraFoodCourtsMarkers = [
          {
            lat: 16.86268085344869,
            lng: 100.18451364142811,
            iconUrl: '/assets/images/โรงอาหาร.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/โรงอาหาร.jpg" alt="ศูนย์อาหารกลาง" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ศูนย์อาหารกลาง (Central Food Court)</h3>
                <p class="text-sm text-gray-600 mb-3">ร้านอาหารหลากหลาย เปิด 07:00-20:00 น. ราคานักศึกษา 25-50 บาท</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8621,100.1830" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          // เพิ่มศูนย์อาหารอื่น ๆ ได้ที่นี่
        ];

        extraFoodCourtsMarkers.forEach(m => {
          const customFoodCourtIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-foodcourt.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customFoodCourtIcon })
            .bindPopup(m.popup)
            .addTo(foodCourtLayer);
        });

        return foodCourtLayer;
      };

      // เพิ่มส่วนร้านกาแฟ (coffeeShops) แบบ marker แมนนวล
      const fetchCoffeeShops = () => {
        const coffeeLayer = L.layerGroup();

        const extraCoffeeShopsMarkers = [
          {
            lat: 16.86282115467969,
            lng: 100.18499405440193,
            iconUrl: '/assets/images/ร้านกาแฟเนี่ย.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ร้านกาแฟเนี่ย.jpg" alt="COFFE MANIA" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">COFFE MANIA</h3>
                <p class="text-sm text-gray-600 mb-3">กาแฟสด น้ำผลไม้ ขนม เปิด 08:00-20:00 น.</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8620,100.1825" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          {
            lat: 16.86083083271833,
            lng: 100.18156498808797,
            iconUrl: '/assets/images/ลิตเติลบี.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ลิตเติลบี.jpg" alt="ร้านกาแฟลิตเติลบี" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ร้านกาแฟลิตเติลบี</h3>
                <p class="text-sm text-gray-600 mb-3">กาแฟราคานักศึกษา เริ่มต้น 25 บาท เปิด 07:00-18:00 น.</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8613,100.1817" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          {
            lat: 16.863167452480237,
            lng: 100.18196888541955,
            iconUrl: '/assets/images/ร้านกาแฟบับเบิ้ลฮันนี่.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ร้านกาแฟบับเบิ้ลฮันนี่.jpg" alt="ร้านกาแฟบับเบิ้ลฮันนี่" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ร้านกาแฟบับเบิ้ลฮันนี่</h3>
                <p class="text-sm text-gray-600 mb-3">กาแฟราคานักศึกษา เริ่มต้น 20 บาท เปิด 08:30-17:00 น.</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8613,100.1817" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          {
            lat: 16.862572655000566,
            lng: 100.18715439289973,
            iconUrl: '/assets/images/ร้านกาแฟดด.jpg',
            popup: `
              <div class="p-3 max-w-xs">
                <img src="/assets/images/ร้านกาแฟดด.jpg" alt="ร้านกาแฟ" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                <h3 class="font-bold text-xl text-gray-800 mb-1">ร้านกาแฟบับเบิ้ลฮันนี่</h3>
                <p class="text-sm text-gray-600 mb-3">กาแฟราคานักศึกษา เริ่มต้น 20 บาท เปิด 08:30-17:00 น.</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=16.8613,100.1817" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                  นำทางด้วย Google Maps
                </a>
                <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
              </div>
            `
          },
          // เพิ่มร้านกาแฟอื่น ๆ ได้ที่นี่
        ];

        extraCoffeeShopsMarkers.forEach(m => {
          const customCoffeeIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-coffee.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customCoffeeIcon })
            .bindPopup(m.popup)
            .addTo(coffeeLayer);
        });

        return coffeeLayer;
      };
      const fetchGroupStudyRooms = () => {
        const groupStudyLayer = L.layerGroup();

        const extraGroupStudyMarkers = [

          {
            lat: 16.861695178052237,
            lng: 100.18070653325297,
            iconUrl: '/assets/images/study-group2.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/study-group2.jpg" alt="ห้องสมุด " class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">ห้องค้นคว้ากลุ่ม B (ตึกคอมพิวเตอร์)</h3>
          <p class="text-sm text-gray-600 mb-3">จุ 6 คน มีคอมพิวเตอร์ + Wi-Fi เร็ว เปิด 24 ชม. (ต้องใช้บัตรนักศึกษา)</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.8626,100.1841" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },
          // เพิ่มห้องค้นคว้ากลุ่มอื่น ๆ ได้ที่นี่
        ]
        extraGroupStudyMarkers.forEach(m => {
          const customGroupStudyIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-study-group.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customGroupStudyIcon })
            .bindPopup(m.popup)
            .addTo(groupStudyLayer);
        });

        return groupStudyLayer;
      };
      const fetchWorkspaces = () => {
        const workspaceLayer = L.layerGroup();

        const extraWorkspacesMarkers = [
          {
            lat: 16.8617237234707,
            lng: 100.18081112316833,
            iconUrl: '/assets/images/workspace-library.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/workspace-library.jpg" alt="มุมทำงานห้องสมุด" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">มุมทำงานเงียบ ห้องสมุด</h3>
          <p class="text-sm text-gray-600 mb-3">ที่นั่งเดี่ยว 50 ที่ มีปลั๊ก + Wi-Fi เปิด 08:00-21:00 น. ห้ามเสียงดัง</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.8615,100.1828" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },

          // เพิ่มพื้นที่ทำงานอื่น ๆ ได้ที่นี่
        ];

        extraWorkspacesMarkers.forEach(m => {
          const customWorkspaceIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-workspace.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customWorkspaceIcon })
            .bindPopup(m.popup)
            .addTo(workspaceLayer);
        });

        return workspaceLayer;
      };
      const fetchPublicRestrooms = () => {
        const restroomLayer = L.layerGroup();

        // จุดห้องน้ำสาธารณะ (ตัวอย่าง 4 จุด คุณแก้ lat/lng + iconUrl + ชื่อจริงได้เลย)
        const extraPublicRestroomsMarkers = [
          {
            lat: 16.86165787305835,
            lng: 100.18073506403448,
            iconUrl: '/assets/images/restroom-building1.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/restroom-building1.jpg" alt="ห้องน้ำตึก 14" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">ห้องน้ำตึก 14 (ทุกชั้น)</h3>
          <p class="text-sm text-gray-600 mb-3">สะอาดดี เปิด 06:00-22:00 น.</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.86205,100.18275" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },
          {
            lat: 16.863942386311123,
            lng: 100.18757626054646,
            iconUrl: '/assets/images/restroom-faculty.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/restroom-faculty.jpg" alt="ห้องน้ำคณะประมง" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">ห้องน้ำคณะประมง (ชั้นล่าง)</h3>
          <p class="text-sm text-gray-600 mb-3">สะอาดปานกลาง เปิด 24 ชม. มีห้องน้ำชาย-หญิงแยก</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.86345,100.1857" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },
          {
            lat: 16.8612,
            lng: 100.1818,
            iconUrl: '/assets/images/restroom-library.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/restroom-library.jpg" alt="ห้องน้ำห้องสมุด" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">ห้องน้ำห้องสมุด (ชั้น 1-3)</h3>
          <p class="text-sm text-gray-600 mb-3">สะอาดมาก มีห้องน้ำสำหรับผู้พิการ เปิดตามเวลาห้องสมุด</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.8612,100.1818" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },
          {
            lat: 16.8639,
            lng: 100.1848,
            iconUrl: '/assets/images/restroom-sports.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/restroom-sports.jpg" alt="ห้องน้ำใกล้สนามกีฬา" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">ห้องน้ำอาคารกีฬา</h3>
          <p class="text-sm text-gray-600 mb-3">สะอาดปานกลาง มีห้องอาบน้ำแยกชาย-หญิง เปิดตามเวลาสนาม</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.8639,100.1848" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },
          // คุณสามารถเพิ่มจุดห้องน้ำอื่น ๆ ได้ที่นี่ตามจริง
        ];

        extraPublicRestroomsMarkers.forEach(m => {
          const customRestroomIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-restroom.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customRestroomIcon })
            .bindPopup(m.popup)
            .addTo(restroomLayer);
        });

        return restroomLayer;
      };
      const fetchSafeZones = () => {
        const safeZoneLayer = L.layerGroup();

        // จุดพื้นที่ปลอดภัย (ตัวอย่าง 4 จุด คุณแก้ lat/lng + iconUrl + ชื่อจริงได้เลย)
        const extraSafeZonesMarkers = [

          {
            lat: 16.863917396070644,
            lng: 100.18789058504389,
            iconUrl: '/assets/images/safezone-sports.jpg',
            popup: `
        <div class="p-3 max-w-xs">
          <img src="/assets/images/safezone-sports.jpg" alt="ป้อมยามพื้นที่ปลอดภัย" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
          <h3 class="font-bold text-xl text-gray-800 mb-1">พื้นที่ปลอดภัยใกล้สนามกีฬา</h3>
          <p class="text-sm text-gray-600 mb-3">ป้อมยามมีไฟส่องสว่างรอบด้าน + กล้องวงจรปิด</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=16.86425,100.18625" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#77DD77] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
            นำทางด้วย Google Maps
          </a>
          <button 
                  onclick="alert('หน้ารายละเอียดของสถานที่นี้กำลังพัฒนาอยู่ครับ จะแจ้งให้ทราบเมื่อพร้อมใช้งาน')"
                  class="block w-full px-4 py-2.5 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  รายละเอียด
                  </button>
        </div>
      `
          },
          // เพิ่มจุดอื่น ๆ ได้ที่นี่ตามความต้องการจริง
        ];

        extraSafeZonesMarkers.forEach(m => {
          const customSafeZoneIcon = L.icon({
            iconUrl: m.iconUrl || '/assets/images/default-safezone.png',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
            className: 'custom-marker-icon'
          });

          L.marker([m.lat, m.lng], { icon: customSafeZoneIcon })
            .bindPopup(m.popup)
            .addTo(safeZoneLayer);
        });

        return safeZoneLayer;
      };

      layerRefs.current = {
        greenArea: createWmsLayer('nu_green_area', 'พื้นที่สีเขียวภายในมหาวิทยาลัยนเรศวร'),
        buildings: createWmsLayer('nu_building', 'พื้นที่สิ่งปลูกสร้าง'),
        roads: createWmsLayer('nu_road', 'พื้นที่ถนน'),
        waterBody: createWmsLayer('nu_water_body', 'พื้นที่แหล่งน้ำ'),
        universityGate: createWmsLayer('nu_university_gate', 'ประตูมหาวิทยาลัย'),
        parking: createWmsLayer('nu_parking', 'ที่จอดรถ'),
        faculties: null,
        Factory: createWmsLayer('nu_Factorys', 'โรงงาน'),
        atms: createWmsLayer('nu_atms', 'ตู้กดเงิน'),
        banks: createWmsLayer('nu_banks', 'ธนาคาร'),
        hospitals: createWmsLayer('nu_hospitals', 'โรงพยาบาล'),
        sports: createWmsLayer('nu_sports', 'กิจกรรม/กีฬา'),
        foodCourts: createWmsLayer('nu_food_courts', 'ศูนย์อาหาร'),
        coffeeShops: createWmsLayer('nu_coffee_shops', 'ร้านกาแฟ'),
        groupStudyRooms: createWmsLayer('nu_group_study_rooms', 'ห้องค้นคว้ากลุ่ม'),
        workspaces: createWmsLayer('nu_workspaces', 'พื้นที่ทำงาน'),
        eventVenues: createWmsLayer('nu_event_venues', 'ที่จัดกิจกรรม'),
        currentFestivals: createWmsLayer('nu_current_festivals', 'งานเทศกาลช่วงนี้'),
        publicRestrooms: createWmsLayer('nu_public_restrooms', 'ห้องน้ำสาธารณะ'),
        safeZones: createWmsLayer('nu_safe_zones', 'โซนปลอดภัย'),
      };

      Promise.all([
        fetchBuildingRooms('อาคาร 13', 'อาคาร 13', 'อาคารสาขาวิชาประมง', 'อาคาร 13.jpg', 16.86396506882284, 100.18763199968545),
        fetchBuildingRooms('อาคาร 16', 'อาคาร 16', 'อาคารคณะวิทยาศาสตร์และเทคโนโลยีการเกษตร', 'อาคาร 16.jpg', 16.862553329722466, 100.18717690522605)
      ]).then(([layer13, layer16]) => {
        // รวม marker ทั้งสองอาคารเข้าเลเยอร์เดียว
        const combinedLayer = L.layerGroup();
        layer13.eachLayer(marker => marker.addTo(combinedLayer));
        layer16.eachLayer(marker => marker.addTo(combinedLayer));

        layerRefs.current.faculties = combinedLayer;

        if (layers.faculties) {
          combinedLayer.addTo(mapRef.current);
        }
      });


      const gateLayer = fetchUniversityGates();
      layerRefs.current.universityGate = gateLayer;
      if (layers.universityGate) {
        gateLayer.addTo(mapRef.current);
      }
      const parkingLayer = fetchParkingLots();
      layerRefs.current.parking = parkingLayer;
      if (layers.parking) {
        parkingLayer.addTo(mapRef.current);
      }
      const atmLayer = fetchATMs();
      layerRefs.current.atms = atmLayer;
      if (layers.atms) {
        atmLayer.addTo(mapRef.current);
      }
      const hospitalLayer = fetchHospitals();
      layerRefs.current.hospitals = hospitalLayer;
      if (layers.hospitals) {
        hospitalLayer.addTo(mapRef.current);
      }
      const sportsLayer = fetchSportsFacilities();
      layerRefs.current.sports = sportsLayer;
      if (layers.sports) {
        sportsLayer.addTo(mapRef.current);
      }
      const foodCourtLayer = fetchFoodCourts();
      layerRefs.current.foodCourts = foodCourtLayer;
      if (layers.foodCourts) {
        foodCourtLayer.addTo(mapRef.current);
      }

      const coffeeLayer = fetchCoffeeShops();
      layerRefs.current.coffeeShops = coffeeLayer;
      if (layers.coffeeShops) {
        coffeeLayer.addTo(mapRef.current);
      }
      const groupStudyLayer = fetchGroupStudyRooms();
      layerRefs.current.groupStudyRooms = groupStudyLayer;
      if (layers.groupStudyRooms) {
        groupStudyLayer.addTo(mapRef.current);
      }
      const workspaceLayer = fetchWorkspaces();
      layerRefs.current.workspaces = workspaceLayer;
      if (layers.workspaces) {
        workspaceLayer.addTo(mapRef.current);
      }
      const restroomLayer = fetchPublicRestrooms();
      layerRefs.current.publicRestrooms = restroomLayer;
      if (layers.publicRestrooms) {
        restroomLayer.addTo(mapRef.current);
      }
      const safeZoneLayer = fetchSafeZones();
      layerRefs.current.safeZones = safeZoneLayer;
      if (layers.safeZones) {
        safeZoneLayer.addTo(mapRef.current);
      }
      Object.keys(layers).forEach((layerName) => {
        if (layers[layerName] && layerRefs.current[layerName]) {
          layerRefs.current[layerName].addTo(mapRef.current);
        }
      });
    }

    const toggleLayer = (layerName, show) => {
      if (mapRef.current && layerRefs.current[layerName]) {
        if (show) {
          layerRefs.current[layerName].addTo(mapRef.current);
        } else {
          mapRef.current.removeLayer(layerRefs.current[layerName]);
        }
      }
    };

    Object.keys(layers).forEach((layerName) => toggleLayer(layerName, layers[layerName]));

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [layers]);

  const handleLayerToggle = (layerName) => {
    setLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const clearFilters = () => {
    setLayers({
      greenArea: false,
      buildings: false,
      roads: false,
      waterBody: false,
      universityGate: false,
      yellowSign: false,
      yellowRoute: false,
      redSign: false,
      redRoute: false,
      blueRoute: false,
      parking: false,
      faculties: false,
      Factory: false,
      atms: false,
      banks: false,
      hospitals: false,
      sports: false,
      foodCourts: false,
      coffeeShops: false,
      groupStudyRooms: false,
      workspaces: false,
      eventVenues: false,
      currentFestivals: false,
      publicRestrooms: false,
      safeZones: false,
    });
    toast.success('เคลียร์เลเยอร์ทั้งหมดแล้ว', { autoClose: 2000 });
  };

  const sections = [
    { id: 'buildingsPlaces', name: 'อาคารสถานที่', icon: <FaBuilding className="text-xl" /> },
    { id: 'transportation', name: 'การเดินทาง', icon: <FaMapSigns className="text-xl" /> },
    { id: 'financial', name: 'ธุรกรรมทางการเงิน', icon: <FaMoneyCheckAlt className="text-xl" /> },
    { id: 'healthSports', name: 'สุขภาพและกีฬา', icon: <FaHeartbeat className="text-xl" /> },
    { id: 'foodBeverage', name: 'อาหารและเครื่องดื่ม', icon: <FaUtensils className="text-xl" /> },
    { id: 'learningSpaces', name: 'พื้นที่เรียนรู้', icon: <FaBook className="text-xl" /> },
    { id: 'publicRestrooms', name: 'ห้องน้ำสาธารณะ', icon: <FaRestroom className="text-xl" /> },
    { id: 'publicSafety', name: 'ความปลอดภัยสาธารณะ', icon: <FaShieldAlt className="text-xl" /> },
    { id: 'backHome', name: 'กลับหน้าหลัก', icon: <FaArrowLeft className="text-xl" />, isBackButton: true },
  ];

  const layerGroups = {

    buildingsPlaces: [
      { id: 'faculties', name: 'คณะและวิทยาลัย', icon: <FaUniversity className="mr-2 text-green-600" /> },
      { id: 'Factory', name: 'โรงงาน', icon: <MdFactory className="mr-2 text-green-600" /> },

    ],
    transportation: [
      { id: 'universityGate', name: 'ป้ายมหาวิทยาลัย', icon: <FaDoorOpen className="mr-2 text-green-600" /> },
      { id: 'parking', name: 'ที่จอดรถ', icon: <FaCar className="mr-2 text-green-600" /> },
    ],
    financial: [
      { id: 'atms', name: 'ตู้กดเงิน', icon: <FaMoneyCheckAlt className="mr-2 text-green-600" /> },
    ],
    healthSports: [
      { id: 'hospitals', name: 'ห้องพยาบาล', icon: <FaHospital className="mr-2 text-green-600" /> },
      { id: 'sports', name: 'กิจกรรม/กีฬา', icon: <FaRunning className="mr-2 text-green-600" /> },
    ],
    foodBeverage: [
      { id: 'foodCourts', name: 'ศูนย์อาหาร', icon: <FaUtensils className="mr-2 text-green-600" /> },
      { id: 'coffeeShops', name: 'ร้านกาแฟ', icon: <FaCoffee className="mr-2 text-green-600" /> },
    ],
    learningSpaces: [
      { id: 'workspaces', name: 'ห้องสมุด', icon: <FaBook className="mr-2 text-green-600" /> },
      { id: 'groupStudyRooms', name: 'ห้องทำงาน', icon: <FaUsers className="mr-2 text-green-600" /> },
    ],
    publicRestrooms: [
      { id: 'publicRestrooms', name: 'ห้องน้ำสาธารณะ', icon: <FaRestroom className="mr-2 text-green-600" /> },
    ],
    publicSafety: [
      { id: 'safeZones', name: 'โซนปลอดภัย', icon: <FaShieldAlt className="mr-2 text-green-600" /> },
    ],
  };

  return (
    <div className="relative h-screen flex flex-col bg-gray-100">
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          font-family: 'Prompt', sans-serif;
          max-width: 340px;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-tip {
          background: #ffffff;
        }
        .custom-marker-icon {
          background: white;
          border: 3px solid #77DD77;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          padding: 4px;
        }
      `}</style>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      {/* แถบด้านบน – สีเขียว RMUTL */}
      <div className="bg-gradient-to-r from-[#77DD77] to-[#006400] text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/images/rmutl-logo.png"
            alt="โลโก้มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา"
            className="h-10 w-auto transition-transform duration-300 hover:scale-110"
          />
          <span className="text-2xl font-bold tracking-wide">RMUTL 2D MAP</span>
        </div>
        <button
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
          onClick={toggleSidebar}
          aria-label="สลับแถบด้านข้าง"
        >
          <FaBars className="text-xl" />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`bg-white shadow-xl transition-width duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden`}
          style={{ zIndex: 1000 }}
        >
          <div className={`flex h-full ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <div className="w-12 bg-green-50 flex flex-col items-center py-4 border-r border-gray-200">
              {sections.map((section) => (
                section.isBackButton ? (
                  <Link
                    key={section.id}
                    to="/"
                    className="w-full p-3 text-green-700 hover:bg-green-100 transition-all duration-300 flex items-center justify-center hover:scale-110"
                    title={section.name}
                    aria-label={`เลือก${section.name}`}
                  >
                    {section.icon}
                  </Link>
                ) : (
                  <button
                    key={section.id}
                    className={`w-full p-3 text-green-700 hover:bg-green-100 transition-all duration-300 flex items-center justify-center hover:scale-110 ${activeSection === section.id ? 'bg-[#77DD77] text-white' : ''
                      }`}
                    onClick={() => setActiveSection(section.id)}
                    title={section.name}
                    aria-label={`เลือก${section.name}`}
                  >
                    {section.icon}
                  </button>
                )
              ))}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-green-50 to-white">
              <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
                {sections.find((s) => s.id === activeSection)?.name}
              </h3>
              <ul className="space-y-2">
                {layerGroups[activeSection]?.map((layer) => (
                  <li key={layer.id}>
                    <button
                      className={`w-full flex items-center p-2 rounded-lg text-gray-700 hover:bg-green-100 transition-all duration-300 shadow-sm ${layers[layer.id] ? 'bg-green-200 text-gray-800' : 'bg-white'
                        }`}
                      onClick={() => handleLayerToggle(layer.id)}
                    >
                      {layer.icon}
                      {layer.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <button
                  className="w-full flex items-center justify-center p-2 rounded-lg bg-green-100 text-gray-700 hover:bg-green-200 transition-all duration-300 shadow-sm"
                  onClick={clearFilters}
                >
                  <FaEraser className="mr-2 text-green-600" />
                  เคลียร์เลเยอร์
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          id="map"
          ref={mapContainerRef}
          className="flex-1 border-2 border-green-300 rounded-lg shadow-md hover:border-green-500 transition-all duration-300"
          style={{ height: 'calc(100vh - 64px)' }}
        />
      </div>
    </div>
  );
};

export default InteractiveMap;