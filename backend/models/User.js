const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  addresses: [{
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    phone: { type: String },
    isDefault: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
