
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        padding: 2,
        position: 'relative',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="#" color="inherit" underline="hover">Privacy Policy</Link> | 
        <Link href="#" color="inherit" underline="hover"> Terms of Service</Link>
      </Typography>
    </Box>
  );
};

export default Footer;
