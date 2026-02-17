import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import AuthModal from '../components/AuthModal';
import '../styles/global.css';

const HomePage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const { addToCart, searchQuery, showAuthModal, setShowAuthModal } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.user.getMenu();
      setMenu(res.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu = menu.filter(item => {
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
                           (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesItem = !selectedItem ||
                       (item.name && item.name.toLowerCase() === selectedItem.toLowerCase());

    return matchesSearch && matchesCategory && matchesItem;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading menu...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section */}
      <div className="hero-section" style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.8) 0%, rgba(255, 140, 0, 0.8) 50%, rgba(255, 99, 71, 0.8) 100%), url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&crop=center")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '120px 20px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>

        <div className="hero-content" style={{
          maxWidth: '800px',
          position: 'relative',
          zIndex: 2,
          animation: 'fadeInUp 1s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5em, 8vw, 4.5em)',
            marginBottom: '20px',
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
            fontWeight: '800',
            lineHeight: '1.1'
          }}>
            Welcome to <span style={{ color: '#FFF8DC' }}>Cafelytic</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1.1em, 3vw, 1.8em)',
            marginBottom: '40px',
            opacity: 0.95,
            fontWeight: '300',
            lineHeight: '1.4'
          }}>
            Your favorite food, delivered fresh and fast! Experience culinary excellence at your doorstep.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section" style={{ textAlign: 'center', margin: '50px 0', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          <h1 style={{ color: '#FFB347', fontSize: '2.5em', marginBottom: '10px' }}>
            Welcome to Cafelytic
          </h1>
          <p style={{ fontSize: '1.2em', color: '#666' }}>
            Your favorite food, delivered fresh and fast!
          </p>
        </div>

        {/* What are your cravings for? Section */}
        <div className="cravings-section" style={{ textAlign: 'center', margin: '40px 0' }}>
          <h2 style={{ color: '#333', fontSize: '2em', marginBottom: '20px' }}>
            What are your cravings for?
          </h2>
          <div className="cravings-options" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div
              className="craving-item"
              style={{
                padding: '20px',
                border: '2px solid #FFB347',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: selectedCategory === 'pizza' ? '#FFB347' : 'transparent',
                color: selectedCategory === 'pizza' ? 'white' : 'inherit'
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'pizza' ? '' : 'pizza')}
            >
              🍕 Pizza
            </div>
            <div
              className="craving-item"
              style={{
                padding: '20px',
                border: '2px solid #FFB347',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: selectedCategory === 'burger' ? '#FFB347' : 'transparent',
                color: selectedCategory === 'burger' ? 'white' : 'inherit'
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'burger' ? '' : 'burger')}
            >
              🍔 Burgers
            </div>
            <div
              className="craving-item"
              style={{
                padding: '20px',
                border: '2px solid #FFB347',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: selectedCategory === 'pasta' ? '#FFB347' : 'transparent',
                color: selectedCategory === 'pasta' ? 'white' : 'inherit'
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'pasta' ? '' : 'pasta')}
            >
              🍝 Pasta
            </div>
            <div
              className="craving-item"
              style={{
                padding: '20px',
                border: '2px solid #FFB347',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: selectedCategory === 'salad' ? '#FFB347' : 'transparent',
                color: selectedCategory === 'salad' ? 'white' : 'inherit'
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'salad' ? '' : 'salad')}
            >
              🥗 Salads
            </div>
          </div>
        </div>

        {/* What's New Section */}
        <div className="whats-new-section" style={{ margin: '40px 0', padding: '20px', backgroundColor: '#FFF8DC', borderRadius: '10px' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
            What's New
          </h2>
          <div className="new-items" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div
              className="new-item"
              style={{ textAlign: 'center', margin: '10px', cursor: 'pointer', transition: 'transform 0.3s' }}
              onClick={() => {
                setSelectedCategory('');
                setSelectedItem(selectedItem === 'Fiery Inferno Chicken Pizza' ? '' : 'Fiery Inferno Chicken Pizza');
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#FFB347',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                border: '3px solid #FFB347',
                margin: '0 auto'
              }}>
                🍕
              </div>
              <h3>Fiery Inferno Chicken Pizza</h3>
              <p>Try our latest spicy creation!</p>
            </div>
            <div
              className="new-item"
              style={{ textAlign: 'center', margin: '10px', cursor: 'pointer', transition: 'transform 0.3s' }}
              onClick={() => {
                setSelectedCategory('');
                setSelectedItem(selectedItem === 'Vegan Burger' ? '' : 'Vegan Burger');
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#FFB347',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                border: '3px solid #FFB347',
                margin: '0 auto'
              }}>
                🍔
              </div>
              <h3>Vegan Burger Option</h3>
              <p>Delicious plant-based alternative!</p>
            </div>
            <div
              className="new-item"
              style={{ textAlign: 'center', margin: '10px', cursor: 'pointer', transition: 'transform 0.3s' }}
              onClick={() => {
                setSelectedCategory('');
                setSelectedItem(selectedItem === 'Arrabbiata Pasta' ? '' : 'Arrabbiata Pasta');
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#FFB347',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                border: '3px solid #FFB347',
                margin: '0 auto'
              }}>
                🍝
              </div>
              <h3>Arrabbiata Pasta</h3>
              <p>Spicy tomato sauce with red chili flakes!</p>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="menu-section">
          <h2 style={{ textAlign: 'center', margin: '40px 0 20px', color: '#333' }}>
            Our Menu {selectedItem || (selectedCategory && `- ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`)}
          </h2>
          <div className="grid">
            {filteredMenu.map(item => (
              <div key={item._id} className="item-card" style={{ position: 'relative' }}>
                {item.rating && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#FFB347',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 1
                  }}>
                    ⭐ {item.rating}/5
                  </div>
                )}
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center'}
                  alt={item.name}
                  className="menu-item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center';
                  }}
                />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price"><strong>${item.price}</strong></p>
                <p>Stock: <span className={`badge ${item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'danger'}`}>
                  {item.stock}
                </span></p>
                <button
                  className="btn"
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                >
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>

          {filteredMenu.length === 0 && searchQuery && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>No items found</h2>
              <p>Try searching for something else.</p>
            </div>
          )}
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default HomePage;
