import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';

const Logo = () => {
  const location = useLocation();
  return (
    <Box display={location.pathname === '/login' ? 'none' : ''}>
      <RouterLink to="/app/dashboard">
        <img style={{ height: '40px' }} src="/static/logo.png" alt="Logo" />
      </RouterLink>
    </Box>
  );
};

export default Logo;
