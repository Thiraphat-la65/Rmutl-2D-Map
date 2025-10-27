import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Geonode from './pages/Geonode';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ManageData from './pages/ManageData.jsx';
import InteractiveMap from './pages/InteractiveMap.jsx';
import UserProfile from './pages/UserProfile.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    return <Navigate to="/login" state={{ redirectPath: location.pathname }} replace />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const LayoutWithNavbar = ({ children }) => {
  const location = useLocation();
  const showNavbar = ['/', '/contact'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <LayoutWithNavbar>
              <Geonode />
            </LayoutWithNavbar>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/contact"
          element={
            <LayoutWithNavbar>
              <ContactPage />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/map" 
          element={
            <LayoutWithNavbar>
              <InteractiveMap />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-data"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user" 
          element={
            <LayoutWithNavbar>
              <UserProfile />
            </LayoutWithNavbar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;