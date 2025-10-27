import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SidebarComponent from '../components/Sidebar/Sidebar';
import toast from 'react-hot-toast';

const ManageData = () => {
  const navigate = useNavigate();
  const [spatialData, setSpatialData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    group: '',
    wfsGetUrl: '',
    wfsPostUrl: '',
  });
  const [editingData, setEditingData] = useState(null);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // ตรวจสอบสิทธิ์และดึงข้อมูลเชิงพื้นที่
  useEffect(() => {
    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchSpatialData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/api/spatial-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpatialData(response.data);
      } catch (error) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message);
        toast.error('ไม่สามารถดึงข้อมูลเชิงพื้นที่ได้');
      }
    };

    fetchSpatialData();
  }, [navigate, token, userRole]);

  // จัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // จัดการการส่งฟอร์ม (เพิ่มหรืออัปเดตข้อมูล)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.category) {
        toast.error('กรุณากรอกชื่อข้อมูลและหมวดหมู่');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      if (editingData) {
        await axios.put(
          `${apiUrl}/api/spatial-data/${editingData.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('อัปเดตข้อมูลสำเร็จ');
      } else {
        await axios.post(
          `${apiUrl}/api/spatial-data`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('เพิ่มข้อมูลสำเร็จ');
      }
      setFormData({ name: '', category: '', description: '', group: '', wfsGetUrl: '', wfsPostUrl: '' });
      setEditingData(null);
      const response = await axios.get(`${apiUrl}/api/spatial-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpatialData(response.data);
    } catch (error) {
      setError('เกิดข้อผิดพลาด: ' + error.message);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  // จัดการการแก้ไขข้อมูล
  const handleEdit = (data) => {
    setEditingData(data);
    setFormData({
      name: data.name,
      category: data.category,
      description: data.description || '',
      group: data.group || '',
      wfsGetUrl: data.wfsGetUrl || '',
      wfsPostUrl: data.wfsPostUrl || '',
    });
  };

  // จัดการการลบข้อมูล
  const handleDelete = async (dataId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.delete(`${apiUrl}/api/spatial-data/${dataId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpatialData(spatialData.filter((data) => data.id !== dataId));
      toast.success('ลบข้อมูลสำเร็จ');
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการลบ: ' + error.message);
      toast.error('ไม่สามารถลบข้อมูลได้');
    }
  };

  // ฟังก์ชันเลื่อนกลับด้านบน
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <main
        className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '80px' : '240px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-orange-600">จัดการข้อมูลเชิงพื้นที่ (Admin)</h1>
          {broken && (
            <IconButton
              onClick={() => setToggled(!toggled)}
              className="text-gray-700 hover:text-orange-600"
            >
              <MenuOutlinedIcon fontSize="large" />
            </IconButton>
          )}
        </div>

        {/* ฟอร์มเพิ่ม/อัปเดตข้อมูลเชิงพื้นที่ */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">
            {editingData ? 'แก้ไขข้อมูลเชิงพื้นที่' : 'เพิ่มข้อมูลเชิงพื้นที่'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  ชื่อข้อมูล
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="เช่น พื้นที่สีเขียว, อาคาร"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">ชื่อชั้นข้อมูลที่ต้องการแสดง</p>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  หมวดหมู่
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="green_area">พื้นที่สีเขียว</option>
                  <option value="building">อาคาร</option>
                  <option value="road">ถนน</option>
                  <option value="other">อื่นๆ</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">หมวดหมู่สำหรับจัดกลุ่มข้อมูล</p>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="group">
                  กลุ่ม
                </label>
                <input
                  type="text"
                  id="group"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="เช่น 📂 สวนสาธารณะ"
                />
                <p className="text-xs text-gray-500 mt-1">กลุ่มสำหรับจัดหมวดหมู่ข้อมูล (ถ้ามี)</p>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wfsGetUrl">
                  WFS GET URL
                </label>
                <input
                  type="url"
                  id="wfsGetUrl"
                  name="wfsGetUrl"
                  value={formData.wfsGetUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="เช่น http://geonode.gistnu.nu.ac.th/wms?..."
                />
                <p className="text-xs text-gray-500 mt-1">URL สำหรับ GET request (ถ้ามี)</p>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wfsPostUrl">
                  WFS POST URL
                </label>
                <input
                  type="url"
                  id="wfsPostUrl"
                  name="wfsPostUrl"
                  value={formData.wfsPostUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="เช่น http://geonode.gistnu.nu.ac.th/wms?..."
                />
                <p className="text-xs text-gray-500 mt-1">URL สำหรับ POST request (ถ้ามี)</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  คำอธิบาย
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="คำอธิบายข้อมูล"
                  rows="4"
                />
                <p className="text-xs text-gray-500 mt-1">คำอธิบายเพิ่มเติมเกี่ยวกับข้อมูล (ถ้ามี)</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-300"
              >
                {editingData ? 'อัปเดต' : 'เพิ่ม'}
              </button>
              {editingData && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingData(null);
                    setFormData({ name: '', category: '', description: '', group: '', wfsGetUrl: '', wfsPostUrl: '' });
                  }}
                  className="ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ตารางข้อมูลเชิงพื้นที่ */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">รายการข้อมูลเชิงพื้นที่</h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {spatialData.length === 0 ? (
            <p className="text-gray-500">ไม่มีข้อมูล</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="p-3 border-b">ID</th>
                    <th className="p-3 border-b">ชื่อข้อมูล</th>
                    <th className="p-3 border-b">หมวดหมู่</th>
                    <th className="p-3 border-b">กลุ่ม</th>
                    <th className="p-3 border-b">WFS GET URL</th>
                    <th className="p-3 border-b">WFS POST URL</th>
                    <th className="p-3 border-b">คำอธิบาย</th>
                    <th className="p-3 border-b">วันที่สร้าง</th>
                    <th className="p-3 border-b">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {spatialData.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{data.id}</td>
                      <td className="p-3 border-b">{data.name}</td>
                      <td className="p-3 border-b">{data.category}</td>
                      <td className="p-3 border-b">{data.group || '-'}</td>
                      <td className="p-3 border-b">
                        {data.wfsGetUrl ? (
                          <a
                            href={data.wfsGetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            title={data.wfsGetUrl}
                          >
                            {data.wfsGetUrl.length > 50 ? data.wfsGetUrl.substring(0, 50) + '...' : data.wfsGetUrl}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-3 border-b">
                        {data.wfsPostUrl ? (
                          <a
                            href={data.wfsPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            title={data.wfsPostUrl}
                          >
                            {data.wfsPostUrl.length > 50 ? data.wfsPostUrl.substring(0, 50) + '...' : data.wfsPostUrl}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-3 border-b">{data.description || '-'}</td>
                      <td className="p-3 border-b">{new Date(data.createdAt).toLocaleString('th-TH')}</td>
                      <td className="p-3 border-b">
                        <button
                          onClick={() => handleEdit(data)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="text-red-600 hover:underline"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ปุ่มเลื่อนกลับด้านบน */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            ></path>
          </svg>
        </button>
      </main>
    </div>
  );
};

export default ManageData;