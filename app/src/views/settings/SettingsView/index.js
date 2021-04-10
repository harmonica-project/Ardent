import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import LoadingOverlay from 'src/components/LoadingOverlay';
import authenticationService from 'src/requests/authentication';
import { setUser as setUserRequest, setNewPassword as setNewPasswordRequest } from 'src/requests/user';
import Password from './Password';
import Admin from './Admin';
import UserInfo from './UserInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SettingsView = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState({
    password: '',
    confirm: ''
  });

  const [messageSnackbarProps, setMessageSnackbarProps] = useState({
    open: false,
    message: '',
    duration: 0,
    severity: 'information'
  });

  const displayMsg = (message, severity = 'success', duration = 6000) => {
    setMessageSnackbarProps({
      open: true,
      severity,
      duration,
      message
    });
  };

  const actionUserHandler = async () => {
    setOpen(true);
    try {
      const res = await setUserRequest(user);
      if (res) {
        displayMsg('Your profile has successfully been updated!');
        authenticationService.updateUser(user);
      } else {
        handleErrorRequest('Request failed.', displayMsg);
      }
    } catch (error) {
      handleErrorRequest(`Error: ${error}`, displayMsg);
    } finally {
      setOpen(false);
    }
  };

  const actionPasswordHandler = async () => {
    setOpen(true);
    try {
      if (password.password === password.confirm) {
        const res = await setNewPasswordRequest({
          username: user.username,
          password: password.password
        });
        if (res) {
          displayMsg('Your password has successfully been updated!');
        } else {
          handleErrorRequest('Request failed.', displayMsg);
        }
      } else {
        displayMsg('Password do not match.', 'error');
      }
    } catch (error) {
      handleErrorRequest(`Error: ${error}`, displayMsg);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    const authInfo = authenticationService.currentUserValue;
    if (authInfo && authInfo.user) {
      setUser({
        ...authInfo.user,
        loaded: true
      });
    }
  }, []);

  return (
    <Page
      className={classes.root}
      title="Settings"
    >
      <Container maxWidth="lg">
        {user.loaded ? (
          <UserInfo
            user={user}
            setUser={setUser}
            actionUserHandler={actionUserHandler}
          />
        ) : <div>Error</div>}
        <Box mt={3}>
          <Password
            password={password}
            setPassword={setPassword}
            actionPasswordHandler={actionPasswordHandler}
          />
        </Box>
        {user.is_admin ? (
          <Box mt={3}>
            <Admin />
          </Box>
        )
          : <div />}
      </Container>
      <MessageSnackbar
        messageSnackbarProps={messageSnackbarProps}
        setMessageSnackbarProps={setMessageSnackbarProps}
      />
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default SettingsView;
