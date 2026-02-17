import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { CartContext } from '../context/CartContext';
import '../styles/global.css';
import '../styles/orders.css';

const OrdersPage = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000); // Refresh every 5 seconds to show status updates from admin
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.user.getOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ORDERED': return '#ffa500';
      case 'PACKED': return '#007bff';
      case 'ON_THE_WAY': return '#28a745';
      case 'DELIVERED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ORDERED': return '📦';
      case 'PACKED': return '📦';
      case 'ON_THE_WAY': return '🚚';
      case 'DELIVERED': return '✅';
      default: return '📦';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status?.toUpperCase() === activeTab;
  });

  const handleReorder = async (order) => {
    try {
      // Add all items from the order to cart
      for (const item of order.items) {
        if (item.foodItem && typeof item.foodItem === 'object' && item.foodItem.name) {
          // Add the item to cart the specified quantity times
          for (let i = 0; i < item.quantity; i++) {
            addToCart(item.foodItem);
          }
        }
      }
      // Wait a bit for state updates to complete, then redirect to cart
      setTimeout(() => {
        navigate('/user/cart');
      }, 100);
    } catch (err) {
      console.error('Failed to reorder:', err);
      alert('Failed to add items to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p className="orders-subtitle">Track and manage your food orders</p>
      </div>

      {/* Order Status Tabs */}
      <div className="orders-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'ORDERED' ? 'active' : ''}`}
          onClick={() => setActiveTab('ORDERED')}
        >
          Ordered ({orders.filter(o => o.status === 'ORDERED').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PACKED' ? 'active' : ''}`}
          onClick={() => setActiveTab('PACKED')}
        >
          Packed ({orders.filter(o => o.status === 'PACKED').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'ON_THE_WAY' ? 'active' : ''}`}
          onClick={() => setActiveTab('ON_THE_WAY')}
        >
          On The Way ({orders.filter(o => o.status === 'ON_THE_WAY').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'DELIVERED' ? 'active' : ''}`}
          onClick={() => setActiveTab('DELIVERED')}
        >
          Delivered ({orders.filter(o => o.status === 'DELIVERED').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders found</h2>
          <p>
            {activeTab === 'all'
              ? "You haven't placed any orders yet. Start exploring our menu!"
              : `No orders with status "${activeTab.replace('_', ' ')}"`
            }
          </p>
          <Link to="/user/home" className="btn primary-btn">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  <span className="status-text">{order.status.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map(item => (
                  (item.foodItem && typeof item.foodItem === 'object' && item.foodItem.name) ? (
                    <div key={item._id} className="order-item-row">
                      <div className="item-image">
                        <img
                          src={item.foodItem?.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center'}
                          alt={item.foodItem?.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h4>{item.foodItem.name}</h4>
                        <p className="item-description">{item.foodItem.description}</p>
                        <div className="item-meta">
                          <span className="quantity">Qty: {item.quantity}</span>
                          <span className="price">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      {order.status === 'delivered' && (
                        <div className="item-actions">
                          <Link
                            to={`/user/feedback/${order._id}/${item.foodItem._id}`}
                            className="btn feedback-btn"
                          >
                            Rate & Review
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div key={item._id} className="order-item-row">
                      <div className="item-details">
                        <h4>Item no longer available</h4>
                        <div className="item-meta">
                          <span className="quantity">Qty: {item.quantity}</span>
                          <span className="price">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="order-actions">
                  <button className="btn secondary-btn">
                    Track Order
                  </button>
                  {order.status === 'DELIVERED' && (
                    <button className="btn primary-btn" onClick={() => handleReorder(order)}>
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
