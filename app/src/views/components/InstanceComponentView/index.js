import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, makeStyles, Button, Typography, Card, CardContent, Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import {
  Delete as DeleteIcon
} from '@material-ui/icons/';
import {
  getComponentInstance as getComponentInstanceRequest,
  deleteComponentInstance as deleteComponentInstanceRequest
} from 'src/requests/component';
import {
  getArchitecture as getArchitectureRequest
} from 'src/requests/architecture';
import InstancePropertiesTable from './InstancePropertiesTable';
import AppBreadcrumb from '../../../components/AppBreadcrumb';
import handleErrorRequest from '../../../utils/handleErrorRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  buttonMargin: {
    marginRight: theme.spacing(1),
  },
  componentSubtitle: {
    marginBottom: theme.spacing(3),
    color: 'grey'
  }
}));

export default function InstanceComponentView() {
  const classes = useStyles();
  const { id } = useParams();
  const [component, setComponent] = useState({});
  const [breadcrumb, setBreadcrumb] = useState({
    architectureId: '',
    componentId: '',
    paperId: ''
  });

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

  const deleteComponentInstance = async (componentId) => {
    deleteComponentInstanceRequest(componentId)
      .then((data) => {
        if (data.success) {
          // removeComponentFromState(componentId);
          displayMsg('Component successfully deleted.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
  };

  const ComponentHeader = () => {
    return (
      <div>
        <Box display="flex" width="100%" mb={3}>
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonMargin}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#f50057', color: 'white' }}
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (window.confirm('Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?')) {
                deleteComponentInstance(component.id);
              }
            }}
          >
            Delete
          </Button>
        </Box>
        <Card>
          <CardContent>
            <Box display="flex">
              <Box width="100%">
                <AppBreadcrumb
                  paperId={breadcrumb.paper_id}
                  architectureId={breadcrumb.architecture_id}
                  componentId={breadcrumb.component_id}
                />
                <Typography variant="h1">
                  {component.name}
                </Typography>
                <Typography variant="subtitle1" className={classes.componentSubtitle}>
                  Component #
                  {component.id}
                </Typography>
                <Typography variant="body1">
                  Reader description -&nbsp;
                  {component.reader_description}
                </Typography>
                <Typography variant="body1">
                  Author description -&nbsp;
                  {component.author_description}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  };

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const compRes = await getComponentInstanceRequest(id);

        if (!compRes.success) return;

        const archRes = await getArchitectureRequest(compRes.result.architecture_id);

        if (archRes.success) {
          setBreadcrumb({
            architecture_id: archRes.result.id,
            paper_id: archRes.result.paper_id,
            component_id: id
          });
          console.log(compRes.result);
          setComponent(compRes.result);
        }
      } catch (error) {
        handleErrorRequest(error, displayMsg);
      }
    };

    fetchComponentData();
  }, []);

  return (
    <Page title="Component" className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ComponentHeader />
          </Grid>
          <Grid item xs={6}>
            {component.properties && component.properties.length ? (
              <InstancePropertiesTable
                properties={component.properties}
                propertyActionHandler={() => console.log('handler')}
              />
            )
              : (
                <Card>
                  <CardContent align="center">
                    <Typography variant="h1" component="div" style={{ fontSize: '200%' }} gutterBottom>
                      No property yet.
                    </Typography>
                    <Typography variant="body1">
                      <p>
                        You can add a new property by clicking the button below.
                      </p>
                    </Typography>
                    <Box mt={3}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => console.log('New property clicked!')}
                      >
                        New&nbsp;property
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent align="center">
                <Typography variant="h1" component="div" style={{ fontSize: '200%' }} gutterBottom>
                  No connections yet.
                </Typography>
                <Typography variant="body1">
                  <p>
                    This feature is not implemented yet.
                    Soon, you&apos;ll be able to create a connection here.
                  </p>
                </Typography>
                <Box mt={3}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => console.log('New connection clicked!')}
                  >
                    New&nbsp;connection
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <MessageSnackbar
          messageSnackbarProps={messageSnackbarProps}
          setMessageSnackbarProps={setMessageSnackbarProps}
        />
      </Container>
    </Page>
  );
}
