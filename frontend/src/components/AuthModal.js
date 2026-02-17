import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/auth.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useContext(AuthContext);
  const { setShowAuthModal, pendingItem, retryAddToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await login(formData);
        setShowAuthModal(false);
        if (location.pathname === '/menu' && pendingItem) {
          // Retry add to cart on menu page
          retryAddToCart(pendingItem);
        } else {
          if (res.user.role === "ADMIN") navigate("/admin");
          else navigate("/user/home");
        }
      } else {
        // For registration, we need to call the register API
        // This would need to be implemented in AuthContext
        alert("Registration functionality needs to be implemented");
      }
    } catch (err) {
      alert("Authentication failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Login Required' : 'Register'}</h2>
        <p>To add items to your cart, please log in or create an account.</p>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="auth-input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="switch-auth-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
