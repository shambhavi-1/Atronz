const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth'); // destructure auth
const multer = require('multer');
const path = require('path');
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  getOrders,
  updateOrderStatus,
  getFeedback,
  recordWaste,
  getAnalytics,
  getUsage,
  getWaste,
  getReorders,
  createReorder,
  updateReorderStatus,
  getLowStockItems
} = require('../controllers/admin');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/items', auth, getItems);
router.post('/items', auth, upload.single('image'), addItem);
router.put('/items/:id', auth, upload.single('image'), updateItem);
router.delete('/items/:id', auth, deleteItem);
router.get('/orders', auth, getOrders);
router.put('/orders/:id/status', auth, updateOrderStatus);
router.get('/feedback', auth, getFeedback);
router.post('/waste', auth, recordWaste);
router.get('/analytics', auth, getAnalytics);
router.get('/usage', auth, getUsage);
router.get('/waste', auth, getWaste);

// Reorder routes
router.get('/reorders/low-stock', auth, getLowStockItems);
router.get('/reorders', auth, getReorders);
router.post('/reorders', auth, createReorder);
router.put('/reorders/:id/status', auth, updateReorderStatus);

module.exports = router;
