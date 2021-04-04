import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import Password from './Password';
import UserInfo from './UserInfo';
import authenticationService from '../../../requests/authentication';
import { getUser as getUserRequest, setUser as setUserRequest } from '../../../requests/user';

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
    try {
      const res = await setUserRequest(user);
      if (res) {
        displayMsg('Your profile has successfully been updated!');
      } else {
        handleErrorRequest('Request failed.', displayMsg);
      }
    } catch (error) {
      handleErrorRequest(`Error: ${error}`, displayMsg);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      let newUser = {};
      const authInfo = authenticationService.currentUserValue;
      if (authInfo && authInfo.username) {
        newUser = await getUserRequest(authInfo.username);
        setUser({
          ...newUser.result,
          loaded: true
        });
      }
    };
    fetchUserData();
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
          <Password user={user} setUser={setUser} actionUserHandler={actionUserHandler} />
        </Box>
      </Container>
      <MessageSnackbar
        messageSnackbarProps={messageSnackbarProps}
        setMessageSnackbarProps={setMessageSnackbarProps}
      />
    </Page>
  );
};

export default SettingsView;
