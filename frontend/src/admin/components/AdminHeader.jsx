import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminHeader = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path === '/admin/menu') return 'Manage Menu';
    if (path === '/admin/inventory') return 'Inventory & Stock';
    if (path === '/admin/orders') return 'Orders Management';
    if (path === '/admin/waste') return 'Usage & Waste';
    if (path === '/admin/feedback') return 'Feedback & Reviews';
    if (path === '/admin/analytics') return 'Analytics & Reports';
    if (path === '/admin/reorder') return 'Reorder Management';
    return 'Admin Panel';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-header-logo">
          <img src="/logo192.png" alt="Cafelytic" className="header-logo" />
          <span className="header-title">Cafelytic Admin</span>
        </div>
      </div>

      <div className="admin-header-center">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="admin-header-right">
        <div className="profile-dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <span className="profile-label">{user?.name || 'Admin'}</span>
            <span className="profile-icon">👤</span>
          </button>

          {showProfileDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="dropdown-item">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
