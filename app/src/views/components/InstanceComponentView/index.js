import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Box, makeStyles, Button, Typography, Card, CardContent, Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import {
  Delete as DeleteIcon
} from '@material-ui/icons/';
import LoadingOverlay from 'src/components/LoadingOverlay';
import {
  getComponentInstance as getComponentInstanceRequest,
  deleteComponentInstance as deleteComponentInstanceRequest,
  saveExistingComponentInstance as saveExistingComponentInstanceRequest,
  saveNewBaseComponent as saveNewBaseComponentRequest,
  getBaseComponents as getBaseComponentsRequest
} from 'src/requests/components';
import {
  getArchitecture as getArchitectureRequest
} from 'src/requests/architectures';
import {
  saveProperty as savePropertyRequest,
  deleteProperty as deletePropertyRequest,
  modifyProperty as modifyPropertyRequest
} from 'src/requests/properties';
import AppBreadcrumb from 'src/components/AppBreadcrumb';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import ComponentModal from 'src/views/architecture/ArchitectureView/ComponentModal';
import InstancePropertiesModal from './InstancePropertiesModal';
import InstancePropertiesTable from './InstancePropertiesTable';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const [component, setComponent] = useState({});
  const [baseComponents, setBaseComponents] = useState([]);
  const [open, setOpen] = useState(false);
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

  const [componentModalProps, setComponentModalProps] = useState({
    open: false,
    component: {},
    actionType: ''
  });

  const [propertyModalProps, setPropertyModalProps] = useState({
    open: false,
    property: {},
    actionType: ''
  });

  const displayMsg = (message, severity = 'success', duration = 6000) => {
    setMessageSnackbarProps({
      open: true,
      severity,
      duration,
      message
    });
  };

  const saveExistingComponent = async (newComponent) => {
    setOpen(true);
    try {
      if (!newComponent.component_base_id || newComponent.component_base_id === '') {
        const baseRes = await saveNewBaseComponentRequest({
          name: newComponent.name,
          base_description: ''
        });
        if (baseRes.success) {
          newComponent = { ...newComponent, component_base_id: baseRes.componentId };
        }
      }

      const data = await saveExistingComponentInstanceRequest(newComponent);
      if (data.success) {
        setComponent(newComponent);
        setComponentModalProps({
          ...componentModalProps,
          component: newComponent,
          open: false,
        });
        displayMsg('Component instance successfully modified.');
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    } finally {
      setOpen(false);
    }
  };

  const deleteComponentInstance = async (componentId) => {
    setOpen(true);
    deleteComponentInstanceRequest(componentId)
      .then((data) => {
        if (data.success) {
          displayMsg('Component successfully deleted.');
          navigate(`/app/architecture/${component.architecture_id}`);
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const saveProperty = (newProperty) => {
    console.log(newProperty);
    setOpen(true);
    savePropertyRequest({ ...newProperty, component_id: component.id })
      .then((data) => {
        if (data.success) {
          displayMsg('Property successfully added.');
          setComponent({
            ...component,
            properties: [...component.properties, {
              ...newProperty,
              id: data.propertyId
            }]
          });
          setPropertyModalProps({
            ...propertyModalProps,
            property: {},
            open: false,
          });
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const removePropertyFromState = (propertyId) => {
    let i;
    const newProperties = [...component.properties];
    for (i = 0; i < newProperties.length; i++) {
      if (newProperties[i].id === propertyId) {
        newProperties.splice(i, 1);
        setComponent({
          ...component,
          properties: newProperties
        });
        return true;
      }
    }

    return false;
  };

  const modifyPropertyFromState = (newProperty) => {
    let i;
    const newProperties = [...component.properties];
    for (i = 0; i < newProperties.length; i++) {
      if (newProperties[i].id === newProperty.id) {
        newProperties[i] = newProperty;
        setComponent({
          ...component,
          properties: newProperties
        });
        return true;
      }
    }

    return false;
  };

  const modifyProperty = (newProperty) => {
    setOpen(true);
    modifyPropertyRequest(newProperty)
      .then((data) => {
        if (data.success) {
          displayMsg('Property successfully modified.');
          modifyPropertyFromState(newProperty);
          setPropertyModalProps({
            ...propertyModalProps,
            property: {},
            open: false,
          });
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const deleteProperty = (propertyId) => {
    setOpen(true);
    deletePropertyRequest(propertyId)
      .then((data) => {
        if (data.success) {
          displayMsg('Property successfully deleted.');
          removePropertyFromState(propertyId);
          setPropertyModalProps({
            ...propertyModalProps,
            property: {},
            open: false,
          });
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const propertyActionHandler = (actionType, property) => {
    switch (actionType) {
      case 'edit':
      case 'view':
        setPropertyModalProps({
          ...componentModalProps,
          open: true,
          actionType,
          property
        });
        break;

      case 'delete':
        // Can be replaced with a prettier modal later.
        if (window.confirm('Property deletion is irreversible. Proceed?')) deleteProperty(property.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const propertyActionModalHandler = (actionType, newProperty) => {
    switch (actionType) {
      case 'new':
        saveProperty(newProperty);
        break;

      case 'edit':
        modifyProperty(newProperty);
        break;

      case 'delete':
        deleteProperty(newProperty.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const componentActionModalHandler = (actionType, newComponent) => {
    switch (actionType) {
      case 'edit':
        saveExistingComponent(newComponent);
        break;

      case 'delete':
        deleteComponentInstance(newComponent.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const handleEditClick = () => {
    setComponentModalProps({
      ...componentModalProps,
      open: true,
      actionType: 'edit'
    });
  };

  const ComponentHeader = () => {
    return (
      <div>
        <Box display="flex" width="100%" mb={3}>
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonMargin}
            onClick={handleEditClick}
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
        setComponentModalProps({
          ...componentModalProps,
          component: compRes.result
        });
        setComponent(compRes.result);
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  const fetchBaseComponents = async () => {
    try {
      const data = await getBaseComponentsRequest();
      if (data.success) {
        setBaseComponents(data.result);
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  useEffect(() => {
    setOpen(true);

    Promise.all([fetchComponentData(), fetchBaseComponents()])
      .then(() => {
        setOpen(false);
      });
  }, []);

  const handleNewPropertyClick = () => {
    setPropertyModalProps({
      ...propertyModalProps,
      open: true,
      actionType: 'new'
    });
  };

  return (
    <Page title="Component" className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ComponentHeader />
          </Grid>
          <Grid item xs={6}>
            <Box mb={3}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleNewPropertyClick}
              >
                New&nbsp;property
              </Button>
            </Box>
            {component.properties && component.properties.length ? (
              <InstancePropertiesTable
                properties={component.properties}
                propertyActionHandler={propertyActionHandler}
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
                        onClick={handleNewPropertyClick}
                      >
                        New&nbsp;property
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
          </Grid>
          <Grid item xs={6}>
            <Box mb={3}>
              <Button
                color="primary"
                variant="contained"
              >
                New&nbsp;connection
              </Button>
            </Box>
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
        <ComponentModal
          modalProps={componentModalProps}
          setModalProps={setComponentModalProps}
          actionModalHandler={componentActionModalHandler}
          baseComponents={baseComponents}
        />
        <InstancePropertiesModal
          modalProps={propertyModalProps}
          setModalProps={setPropertyModalProps}
          actionModalHandler={propertyActionModalHandler}
        />
        <LoadingOverlay open={open} />
      </Container>
    </Page>
  );
}
