import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/api';
import { useAdminSnackbar } from './context/AdminSnackbarContext';
import '../styles/admin.css';

const AdminDashboard = () => {
  const location = useLocation();
  const { showSnackbar } = useAdminSnackbar();
  const [items, setItems] = useState([
    { _id: '1', name: 'Burger', category: 'Fast Food', price: 10, stock: 5, image: '' },
    { _id: '2', name: 'Pizza', category: 'Italian', price: 15, stock: 3, image: '' },
    { _id: '3', name: 'Salad', category: 'Healthy', price: 8, stock: 10, image: '' },
    { _id: '4', name: 'Pasta', category: 'Italian', price: 12, stock: 7, image: '' },
    { _id: '5', name: 'Fries', category: 'Fast Food', price: 5, stock: 20, image: '' }
  ]);
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    totalMenuItems: 0,
    totalUsers: 0,
    lowStockItems: [],
    wasteData: []
  });
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '', stock: '', description: '', image: null });
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [wasteData, setWasteData] = useState({ wasteData: [], totalWasteToday: 0, mostWastedItem: 'None' });
  const [newWaste, setNewWaste] = useState({ foodItem: '', quantity: '', reason: '' });
  const [usagePeriod, setUsagePeriod] = useState('month');
  const [wastePeriod, setWastePeriod] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('month');
  const [reorders, setReorders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reorderQuantity, setReorderQuantity] = useState('');
  const [reorderNotes, setReorderNotes] = useState('');


  useEffect(() => {
    if (location.pathname === '/admin/menu' || location.pathname === '/admin/inventory' || location.pathname === '/admin' || location.pathname === '/admin/reorder') {
      fetchItems();
    }
    if (location.pathname === '/admin/orders' || location.pathname === '/admin') {
      fetchOrders();
    }
    if (location.pathname === '/admin/feedback' || location.pathname === '/admin') {
      fetchFeedback();
    }
    if (location.pathname === '/admin' || location.pathname === '/admin/analytics') {
      fetchAnalytics();
    }
    if (location.pathname === '/admin/analytics') {
      fetchAnalyticsData(analyticsPeriod);
    }
    if (location.pathname === '/admin/reorder') {
      fetchReorders();
      fetchLowStock();
    }
    if (location.pathname === '/admin/waste') {
      fetchUsage(usagePeriod);
      fetchWaste();
    }

  }, [location.pathname]);

  const fetchItems = async () => {
    try {
      const res = await api.admin.getItems();
      setItems(Array.isArray(res.data) ? res.data : []);
      if (!res.data || res.data.length === 0) {
        console.log('No items data available');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setItems([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.admin.getOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
      if (!res.data || res.data.length === 0) {
        console.log('No orders data available');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await api.admin.getFeedback();
      setFeedback(Array.isArray(res.data) ? res.data : []);
      if (!res.data || res.data.length === 0) {
        console.log('No feedback data available');
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setFeedback([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.admin.getAnalytics();
      setAnalytics(res.data);
      if (!res.data) {
        console.log('No analytics data available');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const addItem = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('category', newItem.category);
      formData.append('price', newItem.price);
      formData.append('stock', newItem.stock);
      formData.append('description', newItem.description);
      if (newItem.image) {
        formData.append('image', newItem.image);
      }
      await api.admin.addItem(formData);
      fetchItems();
      setNewItem({ name: '', category: '', price: '', stock: '', description: '', image: null });
      setShowAddModal(false);
      showSnackbar('Menu item added successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to add menu item', 'error');
    }
  };

  const updateItem = async () => {
    try {
      if (editingItem.image && typeof editingItem.image === 'object') {
        // Handle image upload with FormData
        const formData = new FormData();
        formData.append('name', editingItem.name);
        formData.append('category', editingItem.category);
        formData.append('price', editingItem.price);
        formData.append('stock', editingItem.stock);
        formData.append('description', editingItem.description);
        formData.append('image', editingItem.image);
        await api.admin.updateItem(editingItem._id, formData);
      } else {
        // No image, send as JSON
        const { image, ...itemData } = editingItem;
        await api.admin.updateItem(editingItem._id, itemData);
      }
      fetchItems();
      setEditingItem(null);
      showSnackbar('Menu item updated successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to update menu item', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const oldOrder = orders.find(o => o._id === orderId);
    const oldStatus = oldOrder.status;

    // Update local state immediately for better UX
    setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));

    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      showSnackbar('Order status updated successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to update order status', 'error');
      // Revert local state on error
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: oldStatus } : order));
    }
  };

  const fetchUsage = async (period) => {
    try {
      const res = await api.admin.getUsage(period);
      setUsageData(res.data);
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  };

  const fetchWaste = async () => {
    try {
      const res = await api.admin.getWaste(`?period=${wastePeriod}`);
      setWasteData(res.data);
    } catch (err) {
      console.error('Error fetching waste:', err);
    }
  };

  const addWaste = async () => {
    try {
      await api.admin.recordWaste(newWaste);
      fetchWaste();
      setNewWaste({ foodItem: '', quantity: '', reason: '' });
      showSnackbar('Waste entry recorded successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to record waste entry', 'error');
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const item = items.find(i => i._id === itemId);
      const newStock = item.stock > 0 ? 0 : 1;
      await api.admin.updateItem(itemId, { ...item, stock: newStock });
      fetchItems();
      showSnackbar(newStock > 0 ? 'Item enabled for users' : 'Item disabled for users', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to update item availability', 'error');
    }
  };

  const increaseStock = async (itemId) => {
    try {
      const item = items.find(i => i._id === itemId);
      const newStock = item.stock + 1;
      await api.admin.updateItem(itemId, { ...item, stock: newStock });
      fetchItems();
      showSnackbar('Stock increased', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to increase stock', 'error');
    }
  };

  const decreaseStock = async (itemId) => {
    try {
      const item = items.find(i => i._id === itemId);
      if (item.stock > 0) {
        const newStock = item.stock - 1;
        await api.admin.updateItem(itemId, { ...item, stock: newStock });
        fetchItems();
        showSnackbar('Stock decreased', 'success');
      } else {
        showSnackbar('Stock cannot be negative', 'warning');
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to decrease stock', 'error');
    }
  };

  const fetchAnalyticsData = async (period) => {
    try {
      const res = await api.admin.getAnalytics(period);
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    }
  };

  const fetchReorders = async () => {
    try {
      const res = await api.admin.getReorders();
      setReorders(res.data);
    } catch (err) {
      console.error('Error fetching reorders:', err);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await api.admin.getLowStock();
      setLowStockItems(res.data);
    } catch (err) {
      console.error('Error fetching low stock:', err);
    }
  };


  const createReorder = async () => {
    try {
      await api.admin.createReorder({
        foodItem: selectedItem._id,
        quantity: reorderQuantity,
        notes: reorderNotes
      });
      await fetchReorders();
      await fetchLowStock();
      setShowReorderModal(false);
      setSelectedItem(null);
      setReorderQuantity('');
      setReorderNotes('');
      showSnackbar('Reorder request created successfully', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to create reorder request', 'error');
    }
  };

  // Reorder status update function - to be implemented

const updateReorderStatus = async (id, status) => {
  try {
    await api.admin.updateReorderStatus(id, status);
    await fetchReorders(); // refresh history
    showSnackbar('Reorder status updated', 'success');
  } catch (err) {
    console.error(err);
    showSnackbar('Failed to update reorder status', 'error');
  }
};


  const renderContent = () => {
    if (location.pathname === '/admin') {
      return (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-value">{analytics.totalOrders || 0}</div>
              <div className="analytics-label">Total Orders</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">${analytics.totalRevenue || 0}</div>
              <div className="analytics-label">Total Revenue</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{analytics.lowStockItems?.length || 0}</div>
              <div className="analytics-label">Low Stock Items</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{analytics.wasteData?.length || 0}</div>
              <div className="analytics-label">Waste Records</div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">📋 Recent Orders</h2>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Items</th>
                    <th>Total Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(orders) && orders.length > 0 ? orders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 10)
                    .map(order => (
                      <tr key={order._id}>
                        <td>{order.user?.name || 'Unknown User'}</td>
                        <td>{order.items?.map(item => `${item.foodItem?.name || 'Unknown'} × ${item.quantity}`).join(', ') || 'No items'}</td>
                        <td>{order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</td>
                        <td>${order.totalAmount}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="ORDERED">Ordered</option>
                            <option value="PACKED">Packed</option>
                            <option value="ON_THE_WAY">On the Way</option>
                            <option value="DELIVERED">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No orders available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">💬 Customer Feedback</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Item</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(feedback) && feedback.length > 0 ? feedback.slice(0, 10).map(fb => (
                    <tr key={fb._id}>
                      <td>{fb.user?.name || 'Unknown'}</td>
                      <td>{fb.foodItem?.name || 'Unknown'}</td>
                      <td>{'⭐'.repeat(fb.rating)}</td>
                      <td>{fb.comment || 'No comment'}</td>
                      <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No feedback available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    } else if (location.pathname === '/admin/menu') {
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={() => setShowAddModal(true)} className="submit-btn" style={{ backgroundColor: '#28a745' }}>➕ Add New Item</button>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">🍽️ Menu Management</h2>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td>
                        {item.image && (
                          <img
                            src={item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_URL || window.location.origin}/uploads/${item.image}`}
                            alt={item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>
                        <button
                          onClick={() => toggleAvailability(item._id)}
                          className={`submit-btn ${item.stock > 0 ? 'success' : 'error'}`}
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          {item.stock > 0 ? '✅ Available' : '❌ Disabled'}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => setEditingItem(item)} className="action-btn">✏️ Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showAddModal && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
                <h3>Add New Menu Item</h3>
                <div className="form-section">
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Initial Stock (1 = Available, 0 = Disabled)"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                      className="form-input"
                    />
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={addItem} className="submit-btn">➕ Add Item</button>
                    <button onClick={() => setShowAddModal(false)} className="submit-btn" style={{ backgroundColor: '#ccc' }}>❌ Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {editingItem && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
                <h3>Edit Menu Item</h3>
                <div className="form-section">
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={editingItem.category || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={editingItem.price || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={editingItem.stock || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.files[0] })}
                      className="form-input"
                    />
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={updateItem} className="submit-btn">💾 Update Item</button>
                    <button onClick={cancelEdit} className="submit-btn" style={{ backgroundColor: '#ccc' }}>❌ Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else if (location.pathname === '/admin/inventory') {
      return (
        <div className="dashboard-card">
          <h2 className="card-title">📦 Inventory Management</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No inventory items available</td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock}</td>
                      <td>
                        <span className={`stock-badge ${item.stock === 0 ? 'stock-out' : item.stock < 10 ? 'stock-low' : item.stock < 20 ? 'stock-medium' : 'stock-high'}`}>
                          {item.stock === 0 ? 'Out of Stock' : item.stock < 10 ? 'Low Stock' : item.stock < 20 ? 'Medium' : 'High'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => increaseStock(item._id)} className="action-btn" style={{ backgroundColor: '#28a745', color: 'white' }}>+</button>
                          <button onClick={() => decreaseStock(item._id)} className="action-btn" style={{ backgroundColor: '#dc3545', color: 'white' }}>-</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (location.pathname === '/admin/orders') {
      return (
        <div className="dashboard-card">
          <h2 className="card-title">📋 Orders Management</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.length > 0 ? orders.flatMap(order => order.items.map(item => ({ order, item }))).map(({ order, item }) => (
                  <tr key={`${order._id}-${item.foodItem?._id || item._id}`}>
                    <td>{order.user?.name || 'Unknown User'}</td>
                    <td>{item.foodItem?.name || 'Unknown'}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="ORDERED">Ordered</option>
                        <option value="PACKED">Packed</option>
                        <option value="ON_THE_WAY">On the Way</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No orders available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (location.pathname === '/admin/feedback') {
      return (
        <div className="dashboard-card">
          <h2 className="card-title">💬 Customer Feedback</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Item</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(feedback) && feedback.length > 0 ? feedback.map(fb => (
                  <tr key={fb._id}>
                    <td>{fb.user?.name || 'Unknown User'}</td>
                    <td>{fb.foodItem?.name || 'Unknown'}</td>
                    <td>{'⭐'.repeat(fb.rating)}</td>
                    <td>{fb.comment || 'No comment'}</td>
                    <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No feedback available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (location.pathname === '/admin/analytics') {
      return (
        <>
          <div className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="card-title">📊 Analytics Report</h2>
              <select value={analyticsPeriod} onChange={(e) => setAnalyticsPeriod(e.target.value)}>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
                <option value="today">Today</option>
              </select>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-value">{analyticsData?.totalOrders || 0}</div>
                <div className="analytics-label">Total Orders</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">${analyticsData?.totalRevenue || 0}</div>
                <div className="analytics-label">Total Revenue</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analyticsData?.totalWaste || 0}</div>
                <div className="analytics-label">Total Waste</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analyticsData?.lowStockItems?.length || 0}</div>
                <div className="analytics-label">Low Stock Items</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div className="dashboard-card">
                <h3 className="card-title">Top Selling Items</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(analyticsData?.topSellingItems) && analyticsData.topSellingItems.length > 0 ? analyticsData.topSellingItems.map(item => (
                        <tr key={item.itemName}>
                          <td>{item.itemName}</td>
                          <td>{item.category}</td>
                          <td>{item.quantityConsumed}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-card">
                <h3 className="card-title">Revenue by Category</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.revenueByCategory?.length > 0 ? analyticsData.revenueByCategory.map(cat => (
                        <tr key={cat._id}>
                          <td>{cat._id}</td>
                          <td>${cat.revenue.toFixed(2)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center' }}>No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (location.pathname === '/admin/reorder') {

      return (
        <>
          <div className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="card-title">🔄 Reorder Management</h2>
              <button onClick={() => setShowReorderModal(true)} className="submit-btn" style={{ backgroundColor: '#28a745' }}>➕ Create Reorder</button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.length > 0 ? lowStockItems.map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock}</td>
                      <td>
                        <span className={`stock-badge ${item.stock === 0 ? 'stock-out' : 'stock-low'}`}>
                          {item.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => { setSelectedItem(item); setShowReorderModal(true); }} className="action-btn">Reorder</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No items require reordering</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">📋 Reorder History</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Ordered Date</th>
                    <th>Received Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reorders.length > 0 ? reorders.map(reorder => (
                    <tr key={reorder._id}>
                      <td>{reorder.foodItem?.name || 'Unknown'}</td>
                      <td>{reorder.quantity}</td>
                      <td>
                        <span className={`status-badge ${reorder.status.toLowerCase()}`}>
                          {reorder.status}
                        </span>
                      </td>
                      <td>{new Date(reorder.orderedAt).toLocaleDateString()}</td>
                      <td>{reorder.receivedAt ? new Date(reorder.receivedAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No reorder history available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showReorderModal && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                <h3>Create Reorder Request</h3>
                <div className="form-section">
                  <div className="form-grid">
                    <select
                      value={selectedItem?._id || ''}
                      onChange={(e) => setSelectedItem(items.find(item => item._id === e.target.value))}
                      className="form-input"
                    >
                      <option value="">Select Item</option>
                      {items.map(item => (
                        <option key={item._id} value={item._id}>{item.name} (Stock: {item.stock})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Reorder Quantity"
                      value={reorderQuantity}
                      onChange={(e) => setReorderQuantity(e.target.value)}
                      className="form-input"
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      value={reorderNotes}
                      onChange={(e) => setReorderNotes(e.target.value)}
                      className="form-input"
                      rows="3"
                    />
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={createReorder} className="submit-btn">Create Reorder</button>
                    <button onClick={() => { setShowReorderModal(false); setSelectedItem(null); setReorderQuantity(''); setReorderNotes(''); }} className="submit-btn" style={{ backgroundColor: '#ccc' }}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else if (location.pathname === '/admin/waste') {
      return (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-value">{usageData.totalItemsSold || 0}</div>
              <div className="analytics-label">Total Items Sold ({usageData.period})</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{usageData.mostConsumedItem || 'None'}</div>
              <div className="analytics-label">Most Consumed Item</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{wasteData.totalWasteToday || 0}</div>
              <div className="analytics-label">Waste Today</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{wasteData.mostWastedItem || 'None'}</div>
              <div className="analytics-label">Most Wasted Item</div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">📊 Usage Analytics</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ marginRight: '8px' }}>Period:</label>
              <select value={usagePeriod} onChange={(e) => setUsagePeriod(e.target.value)}>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Quantity Consumed</th>
                  </tr>
                </thead>
                <tbody>
                  {usageData.usageData?.length > 0 ? usageData.usageData.map(item => (
                    <tr key={item.itemName}>
                      <td>{item.itemName}</td>
                      <td>{item.category}</td>
                      <td>{item.quantityConsumed}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No usage data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">🗑️ Waste Management</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ marginRight: '8px' }}>Period:</label>
              <select value={wastePeriod} onChange={(e) => setWastePeriod(e.target.value)}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="form-section">
              <div className="form-grid">
                <select
                  value={newWaste.foodItem}
                  onChange={(e) => setNewWaste({ ...newWaste, foodItem: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Item</option>
                  {items.map(item => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity Wasted"
                  value={newWaste.quantity}
                  onChange={(e) => setNewWaste({ ...newWaste, quantity: e.target.value })}
                  className="form-input"
                />
                <select
                  value={newWaste.reason}
                  onChange={(e) => setNewWaste({ ...newWaste, reason: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Reason</option>
                  <option value="expired">Expired</option>
                  <option value="leftover">Leftover</option>
                  <option value="damaged">Damaged</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button onClick={addWaste} className="submit-btn" style={{ marginTop: '16px' }}>➕ Record Waste</button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteData.wasteData?.length > 0 ? wasteData.wasteData.map(waste => (
                    <tr key={waste._id}>
                      <td>{waste.foodItem?.name || 'Unknown'}</td>
                      <td>{waste.quantity}</td>
                      <td>{waste.reason}</td>
                      <td>{new Date(waste.date).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No waste records available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    } else {
      return <div className="dashboard-card"><h2 className="card-title">Page under development</h2></div>;
    }
  };

  return (
    <div className="dashboard-container">
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
