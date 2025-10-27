import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaMap, FaHome, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-700 to-orange-500 p-4 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold tracking-wide flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition duration-300">
            <img src="/assets/images/nu_logo.png" className="h-10 w-auto" alt="Logo" />
            <span className="tracking-widest">NU GIS</span>
          </Link>
        </div>
        <div className="hidden md:flex space-x-4 items-center" id="nav-menu">
          <Link to="/" className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
            <FaHome />
            <span className="font-medium">หน้าหลัก</span>
          </Link>
          <Link to="/map" className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
            <FaMap />
            <span className="font-medium">แผนที่</span>
          </Link>
          <Link to="/contact" className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
            <FaEnvelope />
            <span className="font-medium">ช่องทางการติดต่อ</span>
          </Link>
          {userRole && (
            <>
              <button onClick={handleLogout} className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
                <FaSignOutAlt />
                <span className="font-medium">ออกจากระบบ</span>
              </button>
              {userRole === 'admin' && (
                <Link to="/dashboard" className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
                  <FaShieldAlt />
                  <span className="font-medium">ผู้ดูแลระบบ</span>
                </Link>
              )}
            </>
          )}
          {!userRole && (
            <>
              <Link to="/login" className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
                <FaSignInAlt />
                <span className="font-medium">เข้าสู่ระบบ</span>
              </Link>
              <Link to="/register" className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center space-x-2 hover:shadow-lg">
                <FaUserPlus />
                <span className="font-medium">สมัครสมาชิก</span>
              </Link>
            </>
          )}
        </div>
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-lg p-2 hover:bg-orange-600 transition duration-300">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-orange-600 bg-opacity-95 p-4 mt-2 rounded-b-lg shadow-xl`}>
        <div className="space-y-2">
          <Link to="/" onClick={closeMenu} className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 hover:shadow-lg">
            <FaHome />
            <span className="font-medium">หน้าหลัก</span>
          </Link>
          <Link to="/map" onClick={closeMenu} className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 hover:shadow-lg">
            <FaMap />
            <span className="font-medium">แผนที่</span>
          </Link>
          <Link to="/contact" onClick={closeMenu} className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 hover:shadow-lg">
            <FaEnvelope />
            <span className="font-medium">ช่องทางการติดต่อ</span>
          </Link>
          {userRole ? (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 w-full text-left hover:shadow-lg"
              >
                <FaSignOutAlt />
                <span className="font-medium">ออกจากระบบ</span>
              </button>
              {userRole === 'admin' && (
                <Link to="/dashboard" onClick={closeMenu} className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 hover:shadow-lg">
                  <FaShieldAlt />
                  <span className="font-medium">ผู้ดูแลระบบ</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 hover:shadow-lg">
                <FaSignInAlt />
                <span className="font-medium">เข้าสู่ระบบ</span>
              </Link>
              <Link to="/register" onClick={closeMenu} className="block text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-3 hover:shadow-lg">
                <FaUserPlus />
                <span className="font-medium">สมัครสมาชิก</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;