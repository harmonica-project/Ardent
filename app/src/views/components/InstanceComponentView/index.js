import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Container, Box, makeStyles, Button, Typography, Card, CardContent, Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
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
  modifyProperty as modifyPropertyRequest,
  getBaseComponentProperties as getBaseComponentPropertiesRequest,
} from 'src/requests/properties';
import {
  saveConnection as saveConnectionRequest,
  deleteConnection as deleteConnectionRequest,
  modifyConnection as modifyConnectionRequest
} from 'src/requests/connections';
import AppBreadcrumb from 'src/components/AppBreadcrumb';
import ComponentModal from 'src/modals/ComponentModal';
import ConfirmModal from 'src/modals/ConfirmModal';
import InstancePropertyModal from 'src/modals/InstancePropertyModal';
import ConnectionModal from 'src/modals/ConnectionModal';
import ConnectionsTable from './ConnectionsTable';
import AccordionOverlay from './AccordionOverlay';

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
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [component, setComponent] = useState({});
  const [baseComponents, setBaseComponents] = useState([]);
  const [architectureComponents, setArchitectureComponents] = useState([]);
  const [open, setOpen] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState({
    architectureId: '',
    componentId: '',
    paperId: ''
  });

  const [confirmModalProps, setConfirmModalProps] = useState({
    open: false,
    actionModalHandler: null,
    message: ''
  });

  const [componentModalProps, setComponentModalProps] = useState({
    open: false,
    component: {},
    actionType: '',
    initialComponent: ''
  });

  const [propertyModalProps, setPropertyModalProps] = useState({
    open: false,
    property: {},
    actionType: ''
  });

  const [connectionModalProps, setConnectionModalProps] = useState({
    open: false,
    connection: { direction: 'bidirectional' },
    component: {},
    actionType: ''
  });

  const messageResultTransferProps = (expectedLength, actualLength) => {
    if (expectedLength === 0) {
      enqueueSnackbar(`
      No new properties have been transferred from base component, as the base component does not have base properties.
    `, { variant: 'info' });
    } else if (actualLength === expectedLength) {
      enqueueSnackbar(`
          ${actualLength || 'No new'} properties have been transferred from base component.
          ${actualLength ? 'Do not forget to fill their values!' : ''}
          `, { variant: 'success' });
    } else {
      enqueueSnackbar(`
          ${actualLength || 'No new'} properties have been transferred from base component, but ${expectedLength} were expected.
          Properties that were not added might already be present in the component instance.
        `, { variant: 'info' });
    }
  };

  const transferBasePropsToInstance = async (newComponent) => {
    const queries = [];
    let newProperties = [];
    const propRes = await getBaseComponentPropertiesRequest(newComponent.component_base_id);
    if (propRes.success) {
      propRes.result.forEach((prop) => {
        const newProperty = {
          key: prop.key,
          value: 'Undefined',
          component_id: newComponent.id,
          category: prop.category
        };

        newProperties.push(newProperty);
        queries.push(savePropertyRequest(newProperty));
      });
      const results = await Promise.all(queries);
      results.forEach((res, i) => {
        if (res && res.success) {
          newProperties[i].id = res.propertyId;
        }
      });
      newProperties = newProperties.filter((prop) => prop.id);

      messageResultTransferProps(queries.length, newProperties.length);
    } else {
      enqueueSnackbar('Error while retrieving base properties.', { variant: 'error' });
    }

    return newProperties;
  };

  const saveExistingComponent = async (newComponent, doAddBaseProps) => {
    setOpen(true);
    try {
      if (!newComponent.component_base_id || newComponent.component_base_id === '') {
        const baseRes = await saveNewBaseComponentRequest({
          name: newComponent.name,
          base_description: ''
        });
        if (baseRes.success) {
          newComponent = { ...newComponent, component_base_id: baseRes.componentId };
          setBaseComponents([
            ...baseComponents,
            {
              id: baseRes.componentId,
              name: newComponent.name,
              base_description: ''
            }
          ]);
        }
      }

      const data = await saveExistingComponentInstanceRequest(newComponent);
      if (data.success) {
        enqueueSnackbar('Component instance successfully modified', { variant: 'success' });
        let newProperties = [];

        if (doAddBaseProps) {
          newProperties = await transferBasePropsToInstance(newComponent);
        }

        newComponent.properties = [...newComponent.properties, ...newProperties];
        setComponent(newComponent);
        setComponentModalProps({
          ...componentModalProps,
          component: newComponent,
          open: false,
          initialComponent: component.name
        });
      }
    } catch (error) {
      enqueueSnackbar(error, 'error');
    } finally {
      setOpen(false);
    }
  };

  const deleteComponentInstance = async (componentId) => {
    setOpen(true);
    deleteComponentInstanceRequest(componentId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Component successfully deleted.', { variant: 'success' });
          navigate(`/app/architecture/${component.architecture_id}`);
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  const saveProperty = (newProperty) => {
    setOpen(true);
    savePropertyRequest({ ...newProperty, component_id: component.id })
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Property successfully added.', { variant: 'success' });
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
      .catch((error) => enqueueSnackbar(error, 'error'))
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

  const removeConnectionFromState = (connectionId) => {
    let i;
    const newConnections = [...component.connections];
    for (i = 0; i < newConnections.length; i++) {
      if (newConnections[i].id === connectionId) {
        newConnections.splice(i, 1);
        setComponent({
          ...component,
          connections: newConnections
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

  const modifyConnectionFromState = (newConnection) => {
    let i;
    const newConnections = [...component.connections];
    for (i = 0; i < newConnections.length; i++) {
      if (newConnections[i].id === newConnection.id) {
        newConnections[i] = newConnection;
        setComponent({
          ...component,
          connections: newConnections
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
          enqueueSnackbar('Property successfully modified.', { variant: 'success' });
          modifyPropertyFromState(newProperty);
          setPropertyModalProps({
            ...propertyModalProps,
            property: {},
            open: false,
          });
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  const modifyConnection = (newConnection) => {
    setOpen(true);
    modifyConnectionRequest(newConnection)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Connection successfully modified.', { variant: 'success' });
          modifyConnectionFromState(newConnection);
          setConnectionModalProps({
            ...connectionModalProps,
            connection: { direction: 'bidirectional' },
            open: false,
          });
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  const deleteProperty = (propertyId) => {
    setOpen(true);
    deletePropertyRequest(propertyId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Property successfully deleted.', { variant: 'success' });
          removePropertyFromState(propertyId);
          setPropertyModalProps({
            ...propertyModalProps,
            property: {},
            open: false,
          });
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  const deleteConnection = (connectionId) => {
    setOpen(true);
    deleteConnectionRequest(connectionId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Connection successfully deleted.', { variant: 'success' });
          removeConnectionFromState(connectionId);
          setConnectionModalProps({
            ...connectionModalProps,
            connection: { direction: 'bidirectional' },
            open: false,
          });
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
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
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Property deletion is irreversible. Proceed?',
          actionModalHandler: () => deleteProperty(property.id)
        });
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const connectionActionHandler = (actionType, connection) => {
    console.log(connection);
    switch (actionType) {
      case 'edit':
      case 'view':
        setConnectionModalProps({
          ...componentModalProps,
          open: true,
          actionType,
          connection
        });
        break;

      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Connection deletion is irreversible. Proceed?',
          actionModalHandler: () => deleteConnection(connection.id)
        });
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

  const saveConnection = (newConnection) => {
    setOpen(true);
    saveConnectionRequest({ ...newConnection, component_id: component.id })
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Connection successfully added.', { variant: 'success' });
          setComponent({
            ...component,
            connections: [...component.connections, {
              ...newConnection,
              id: data.connectionId
            }]
          });
          setConnectionModalProps({
            ...connectionModalProps,
            connection: { direction: 'bidirectional' },
            open: false,
          });
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  const connectionActionModalHandler = (actionType, newConnection) => {
    switch (actionType) {
      case 'new':
        saveConnection(newConnection);
        break;

      case 'edit':
        modifyConnection(newConnection);
        break;

      case 'delete':
        deleteConnection(newConnection.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const componentActionModalHandler = (actionType, newComponent, doAddBaseProps) => {
    switch (actionType) {
      case 'edit':
        saveExistingComponent(newComponent, doAddBaseProps);
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
      actionType: 'edit',
      initialComponent: component.name
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
              setConfirmModalProps({
                ...confirmModalProps,
                open: true,
                message: 'Component deletion is irreversible. Associated connections and properties will also be deleted. Proceed?',
                actionModalHandler: () => deleteComponentInstance(component.id)
              });
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
        setArchitectureComponents(archRes.result.components);
        setComponentModalProps({
          ...componentModalProps,
          initialComponent: compRes.result.name,
          component: compRes.result
        });
        setConnectionModalProps({
          ...connectionModalProps,
          component: compRes.result
        });
        setComponent(compRes.result);
      }
    } catch (error) {
      enqueueSnackbar(error, 'error');
    }
  };

  const fetchBaseComponents = async () => {
    try {
      const data = await getBaseComponentsRequest();
      if (data.success) {
        setBaseComponents(data.result);
      }
    } catch (error) {
      enqueueSnackbar(error, 'error');
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
      actionType: 'new',
      property: {}
    });
  };

  const handleNewConnectionClick = () => {
    setConnectionModalProps({
      ...connectionModalProps,
      open: true,
      actionType: 'new',
      connection: { first_component: component.id, direction: 'bidirectional' }
    });
  };

  return (
    <Page title="Component" className={classes.root}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ComponentHeader />
          </Grid>
          <Grid item xs={12}>
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
              <AccordionOverlay
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
          <Grid item xs={12}>
            <Box mb={3}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleNewConnectionClick}
              >
                New&nbsp;connection
              </Button>
            </Box>
            {component.connections && component.connections.length ? (
              <ConnectionsTable
                connections={component.connections}
                connectionActionHandler={connectionActionHandler}
                architectureComponents={architectureComponents}
              />
            )
              : (
                <Card>
                  <CardContent align="center">
                    <Typography variant="h1" component="div" style={{ fontSize: '200%' }} gutterBottom>
                      No connection yet.
                    </Typography>
                    <Typography variant="body1">
                      <p>
                        You can add a new connection by clicking the button below.
                      </p>
                    </Typography>
                    <Box mt={3}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleNewConnectionClick}
                      >
                        New&nbsp;connection
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
          </Grid>
        </Grid>
        <ComponentModal
          modalProps={componentModalProps}
          setModalProps={setComponentModalProps}
          actionModalHandler={componentActionModalHandler}
          baseComponents={baseComponents}
        />
        <InstancePropertyModal
          modalProps={propertyModalProps}
          setModalProps={setPropertyModalProps}
          actionModalHandler={propertyActionModalHandler}
        />
        <ConnectionModal
          modalProps={connectionModalProps}
          setModalProps={setConnectionModalProps}
          actionModalHandler={connectionActionModalHandler}
          architectureComponents={architectureComponents}
        />
        <ConfirmModal
          modalProps={confirmModalProps}
          setModalProps={setConfirmModalProps}
        />
        <LoadingOverlay open={open} />
      </Container>
    </Page>
  );
}
