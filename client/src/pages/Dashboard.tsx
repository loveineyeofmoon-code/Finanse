import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userData = useUserData();
  // если пользователь есть, но в документе users указано emailVerified=false, перенаправляем на /verify
  if (user && userData && userData.emailVerified === false) {
    return <Navigate to="/verify" replace />;
  }

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className={`app-container ${isMenuOpen ? 'menu-open' : ''}`}>
      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Закрыть меню"
        />
      )}
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-topbar">
          <button className="sidebar-toggle" type="button" onClick={toggleMenu}>
            ☰ Меню
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
