import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: 'none',
    }}>
      <Toolbar>
        <Typography variant="h6" style={{
            flexGrow: 1,
            fontWeight: 'bolder',
        }}>
          SafetyNet.
        </Typography>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
        }}>
          <Link to="/" style={{
                textDecoration: 'none',
                color: '#000000',
                padding: '10px',
            }} >
            <Button color="inherit">Home</Button>
          </Link>
          <Button color="inherit">About Us</Button>
          <Link to="/login" style={{
                textDecoration: 'none',
                color: '#000000',
                padding: '10px',
          }}>
          <Button color="inherit">Login</Button>
          </Link>
          <Button color="inherit">Services</Button>
          <Button color="inherit" style={{
                backgroundColor: '#0530AD',
                color: '#ffffff',
                padding: '10px',
                borderRadius: '30px',
          }}>Watch Demo</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
