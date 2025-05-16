import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PaymentIcon from '@mui/icons-material/Payment';

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1 }} />
            Payment Gateway
          </Box>
        </Typography>
        
        <Button 
          color="inherit" 
          component={Link} 
          to="/"
          sx={{ mx: 1 }}
        >
          Make Payment
        </Button>
        
        <Button 
          color="inherit" 
          component={Link} 
          to="/dashboard"
          sx={{ mx: 1 }}
        >
          Dashboard
        </Button>
        
        <IconButton 
          color="inherit" 
          onClick={toggleDarkMode}
          sx={{ ml: 1 }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;