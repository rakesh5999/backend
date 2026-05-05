import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import '../layout.scss';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
