const express = require('express');
const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', async (req, res) => {
  try {
    const event = req.body;

    // Log the webhook event
    console.log('Stripe webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// PayPal webhook endpoint
router.post('/paypal', async (req, res) => {
  try {
    const event = req.body;

    console.log('PayPal webhook received:', event.event_type);

    // Handle PayPal events
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('PayPal payment completed');
        // Handle successful PayPal payment
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('PayPal payment denied');
        // Handle denied PayPal payment
        break;
      default:
        console.log('Unhandled PayPal event:', event.event_type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('PayPal webhook error:', err);
    res.status(400).json({ error: 'Webhook error' });
  }
});

module.exports = router;
