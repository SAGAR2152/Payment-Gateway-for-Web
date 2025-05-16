const express = require('express');
const cors = require('cors');
const paypal = require('@paypal/checkout-server-sdk');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PayPal Configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// In-memory payment history storage (in production, use a database)
const paymentHistory = [];

// Create Payment Order
app.post('/api/create-payment', async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: req.body.amount
        }
      }]
    });
    
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send Email Confirmation
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, amount } = req.body;
    
    // Store payment in history
    const payment = {
      id: Date.now().toString(),
      email,
      amount,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    paymentHistory.push(payment);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Payment Confirmation',
      html: `<h2>Payment of $${amount} received</h2>
             <p>Thank you for your payment!</p>`
    });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get payment history
app.get('/api/payment-history', (req, res) => {
  res.json(paymentHistory);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));