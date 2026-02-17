const express = require('express');
const router = express.Router();
const { auth, requireUser } = require('../middleware/auth'); 
const {
  getMenu,
  getItemById,
  placeOrder,
  getOrders,
  submitFeedback,
  addToCart,
  addAddress,
  getAddresses,
} = require('../controllers/user');

router.get('/menu', getMenu);
router.get('/menu/item/:id', getItemById);
router.post('/cart', auth, addToCart);
router.post('/orders', auth, placeOrder);
router.get('/orders', auth, getOrders);
router.post('/feedback', auth, submitFeedback);
router.post('/addresses', auth, addAddress);
router.get('/addresses', auth, getAddresses);

module.exports = router;