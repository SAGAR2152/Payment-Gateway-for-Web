import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Container, Card, Typography, TextField, Box, Alert } from '@mui/material';

function PaymentForm({ darkMode }) {
  const [amount, setAmount] = useState(10);
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handlePaymentSuccess = async (details) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Payment successful! Confirmation email sent.');
        setErrorMessage('');
      } else {
        setErrorMessage('Payment succeeded but email failed to send.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Payment succeeded but there was an error with the confirmation.');
      setSuccessMessage('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card className="payment-card">
        <Typography variant="h4" sx={{ mb: 3 }}>Make a Payment</Typography>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
      
        <TextField
          label="Email"
          type="email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <TextField
          label="Amount (USD)"
          type="number"
          fullWidth
          sx={{ mb: 3 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Box sx={{ mt: 2 }}>
          <PayPalScriptProvider
            options={{
              "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
              currency: "USD"
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: amount
                    }
                  }]
                });
              }}
              onApprove={(data, actions) => actions.order.capture()
                .then(details => handlePaymentSuccess(details))}
            />
          </PayPalScriptProvider>
        </Box>
      </Card>
    </Container>
  );
}

export default PaymentForm;
