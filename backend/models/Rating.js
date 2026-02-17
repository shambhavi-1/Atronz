const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Compound unique index
ratingSchema.index({ user: 1, foodItem: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
