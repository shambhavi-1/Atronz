const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.getMenu = async (req, res) => {
  try {
    const items = await FoodItem.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await FoodItem.findOne({ name: req.params.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Calculate average rating from feedback
    const feedback = await Feedback.find({ foodItem: item._id });
    const averageRating = feedback.length > 0
      ? feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length
      : item.rating; 
    const itemWithRating = {
      ...item.toObject(),
      rating: averageRating
    };

    res.json(itemWithRating);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.placeOrder = async (req, res) => {
  const { items, address, paymentMethod } = req.body;
  try {
    // Debug logging
    console.log('Place order - user role:', req.user.role, 'type:', typeof req.user.role);
    console.log('Place order - user ID:', req.user.id);
    console.log('Place order - full req.user:', req.user);

    // Ensure only regular users can place orders
    if (req.user.role !== 'USER') {
      console.log('Access denied - user role is not USER');
      console.log('Expected: USER, Got:', req.user.role, 'Type:', typeof req.user.role);
      console.log('Role comparison:', req.user.role === 'USER' ? 'EQUAL' : 'NOT EQUAL');
      console.log('Trimmed role:', req.user.role.trim());
      console.log('Role length:', req.user.role.length);
      return res.status(403).json({ message: 'Only users can place orders' });
    }
    console.log('Access granted - user can place orders');
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    if (!address || !address.street?.trim() || !address.city?.trim() || !address.state?.trim() || !address.zip?.trim()) {
      return res.status(400).json({ message: 'Complete address required' });
    }
    if (!['card', 'upi', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }
    let totalAmount = 0;
    const itemMap = new Map();
    for (const item of items) {
      if (!item.foodItem || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Invalid item data' });
      }
      
      const foodItemDoc = await FoodItem.findById(item.foodItem) || await FoodItem.findOne({ name: item.foodItem });
      if (!foodItemDoc) {
        return res.status(400).json({ message: 'Invalid food item' });
      }
      const key = foodItemDoc._id.toString();
      if (itemMap.has(key)) {
        itemMap.get(key).quantity += item.quantity;
      } else {
        itemMap.set(key, {
          foodItem: foodItemDoc._id,
          quantity: item.quantity,
          price: item.price || foodItemDoc.price,
        });
      }
    }
    const orderItems = Array.from(itemMap.values());
    for (const item of orderItems) {
      totalAmount += item.price * item.quantity;
    }
    
    address.phone = address.phone || '';
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      address,
      paymentMethod,
    });
    await order.save();
    
    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (foodItem) {
        foodItem.stock -= item.quantity;
        await foodItem.save();
      }
    }
    res.json(order);
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.foodItem', 'name price image description')
      .sort({ createdAt: -1 });
      console.log("Placing order for user ID:", req.user.id);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitFeedback = async (req, res) => {
  const { foodItem, rating, comment } = req.body;
  try {
    const feedback = new Feedback({
      user: req.user.id,
      foodItem,
      rating,
      comment,
    });
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  const { foodItemId } = req.body;
  try {
    // Validate that the food item exists
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    // Since cart is handled on frontend, just return success
    res.json({ message: 'Item added to cart successfully', item: foodItem });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addAddress = async (req, res) => {
  const { street, city, state, zip, phone, isDefault } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    user.addresses.push({ street, city, state, zip, phone, isDefault });
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
