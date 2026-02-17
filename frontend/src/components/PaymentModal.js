import React, { useState } from 'react';
import '../styles/payment-modal.css';

const PaymentModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failure for testing (remove in production)
          if (Math.random() > 0.8) {
            reject(new Error('Payment failed'));
          } else {
            resolve();
          }
        }, 2000);
      });
      setProcessing(false);
      onConfirm(selectedMethod);
    } catch (error) {
      setProcessing(false);
      alert('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="amazon-modal-overlay" onClick={onClose}>
      <div className="amazon-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="amazon-modal-header">
          <button className="amazon-modal-close" onClick={onClose}>×</button>
          <h2>Select a payment method</h2>
        </div>

        <div className="amazon-modal-body">
          <div className="amazon-order-summary">
            <h3>Order Summary</h3>
            <div className="amazon-summary-row">
              <span>Items:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="amazon-summary-row">
              <span>Shipping & handling:</span>
              <span>$0.00</span>
            </div>
            <div className="amazon-summary-row amazon-total">
              <span>Order total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="amazon-payment-methods">
            <h3>Payment method</h3>

            {/* Credit/Debit Card */}
            <div className={`amazon-payment-option ${selectedMethod === 'card' ? 'selected' : ''}`} onClick={() => setSelectedMethod('card')}>
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                checked={selectedMethod === 'card'}
                onChange={() => setSelectedMethod('card')}
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

            {selectedMethod === 'card' && (
              <div className="amazon-card-form">
                <div className="amazon-form-group">
                  <label>Card number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="amazon-input"
                  />
                </div>
                <div className="amazon-form-row">
                  <div className="amazon-form-group">
                    <label>Name on card</label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
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
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      className="amazon-input"
                    />
                  </div>
                  <div className="amazon-form-group">
                    <label>Security code</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
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
            <div className={`amazon-payment-option ${selectedMethod === 'upi' ? 'selected' : ''}`} onClick={() => setSelectedMethod('upi')}>
              <input
                type="radio"
                id="upi"
                name="payment"
                value="upi"
                checked={selectedMethod === 'upi'}
                onChange={() => setSelectedMethod('upi')}
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

            {selectedMethod === 'upi' && (
              <div className="amazon-upi-form">
                <div className="amazon-form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="user@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="amazon-input"
                  />
                </div>
              </div>
            )}

            {/* Cash on Delivery */}
            <div className={`amazon-payment-option ${selectedMethod === 'cod' ? 'selected' : ''}`} onClick={() => setSelectedMethod('cod')}>
              <input
                type="radio"
                id="cod"
                name="payment"
                value="cod"
                checked={selectedMethod === 'cod'}
                onChange={() => setSelectedMethod('cod')}
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

            {selectedMethod === 'cod' && (
              <div className="amazon-cod-info">
                <p>You'll pay ${totalAmount.toFixed(2)} in cash when your order is delivered.</p>
              </div>
            )}
          </div>
        </div>

        <div className="amazon-modal-footer">
          <div className="amazon-footer-content">
            <div className="amazon-order-total">
              <span>Order total: </span>
              <strong>${totalAmount.toFixed(2)}</strong>
            </div>
            <div className="amazon-footer-buttons">
              <button className="amazon-btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="amazon-btn-primary"
                onClick={handleConfirm}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Place your order`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
