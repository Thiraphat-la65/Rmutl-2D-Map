// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home';
import InteractiveMap from './pages/InteractiveMap';
import Detail from './pages/Detail';

function AppContent() {
  const location = useLocation();

  const showNavbar = location.pathname !== '/map';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<InteractiveMap />} />
        
        {/* แก้ตรงนี้สำคัญ: ต้องเป็น :roomNumber */}
        <Route path="/detail/:roomNumber" element={<Detail />} />
        
        {/* ข้าม path /api ทั้งหมด */}
        <Route path="/api/*" element={null} />
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;