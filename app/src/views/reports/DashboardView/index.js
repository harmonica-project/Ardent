import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import MessageSnackbar from 'src/components/MessageSnackbar';
import LoadingOverlay from 'src/components/LoadingOverlay';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import Page from 'src/components/Page';
import { getArchitectures as getArchitecturesRequest } from 'src/requests/architectures';
import { getBaseComponents as getBaseComponentsRequest } from 'src/requests/components';
import { getPapers as getPapersRequest } from 'src/requests/papers';
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
  const [open, setOpen] = useState(false);

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

  const getArchitectures = async () => {
    try {
      const data = await getArchitecturesRequest();
      if (data.success) {
        setArchitectures(data.result);
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  const getBaseComponents = async () => {
    try {
      const data = await getBaseComponentsRequest();
      if (data.success) {
        setComponents(data.result);
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  const getPapers = async () => {
    try {
      const data = await getPapersRequest();
      if (data.success) {
        setPapers(data.result);
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  useEffect(() => {
    setOpen(true);
    Promise.all([getPapers(), getArchitectures(), getBaseComponents()])
      .then(() => {
        setOpen(false);
      });
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
            lg={7}
            md={12}
            xl={8}
            xs={12}
          >
            <Jumbo />
          </Grid>
          <Grid
            item
            lg={5}
            md={6}
            xl={4}
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
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default Dashboard;
