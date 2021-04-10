import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@material-ui/core';

const Logo = () => {
  return (
    <Box>
      <RouterLink to="/app/dashboard">
        <img style={{ height: '40px' }} src="/static/logo.png" alt="Logo" />
      </RouterLink>
    </Box>
  );
};

export default Logo;
