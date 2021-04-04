import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import Page from 'src/components/Page';
import { getArchitectures } from 'src/requests/architecture';
import { getComponentsNames } from 'src/requests/component';
import { getPapers } from 'src/requests/paper';
import ArchitectureSummary from './ArchitectureSummary';
import Jumbo from './Jumbo';
import PapersStatuses from './PapersStatuses';
import PaperSummary from './PaperSummary';
import ComponentSummary from './ComponentSummary';
import StudyProgress from './StudyProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [papers, setPapers] = useState([]);
  const [architectures, setArchitectures] = useState([]);
  const [components, setComponents] = useState([]);

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

  useEffect(() => {
    getArchitectures()
      .then((data) => {
        if (data.success) {
          setArchitectures(data.result);
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));

    getComponentsNames()
      .then((data) => {
        if (data.success) {
          setComponents(data.result);
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));

    getPapers()
      .then((data) => {
        if (data.success) {
          setPapers(data.result);
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
  }, []);

  useEffect(() => {

  }, []);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <PaperSummary nbPapers={papers.length} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <ArchitectureSummary nbArchitectures={architectures.length} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <ComponentSummary nbComponents={components.length} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <StudyProgress papers={papers} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Jumbo />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <PapersStatuses papers={papers} />
          </Grid>
        </Grid>
      </Container>
      <MessageSnackbar
        messageSnackbarProps={messageSnackbarProps}
        setMessageSnackbarProps={setMessageSnackbarProps}
      />
    </Page>
  );
};

export default Dashboard;
