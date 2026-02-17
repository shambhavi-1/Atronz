import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/cart.css';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getTotalAmount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  const subtotal = getTotalAmount();
  const tax = subtotal * 0.08;
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="amazon-cart-container">
      <div className="amazon-breadcrumb">
        <span>Home</span> › <span>Cart</span>
      </div>

      <div className="amazon-delivery-info">
        <span className="amazon-delivery-icon">🚚</span>
        <span>Free delivery on orders over $25. Estimated delivery: 2 hours</span>
      </div>

      <div className="amazon-cart-header">
        <h1>Shopping Cart</h1>
        <a href="#" className="amazon-continue-shopping" onClick={() => navigate('/user/home')}>
          Continue shopping
        </a>
      </div>

      {cart.length === 0 ? (
        <div className="amazon-cart-empty">
          <h2>Your Cafelytic Cart is empty</h2>
          <p>Shop today's deals</p>
          <button className="amazon-btn-primary" onClick={() => navigate('/user/home')}>
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="amazon-cart-content">
          <div className="amazon-cart-items">
            {cart.map(item => (
              <div key={item._id} className="amazon-cart-item">
                <div className="amazon-item-image">
                  <img src={item.image || '/icons/food-placeholder.png'} alt={item.name} />
                </div>
                <div className="amazon-item-details">
                  <h3 className="amazon-item-title">{item.name}</h3>
                  <p className="amazon-item-description">{item.description}</p>
                  <p className="amazon-item-stock">In Stock</p>
                  <p className="amazon-item-delivery">FREE delivery </p>
                  <div className="amazon-item-quantity">
                    <span className="amazon-quantity-label">Qty:</span>
                    <div className="amazon-quantity-controls">
                      <button
                        className="amazon-quantity-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="amazon-quantity-value">{item.quantity}</span>
                      <button
                        className="amazon-quantity-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="amazon-delete-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="amazon-item-price">
                  <p className="amazon-price">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="amazon-item-total">(${item.price.toFixed(2)} each)</p>
                </div>
              </div>
            ))}
          </div>

          <div className="amazon-cart-summary">
            <div className="amazon-summary-box">
              <div className="amazon-summary-row amazon-total">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className="amazon-proceed-btn" onClick={handleCheckout}>
                Proceed to checkout
              </button>
              <div className="amazon-gift-option">
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
