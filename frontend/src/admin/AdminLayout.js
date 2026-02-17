import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { AdminSnackbarProvider } from './context/AdminSnackbarContext';
import AdminSnackbar from './components/AdminSnackbar';
import '../styles/global.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { path: '/admin', label: 'Dashboard Overview', icon: '📊' },
    { path: '/admin/menu', label: 'Manage Menu', icon: '🍽️' },
    { path: '/admin/inventory', label: 'Inventory & Stock', icon: '📦' },
    { path: '/admin/orders', label: 'Orders Management', icon: '📋' },
    { path: '/admin/waste', label: 'Usage & Waste', icon: '📉' },
    { path: '/admin/feedback', label: 'Feedback & Reviews', icon: '💬' },
    { path: '/admin/analytics', label: 'Analytics & Reports', icon: '📈' },
    { path: '/admin/reorder', label: 'Reorder Management', icon: '🔄' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AdminSnackbarProvider>
      <div className="admin-layout">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          ☰
        </button>

        {/* Sidebar */}
        <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <div className="admin-logo">
              <img src="/logo192.png" alt="Cafelytic" className="logo-small" />
              {!sidebarCollapsed && <span className="logo-text-admin">Cafelytic Admin</span>}
            </div>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
          </div>

          <nav className="admin-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button onClick={handleLogout} className="admin-logout-btn">
              <span className="nav-icon">🚪</span>
              {!sidebarCollapsed && <span className="nav-label">Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
      <AdminSnackbar />
    </AdminSnackbarProvider>
  );
};

export default AdminLayout;
