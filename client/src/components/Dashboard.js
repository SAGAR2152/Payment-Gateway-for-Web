import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    averageAmount: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch('/api/payment-history');
        const data = await response.json();
        setPayments(data);
        
        // Calculate statistics
        if (data.length > 0) {
          const total = data.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
          setStats({
            totalAmount: total.toFixed(2),
            averageAmount: (total / data.length).toFixed(2),
            totalTransactions: data.length
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setLoading(false);
      }
    };
    
    fetchPaymentHistory();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {stats.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h4">
                ${stats.totalAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Payment
              </Typography>
              <Typography variant="h4">
                ${stats.averageAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Chart */}
      {payments.length > 0 && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Payment Distribution
          </Typography>
          <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: payments.length, label: 'Transactions' }
                  ],
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 180,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={400}
              height={300}
            />
          </Box>
        </Paper>
      )}
      
      {/* Payment History Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payment History
        </Typography>
        
        {payments.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            No payment history available yet. Make your first payment!
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id.slice(-6)}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell align="right">${payment.amount}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: 
                            payment.status === 'completed' ? 'success.main' : 
                            payment.status === 'pending' ? 'warning.main' : 'error.main',
                          color: 'white',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          display: 'inline-block',
                          textTransform: 'capitalize'
                        }}
                      >
                        {payment.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default Dashboard;