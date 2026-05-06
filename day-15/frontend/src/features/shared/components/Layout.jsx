import React from 'react';
import { Outlet, useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import { useAuth } from '../../auth/hooks/useAuth';
import '../layout.scss';

const Layout = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
      await handleLogout();
      navigate('/login');
  };

  return (
    <div className="app-layout">
      <div className="mobile-header">
        <span className="logo-text">Insta</span>
        <button className="logout-btn" onClick={onLogout} title="Log Out">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
