const mongoose = require('mongoose');

const reorderSchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true },
  reorderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'ORDERED', 'RECEIVED'], 
    default: 'PENDING' 
  },
  orderedAt: { type: Date, default: Date.now },
  receivedAt: { type: Date },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Reorder', reorderSchema);
