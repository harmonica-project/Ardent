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
  deleteProject as deleteProjectRequest,
  editProject as editProjectRequest
} from 'src/requests/projects';
import Page from 'src/components/Page';
import ProjectCard from './ProjectCard';
import ConfirmModal from 'src/modals/ConfirmModal';
import { useProject } from '../../../project-context';
import ProjectModal from 'src/modals/ProjectModal';
import authenticationService from 'src/requests/authentication';
import LoadingOverlay from 'src/components/LoadingOverlay';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
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

  const [confirmModalProps, setConfirmModalProps] = useState({
    open: false,
    actionModalHandler: null,
    message: ''
  });

  const [projectModalProps, setProjectModalProps] = useState({
    open: false,
    project: {
      url: '',
      name: '',
      description: '',
      users: []
    },
    actionType: ''
  });

  const {
    state: { project },
    dispatch
  } = useProject();
  
  const getProjects = () => {
    setOpen(true);
    getUserProjectsRequest(username)
      .then((data) => {
        setProjects([...data.result]);
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
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
        setProjectModalProps({
          ...projectModalProps,
          open: true,
          actionType: 'edit',
          project: value,
          oldUrl: value.url
        });
        break;

      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Project deletion is irreversible. Associated papers, architectures, components, and properties will also be deleted. Proceed?',
          actionModalHandler: () => deleteProject(value)
        });
    }
  };

  const editProject = (newProject) => {
    setOpen(true);
    editProjectRequest(projectModalProps.oldUrl, newProject)
      .then((data) => {
        if (data.success) {
          modifyProjectFromState(projectModalProps.oldUrl, newProject);
          setProjectModalProps({
            open: false,
            project: {
              url: '',
              name: '',
              description: '',
              users: []
            },
            actionType: ''
          });
          enqueueSnackbar('Project successfully modified.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const saveNewProject = (newProject) => {
    setOpen(true);
    saveNewProjectRequest({ ...newProject, username })
      .then((data) => {
        if (data.success) {
          setProjects([...projects, { ...newProject, is_admin: true }]);
          setProjectModalProps({
            open: false,
            project: {
              url: '',
              name: '',
              description: '',
              users: []
            },
            actionType: ''
          });
          enqueueSnackbar('Project successfully added.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const deleteProjectFromState = (url) => {
    const newProjects = [...projects].filter(project => project.url !== url);
    setProjects(newProjects);
  };

  const modifyProjectFromState = (oldUrl, newProject) => {
    const foundUser = newProject.users.find((user) => user.username === username);
    let newProjects;

    if (foundUser) {
      newProjects = [...projects].map(project => (project.url === oldUrl ? { ...newProject, is_admin: foundUser.is_admin } : project));
    } else {
      newProjects = [...projects].filter(project => (project.url !== oldUrl));
    }

    setProjects(newProjects);
  };

  const deleteProject = (newProject) => {
    setOpen(true);
    deleteProjectRequest(newProject.url)
      .then((data) => {
        if (data.success) {
          deleteProjectFromState(newProject.url);
          setConfirmModalProps({
            open: false,
            actionModalHandler: null,
            message: ''
          });
          if (newProject.url === project.url) {
            dispatch({ 
              type: 'change', 
              payload: {
                url: '',
                name: '',
                description: ''
              }
            });
          }
          enqueueSnackbar('Project successfully deleted.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const projectActionModalHandler = (actionType, newProject) => {
    switch (actionType) {
      case 'new':
        saveNewProject(newProject);
        break;

      case 'edit':
        editProject(newProject);
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
          onClick={() => setProjectModalProps({
            open: true,
            actionType: 'new',
            project: {
              url: '',
              name: '',
              description: '',
              users: [{
                username,
                is_admin: true,
                locked: true
              }]
            }
          })}
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
                <Grid item xs={12} sm={6} md={4}>
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
      <ConfirmModal
        modalProps={confirmModalProps}
        setModalProps={setConfirmModalProps}
      />
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default ProjectsView;