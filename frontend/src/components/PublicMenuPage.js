import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import axiosInstance from '../api/axios';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import '../styles/global.css';

const PublicMenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, cart, updateQuantity, removeFromCart, getTotalAmount } = useCart();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('🔄 PublicMenuPage: Component mounted, starting menu fetch...');
    console.log('🔗 PublicMenuPage: API base URL:', process.env.REACT_APP_API_URL || 'http://localhost:5001');
    console.log('📡 PublicMenuPage: About to call api.user.getMenu()');

    const fetchMenu = async () => {
      try {
        console.log('📤 PublicMenuPage: Making API call to getMenu...');
        const startTime = Date.now();
        const response = await api.user.getMenu();
        const endTime = Date.now();
        console.log(`⏱️ PublicMenuPage: API call took ${endTime - startTime}ms`);

        console.log('📥 PublicMenuPage: Full API response:', response);
        console.log('📊 PublicMenuPage: Response status:', response.status);
        console.log('📋 PublicMenuPage: Response headers:', response.headers);
        console.log('🍽️ PublicMenuPage: Raw menu data from response.data:', response.data);

        const data = Array.isArray(response.data) ? response.data : [];
        console.log('🔄 PublicMenuPage: Processed menu data (ensured array):', data);
        console.log('📏 PublicMenuPage: Menu data length:', data.length);

        if (data.length > 0) {
          console.log('✅ PublicMenuPage: First menu item sample:', data[0]);
          console.log('📝 PublicMenuPage: Menu item keys:', Object.keys(data[0]));
        } else {
          console.log('⚠️ PublicMenuPage: No menu items received');
        }

        setMenu(data);
        console.log('💾 PublicMenuPage: Menu state updated with', data.length, 'items');
      } catch (err) {
        console.error('❌ PublicMenuPage: Failed to fetch menu:', err);
        console.error('🔍 PublicMenuPage: Error message:', err.message);
        console.error('🌐 PublicMenuPage: Error response:', err.response);
        console.error('📊 PublicMenuPage: Error status:', err.response?.status);
        console.error('📋 PublicMenuPage: Error data:', err.response?.data);
        console.error('🔗 PublicMenuPage: Error config:', err.config);
        setMenu([]);
      } finally {
        setLoading(false);
        console.log('🏁 PublicMenuPage: Loading finished, component ready');
      }
    };
    fetchMenu();
  }, []);

  const urlParams = new URLSearchParams(location.search);
  const urlSelectedItem = urlParams.get('item');

  const categories = ['All', ...new Set(menu.map(item => item.category))].filter(cat => cat !== 'cravings');

  // Category images mapping
  const categoryImages = {
    Pizza: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Burger: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center",
    Pasta: "https://plus.unsplash.com/premium_photo-1664472682525-0c0b50534850?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2V0dGklMjBjYXJib25hcmF8ZW58MHx8MHx8fDA%3D",
    Salad: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop&crop=center",
    Snacks: "https://images.unsplash.com/photo-1601050690294-397f3c324515?auto=format&fit=crop&w=800&q=80",
    Breakfast: "https://images.unsplash.com/photo-1725483990122-802996d84699?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Lunch: "https://plus.unsplash.com/premium_photo-1669831178095-005ed789250a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Beverages: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    Dessert: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  };

  const filteredMenu = urlSelectedItem
    ? menu.filter(item => item.name === urlSelectedItem)
    : menu.filter(item => {
        const matchesSearch = searchQuery === '' ||
          (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

  const cravingItems = menu.filter(item => item.rating && item.rating >= 4.5);
  const newItems = menu.filter(item => item.stock > 100);



  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ backgroundColor: 'white', padding: '20px', minHeight: '100vh' }}>
        {/* 1st Div: What's Your Craving For? - Categories in horizontal bar with circular items */}
        <div className="card" style={{ marginTop: '40px', borderRadius: '15px', border: '2px solid orange' }}>
          <h2>What's Your Craving For?</h2>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px', justifyContent: 'center' }}>
            {categories.map(cat => (
              <div key={cat} style={{ minWidth: '120px', flexShrink: 0, textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedCategory(cat)}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  overflow: 'hidden'
                }}>
                  <img src={categoryImages[cat]} alt={cat} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='} />
                </div>
                <p style={{ fontSize: '14px', marginTop: '5px', fontWeight: 'bold', textAlign: 'center' }}>{cat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2nd Div: What's New - New items in horizontal bar with circular items */}
        {newItems.length > 0 && (
          <div className="card" style={{ marginTop: '40px', borderRadius: '20px', border: '2px solid #ff6b6b' }}>
            <h2>What's New</h2>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px', justifyContent: 'center' }}>
              {newItems.map((item, index) => (
                <div key={item._id} style={{ minWidth: '120px', flexShrink: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    navigate('/login', { state: { from: location.pathname } });
                  } else {
                    navigate(`/user/item/${item._id}`);
                  }
                }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', overflow: 'hidden' }}>
                    <img src={item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/uploads/${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'} />
                  </div>
                  <p style={{ fontSize: '14px', marginTop: '5px', fontWeight: 'bold', textAlign: 'center' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3rd Div: Main Menu - All items in normal grid with full details */}
        <div className="card" style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Main Menu</h2>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontWeight: '500'
                }}
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="menu-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '15px',
            padding: '20px'
          }}>
            {filteredMenu.map(item => (
              <div key={item._id} id={item._id} className="menu-item" style={{
                border: '1px solid #e1e5e9',
                borderRadius: '12px',
                padding: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
              }}>
                <img src={item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/uploads/${item.image}`} alt={item.name} className="menu-item-image" style={{
                  width: '90%',
                  height: '165px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }} onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'} />
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '1em',
                  fontWeight: '600',
                  color: '#2c3e50',
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{item.name}</h3>
                <p style={{
                  margin: '0 0 6px 0',
                  color: '#7f8c8d',
                  fontSize: '0.8em',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: '2.6em'
                }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{
                    margin: '0',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    color: '#e74c3c'
                  }}>${item.price}</p>
                  <StarRating rating={item.rating} />
                </div>
                <button onClick={() => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    navigate('/login', { state: { from: location.pathname } });
                  } else {
                    navigate(`/user/item/${item._id}`);
                  }
                }} className="btn" style={{
                  width: '100%',
                  padding: '6px 10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease',
                  marginBottom: '5px'
                }}>View Details</button>
                <button
                  className="btn"
                  onClick={() => {
                    if (!user) {
                      navigate('/login', { state: { from: location.pathname } });
                    } else {
                      addToCart(item);
                    }
                  }}
                  disabled={item.stock === 0}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    backgroundColor: item.stock === 0 ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: item.stock === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.85em',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {filteredMenu.length === 0 && searchQuery && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>No items found</h2>
            <p>Try searching for something else.</p>
          </div>
        )}
      </div>
  );
};

export default PublicMenuPage;
