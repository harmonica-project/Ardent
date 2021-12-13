/* eslint-disable */
import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import authenticationService from './requests/authentication';
import { useProject } from './project-context';

const App = () => {
  const [authInfo, setAuthInfo] = useState({});
  const {
    state: { project },
  } = useProject();

  useEffect(() => {
    authenticationService.currentUser.subscribe((newAuthInfo) => setAuthInfo(newAuthInfo));
  }, []);

  let user;
  if (authInfo) {
    user = authInfo;
  } else {
    user = authenticationService.currentUserValue;
  }

  const routing = useRoutes(routes(user, project.url));

  return (
    <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SnackbarProvider>
          {routing}
        </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
