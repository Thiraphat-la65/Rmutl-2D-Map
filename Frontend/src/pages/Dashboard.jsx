import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userSlice'; // สมมติว่าไฟล์นี้มี action logout
import { Chart } from 'chart.js/auto';
import SidebarComponent from '../components/Sidebar/Sidebar'; // ปรับ path ให้ตรงกับโครงสร้าง
import { IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ userCount: 0, serviceCount: 0, copyCount: 0 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const token = localStorage.getItem('token');
  const chartRef = useRef(null);

  const fetchStats = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      console.log('Fetching data from:', `${apiUrl}/api/users/count`); // Debug
      const userRes = await axios.get(`${apiUrl}/api/users/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User count response:', userRes.data); // Debug

      console.log('Fetching data from:', `${apiUrl}/api/logs`); // Debug
      const logRes = await axios.get(`${apiUrl}/api/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Logs response:', logRes.data); // Debug

      if (!Array.isArray(logRes.data)) {
        throw new Error('Invalid logs data format');
      }

      const copyCount = logRes.data.filter(log => log.isSuccess && log.actionType === 'copy').length;

      setStats({
        userCount: userRes.data.count || 0,
        serviceCount: logRes.data.length || 0,
        copyCount,
      });

      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logRes.data.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === today && log.actionType === 'copy' && log.isSuccess;
      });

      const hourlyData = Array(24).fill(0);
      todayLogs.forEach(log => {
        const hour = new Date(log.timestamp).getHours();
        hourlyData[hour]++;
      });

      setChartData({
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: 'จำนวนการคัดลอก',
          data: hourlyData,
          backgroundColor: 'rgba(255, 165, 0, 0.6)',
          borderColor: 'rgba(255, 165, 0, 1)',
          borderWidth: 1,
        }],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error.response?.data || error.message);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + (error.response?.data?.message || error.message));
    }
  };

  // รีเฟรชข้อมูลทันทีเมื่อกด "Copy"
  const refreshStats = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // รีเฟรชทุก 5 วินาที
    return () => clearInterval(interval);
  }, [navigate, token, dispatch]);

  useEffect(() => {
    if (chartData.labels.length > 0 && document.getElementById('copyChart')) {
      const ctx = document.getElementById('copyChart').getContext('2d');
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: { y: { beginAtZero: true, title: { display: true, text: 'จำนวนครั้ง' } } },
          plugins: { legend: { position: 'top' } },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
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
        handleLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 transition-all duration-300" style={{ marginLeft: isCollapsed ? '80px' : '240px' }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-orange-600 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text">
            หน้าแดชบอร์ดแสดงข้อมูลโดยรวม
          </h1>
          {broken && (
            <IconButton onClick={() => setToggled(!toggled)} className="text-gray-700 hover:text-orange-600">
              <MenuOutlinedIcon fontSize="large" />
            </IconButton>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">จำนวนผู้ใช้</h2>
            <p className="text-4xl font-bold text-orange-600">{stats.userCount || 'N/A'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">ข้อมูลบริการทั้งหมด</h2>
            <p className="text-4xl font-bold text-orange-600">{stats.serviceCount || 'N/A'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">ข้อมูลที่คัดลอก</h2>
            <p className="text-4xl font-bold text-orange-600">{stats.copyCount || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">การคัดลอกข้อมูลวันนี้</h2>
          <div className="relative h-96">
            <canvas id="copyChart" className="w-full"></canvas>
          </div>
        </div>
        {error && <p className="mt-4 text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
      </main>
    </div>
  );
};

export default Dashboard;