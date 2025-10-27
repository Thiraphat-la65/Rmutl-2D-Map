import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import SidebarComponent from '../components/Sidebar/Sidebar';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchUser = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const userResponse = await axios.get(`${apiUrl}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const logsResponse = await axios.get(`${apiUrl}/api/logs?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
        setLogs(logsResponse.data);
      } catch (error) {
        toast.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [navigate, token, userId]);

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
        <h1 className="text-4xl font-extrabold text-orange-600 mb-6">โปรไฟล์ผู้ใช้</h1>
        {user && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">ข้อมูลผู้ใช้</h2>
            <p>ชื่อ: {user.name}</p>
            <p>อีเมล: {user.email}</p>
            <p>บทบาท: {user.role}</p>
          </div>
        )}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">ประวัติการใช้งาน</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-3 border-b">วันที่</th>
                <th className="p-3 border-b">การกระทำ</th>
                <th className="p-3 border-b">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3 border-b">{log.actionType}</td>
                  <td className="p-3 border-b">{log.actionDetails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;