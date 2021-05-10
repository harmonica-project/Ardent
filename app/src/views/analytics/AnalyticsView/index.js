import React from 'react';
import {
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const AnalyticsView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Analytics"
    >
      <Card style={{ padding: '20px', margin: '20px', textAlign: 'center' }}>
        <Typography>
          This section will be used to analyze collected content.
          It has not been implemented yet, stay tuned!
        </Typography>
      </Card>
    </Page>
  );
};

export default AnalyticsView;
