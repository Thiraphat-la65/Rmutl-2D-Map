// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home';
import InteractiveMap from './pages/InteractiveMap';

function AppContent() {
  const location = useLocation();

  // ซ่อน Navbar เฉพาะในหน้า /map
  const showNavbar = location.pathname !== '/map';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<InteractiveMap />} />
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;