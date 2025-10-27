import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SidebarComponent from '../components/Sidebar/Sidebar';

const SpatialDataLinks = () => {
  const navigate = useNavigate();
  const [layers, setLayers] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchLayers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/api/spatial-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLayers(response.data);
      } catch (error) {
        toast.error('ไม่สามารถดึงข้อมูลชั้นข้อมูลได้');
        console.error('Error fetching layers:', error);
      }
    };
    fetchLayers();
  }, [navigate, token]);

  const handleCopyLink = async (layer) => {
    const wfsUrl = `${import.meta.env.VITE_GEOSERVER_URL}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${layer.category}&outputFormat=application/json`;
    navigator.clipboard.writeText(wfsUrl);
    toast.success('คัดลอกลิงก์เรียบร้อย');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.post(
        `${apiUrl}/api/logs`,
        {
          userId: localStorage.getItem('userId'),
          actionType: 'copy_layer',
          actionDetails: `Copied layer: ${layer.name} (${layer.category})`,
          isSuccess: true,
          device: navigator.userAgent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error logging copy action:', error);
    }
  };

  const filteredLayers = categoryFilter ? layers.filter((layer) => layer.category === categoryFilter) : layers;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        toggled={toggled}
        setToggled={setToggled}
        broken={broken}
        setBroken={setBroken}
        handleLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          navigate('/');
        }}
      />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6" style={{ marginLeft: isCollapsed ? '80px' : '240px' }}>
        <h1 className="text-4xl font-extrabold text-orange-600 mb-6">ชั้นข้อมูลเชิงพื้นที่</h1>
        <FormControl fullWidth className="mb-4">
          <InputLabel>หมวดหมู่</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="หมวดหมู่"
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="green_area">พื้นที่สีเขียว</MenuItem>
            <MenuItem value="building">อาคาร</MenuItem>
            <MenuItem value="road">ถนน</MenuItem>
            <MenuItem value="other">อื่นๆ</MenuItem>
          </Select>
        </FormControl>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLayers.map((layer) => (
            <div key={layer.id} className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-orange-600">{layer.name}</h3>
              <p>หมวดหมู่: {layer.category}</p>
              <p>คำอธิบาย: {layer.description || '-'}</p>
              <div className="h-64">
                <MapContainer center={[16.7466, 100.1963]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <GeoJSON
                    data={`${import.meta.env.VITE_GEOSERVER_URL}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${layer.category}&outputFormat=application/json`}
                  />
                </MapContainer>
              </div>
              <button
                onClick={() => handleCopyLink(layer)}
                className="mt-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center"
              >
                <ContentCopyIcon className="mr-2" /> คัดลอกลิงก์ WFS
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SpatialDataLinks;