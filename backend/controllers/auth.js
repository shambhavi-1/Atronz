const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    const { name, email, password, role } = req.body;

    console.log('Extracted data:', { name, email, password: password ? '[HIDDEN]' : undefined, role });

    if (!name || !email || !password || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      console.log('Validation failed: missing or invalid fields');
      return res.status(400).json({ message: "Name, email, and password are required and must be strings" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    console.log('Trimmed data:', { trimmedName, trimmedEmail, passwordLength: password.length });

    if (!trimmedEmail || !trimmedName || !password) {
      console.log('Validation failed: empty after trimming');
      return res.status(400).json({ message: "Name, email, and password cannot be empty after trimming" });
    }

    console.log('Checking for existing user...');
    const existing = await User.findOne({ email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } });
    console.log('Existing user check result:', existing ? 'found' : 'not found');

    if (existing) {
      console.log('User already exists');
      return res.status(400).json({ message: "User already exists" });
    }


    if (role && role.toUpperCase() === 'ADMIN') {
      console.log('Checking admin role...');
      const existingAdmin = await User.findOne({ role: 'ADMIN' });
      if (existingAdmin) {
        console.log('Admin already exists');
        return res.status(400).json({ message: 'An admin already exists. Only one admin is allowed.' });
      }
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user...');
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: role ? role.toUpperCase() : 'USER',
      addresses: [],
    });

    console.log('User created successfully:', user._id);

    console.log('Generating token...');
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Registration successful');
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({
      message: "Registration failed",
      error: err.message
    });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    let role = user.role ? user.role.toUpperCase() : 'USER';


    if (email === 'admin@cafelytic.com') {
      role = 'ADMIN';

      if (user.role !== 'ADMIN') {
        user.role = 'ADMIN';
        await user.save();
      }
    }


    const isAdmin = role === 'ADMIN';


    console.log('Role from DB:', user.role);
    console.log('Normalized role:', role);
    console.log('Is Admin:', isAdmin);

    const token = jwt.sign(
      { user: { id: user._id, role: role, isAdmin: isAdmin } },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );


    console.log('Role in JWT:', role);
    console.log('Is Admin in JWT:', isAdmin);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        isAdmin: isAdmin,
      },
    });


    console.log('Role sent to frontend:', role);
    console.log('Is Admin sent to frontend:', isAdmin);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= VERIFY TOKEN ================= */
exports.verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    let role = user.role ? user.role.toUpperCase() : 'USER';


    const isAdmin = role === 'ADMIN';

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        isAdmin: isAdmin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
