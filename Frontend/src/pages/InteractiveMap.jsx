// src/pages/InteractiveMap.jsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { FaBars, FaMapMarkerAlt, FaBuilding, FaRoad, FaWater, FaEraser, FaArrowLeft, FaDoorOpen,  FaCar, FaUniversity, FaBriefcase, FaLayerGroup, FaMapSigns, FaMoneyCheckAlt, FaPiggyBank, FaHeartbeat, FaHospital, FaRunning, FaUtensils, FaCoffee, FaBook, FaUsers, FaCalendarAlt, FaRestroom, FaShieldAlt } from 'react-icons/fa';
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
    offices: false,
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
  const [activeSection, setActiveSection] = useState('dataLayers');

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        minZoom: 14,
        maxZoom: 19,
      }).setView([16.862993664376827, 100.18312689977077], 16);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

      const wmsUrl = 'http://geonode.gistnu.nu.ac.th/geoserver/wms';

      const createWmsLayer = (layerName, popupText) => {
        const layer = L.tileLayer.wms(wmsUrl, {
          layers: layerName,
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          opacity: 0.7,
        }).bindPopup(popupText);
        layer.on('load', () => console.log(`${layerName} เลเยอร์โหลดสำเร็จ`));
        layer.on('error', () => {
          console.error(`${layerName} เลเยอร์โหลดไม่สำเร็จ`);
          toast.error(`ไม่สามารถโหลดเลเยอร์ ${popupText} ได้`, { autoClose: 3000 });
        });
        return layer;
      };

      const facultyIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="#ff4444" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const officeIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="#1e90ff" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const fetchFacultiesGeoJSON = async () => {
        try {
          const response = await fetch('/faculties.geojson');
          if (!response.ok) throw new Error(`ข้อผิดพลาด HTTP ${response.status}`);
          const geojson = await response.json();

          const facultyLayer = L.geoJSON(geojson, {
            pointToLayer: (feature, latlng) => {
              const [lng, lat] = feature.geometry.coordinates;
              const popupContent = `
                <div class="p-4 max-w-xs">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">${feature.properties.name}</h3>
                  <img src="${feature.properties.image || '/assets/images/placeholder.jpg'}" alt="${feature.properties.name}" class="w-full h-32 object-cover rounded-lg mb-2" onerror="this.src='/assets/images/placeholder.jpg'" />
                  <p class="text-sm text-gray-600 mb-2">${feature.properties.description || 'ไม่มีรายละเอียด'}</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางไป${feature.properties.name}
                  </a>
                </div>
              `;
              return L.marker(latlng, { icon: facultyIcon }).bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
              });
            },
          });

          // ทุกตำแหน่งคณะและสถานที่ (ครบตามที่เคยให้มา)
          const extraMarkers = [
            {
              lat: 16.862125295303038,
              lng: 100.18487977177142,
              iconUrl: '/assets/images/พืชศาสตร์.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/พืชศาสตร์.jpg" alt="สาขาพืชศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สาขาพืชศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ฝ่ายวิชาการ วิทยาเขตพิษณุโลก</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.862125295303038,100.18487977177142" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.86396506882284,
              lng: 100.18763199968545,
              iconUrl: '/assets/images/คณะประมง.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/คณะประมง.jpg" alt="สาขาประมง1" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สาขาประมง1</h3>
                  <p class="text-sm text-gray-600 mb-3">สำนักงานประมง</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.86396506882284,100.18763199968545" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.862591611196265,
              lng: 100.18715885215336,
              iconUrl: '/assets/images/ภาพตึกคณะวิท.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/ภาพตึกคณะวิท.jpg" alt="สำนักงานคณะวิทยาศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สำนักงานคณะวิทยาศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ตึก 16</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.862591611196265,100.18715885215336" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.861634985592083,
              lng: 100.18242070453148,
              iconUrl: '/assets/images/สาขาวิทยาศาส.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/สาขาวิทยาศาส.jpg" alt="คณะวิทยาศาสตร์และเทคโนโลยีการเกษตร" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">คณะวิทยาศาสตร์และเทคโนโลยีการเกษตร</h3>
                  <p class="text-sm text-gray-600 mb-3">ฝ่ายวิชาการ วิทยาเขตพิษณุโลก</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.861634985592083,100.18242070453148" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.86308128763508,
              lng: 100.18692661412354,
              iconUrl: '/assets/images/สาขาประมง.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/สาขาประมง.jpg" alt="ทางเข้าฟาร์มปลา" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">ทางเข้าฟาร์มปลา</h3>
                  <p class="text-sm text-gray-600 mb-3">ทางเข้า ประมง</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.86308128763508,100.18692661412354" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.86127421996134,
              lng: 100.18201663492415,
              iconUrl: '/assets/images/สาขาวิชาเทโนโลยีคอมพิวเตอร์.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/สาขาวิชาเทโนโลยีคอมพิวเตอร์.jpg" alt="สาขาวิชาเทคโนโลยีคอมพิวเตอร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สาขาวิชาเทคโนโลยีคอมพิวเตอร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ตึกคอม</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.86127421996134,100.18201663492415" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.861800348704413,
              lng: 100.18178066213814,
              iconUrl: '/assets/images/อาคารเรียนรวม.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/อาคารเรียนรวม.jpg" alt="อาคารเรียนรวม" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">อาคารเรียนรวม</h3>
                  <p class="text-sm text-gray-600 mb-3">ตึกคอม</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.861800348704413,100.18178066213814" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.8617237234707,
              lng: 100.18081112316833,
              iconUrl: '/assets/images/82073fe0-de82-4efa-a2c7-b09d29dabe93.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/82073fe0-de82-4efa-a2c7-b09d29dabe93.jpg" alt="ตึก 14" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">ตึก 14</h3>
                  <p class="text-sm text-gray-600 mb-3">อาคารเรียนรวม</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.8617237234707,100.18081112316833" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.86352000024014,
              lng: 100.18251160480152,
              iconUrl: '/assets/images/590e7e1b-6c34-471f-a8ef-2d19788672ea.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/590e7e1b-6c34-471f-a8ef-2d19788672ea.jpg" alt="สัตวศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สัตวศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ป้ายสัตวศาสตร์</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.86352000024014,100.18251160480152" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.863000489298784,
              lng: 100.18235180471662,
              iconUrl: '/assets/images/คณะวิศวะ.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/คณะวิศวะ.jpg" alt="คณะวิศวกรรมศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">คณะวิศวกรรมศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ป้ายคณะวิศวะ</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.863000489298784,100.18235180471662" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.862531950885703,
              lng: 100.18149461277717,
              iconUrl: '/assets/images/94d88aaf-d62c-44c0-a650-8a5b916a4428.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/94d88aaf-d62c-44c0-a650-8a5b916a4428.jpg" alt="เครื่องจักรกลเกษตร" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">เครื่องจักรกลเกษตร</h3>
                  <p class="text-sm text-gray-600 mb-3">ป้ายประตูทางเข้า</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.862531950885703,100.18149461277717" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.861047640487723,
              lng: 100.18160565375868,
              iconUrl: '/assets/images/7e2f7b4e-b7c4-4159-9a2f-084c52afea74.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/7e2f7b4e-b7c4-4159-9a2f-084c52afea74.jpg" alt="คณะบริหารธุรกิจและศิลปศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">คณะบริหารธุรกิจและศิลปศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ตึกบริหารธุรกิจและศิลปศาสตร์</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.861047640487723,100.18160565375868" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.861042361470503,
              lng: 100.18245639018853,
              iconUrl: '/assets/images/09a69e5e-24d3-4d85-8e98-f2aaf72d78ce.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/09a69e5e-24d3-4d85-8e98-f2aaf72d78ce.jpg" alt="สาขาวิชาเทคโนโลยีการอาหาร" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สาขาวิชาเทคโนโลยีการอาหาร</h3>
                  <p class="text-sm text-gray-600 mb-3">Food Science and Technology</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.861042361470503,100.18245639018853" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
          ];

          extraMarkers.forEach(m => {
            const customIcon = L.icon({
              iconUrl: m.iconUrl || '/assets/images/default-marker.png',
              iconSize: [48, 48],
              iconAnchor: [24, 48],
              popupAnchor: [0, -48],
              className: 'custom-marker-icon'  // กรอบขาว + ขอบเขียว + เงา
            });

            L.marker([m.lat, m.lng], { icon: customIcon })
              .bindPopup(m.popup)
              .addTo(facultyLayer);
          });

          return facultyLayer;
        } catch (error) {
          console.error('ข้อผิดพลาดในการดึง GeoJSON คณะและวิทยาลัย:', error.message);
          toast.error(`ไม่สามารถโหลดข้อมูลคณะและวิทยาลัยได้: ${error.message}`, { autoClose: 5000 });
          return createWmsLayer('nu_faculties', 'คณะและวิทยาลัย');
        }
      };

      const fetchOfficesGeoJSON = async () => {
        try {
          const response = await fetch('/offices.geojson');
          if (!response.ok) throw new Error(`ข้อผิดพลาด HTTP ${response.status}`);
          const geojson = await response.json();

          const officeLayer = L.geoJSON(geojson, {
            pointToLayer: (feature, latlng) => {
              const [lng, lat] = feature.geometry.coordinates;
              const popupContent = `
                <div class="p-4 max-w-xs">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">${feature.properties.name}</h3>
                  <img src="${feature.properties.image || '/assets/images/placeholder.jpg'}" alt="${feature.properties.name}" class="w-full h-32 object-cover rounded-lg mb-2" onerror="this.src='/assets/images/placeholder.jpg'" />
                  <p class="text-sm text-gray-600 mb-2">${feature.properties.description || 'ไม่มีรายละเอียด'}</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางไป${feature.properties.name}
                  </a>
                </div>
              `;
              return L.marker(latlng, { icon: officeIcon }).bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
              });
            },
          });

          // จุดสำนักงานเพิ่มเติม (รวมจุดที่คุณส่งมา)
          const extraOfficeMarkers = [
            {
              lat: 16.86396506882284,
              lng: 100.18763199968545,
              iconUrl: '/assets/images/คณะประมง.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/คณะประมง.jpg" alt="สำนักงานประมง" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สาขาประมง1</h3>
                  <p class="text-sm text-gray-600 mb-3">สำนักงานประมง</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.86396506882284,100.18763199968545" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.862005582358734, 
              lng: 100.1849252456183,
              iconUrl: '/assets/images/สำนักงานพืชศาสตร์.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/สำนักงานพืชศาสตร์.jpg" alt="สำนักงานพืชศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สำนักงานพืชศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ฝ่ายวิชาการ วิทยาเขตพิษณุโลก</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.862125295303038,100.18487977177142" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
            {
              lat: 16.863856255053847,  
              lng: 100.18252895957103,
              iconUrl: '/assets/images/สำนักงานสัตว์วะศาสตร์.jpg',
              popup: `
                <div class="p-3 max-w-xs">
                  <img src="/assets/images/สำนักงานสัตว์วะศาสตร์.jpg" alt="สำนักงานสัตวศาสตร์" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" onerror="this.src='/assets/images/placeholder.jpg'">
                  <h3 class="font-bold text-xl text-gray-800 mb-1">สำนักงานสัตวศาสตร์</h3>
                  <p class="text-sm text-gray-600 mb-3">ฝ่ายวิชาการ วิทยาเขตพิษณุโลก</p>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=16.862125295303038,100.18487977177142" target="_blank" class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#00843D] text-white font-medium rounded-lg hover:bg-[#006633] transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9s-1.12 2.5-2.5 2.5z"/></svg>
                    นำทางด้วย Google Maps
                  </a>
                </div>
              `
            },
          ];

          extraOfficeMarkers.forEach(m => {
            const customOfficeIcon = L.icon({
              iconUrl: m.iconUrl || '/assets/images/default-marker.png',
              iconSize: [48, 48],
              iconAnchor: [24, 48],
              popupAnchor: [0, -48],
              className: 'custom-marker-icon'  // กรอบขาว + ขอบเขียว + เงา
            });

            L.marker([m.lat, m.lng], { icon: customOfficeIcon })
              .bindPopup(m.popup)
              .addTo(officeLayer);
          });

          return officeLayer;
        } catch (error) {
          console.error('ข้อผิดพลาดในการดึง GeoJSON สำนักงาน:', error.message);
          toast.error(`ไม่สามารถโหลดข้อมูลสำนักงานได้: ${error.message}`, { autoClose: 5000 });
          return createWmsLayer('nu_offices', 'สำนักงาน');
        }
      };

      layerRefs.current = {
        greenArea: createWmsLayer('nu_green_area', 'พื้นที่สีเขียวภายในมหาวิทยาลัยนเรศวร'),
        buildings: createWmsLayer('nu_building', 'พื้นที่สิ่งปลูกสร้าง'),
        roads: createWmsLayer('nu_road', 'พื้นที่ถนน'),
        waterBody: createWmsLayer('nu_water_body', 'พื้นที่แหล่งน้ำ'),
        universityGate: createWmsLayer('nu_university_gate', 'ประตูมหาวิทยาลัย'),
        parking: createWmsLayer('nu_parking', 'ที่จอดรถ'),
        faculties: null,
        offices: null,
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

      fetchFacultiesGeoJSON().then((facultyLayer) => {
        if (facultyLayer) {
          layerRefs.current.faculties = facultyLayer;
          if (layers.faculties) {
            facultyLayer.addTo(mapRef.current);
          }
        }
      });

      fetchOfficesGeoJSON().then((officeLayer) => {
        if (officeLayer) {
          layerRefs.current.offices = officeLayer;
          if (layers.offices) {
            officeLayer.addTo(mapRef.current);
          }
        }
      });

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
      offices: false,
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
    { id: 'dataLayers', name: 'ชั้นข้อมูล', icon: <FaLayerGroup className="text-xl" /> },
    { id: 'buildingsPlaces', name: 'อาคารสถานที่', icon: <FaBuilding className="text-xl" /> },
    { id: 'transportation', name: 'การเดินทาง', icon: <FaMapSigns className="text-xl" /> },
    { id: 'financial', name: 'ธุรกรรมทางการเงิน', icon: <FaMoneyCheckAlt className="text-xl" /> },
    { id: 'healthSports', name: 'สุขภาพและกีฬา', icon: <FaHeartbeat className="text-xl" /> },
    { id: 'foodBeverage', name: 'อาหารและเครื่องดื่ม', icon: <FaUtensils className="text-xl" /> },
    { id: 'learningSpaces', name: 'พื้นที่เรียนรู้', icon: <FaBook className="text-xl" /> },
    { id: 'eventSpaces', name: 'พื้นที่จัดกิจกรรม', icon: <FaCalendarAlt className="text-xl" /> },
    { id: 'publicRestrooms', name: 'ห้องน้ำสาธารณะ', icon: <FaRestroom className="text-xl" /> },
    { id: 'publicSafety', name: 'ความปลอดภัยสาธารณะ', icon: <FaShieldAlt className="text-xl" /> },
    { id: 'backHome', name: 'กลับหน้าหลัก', icon: <FaArrowLeft className="text-xl" />, isBackButton: true },
  ];

  const layerGroups = {
    dataLayers: [
      { id: 'greenArea', name: 'พื้นที่สีเขียว', icon: <FaMapMarkerAlt className="mr-2 text-green-600" /> },
      { id: 'buildings', name: 'พื้นที่สิ่งปลูกสร้าง', icon: <FaBuilding className="mr-2 text-green-600" /> },
      { id: 'roads', name: 'พื้นที่ถนน', icon: <FaRoad className="mr-2 text-green-600" /> },
      { id: 'waterBody', name: 'พื้นที่แหล่งน้ำ', icon: <IoIosWater className="mr-2 text-green-600" /> },
      { id: 'Demonstration plot', name: 'แปลงสาธิต', icon: <FaWater className="mr-2 text-green-600" /> }
    ],
    buildingsPlaces: [
      { id: 'faculties', name: 'คณะและวิทยาลัย', icon: <FaUniversity className="mr-2 text-green-600" /> },
      { id: 'offices', name: 'สำนักงาน', icon: <FaBriefcase className="mr-2 text-green-600" /> },
      { id: 'Factory', name: 'โรงงาน', icon: <MdFactory className="mr-2 text-green-600" /> },
      
    ],
    transportation: [
      { id: 'universityGate', name: 'ประตูมหาวิทยาลัย', icon: <FaDoorOpen className="mr-2 text-green-600" /> },
      { id: 'parking', name: 'ที่จอดรถ', icon: <FaCar className="mr-2 text-green-600" /> },
    ],
    financial: [
      { id: 'atms', name: 'ตู้กดเงิน', icon: <FaMoneyCheckAlt className="mr-2 text-green-600" /> },
    ],
    healthSports: [
      { id: 'hospitals', name: 'โรงพยาบาล', icon: <FaHospital className="mr-2 text-green-600" /> },
      { id: 'sports', name: 'กิจกรรม/กีฬา', icon: <FaRunning className="mr-2 text-green-600" /> },
    ],
    foodBeverage: [
      { id: 'foodCourts', name: 'ศูนย์อาหาร', icon: <FaUtensils className="mr-2 text-green-600" /> },
      { id: 'coffeeShops', name: 'ร้านกาแฟ', icon: <FaCoffee className="mr-2 text-green-600" /> },
    ],
    learningSpaces: [
      { id: 'groupStudyRooms', name: 'ห้องค้นคว้ากลุ่ม', icon: <FaUsers className="mr-2 text-green-600" /> },
      { id: 'workspaces', name: 'พื้นที่ทำงาน', icon: <FaBook className="mr-2 text-green-600" /> },
    ],
    eventSpaces: [
      { id: 'eventVenues', name: 'ที่จัดกิจกรรม', icon: <FaCalendarAlt className="mr-2 text-green-600" /> },
      { id: 'currentFestivals', name: 'งานเทศกาลช่วงนี้', icon: <FaCalendarAlt className="mr-2 text-green-600" /> },
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
          border: 3px solid #00843D;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          padding: 4px;
        }
      `}</style>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      {/* แถบด้านบน – สีเขียว RMUTL */}
      <div className="bg-gradient-to-r from-[#00843D] to-[#006400] text-white p-4 flex justify-between items-center shadow-lg">
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
          className={`bg-white shadow-xl transition-width duration-300 ease-in-out ${
            isSidebarOpen ? 'w-80' : 'w-0'
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
                    className={`w-full p-3 text-green-700 hover:bg-green-100 transition-all duration-300 flex items-center justify-center hover:scale-110 ${
                      activeSection === section.id ? 'bg-[#00843D] text-white' : ''
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
                      className={`w-full flex items-center p-2 rounded-lg text-gray-700 hover:bg-green-100 transition-all duration-300 shadow-sm ${
                        layers[layer.id] ? 'bg-green-200 text-gray-800' : 'bg-white'
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