import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';
import CartDrawer from './CartDrawer';
import '../styles/header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menu, setMenu] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    fetchMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.user.getMenu();
      setMenu(res.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
    if (accountRef.current && !accountRef.current.contains(e.target)) {
      setShowAccountDropdown(false);
    }
  };

  const filteredSuggestions = menu.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 suggestions

  const handleSuggestionClick = (item) => {
    navigate(`/user/item/${item._id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="logo-link">
              <img src="/logo192.png" alt="Cafelytic" className="logo" />
              <span className="logo-text">Cafelytic</span>
            </Link>
          </div>

          <div className="header-center" ref={searchRef}>
            <div className="search-container">
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
              <button type="submit" className="search-btn">🔍</button>
              {showSuggestions && (
                <div className="search-dropdown">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map(item => (
                      <div
                        key={item._id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <img src={item.image} alt={item.name} className="suggestion-image" />
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
            </div>
          </div>

          <div className="header-right">
            <button onClick={() => setShowCart(true)} className="header-icon cart-icon">
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
            {user && (
              <Link to="/user/orders" className="header-icon">
                📦 Orders
              </Link>
            )}
            <div className="header-icon account-icon" ref={accountRef}>
              <button onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
                👤 {user ? user.name : 'Account'}
              </button>
              {showAccountDropdown && (
                <div className="account-dropdown">
                  {user ? (
                    <>
                      <Link to="/user/profile" className="dropdown-item">Profile</Link>
                      <button onClick={handleLogout} className="dropdown-item">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item">Login</Link>
                      <Link to="/register" className="dropdown-item">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
