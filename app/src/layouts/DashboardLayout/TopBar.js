import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import Logo from 'src/components/Logo';
import authenticationService from 'src/requests/authentication';

const TopBar = ({
  onMobileNavOpen,
  ...rest
}) => {
  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <Logo />
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton color="inherit" onClick={() => authenticationService.logout()}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
