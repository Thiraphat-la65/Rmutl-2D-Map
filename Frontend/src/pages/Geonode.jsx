import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import PostEndpointBox from '../components/PostEndpointBox';
import GetEndpointBox from '../components/GetEndpointBox';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600 bg-red-100 rounded-lg">
          <h2>เกิดข้อผิดพลาด!</h2>
          <p>กรุณาลองรีเฟรชหน้า หรือติดต่อผู้ดูแลระบบ: {this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const GEOSERVER_BASE_URL = import.meta.env.VITE_GEOSERVER_URL || 'http://geonode.gistnu.nu.ac.th/geoserver';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const FALLBACK_GEOSERVER_URL = 'http://localhost:8080/geoserver'; // Fallback สำหรับทดสอบในเครื่อง

const Geonode = ({ refreshStats }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [layers, setLayers] = useState([]);
  const [selectedValue, setSelectedValue] = useState('g::ทั้งหมด');
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const staticSections = [
    { title: '📂 ข้อมูลพื้นที่', subtitle: 'พื้นที่สีเขียว', description: 'แสดงข้อมูลพื้นที่สีเขียวภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_green_area', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'พื้นที่สิ่งปลูกสร้าง', description: 'แสดงข้อมูลพื้นที่อาคารภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_buildings', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'พื้นที่ถนน', description: 'แสดงข้อมูลพื้นที่ทางเดินรถภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_roads', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'พื้นที่แหล่งน้ำ', description: 'แสดงพื้นที่แหล่งน้ำภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_water_body', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 ข้อมูลอาคาร', subtitle: 'คณะและวิทยาลัย', description: 'แสดงข้อมูลอาคารในแต่ละคณะภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_faculties', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'สำนักงาน', description: 'แสดงข้อมูลอาคารสำนักงานภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_offices', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'โรงเรียน', description: 'แสดงข้อมูลโรงเรียนภายในมหาวิทยาลัยนเรศวร',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_schools', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 การเดินทาง', subtitle: 'ประตูมหาวิทยาลัย', description: 'ข้อมูลประตูทางเข้าออกของมหาวิทยาลัย',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_gates', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'ป้ายสายสีเหลือง', description: 'ข้อมูลป้ายรถประจำทางสายสีเหลือง',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_yellow_signs', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'สายสีเหลือง', description: 'ข้อมูลเส้นทางรถประจำทางสายสีเหลือง',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_yellow_lines', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'ป้ายสายสีแดง', description: 'ข้อมูลป้ายรถประจำทางสายสีแดง',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_red_signs', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'สายสีแดง', description: 'ข้อมูลเส้นทางรถประจำทางสายสีแดง',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_red_lines', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'สายสีน้ำเงิน', description: 'ข้อมูลเส้นทางรถประจำทางสายสีน้ำเงิน',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_blue_lines', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'ที่จอดรถ', description: 'ข้อมูลที่จอดรถในพื้นที่มหาวิทยาลัย',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_parking', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 ธุรกรรมทางการเงิน', subtitle: 'ตู้กดเงินอัตโนมัติ', description: 'ข้อมูลตำแหน่งตู้ ATM ในพื้นที่',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_atms', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'ธนาคาร', description: 'ข้อมูลสาขาธนาคารในพื้นที่',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_banks', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 อาหารและเครื่องดื่ม', subtitle: 'ศูนย์อาหาร', description: 'ข้อมูลศูนย์อาหารในพื้นที่',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_food_courts', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'ร้านกาแฟ', description: 'ข้อมูลร้านกาแฟในพื้นที่',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_cafes', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 พื้นที่เรียนรู้', subtitle: 'ห้องค้นคว้ากลุ่ม', description: 'ข้อมูลห้องค้นคว้ากลุ่มสำหรับนักศึกษา',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_study_rooms', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'พื้นที่ทำงาน', description: 'ข้อมูลพื้นที่ทำงานร่วมกัน',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_workspaces', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 พื้นที่จัดกิจกรรม', subtitle: 'ที่จัดกิจกรรม', description: 'ข้อมูลสถานที่จัดกิจกรรมในพื้นที่',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_event_spaces', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { subtitle: 'งานเทศกาลช่วงนี้!', description: 'ข้อมูลงานเทศกาลและกิจกรรมพิเศษ',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_festivals', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 ห้องน้ำสาธารณะ', subtitle: 'ห้องน้ำสาธารณะ', description: 'ข้อมูลตำแหน่งห้องน้ำสาธารณะ',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_restrooms', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
    { title: '📂 ความปลอดภัยสาธารณะ', subtitle: 'โซนปลอดภัย', description: 'ข้อมูลโซนปลอดภัยและจุดรวมพล',
      apis: [
        { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: 'nu_safe_zones', bbox: '99.9000,17.2000,99.9500,17.2500' } },
        { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } }
      ]
    },
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchLayers = async () => {
      try {
        if (userRole === 'admin') {
          const response = await axios.get(`${API_URL}/api/spatial-data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const staticSubtitles = new Set(staticSections.map(section => section.subtitle).filter(Boolean));
          const apiLayers = response.data.map((layer, index) => {
            let uniqueSubtitle = layer.name;
            let suffixCount = 1;
            while (staticSubtitles.has(uniqueSubtitle)) {
              uniqueSubtitle = `${layer.name} (Dynamic ${suffixCount})`;
              suffixCount++;
            }
            return {
              subtitle: uniqueSubtitle,
              description: layer.description || `ข้อมูล ${layer.name}`,
              group: layer.group || '📂 อื่นๆ',
              apis: [
                { method: 'POST', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetMap', typeName: layer.name, bbox: '99.9000,17.2000,99.9500,17.2500' } },
                { method: 'GET', path: 'wms', fullPathParams: { service: 'WMS', version: '1.3.0', request: 'GetCapabilities' } },
              ],
              dynamicId: layer.id,
            };
          });
          setLayers([...staticSections, ...apiLayers]);
        } else {
          setLayers(staticSections);
        }
      } catch (error) {
        toast.error('ไม่สามารถดึงข้อมูลชั้นข้อมูลได้');
        console.error('Error fetching layers:', error);
        setLayers(staticSections);
      }
    };
    fetchLayers();
  }, [navigate, token, userRole]);

  useEffect(() => {
    if (location.state?.showMessage) {
      const { name, role } = location.state;
      setMessage(`ยินดีต้อนรับ, ${name}! สถานะ: ${role === 'admin' ? 'แอดมิน' : 'ผู้ใช้'}`);
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let currentGroup = 'ทั้งหมด';
  const withGroup = layers.map(item => {
    if (item.title) currentGroup = item.title;
    return { ...item, group: item.group || currentGroup, isTitle: !!item.title };
  });

  const comboOptions = [];
  comboOptions.push({ value: 'g::ทั้งหมด', label: 'ทั้งหมด', type: 'all' });

  const groupsInOrder = [];
  const seen = new Set();
  withGroup.forEach(it => {
    if (!seen.has(it.group)) {
      seen.add(it.group);
      groupsInOrder.push(it.group);
    }
  });

  groupsInOrder.forEach(g => {
    comboOptions.push({ value: `g::${g}`, label: g, type: 'group' });
    withGroup
      .filter(it => it.group === g && it.subtitle)
      .forEach((it, index) => {
        const uniqueValue = it.dynamicId ? `s::${it.subtitle}-${it.dynamicId}` : `s::${it.subtitle}-${index}`;
        comboOptions.push({
          value: uniqueValue,
          label: `— ${it.subtitle}`,
          type: 'sub',
          group: g,
        });
      });
  });

  const slugify = s => s?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const selectedGroup =
    selectedValue === 'g::ทั้งหมด'
      ? 'ทั้งหมด'
      : selectedValue.startsWith('g::')
      ? selectedValue.slice(3)
      : comboOptions.find(o => o.value === selectedValue)?.group ||
        withGroup.find(it => `s::${it.subtitle}-${it.dynamicId || ''}` === selectedValue || `s::${it.subtitle}-${withGroup.indexOf(it)}` === selectedValue)?.group ||
        'ทั้งหมด';

  const selectedSub = selectedValue.startsWith('s::') 
    ? selectedValue.split('-')[0].slice(3)
    : '';

  let visible;
  if (selectedValue === 'g::ทั้งหมด') {
    visible = withGroup;
  } else if (selectedSub) {
    const subItem = withGroup.find(it => it.subtitle === selectedSub);
    const header = { isTitle: true, title: selectedGroup };
    visible = subItem ? [header, subItem] : [header];
  } else {
    visible = withGroup.filter(it => it.group === selectedGroup);
  }

  const scrollToSub = subtitle => {
    const id = slugify(subtitle || '');
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = e => {
    const val = e.target.value;
    setSelectedValue(val);
    if (val.startsWith('s::')) {
      const sub = val.split('-')[0].slice(3);
      setTimeout(() => scrollToSub(sub), 0);
    }
  };

  const handleHeaderClick = () => {
    if (selectedSub) {
      scrollToSub(selectedSub);
    } else if (selectedGroup === 'ทั้งหมด') {
      const firstSub = withGroup.find(it => it.subtitle)?.subtitle;
      if (firstSub) scrollToSub(firstSub);
    } else {
      const firstSubInGroup = withGroup.find(it => it.group === selectedGroup && it.subtitle)?.subtitle;
      if (firstSubInGroup) scrollToSub(firstSubInGroup);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshStats = () => {
    console.log('refreshStats not implemented, please pass it from parent component');
  };

  return (
    <ErrorBoundary>
      <div className="p-6 mt-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl max-w-3xl mx-auto relative">
        {showMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center animate-fade-out">
            <p className="text-lg">{message}</p>
          </div>
        )}
        <h2
          onClick={handleHeaderClick}
          title="คลิกเพื่อเลื่อนไปยังเนื้อหาที่เลือก"
          className="flex items-center bg-orange-500 px-4 py-5 text-3xl font-bold text-white rounded-lg cursor-pointer"
        >
          <span className="w-2 h-10 bg-orange-700 rounded-md mr-3"></span>
          พื้นที่ให้บริการข้อมูล Geonode Service
        </h2>
        <hr className="mb-6 border-t border-gray-300" />
        <div className="p-4 bg-white rounded-xl shadow-md border border-orange-300">
          <h3 className="text-base font-bold mb-2 flex items-center duration-300 hover:scale-101">
            <span className="mr-2">🗂️</span> กรองข้อมูลพื้นที่
          </h3>
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 duration-300 hover:scale-101"
            value={selectedValue}
            onChange={handleChange}
          >
            {comboOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {visible.map((section, sidx) => (
          <div key={`section-${sidx}`} className="mb-8">
            {section.isTitle && section.title && (
              <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2 py-2 rounded-lg transform transition duration-300 hover:scale-105">
                {section.title}
              </h3>
            )}
            {section.subtitle && (
              <>
                <span id={slugify(section.subtitle)} className="block scroll-mt-24"></span>
                <p className="text-sm text-black mt-1 mb-1 pl-1 italic">{section.subtitle}</p>
                {section.description && (
                  <p className="text-xs text-gray-500 mb-2 pl-2">{section.description}</p>
                )}
              </>
            )}
            {(section.subtitle || section.isTitle) && <hr className="border-t border-gray-300 mb-4" />}
            {section.apis && section.apis.length > 0 ? (
              section.apis.map((ep, idx) =>
                ep.method === 'GET' ? (
                  <GetEndpointBox
                    key={`api-${sidx}-${idx}`}
                    path={`${GEOSERVER_BASE_URL}/${ep.path}`}
                    subtitle={section.subtitle}
                    fullPathParams={ep.fullPathParams}
                    onCopySuccess={refreshStats || handleRefreshStats}
                  />
                ) : (
                  <PostEndpointBox
                    key={`api-${sidx}-${idx}`}
                    path={`${GEOSERVER_BASE_URL}/${ep.path}`}
                    subtitle={section.subtitle}
                    fullPathParams={ep.fullPathParams}
                    onCopySuccess={refreshStats || handleRefreshStats}
                  />
                )
              )
            ) : (
              !section.isTitle && (
                <p className="text-xs text-gray-400 pl-2">ไม่มี API สำหรับส่วนนี้</p>
              )
            )}
          </div>
        ))}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isVisible ? 'translate-y-0' : 'translate-y-10'} duration-300`}
          style={{ display: isVisible ? 'block' : 'none' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
        <style>
          {`
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            .animate-fade-out {
              animation: fadeOut 5s ease-out forwards;
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
};

export default Geonode;