import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import toast from 'react-hot-toast';

const PostEndpointBox = ({ path, subtitle, fullPathParams, onCopySuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTryMode, setIsTryMode] = useState(false);
  const [param, setParam] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const GEOSERVER_BASE_URL = import.meta.env.VITE_GEOSERVER_URL || 'http://geonode.gistnu.nu.ac.th/geoserver';

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIsTryMode(false);
    setResult('');
    setParam('');
  };

  const handleCopy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { redirectPath: window.location.pathname } });
      return;
    }

    try {
      const baseUrl = `${GEOSERVER_BASE_URL}/wms`;
      const defaultParams = {
        service: 'WMS',
        version: '1.3.0',
        request: 'GetMap',
      };
      const params = { ...defaultParams, ...fullPathParams };
      const fullPath = `${baseUrl}?${new URLSearchParams(params).toString()}`;
      
      await navigator.clipboard.writeText(fullPath);
      setCopied(true);
      toast.success('คัดลอกลิงก์เรียบร้อย');
      setTimeout(() => setCopied(false), 1500);

      let decoded;
      try {
        decoded = jwtDecode(token);
        console.log('Decoded token:', { id: decoded.id, role: decoded.role });
      } catch (decodeErr) {
        throw new Error('Invalid token format: ' + decodeErr.message);
      }
      if (!decoded || !decoded.id) {
        throw new Error('Invalid token or missing userId');
      }

      const copyData = {
        userId: decoded.id.toString(),
        actionType: 'copy',
        actionDetails: `Copied POST link for ${subtitle || path}`,
        isSuccess: true,
        device: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/api/logs`, copyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Log created with ID:', response.data.id, 'for path:', fullPath);
      if (onCopySuccess) onCopySuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`เกิดข้อผิดพลาด: ${errorMsg}`);
      console.error('Error copying or logging:', err.message, { response: err.response, path: fullPath });
    }
  };

  const handleTry = () => setIsTryMode(true);
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setResult('Error: Please log in to try this endpoint.');
      return;
    }

    try {
      const fullPath = `${GEOSERVER_BASE_URL}/${path}${fullPathParams ? '?' + new URLSearchParams(fullPathParams).toString() : ''}`;
      const response = await axios.post(fullPath, { param }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setResult(`Error: ${err.response?.data?.error || err.message || 'ไม่สามารถเรียก API ได้'}`);
      console.error('Error posting data:', err, { path, param });
    }
  };

  const methodLabel = 'บันทึก/ส่งข้อมูล';

  const layerNameMap = {
    'พื้นที่สีเขียว': 'nu_green_area',
    'พื้นที่สิ่งปลูกสร้าง': 'nu_buildings',
    'พื้นที่ถนน': 'nu_roads',
    'พื้นที่แหล่งน้ำ': 'nu_water_body',
    'คณะและวิทยาลัย': 'nu_faculties',
    'สำนักงาน': 'nu_offices',
    'โรงเรียน': 'nu_schools',
    'ประตูมหาวิทยาลัย': 'nu_gates',
    'ป้ายสายสีเหลือง': 'nu_yellow_signs',
    'สายสีเหลือง': 'nu_yellow_lines',
    'ป้ายสายสีแดง': 'nu_red_signs',
    'สายสีแดง': 'nu_red_lines',
    'สายสีน้ำเงิน': 'nu_blue_lines',
    'ที่จอดรถ': 'nu_parking',
    'ตู้กดเงินอัตโนมัติ': 'nu_atms',
    'ธนาคาร': 'nu_banks',
    'ศูนย์อาหาร': 'nu_food_courts',
    'ร้านกาแฟ': 'nu_cafes',
    'ห้องค้นคว้ากลุ่ม': 'nu_study_rooms',
    'พื้นที่ทำงาน': 'nu_workspaces',
    'ที่จัดกิจกรรม': 'nu_event_spaces',
    'งานเทศกาลช่วงนี้!': 'nu_festivals',
    'ห้องน้ำสาธารณะ': 'nu_restrooms',
    'โซนปลอดภัย': 'nu_safe_zones',
  };

  const descriptionMap = {
    [subtitle]: (
      <div className="text-sm text-black space-y-2">
        <p className="font-semibold">การนำเข้าข้อมูล GeoNode เข้าสู่โปรแกรม QGIS</p>
        <ol className="list-decimal list-inside space-y-3">
          <li>ดาวน์โหลดโปรแกรม QGIS ได้ที่ <a href="https://qgis.org/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://qgis.org/download/</a></li>
          <li>เปิดโปรแกรม QGIS บนเครื่องของคุณ</li>
          <li>
            เลือกหัวข้อ <strong>Open Data Source Manager</strong> หรือกด <code>Ctrl + L</code><br />
            <img src="/assets/images/ขั้นตอนที่ 1.png" alt="เปิด Open Data Source" className="my-2 rounded shadow" />
          </li>
          <li>
            เลือก <strong>WMS/WMTS</strong><br />
            <img src="/assets/images/ขั้นตอนที่ 2.png" alt="เลือก WMS" className="my-2 rounded shadow" />
          </li>
          <li>
            คลิก <strong>New Connection</strong> และใส่ URL: <code>{GEOSERVER_BASE_URL}/wms</code><br />
            <img src="/assets/images/ขั้นตอนที่ 3.png" alt="เพิ่ม WMS Connection" className="my-2 rounded shadow" />
          </li>
          <li>
            ใส่ชื่อ และ URL ของหัวข้อ <strong>{layerNameMap[subtitle] || subtitle}</strong> แล้วกด OK<br />
            <strong>หมายเหตุ:</strong> ใช้ URL ที่คัดลอกจากปุ่ม "Copy" เช่น <code>{path}</code><br />
            <img src="/assets/images/ขั้นตอนที่ 4.png" alt={`ใส่ URL และชื่อ Layer ${subtitle}`} className="my-2 rounded shadow" />
          </li>
          <li>
            คลิก <strong>Connect</strong> เพื่อเชื่อมต่อ<br />
            <img src="/assets/images/ขั้นตอนที่ 5.png" alt="เชื่อมต่อด้วยปุ่ม Connect" className="my-2 rounded shadow" />
          </li>
          <li>
            เลือก Layer <strong>{layerNameMap[subtitle] || subtitle}</strong> และคลิก <strong>Add</strong><br />
            <img src="/assets/images/ขั้นตอนที่ 6.png" alt="เลือก Add เพื่อแสดง Layer" className="my-2 rounded shadow" />
          </li>
          <li>
            ข้อมูลจะปรากฏบนแผนที่ใน QGIS<br />
            <strong>ถ้าไม่ปรากฏ:</strong> ตรวจสอบ CRS (เช่น EPSG:4326) ใน Properties หรือรีสตาร์ท QGIS<br />
            <img src="/assets/images/ขั้นตอนที่ 7.png" alt="ผลลัพธ์ข้อมูลแสดงในแผนที่" className="my-2 rounded shadow" />
          </li>
        </ol>
      </div>
    ),
  };

  return (
    <div className="border border-orange-300 rounded-lg mb-4">
      <div className="flex justify-between items-center bg-orange-100 px-4 py-2 rounded-lg transform transition duration-300 hover:scale-101">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold">POST</span>
            <span className="text-black font-medium">{path}</span>
          </div>
          {subtitle && (
            <span className="text-xs text-gray-600 ml-16">{subtitle} – {methodLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="text-sm px-2 py-1 border border-gray-400 rounded hover:bg-gray-100">
            Copy
          </button>
          {copied && <span className="text-green-600 text-xs">คัดลอกแล้ว!</span>}
          <button onClick={toggleOpen} className="text-orange-500 hover:text-orange-700">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 bg-orange-50 border-t border-orange-200 duration-300 hover:scale-101">
          <div className="mb-2 text-sm text-black">
            {subtitle && descriptionMap[subtitle] ? descriptionMap[subtitle] : <span>ข้อมูลสำหรับหัวข้อนี้ยังไม่มีรายละเอียด</span>}
          </div>
          {isTryMode && (
            <div>
              <input
                type="text"
                placeholder="ใส่ค่าพารามิเตอร์ เช่น GeoJSON data"
                className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
                value={param}
                onChange={e => setParam(e.target.value)}
              />
              <button onClick={handleSubmit} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Submit
              </button>
              {result && (
                <div className="mt-3 bg-white border border-gray-300 rounded p-2 text-sm text-black">
                  <pre>{result}</pre>
                </div>
              )}
            </div>
          )}
          <button onClick={handleTry} className="mt-2 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500">
            Try it out
          </button>
        </div>
      )}
    </div>
  );
};

export default PostEndpointBox;