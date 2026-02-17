import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import { useAdminSnackbar } from "../admin/context/AdminSnackbarContext";
import "../styles/auth.css"; // ✅ RESTORES YOUR UI

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      showSnackbar("Login successful!", "success");

      // ✅ ADMIN IDENTIFICATION BASED NAVIGATION
      const role = res.user.role?.toUpperCase();
      const from = location.state?.from || null;
      if (role === "ADMIN") {
        navigate((from && from !== "/") ? from : "/admin");
      } else {
        navigate((from && from !== "/") ? from : "/menu");
      }
    } catch (err) {
      showSnackbar("Invalid login credentials", "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Cafelytic account</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <input
              className="auth-input"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              className="auth-input"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="auth-btn" type="submit">
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
