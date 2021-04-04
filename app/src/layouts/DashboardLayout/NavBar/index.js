import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Collapse
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Paperclip as PaperclipIcon,
  Cpu as CpuIcon,
  LogOut as LogOutIcon
} from 'react-feather';
import {
  AccountTree as AccountTreeIcon,
  FormatListBulleted as FormatListBulletedIcon
} from '@material-ui/icons/';
import { getUser as getUserRequest } from 'src/requests/user';
import NavItem from './NavItem';
import authenticationService from '../../../requests/authentication';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    first_name: 'Unknown',
    last_name: 'Unknown',
    role: 'Unknown',
    is_admin: false,
    username: 'unknown'
  });

  const handleOpen = () => {
    setOpen(!open);
  };

  const items = [
    {
      href: '/app/dashboard',
      icon: BarChartIcon,
      title: 'Dashboard'
    },
    {
      href: '/app/papers',
      icon: PaperclipIcon,
      title: 'Study papers'
    },
    {
      href: '/app/analytics',
      action: handleOpen,
      openState: open,
      icon: CpuIcon,
      title: 'Analytics',
      subitems: [
        {
          href: '/app/analytics',
          icon: AccountTreeIcon,
          title: 'Patterns identification'
        },
        {
          href: '/app/components',
          icon: FormatListBulletedIcon,
          title: 'Components summary'
        }
      ]
    },
    {
      href: '/app/settings',
      icon: SettingsIcon,
      title: 'Settings'
    }
  ];

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      let newUser = {};
      const authInfo = authenticationService.currentUserValue;
      if (authInfo && authInfo.username) {
        newUser = await getUserRequest(authInfo.username);
        setUser(newUser.result);
      }
    };
    fetchUserData();
  }, []);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Box mb={1}>
          <Avatar
            className={classes.avatar}
            component={RouterLink}
            src={user.avatar}
            to="/app/account"
          />
        </Box>
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {`${user.first_name} ${user.last_name}`}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.role}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => {
            if (item.subitems) {
              return (
                <div>
                  <NavItem
                    onClick={item.action}
                    href={item.href}
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                    disableLink
                  />
                  <Collapse in={item.openState} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subitems.map((subitem) => (
                        <NavItem
                          href={subitem.href}
                          key={subitem.title}
                          title={subitem.title}
                          icon={subitem.icon}
                          subitem
                        />
                      ))}
                    </List>
                  </Collapse>
                </div>
              );
            }
            return (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            );
          })}
          <NavItem
            href="/login"
            key="Logout"
            title="Logout"
            icon={LogOutIcon}
            onClick={authenticationService.logout}
          />
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
