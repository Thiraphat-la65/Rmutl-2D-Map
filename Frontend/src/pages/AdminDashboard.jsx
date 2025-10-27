import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import SidebarComponent from '../components/Sidebar/Sidebar';
import { IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [actionDetailsOptions, setActionDetailsOptions] = useState(['']); // ตัวเลือกสำหรับ Action Details
  const [userOptions, setUserOptions] = useState(['']); // ตัวเลือกสำหรับ User
  const [selectedActionDetails, setSelectedActionDetails] = useState(''); // ค่าเลือก Action Details
  const [selectedUser, setSelectedUser] = useState(''); // ค่าเลือก User

  useEffect(() => {
    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    setUser(storedUser);

    const fetchLogs = async () => {
      if (!storedUser || !localStorage.getItem('token')) {
        setError('No authentication data. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/api/logs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLogs(response.data || []); // ตั้งค่าเป็น array ว่างถ้า response เป็น undefined
      } catch (err) {
        setError(`Failed to fetch logs: ${err.message}`);
        console.error('Error fetching logs:', err);
        setLogs([]); // ตั้งค่าเป็น array ว่างเมื่อมี error
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // รีเฟรชทุก 5 วินาที
    return () => clearInterval(interval); // ล้าง interval เมื่อ component unmount
  }, []);

  // อัปเดตตัวเลือกใน dropdown เมื่อ logs เปลี่ยน
  useEffect(() => {
    if (!logs || !Array.isArray(logs)) {
      setActionDetailsOptions(['All']);
      setUserOptions(['All']);
      return;
    }

    const uniqueActionDetails = ['All', ...new Set(logs.map(log => log.actionDetails || 'No details'))];
    const uniqueUsers = ['All', ...new Set(logs.map(log => log.userName || 'Unknown User'))];
    setActionDetailsOptions(uniqueActionDetails);
    setUserOptions(uniqueUsers);
  }, [logs]);

  // อัปเดต filteredLogs เมื่อเลือก filter
  useEffect(() => {
    if (!logs || !Array.isArray(logs)) {
      setFilteredLogs([]);
      return;
    }

    let result = [...logs];
    if (selectedActionDetails && selectedActionDetails !== 'All') {
      result = result.filter(log => log.actionDetails === selectedActionDetails);
    }
    if (selectedUser && selectedUser !== 'All') {
      result = result.filter(log => log.userName === selectedUser);
    }
    setFilteredLogs(result);
  }, [logs, selectedActionDetails, selectedUser]);

  const handleDelete = async (logId) => {
    console.log('Deleting log with ID:', logId);
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.delete(`${apiUrl}/api/logs/${logId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Delete response:', response.data);
        setLogs(logs.filter(log => log.id !== logId));
      } catch (err) {
        setError(`Failed to delete log: ${err.message}`);
        console.error('Error deleting log:', err.response ? err.response.data : err);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  if (loading) return <p className="text-center text-gray-600 animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg shadow">{error}</p>;
  if (!user) return <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg shadow">Please log in.</p>;

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
            AdminDashboard
          </h1>
          {broken && (
            <IconButton onClick={() => setToggled(!toggled)} className="text-gray-700 hover:text-orange-600">
              <MenuOutlinedIcon fontSize="large" />
            </IconButton>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 border-l-4 border-orange-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">ยินดีต้อนรับ, {user.name}</h2>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 border-l-4 border-orange-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">กรองข้อมูลพื้นที่และสถานะผู้ใช้</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">ประเภทการดำเนินการ</label>
              <select
                value={selectedActionDetails}
                onChange={(e) => setSelectedActionDetails(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 hover:border-orange-300"
              >
                {actionDetailsOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">สถานะผู้ใช้</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 hover:border-orange-300"
              >
                {userOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-l-4 border-orange-500">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <h3 className="text-xl font-semibold text-gray-800">ตารางข้อมูล</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภทการดำเนินการ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นำข้อมูลอะไรใช้</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สำเร็จ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อุปกรณ์</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่และเวลา</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะผู้ใช้</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลบข้อมูล</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{log.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.actionType}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate hover:text-clip">{log.actionDetails || 'No details'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                            log.isSuccess
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {log.isSuccess ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.device}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.role ? (log.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้') : 'ไม่ทราบ'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-red-600 hover:text-red-800 font-medium hover:underline transition duration-200"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                      <span className="text-lg">No logs available or no matching filters.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-right">
          <p className="text-sm text-gray-600">
            Total logs: <span className="font-medium text-gray-800">{filteredLogs.length}</span> | Last updated:{' '}
            <span className="font-medium text-gray-800">{new Date().toLocaleTimeString()}</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;