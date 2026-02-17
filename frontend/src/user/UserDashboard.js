import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/api';
import '../styles/global.css';

const UserDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [feedbackItem, setFeedbackItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.user.getMenu();
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.user.getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    try {
      await api.user.placeOrder({
        items: cart.map(item => ({ foodItem: item._id, quantity: item.quantity }))
      });
      setCart([]);
      fetchOrders();
      alert('Order placed successfully!');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  const submitFeedback = async (foodItemId) => {
    try {
      await api.user.submitFeedback({ foodItem: foodItemId, rating, comment });
      setFeedbackItem(null);
      setRating(5);
      setComment('');
      alert('Feedback submitted successfully!');
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome to Cafelytic, {user?.name}!</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="card">
        <h2>Menu</h2>
        <div className="grid">
          {menu.map(item => (
            <div key={item._id} className="item-card">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center'}
                alt={item.name}
                className="menu-item-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center';
                }}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price"><strong>${item.price}</strong></p>
              <p>Stock: <span className={`badge ${item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'danger'}`}>
                {item.stock}
              </span></p>
              <button
                className="btn"
                onClick={() => addToCart(item)}
                disabled={item.stock === 0}
              >
                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                      {item.quantity}
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn"
                        style={{ backgroundColor: '#ff6b6b' }}
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total: ${totalAmount.toFixed(2)}</h3>
            <button className="btn" onClick={placeOrder}>Place Order</button>
          </>
        )}
      </div>

      <div className="card">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.items.map(item => `${item.foodItem.name} (x${item.quantity})`).join(', ')}</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className={`badge ${order.status === 'delivered' ? 'success' : order.status === 'pending' ? 'warning' : 'default'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Submit Feedback</h2>
        <select
          className="input"
          onChange={(e) => setFeedbackItem(e.target.value)}
          value={feedbackItem || ''}
        >
          <option value="">Select an item to feedback</option>
          {menu.map(item => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>
        {feedbackItem && (
          <form onSubmit={(e) => {
            e.preventDefault();
            submitFeedback(feedbackItem);
          }} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Rating (1-5):</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="input"
                required
              />
            </div>
            <div className="form-group">
              <label>Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input"
                rows="3"
                placeholder="Optional comment"
              />
            </div>
            <button type="submit" className="btn">Submit Feedback</button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: '#ccc', marginLeft: '10px' }}
              onClick={() => setFeedbackItem(null)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
