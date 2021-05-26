import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import LoadingOverlay from 'src/components/LoadingOverlay';
import authenticationService from 'src/requests/authentication';
import { setUser as setUserRequest, setNewPassword as setNewPasswordRequest } from 'src/requests/users';
import Password from './Password';
import Admin from './Admin';
import UserInfo from './UserInfo';
import Study from './Study';

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
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState({
    password: '',
    confirm: ''
  });

  const actionUserHandler = async () => {
    setOpen(true);
    try {
      const res = await setUserRequest(user);
      if (res) {
        enqueueSnackbar('Your profile has successfully been updated!', { variant: 'success' });
        authenticationService.updateUser(user);
      } else {
        enqueueSnackbar('Request failed.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: 'error' });
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
          enqueueSnackbar('Your password has successfully been updated!', { variant: 'success' });
        } else {
          enqueueSnackbar('Request failed.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Password do not match.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: 'error' });
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
        <Box mb={3}>
          <Study />
        </Box>
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
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default SettingsView;
