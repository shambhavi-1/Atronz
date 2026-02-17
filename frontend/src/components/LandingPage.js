import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';
import '../styles/global.css';

const LandingPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.user.getMenu();
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 139, 71, 0.1)'
      }}>
        <div className="navbar-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div className="navbar-logo">
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}>
              <img src="/logo192.png" alt="Cafelytic" className="logo" style={{
                width: '40px',
                height: '40px'
              }} />
              <span className="logo-text" style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                color: '#FFB347',
                marginLeft: '10px'
              }}>
                Cafelytic
              </span>
            </Link>
          </div>

          <div className="navbar-icons" style={{
            display: 'flex',
            gap: '20px'
          }}>
            <Link to="/menu" className="nav-icon" style={{
              padding: '10px 20px',
              borderRadius: '20px',
              textDecoration: 'none',
              color: '#333',
              fontWeight: '500',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🍽️ Menu
            </Link>
            <Link to="/login" className="nav-icon" style={{
              padding: '10px 20px',
              borderRadius: '20px',
              textDecoration: 'none',
              backgroundColor: '#FFB347',
              color: 'white',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}>
              🔐 Login
            </Link>
            <Link to="/register" className="nav-icon" style={{
              padding: '10px 20px',
              borderRadius: '20px',
              textDecoration: 'none',
              backgroundColor: '#FF8C00',
              color: 'white',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}>
              📝 Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFB347 0%, #FF8C00 50%, #FF6347 100%)',
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
          <div className="hero-buttons" style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <Link to="/menu" style={{
              backgroundColor: 'white',
              color: '#FFB347',
              padding: '18px 35px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontSize: '1.2em',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '2px solid white'
            }}>
              🍽️ View Our Menu
            </Link>
            <Link to="/register" style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '3px solid white',
              padding: '18px 35px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontSize: '1.2em',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}>
              📝 Join Us Today
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '80px 20px',
        position: 'relative'
      }}>
        {/* Quote Div */}
        <div className="quote-div" style={{
          textAlign: 'center',
          marginBottom: '10px',
          maxWidth: '800px'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5em, 8vw, 4.5em)',
            marginBottom: '20px',
            color: '#333',
            fontWeight: '800',
            lineHeight: '1.1'
          }}>
            "Good food is the foundation of genuine happiness."
          </h2>
          <p style={{
            fontSize: 'clamp(1.1em, 3vw, 1.8em)',
            marginBottom: '40px',
            color: '#666',
            fontWeight: '300',
            lineHeight: '1.4'
          }}>
            At Cafelytic, we believe that every meal tells a story. Join us in creating unforgettable dining experiences.
          </p>
        </div>

        {/* Image Div */}
        <div className="image-div" style={{
          maxWidth: '1200px',
          width: '100%',
          height: '500px',
          margin: '0 auto',
          backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1670601440146-3b33dfcd7e17?q=80&w=938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}></div>
      </div>



    </div>
  );
};

export default LandingPage;
