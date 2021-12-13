/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Card,
  makeStyles,
  Button,
  Container,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from '@material-ui/core';
import {
  getUserProjects as getUserProjectsRequest,
} from 'src/requests/users';
import {
  saveNewProject as saveNewProjectRequest,
} from 'src/requests/projects';
import Page from 'src/components/Page';
import ProjectCard from './ProjectCard';
import { useProject } from '../../../project-context';
import ProjectModal from 'src/modals/ProjectModal';
import authenticationService from 'src/requests/authentication';
import LoadingOverlay from 'src/components/LoadingOverlay';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProjectsView = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { username } = authenticationService.currentUserValue.user;
  const [open, setOpen] = useState(false);

  const [projectModalProps, setProjectModalProps] = useState({
    open: false,
    project: {
      url: '',
      name: '',
      description: ''
    },
    actionType: ''
  });

  const {
    state: { project },
    dispatch
  } = useProject();
  
  const getProjects = () => {
    getUserProjectsRequest(username)
      .then((data) => {
        setProjects([...data.result]);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleCardAction = (action, value) => {
    switch (action) {
      case 'view':
        dispatch({ type: 'change', payload: value });
        navigate(`/project/${value.url}/`)
        break;
      
      case 'edit':
        console.log(action, value, 'edit');
        break;
    }
  };

  const saveNewProject = (newProject) => {
    setOpen(true);
    saveNewProjectRequest({ ...newProject, username })
      .then((data) => {
        if (data.success) {
          setProjects([...projects, newProject]);
          setProjectModalProps({
            open: false,
            project: {},
            actionType: ''
          });
          enqueueSnackbar('Project successfully added.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const projectActionModalHandler = (actionType, newProject) => {
    console.log(actionType)
    switch (actionType) {
      case 'new':
        saveNewProject(newProject);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  return (
    <Page
      className={classes.root}
      title="My projects"
    >
      <Container maxWidth={false}>
        <Button
          className={classes.marginButton}
          color="primary"
          variant="contained"
          onClick={() => setProjectModalProps({...projectModalProps, open: true, actionType: 'new' })}
        >
          New project
        </Button>
        <Card style={{ marginTop: '20px' }}>
          <CardHeader
            subheader="Choose and manage your projects"
            title="My projects"
          />
          <Divider />
          <CardContent>
            <Grid container>
              {projects.map((p) => (
                <Grid item xs={4}>
                  <ProjectCard project={p} action={handleCardAction} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
      <ProjectModal
        modalProps={projectModalProps}
        setModalProps={setProjectModalProps}
        actionModalHandler={projectActionModalHandler}
      />
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default ProjectsView;