const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Global variables for logging
global.logs = [];

/* =========================
   Middleware
========================= */
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

/* =========================
   Health check
========================= */
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

/* =========================
   Routes
========================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/webhooks', require('./routes/webhooks'));

/* =========================
   Cybersecurity Routes
========================= */
// POST /api/logs - Log user activities
app.post('/api/logs', (req, res) => {
  const { user, action } = req.body;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const timestamp = new Date();

  // Add log
  global.logs.push({ user, action, ip, timestamp });

  // Rule-based anomaly detection for login attempts
  if (action === 'login') {
    const sixtySecondsAgo = new Date(timestamp.getTime() - 60 * 1000);
    const recentLoginAttempts = global.logs.filter(log =>
      log.user === user && log.action === 'login' && log.timestamp >= sixtySecondsAgo
    );

    const count = recentLoginAttempts.length;
    let riskLevel = 'LOW';

    if (count >= 5) {
      riskLevel = 'HIGH';
    } else if (count >= 3) {
      riskLevel = 'MEDIUM';
    }

    if (riskLevel !== 'LOW') {
      console.log(`[${riskLevel}] Anomaly detected: ${count} login attempts in 1 minute - User: ${user}, IP: ${ip}`);
    }
  }

  res.json({ message: 'Log recorded' });
});

/* =========================
   MongoDB Connection
========================= */
const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cafelytic';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB connected');

    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('⛔ MongoDB connection REQUIRED. Server not started.');
    process.exit(1);
  });
