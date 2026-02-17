const FoodItem = require("../models/FoodItem");

exports.getAllFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu" });
  }
};


exports.addFoodItem = async (req, res) => {
  try {
    const food = new FoodItem(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ message: "Failed to add food item" });
  }
};


exports.updateFoodItem = async (req, res) => {
  try {
    const updated = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update food item" });
  }
};


exports.deleteFoodItem = async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete food item" });
  }
};
