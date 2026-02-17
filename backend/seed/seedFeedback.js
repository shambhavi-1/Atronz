const Feedback = require('../models/Feedback');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

const seedFeedback = async () => {
  // Get existing users and food items
  const users = await User.find();
  const foodItems = await FoodItem.find();

  if (users.length === 0 || foodItems.length === 0) {
    console.log('⚠️ No users or food items found, skipping feedback seeding');
    return;
  }

  
  const allFeedback = await Feedback.find().populate('user');
  const regularUsers = users.filter(user => user.role !== 'ADMIN');

  for (const feedback of allFeedback) {
    let updated = false;
    
    if (!feedback.user || (feedback.user && feedback.user.role === 'ADMIN')) {
      
      const order = await Order.findOne({ 'items.foodItem': feedback.foodItem }).populate('user');
      if (order && order.user && order.user.role !== 'ADMIN') {
        feedback.user = order.user._id;
        updated = true;
        console.log(`✅ Assigned feedback ${feedback._id} to user: ${order.user.email}`);
      } else if (regularUsers.length > 0) {
        
        feedback.user = regularUsers[0]._id;
        updated = true;
        console.log(`✅ Assigned feedback ${feedback._id} to user: ${regularUsers[0].email}`);
      }
    }
    if (updated) {
      await feedback.save();
      console.log(`✅ Updated feedback ${feedback._id}`);
    }
  }

  // Create some additional feedback if less than 5 exist
  const existingFeedbackCount = await Feedback.countDocuments();
  const feedbackToCreate = Math.max(0, 5 - existingFeedbackCount);

  for (let i = 0; i < feedbackToCreate; i++) {
    const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
    const randomFoodItem = foodItems[Math.floor(Math.random() * foodItems.length)];

    const ratings = [3, 4, 5];
    const comments = ['Great food!', 'Delicious!', 'Very tasty', 'Good quality', 'Nice experience', ''];

    const feedback = new Feedback({
      user: randomUser._id,
      foodItem: randomFoodItem._id,
      rating: ratings[Math.floor(Math.random() * ratings.length)],
      comment: comments[Math.floor(Math.random() * comments.length)]
    });

    await feedback.save();
    console.log(`✅ Created feedback for user: ${randomUser.email} on ${randomFoodItem.name}`);
  }
};

module.exports = seedFeedback;
