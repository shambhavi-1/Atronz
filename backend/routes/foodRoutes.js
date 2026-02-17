const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { auth } = require('../middleware/auth');
const Rating = require('../models/Rating');
const FoodItem = require('../models/FoodItem');

// GET all food items
router.get('/', foodController.getAllFoodItems);

// POST add food item
router.post('/', foodController.addFoodItem);

// PUT update food item
router.put('/:id', foodController.updateFoodItem);

// DELETE food item
router.delete('/:id', foodController.deleteFoodItem);

// POST rate food item
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const foodItemId = req.params.id;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if food item exists
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Save or update rating
    await Rating.findOneAndUpdate(
      { user: userId, foodItem: foodItemId },
      { rating },
      { upsert: true, new: true }
    );

    // Recalculate average rating
    const ratings = await Rating.find({ foodItem: foodItemId });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    // Update FoodItem
    await FoodItem.findByIdAndUpdate(foodItemId, {
      rating: averageRating,
      ratingCount: ratings.length
    });

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
