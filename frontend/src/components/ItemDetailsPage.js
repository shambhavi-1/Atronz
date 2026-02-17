import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import StarRating from './StarRating';
import '../styles/global.css';

const FeedbackForm = ({ itemId, showSnackbar }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    setLoading(true);
    try {
      await api.user.submitFeedback({ foodItem: itemId, rating, comment });
      setRating(5);
      setComment('');
      showSnackbar('Feedback submitted successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h3>Submit Feedback</h3>
      <form onSubmit={(e) => { e.preventDefault(); submitFeedback(); }}>
        <div className="form-group">
          <label>Rating:</label>
          <StarRating rating={rating} interactive onRatingChange={setRating} />
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
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit Feedback'}</button>
      </form>
    </div>
  );
};

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchItem();
  }, [id, showSnackbar]);

  const fetchItem = async () => {
    try {
      const res = await api.user.getItemById(id);
      setItem(res.data);
    } catch (err) {
      // Fallback: fetch menu and find item by _id
      try {
        const menuRes = await api.user.getMenu();
        const foundItem = menuRes.data.find(item => item._id === id);
        if (foundItem) {
          setItem(foundItem);
        } else {
          showSnackbar('Item not found.', 'error');
        }
      } catch (menuErr) {
        showSnackbar('Item not found.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (!item || !item.name) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Item not found.</p>
        <button onClick={() => navigate('/user/home')} className="btn">Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/user/home')} className="btn" style={{ marginBottom: '20px' }}>Back to Menu</button>
      <div className="card">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/icons/food-placeholder.png';
            }}
          />
          <div style={{ flex: 1 }}>
            <h1>{item.name}</h1>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Stock:</strong> {item.stock}</p>
            <div><strong>Rating:</strong> <StarRating rating={item.rating} /></div>
            <p><strong>Description:</strong> {item.description}</p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
              <button onClick={() => user ? addToCart(item) : navigate('/login')} className="btn">Add to Cart</button>
              <button onClick={() => {
                if (!user) {
                  navigate('/login', { state: { from: '/user/cart' } });
                } else {
                  navigate('/user/cart');
                }
              }} className="btn btn-secondary">Go to Cart</button>
            </div>
          </div>
        </div>
      </div>
      {user && <FeedbackForm itemId={item._id} showSnackbar={showSnackbar} />}
    </div>
  );
};

export default ItemDetailsPage;
