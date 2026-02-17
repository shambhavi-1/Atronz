const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Waste = require('../models/Waste');
const Reorder = require('../models/Reorder');

exports.getItems = async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addItem = async (req, res) => {
  const { name, category, price, stock, description } = req.body;
  const image = req.file ? req.file.filename : '';
  try {
    const item = new FoodItem({ name, category, price, stock, description, image });
    await item.save();
    res.json(item);
  } catch (error) {
  console.error('ADD ITEM ERROR:', error);
  res.status(500).json({ message: error.message });
}
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    const item = await FoodItem.findByIdAndUpdate(id, updateData, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    await FoodItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email role').populate('items.foodItem', 'name price');
    const filteredOrders = orders.filter(order => order.user && typeof order.user === 'object' && order.user.role !== 'ADMIN');

    
    const userIds = [...new Set(filteredOrders.map(order => order.user._id.toString()))];

    
    const userTotalItems = {};
    for (const userId of userIds) {
      const userOrders = await Order.find({ user: userId });
      const totalItems = userOrders.reduce((sum, order) =>
        sum + order.items.reduce((orderSum, item) => orderSum + item.quantity, 0), 0
      );
      userTotalItems[userId] = totalItems;
    }

    
    const ordersWithData = filteredOrders.map(order => ({
      ...order.toObject(),
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      itemCount: order.items.length,
      userTotalItems: userTotalItems[order.user._id.toString()] || 0
    }));

    res.json(ordersWithData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('user', 'name email').populate('foodItem');
    
    const filteredFeedback = feedback.filter(fb => fb.user && fb.user.role !== 'ADMIN');
    res.json(filteredFeedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.recordWaste = async (req, res) => {
  const { foodItem, quantity, reason } = req.body;
  try {
    const waste = new Waste({ foodItem, quantity, reason });
    await waste.save();
    res.json(waste);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
    const lowStockItems = await FoodItem.find({ stock: { $lt: 10 } });
    const wasteData = await Waste.find().populate('foodItem');
    res.json({ totalOrders, totalRevenue: totalRevenue[0]?.total || 0, lowStockItems, wasteData });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { status: status.toUpperCase() }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsage = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let startDate;

    const now = new Date();
    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const usageData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.foodItem',
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'fooditems',
          localField: '_id',
          foreignField: '_id',
          as: 'item'
        }
      },
      { $unwind: '$item' },
      {
        $project: {
          itemName: '$item.name',
          category: '$item.category',
          quantityConsumed: '$totalQuantity'
        }
      },
      { $sort: { quantityConsumed: -1 } }
    ]);

    const totalItemsSold = usageData.reduce((sum, item) => sum + item.quantityConsumed, 0);
    const mostConsumedItem = usageData.length > 0 ? usageData[0].itemName : 'None';

    res.json({ usageData, totalItemsSold, mostConsumedItem, period });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getWaste = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    let query = {};

    const now = new Date();
    if (period === 'today') {
      // Start and end of today
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      query.date = { $gte: startOfDay, $lt: endOfDay };
    } else if (period === 'week') {
      const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query.date = { $gte: startDate };
    } else if (period === 'month') {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      query.date = { $gte: startDate };
    }

    const wasteData = await Waste.find(query).populate('foodItem').sort({ date: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayWaste = wasteData.filter(w => w.date >= today);
    const totalWasteToday = todayWaste.reduce((sum, w) => sum + w.quantity, 0);
    const wasteByItem = {};
    wasteData.forEach(w => {
      if (!wasteByItem[w.foodItem.name]) wasteByItem[w.foodItem.name] = 0;
      wasteByItem[w.foodItem.name] += w.quantity;
    });
    const mostWastedItem = Object.keys(wasteByItem).length > 0 ? Object.keys(wasteByItem).reduce((a, b) => wasteByItem[a] > wasteByItem[b] ? a : b) : 'None';

    res.json({ wasteData, totalWasteToday, mostWastedItem, period });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let startDate;

    const now = new Date();
    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Total orders and revenue
    const orders = await Order.find({ createdAt: { $gte: startDate } });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Low stock items
    const lowStockItems = await FoodItem.find({ stock: { $lt: 10 } });

    // Waste data
    const wasteData = await Waste.find({ date: { $gte: startDate } }).populate('foodItem');
    const totalWaste = wasteData.reduce((sum, w) => sum + w.quantity, 0);

    // Usage data (orders by item)
    const usageData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.foodItem',
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'fooditems',
          localField: '_id',
          foreignField: '_id',
          as: 'item'
        }
      },
      { $unwind: '$item' },
      {
        $project: {
          itemName: '$item.name',
          category: '$item.category',
          quantityConsumed: '$totalQuantity'
        }
      },
      { $sort: { quantityConsumed: -1 } }
    ]);

    // Top selling items
    const topSellingItems = usageData.slice(0, 5);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'fooditems',
          localField: 'items.foodItem',
          foreignField: '_id',
          as: 'item'
        }
      },
      { $unwind: '$item' },
      {
        $group: {
          _id: '$item.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      lowStockItems,
      totalWaste,
      topSellingItems,
      revenueByCategory,
      period
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReorders = async (req, res) => {
  try {
    const reorders = await Reorder.find()
      .populate('foodItem')
      .populate('reorderedBy', 'name email')
      .sort({ date: -1 });

    res.json(reorders);
  } catch (error) {
  console.error('REORDER ERROR:', error);
  res.status(500).json({ message: error.message });
}

};

exports.createReorder = async (req, res) => {
  const { foodItem, quantity, notes } = req.body;

  if (!foodItem) {
    return res.status(400).json({ message: 'Food item is required' });
  }

  if (!quantity || Number(quantity) <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    const item = await FoodItem.findById(foodItem);

    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    item.stock += Number(quantity);
    if (item.stock > 0) item.isAvailable = true;
    await item.save();

    const reorder = await Reorder.create({
      foodItem: item._id,
      quantity: Number(quantity),
      notes,
      reorderedBy: req.user ? req.user.id : null,
      status: 'RECEIVED',
      orderedAt: new Date(),
      receivedAt: new Date()
    });

    res.json(reorder);
  } catch (error) {
  console.error('REORDER ERROR:', error);
  res.status(500).json({ message: error.message });
}
};

exports.updateReorderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'ORDERED', 'RECEIVED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const reorder = await Reorder.findById(id);
    if (!reorder) {
      return res.status(404).json({ message: 'Reorder not found' });
    }

    reorder.status = status;
    if (status === 'RECEIVED') {
      reorder.receivedAt = new Date();
    }

    await reorder.save();
    res.json(reorder);

  } catch (error) {
  console.error('REORDER ERROR:', error);
  res.status(500).json({ message: error.message });
}
};

exports.getLowStockItems = async (req, res) => {
  try {
    const items = await FoodItem.find({
      $or: [
        { stock: { $lt: 10 } },
        { isAvailable: false }
      ]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};