import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import authenticationService from './requests/authentication';

const App = () => {
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    authenticationService.currentUser.subscribe((newAuthInfo) => setAuthInfo(newAuthInfo));
  }, []);

  let username;
  if (authInfo && authInfo.user) {
    username = authInfo.user.username;
  }
  const routing = useRoutes(routes(username));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
