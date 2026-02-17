import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import '../styles/global.css';

const FeedbackPage = () => {
  const { orderId, itemId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [item, setItem] = useState(null);
  const [menu, setMenu] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchOrderDetails = useCallback(async () => {
    try {
      const res = await api.user.getOrders();
      const order = res.data.find(o => o._id === orderId);
      if (order) {
        const orderItem = order.items.find(i => i.foodItem._id === itemId);
        if (orderItem) {
          setItem(orderItem.foodItem);
        }
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId, itemId]);

  useEffect(() => {
    if (orderId && itemId) {
      fetchOrderDetails();
    } else {
      fetchMenu();
      setLoading(false);
    }
  }, [orderId, itemId, fetchOrderDetails]);

  const fetchMenu = async () => {
    try {
      const res = await api.user.getMenu();
      setMenu(res.data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foodItemId = item ? item._id : selectedItemId;
    if (!foodItemId) return;

    setSubmitting(true);
    try {
      await api.user.submitFeedback({
        foodItem: foodItemId,
        rating: parseInt(rating),
        comment
      });
      alert('Thank you for your feedback!');
      navigate('/user/home');
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <>
        <div className="container">
          <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Leave Feedback</h1>

            <div className="form-group">
              <label>Select an item to feedback on</label>
              <select
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  const selectedItem = menu.find(item => item._id === e.target.value);
                  setItem(selectedItem);
                }}
                className="input"
              >
                <option value="">Choose an item...</option>
                {menu.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.name} - ${item.price}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/user/home')}
                style={{ backgroundColor: '#ccc' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Leave Feedback</h1>

        <div className="feedback-item">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center'}
            alt={item.name}
            className="feedback-item-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center';
            }}
          />
          <div className="feedback-item-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="price"><strong>${item.price}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5 stars)</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input"
              rows="4"
              placeholder="Tell us about your experience with this item..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <button
              type="submit"
              className="btn"
              disabled={submitting}
              style={{ flex: 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/user/orders')}
              style={{ backgroundColor: '#ccc' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
