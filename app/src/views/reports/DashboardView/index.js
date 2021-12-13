import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import LoadingOverlay from 'src/components/LoadingOverlay';
import Page from 'src/components/Page';
import {
  getProjectPapers as getProjectPapersRequest,
  getProjectArchitectures as getProjectArchitecturesRequest,
  getProjectBaseComponents as getProjectBaseComponentsRequest
} from 'src/requests/projects';
import ArchitectureSummary from './ArchitectureSummary';
import Jumbo from './Jumbo';
import PapersStatuses from './PapersStatuses';
import PaperSummary from './PaperSummary';
import ComponentSummary from './ComponentSummary';
import StudyProgress from './StudyProgress';
import { useProject } from '../../../project-context';

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
  const { enqueueSnackbar } = useSnackbar();
  const [papers, setPapers] = useState([]);
  const [architectures, setArchitectures] = useState([]);
  const [components, setComponents] = useState([]);
  const [open, setOpen] = useState(false);

  const {
    state: { project },
  } = useProject();

  const getArchitectures = async () => {
    try {
      const data = await getProjectArchitecturesRequest(project.url);
      if (data.success) {
        setArchitectures(data.result);
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  const getBaseComponents = async () => {
    try {
      const data = await getProjectBaseComponentsRequest(project.url);
      if (data.success) {
        setComponents(data.result);
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  const getPapers = async () => {
    if (project.url) {
      try {
        const data = await getProjectPapersRequest(project.url);
        if (data.success) {
          setPapers(data.result);
        }
      } catch (error) {
        enqueueSnackbar(error.toString(), { variant: 'error' });
      }
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
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default Dashboard;
