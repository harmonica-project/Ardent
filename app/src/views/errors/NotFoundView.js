import React from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const NotFoundView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="404"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography
            align="center"
            color="textPrimary"
            variant="h1"
          >
            The page you are looking for isn&apos;t here!
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle1"
            style={{ marginTop: '10px' }}
          >
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation!
          </Typography>
        </Container>
      </Box>
    </Page>
  );
};

export default NotFoundView;
