import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';
import { useSnackbar } from '../context/SnackbarContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/global.css';
import '../styles/checkout.css';

const Stepper = ({ currentStep }) => {
  const steps = [
    { label: 'Bag', icon: '👜' },
    { label: 'Address', icon: '📍' },
    { label: 'Payment', icon: '💳' },
    { label: 'Confirmation', icon: '✅' },
  ];

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div key={index} className={`step ${index < currentStep ? 'completed' : index === currentStep ? 'active' : ''}`}>
          <div className="step-icon">{step.icon}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

const CheckoutPage = () => {
  const { cart, clearCart, getTotalAmount, updateQuantity, removeFromCart } = useCart();
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.user.getAddresses();
        setAddresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // eslint-disable-next-line no-undef
    if (!user) {
      navigate('/login');
      return;
    }

    if (!address.street?.trim() || !address.city?.trim() || !address.state?.trim() || !address.zip?.trim()) {
      showSnackbar('Please provide complete address information.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.user.placeOrder({
        items: cart.map(item => ({ foodItem: item._id, quantity: item.quantity, price: item.price })),
        address,
        paymentMethod
      });
      setOrderDetails(response.data);
      clearCart();
      setOrderPlaced(true);
      showSnackbar('Order placed successfully!', 'success');
      setCurrentStep(3); // Move to confirmation step after successful order
    } catch (err) {
      showSnackbar('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return address.street?.trim() && address.city?.trim() && address.state?.trim() && address.zip?.trim();
    }
    return true;
  };



  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checking out.</p>
        <button className="btn" onClick={() => navigate('/user/home')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="checkout-layout">
            <div className="checkout-main">
              <div className="card">
                <h2>Order Summary</h2>
                <div className="order-items">
                  {cart.map(item => (
                    <div key={item._id} className="order-item">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center'}
                        alt={item.name}
                        className="order-item-image"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&crop=center';
                        }}
                      />
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                        <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <h3>Total: ${getTotalAmount().toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="checkout-sidebar">
              <div className="card">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="summary-item total">
                  <span><strong>Total:</strong></span>
                  <span><strong>${getTotalAmount().toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="checkout-layout">
            <div className="checkout-main">
              <div className="card">
                <h2>Delivery Address</h2>
                {addresses.length > 0 && (
                  <div>
                    <h3>Select an existing address</h3>
                    {addresses.map((addr, index) => (
                      <div key={index} className="address-option">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === index}
                          onChange={() => {
                            setSelectedAddress(index);
                            setAddress(addr);
                          }}
                        />
                        <label>
                          {addr.street}, {addr.city}, {addr.state} {addr.zip} - {addr.phone}
                        </label>
                      </div>
                    ))}
                    <hr />
                  </div>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                >
                  {showAddAddress ? 'Cancel' : '+ Add New Address'}
                </button>
                {showAddAddress && (
                  <form style={{ marginTop: '20px' }}>
                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        className="input"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        className="input"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>State</label>
                        <input
                          type="text"
                          className="input"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>ZIP Code</label>
                        <input
                          type="text"
                          className="input"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        className="input"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn"
                      onClick={async () => {
                        try {
                          await api.user.addAddress(address);
                          setAddresses([...addresses, address]);
                          setAddress(address);
                          setShowAddAddress(false);
                          showSnackbar('Address added successfully!', 'success');
                        } catch (err) {
                          showSnackbar('Failed to add address.', 'error');
                        }
                      }}
                    >
                      Save Address
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className="checkout-sidebar">
              <div className="card">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="summary-item total">
                  <span><strong>Total:</strong></span>
                  <span><strong>${getTotalAmount().toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-layout">
            <div className="checkout-main">
              <div className="card">
                <h2>Select a payment method</h2>
                <div className="amazon-order-summary" style={{ marginBottom: '20px' }}>
                  <h3>Order Summary</h3>
                  <div className="amazon-summary-row">
                    <span>Items:</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className="amazon-summary-row">
                    <span>Shipping & handling:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="amazon-summary-row amazon-total">
                    <span>Order total:</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>

                <div className="amazon-payment-methods">
                  <h3>Payment method</h3>

                  {/* Credit/Debit Card */}
                  <div className={`amazon-payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <label htmlFor="card" className="amazon-payment-label">
                      <div className="amazon-payment-info">
                        <div className="amazon-payment-title">
                          <span className="amazon-payment-icon">💳</span>
                          Credit or debit card
                        </div>
                        <div className="amazon-payment-subtitle">Visa, Mastercard, American Express</div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="amazon-card-form">
                      <div className="amazon-form-group">
                        <label>Card number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="amazon-input"
                        />
                      </div>
                      <div className="amazon-form-row">
                        <div className="amazon-form-group">
                          <label>Name on card</label>
                          <input
                            type="text"
                            placeholder="John Smith"
                            className="amazon-input"
                          />
                        </div>
                      </div>
                      <div className="amazon-form-row">
                        <div className="amazon-form-group">
                          <label>Expiration date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="amazon-input"
                          />
                        </div>
                        <div className="amazon-form-group">
                          <label>Security code</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="amazon-input"
                          />
                        </div>
                      </div>
                      <div className="amazon-security-note">
                        <span className="amazon-lock-icon">🔒</span>
                        Your card information is encrypted and secure.
                      </div>
                    </div>
                  )}

                  {/* UPI */}
                  <div className={`amazon-payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                    <input
                      type="radio"
                      id="upi"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <label htmlFor="upi" className="amazon-payment-label">
                      <div className="amazon-payment-info">
                        <div className="amazon-payment-title">
                          <span className="amazon-payment-icon">📱</span>
                          UPI
                        </div>
                        <div className="amazon-payment-subtitle">Pay with UPI apps</div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="amazon-upi-form">
                      <div className="amazon-form-group">
                        <label>UPI ID</label>
                        <input
                          type="text"
                          placeholder="user@upi"
                          className="amazon-input"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery */}
                  <div className={`amazon-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <label htmlFor="cod" className="amazon-payment-label">
                      <div className="amazon-payment-info">
                        <div className="amazon-payment-title">
                          <span className="amazon-payment-icon">🚚</span>
                          Cash on Delivery
                        </div>
                        <div className="amazon-payment-subtitle">Pay when you receive your order</div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="amazon-cod-info">
                      <p>You'll pay ${getTotalAmount().toFixed(2)} in cash when your order is delivered.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="checkout-sidebar">
              <div className="card">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="summary-item total">
                  <span><strong>Total:</strong></span>
                  <span><strong>${getTotalAmount().toFixed(2)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-layout">
            <div className="checkout-main">
              <div className="card">
                <div className="confirmation-success">
                  <div className="success-icon">✅</div>
                  <h2>Order Confirmed!</h2>
                  <p>Your order has been successfully placed.</p>
                </div>
                <div className="confirmation-section">
                  <h3>Order Details</h3>
                  <div className="confirmation-item">
                    <span>Order ID:</span>
                    <span>#{orderDetails?._id?.slice(-8)}</span>
                  </div>
                  <div className="confirmation-item">
                    <span>Items:</span>
                    <span>{orderDetails?.items?.length || 0} items</span>
                  </div>
                  <div className="confirmation-item">
                    <span>Total:</span>
                    <span>${orderDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="confirmation-item">
                    <span>Payment Method:</span>
                    <span>{paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="confirmation-item">
                    <span>Delivery Address:</span>
                    <span>{address.street}, {address.city}, {address.state} {address.zip}</span>
                  </div>
                </div>
                <div className="confirmation-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/user/orders')}
                    style={{ width: '100%', marginBottom: '10px' }}
                  >
                    View Order
                  </button>
                  <button
                    className="btn"
                    onClick={() => navigate('/user/home')}
                    style={{ width: '100%' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
            <div className="checkout-sidebar">
              <div className="card">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>${orderDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="summary-item total">
                  <span><strong>Total:</strong></span>
                  <span><strong>${orderDetails?.totalAmount?.toFixed(2) || '0.00'}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Checkout</h1>
      <Stepper currentStep={currentStep} />
      {renderStepContent()}
      <div className="step-navigation" style={{ marginTop: '20px', textAlign: 'center' }}>
        {currentStep > 0 && currentStep < 3 && (
          <button className="btn btn-secondary" onClick={prevStep} style={{ marginRight: '10px' }}>
            Previous
          </button>
        )}
        {currentStep < 2 && (
          <button className="btn" onClick={nextStep} disabled={!canProceed()}>
            Next
          </button>
        )}
        {currentStep === 2 && (
          <button className="btn" onClick={handlePlaceOrder} disabled={loading || !address.street || !address.city || !address.state || !address.zip}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        )}
      </div>

    </div>
  );
};

export default CheckoutPage;
