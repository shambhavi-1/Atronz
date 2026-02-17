const jwt = require('jsonwebtoken');

// Main authentication middleware
const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    // Fetch fresh user data from database to ensure role is current
    const User = require('../models/User');
    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id,
      role: user.role,
      isAdmin: user.role === 'ADMIN'
    };

    console.log('Auth middleware - fresh user from DB:', req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Allow only USER role
const requireUser = (req, res, next) => {
  console.log('requireUser middleware - user role:', req.user.role);
  if (req.user.role !== 'USER') {
    console.log('Access denied - user is not a regular user');
    return res.status(403).json({ message: 'Only users can access this route' });
  }
  console.log('Access granted - user is a regular user');
  next();
};

// Allow only ADMIN role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only admins can access this route' });
  }
  next();
};

module.exports = {
  auth,
  requireUser,
  requireAdmin,
};