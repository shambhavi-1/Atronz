import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';
import axiosInstance from '../api/axios';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menu, setMenu] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    fetchMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axiosInstance.get('user/menu');
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setMenu([]);
    }
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setShowUserMenu(false);
    }
  };

  const filteredSuggestions = (Array.isArray(menu) ? menu : []).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 suggestions

  const handleSuggestionClick = (item) => {
    if (user) {
      navigate(`/user/item/${item._id}`);
    } else {
      navigate(`/menu?item=${item.name}`);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (user) {
        navigate(`/user/home?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to={user ? "/user/home" : "/"}>
            <img src="/logo192.png" alt="Cafelytic" className="logo" />
            <span className="logo-text">Cafelytic</span>
          </Link>
        </div>

        {/* Search Bar with Dropdown */}
        <div className="navbar-search" ref={searchRef}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
            {showSuggestions && (
              <div className="search-dropdown">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map(item => (
                    <div
                      key={item._id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <img src={item.image || '/icons/food-placeholder.png'} alt={item.name} className="suggestion-image" />
                      <div className="suggestion-details">
                        <div className="suggestion-name">{item.name}</div>
                        <div className="suggestion-price">${item.price}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-suggestions">No items found</div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Navigation Icons */}
        <div className="navbar-icons">
          {/* Cart */}
          <div onClick={() => handleProtectedClick('/user/cart')} className={`nav-icon ${isActive('/user/cart') ? 'active' : ''}`}>
            <div className="nav-icon-content">
              🛒
              <span className="nav-text">Cart</span>
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </div>
          </div>

          {/* Orders */}
          <div onClick={() => handleProtectedClick('/user/orders')} className={`nav-icon ${isActive('/user/orders') ? 'active' : ''}`}>
            <div className="nav-icon-content">
              📦
              <span className="nav-text">Orders</span>
            </div>
          </div>

          {/* Profile/User Menu */}
          {user ? (
            <div className="nav-icon user-menu-container">
              <div ref={userMenuRef}>
                <button
                  className="nav-icon user-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  <div className="nav-icon-content">
                    👤
                    <span className="nav-text">{user.name}</span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <div onClick={() => navigate('/login')} className="nav-icon">
                <div className="nav-icon-content">
                  🔐
                  <span className="nav-text">Login</span>
                </div>
              </div>
              <div onClick={() => navigate('/register')} className="nav-icon">
                <div className="nav-icon-content">
                  📝
                  <span className="nav-text">Register</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
