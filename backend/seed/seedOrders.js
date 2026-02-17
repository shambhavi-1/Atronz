const Order = require('../models/Order');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');

const seedOrders = async () => {
  // Get existing users and food items
  const users = await User.find();
  const foodItems = await FoodItem.find();

  if (users.length === 0 || foodItems.length === 0) {
    console.log('⚠️ No users or food items found, skipping order seeding');
    return;
  }

  const existingOrderCount = await Order.countDocuments();
  if (existingOrderCount > 10) {
    console.log('⚠️ Orders already seeded. Skipping new order creation.');
    return;
  }

  // Update existing orders to use ObjectId for foodItem if they have string
  // Also reassign orders from admin users to regular users
  const allOrders = await Order.find().populate('user');
  const regularUsers = users.filter(user => user.role !== 'ADMIN');

  for (const order of allOrders) {
    let updated = false;
    for (const item of order.items) {
      if (typeof item.foodItem === 'string') {
        // Find the food item by name or id
        const foodItem = foodItems.find(f => f._id.toString() === item.foodItem || f.name === item.foodItem);
        if (foodItem) {
          item.foodItem = foodItem._id;
          updated = true;
        }
      }
    }
    // Reassign order to regular user
    if (order.user && regularUsers.length > 0) {
      const randomRegularUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      order.user = randomRegularUser._id;
      updated = true;
      console.log(`✅ Reassigned order ${order._id} to user: ${randomRegularUser.email}`);
    }
    if (updated) {
      await order.save();
      console.log(`✅ Updated order ${order._id}`);
    }
  }

  // Create only up to 6 total orders
  const ordersToCreate = 6 - existingOrderCount;
  for (let i = 0; i < ordersToCreate; i++) {
    const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
    // Random items for the order (ensure no duplicates)
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const selectedItems = new Set();
    const orderItems = [];
    let totalAmount = 0;

    while (orderItems.length < numItems && selectedItems.size < foodItems.length) {
      const randomItem = foodItems[Math.floor(Math.random() * foodItems.length)];
      if (!selectedItems.has(randomItem._id.toString())) {
        selectedItems.add(randomItem._id.toString());
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const price = randomItem.price;

        orderItems.push({
          foodItem: randomItem._id,
          quantity,
          price
        });

        totalAmount += price * quantity;
      }
    }

    // Random status
    const statuses = ['ORDERED', 'PACKED', 'ON_THE_WAY', 'DELIVERED'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Random address
    const addresses = [
      { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', phone: '123-456-7890' },
      { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90210', phone: '987-654-3210' },
      { street: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', phone: '555-123-4567' }
    ];
    const address = addresses[Math.floor(Math.random() * addresses.length)];

    const order = new Order({
      user: randomUser._id,
      items: orderItems,
      totalAmount,
      address,
      paymentMethod: 'card',
      status
    });

    await order.save();
    console.log(`✅ Created order for user: ${randomUser.email}`);
  }
};

module.exports = seedOrders;
