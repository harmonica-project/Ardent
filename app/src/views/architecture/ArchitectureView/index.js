import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@material-ui/core';
import {
  Delete as DeleteIcon
} from '@material-ui/icons/';
import Page from 'src/components/Page';
import {
  getArchitecture as getArchitectureRequest,
  deleteArchitecture as deleteArchitectureRequest,
  saveExistingArchitecture as saveExistingArchitectureRequest,
  getArchitectureGraph as getArchitectureGraphRequest
} from 'src/requests/architectures';
import {
  deleteComponentInstance as deleteComponentInstanceRequest,
  saveNewComponentInstance as saveNewComponentInstanceRequest,
  saveExistingComponentInstance as saveExistingComponentInstanceRequest,
  saveNewBaseComponent as saveNewBaseComponentRequest,
  getBaseComponents as getBaseComponentsRequest,
} from 'src/requests/components';
import {
  saveProperty as savePropertyRequest,
  getBaseComponentProperties as getBaseComponentPropertiesRequest,
} from 'src/requests/properties';
import { saveQuestion as saveQuestionRequest } from 'src/requests/questions';
import DotOverlay from 'src/components/DotOverlay';
import AppBreadcrumb from 'src/components/AppBreadcrumb';
import LoadingOverlay from 'src/components/LoadingOverlay';
import ComponentModal from 'src/modals/ComponentModal';
import QuestionModal from 'src/modals/QuestionModal';
import ArchitectureModal from 'src/modals/ArchitectureModal';
import ConfirmModal from 'src/modals/ConfirmModal';
import ComponentsTable from './ComponentsTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  architectureSubtitle: {
    marginBottom: theme.spacing(3),
    color: 'grey'
  },
  buttonMargin: {
    marginRight: theme.spacing(1),
  }
}));

const ArchitectureView = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [architecture, setArchitecture] = useState({ components: [] });
  const [baseComponents, setBaseComponents] = useState([]);
  const [open, setOpen] = useState(false);
  const [architectureModalProps, setArchitectureModalProps] = useState({
    open: false,
    architecture: { components: [] },
    actionType: ''
  });

  const [dotProps, setDotProps] = useState({
    open: false,
    graph: ''
  });

  const [questionModalProps, setQuestionModalProps] = useState({
    open: false,
    context: {}
  });

  const [confirmModalProps, setConfirmModalProps] = useState({
    open: false,
    actionModalHandler: null,
    message: ''
  });

  const [componentModalProps, setComponentModalProps] = useState({
    open: false,
    component: {
      architecture_id: id
    },
    initialComponent: '',
    actionType: ''
  });

  const getArchitecture = async () => {
    try {
      const data = await getArchitectureRequest(id);
      if (data.success) {
        setArchitecture(data.result);
        setArchitectureModalProps({
          ...architectureModalProps,
          architecture: data.result
        });
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  const getBaseComponents = async () => {
    try {
      const data = await getBaseComponentsRequest(id);
      if (data.success) {
        setBaseComponents(data.result);
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    }
  };

  useEffect(() => {
    setOpen(true);
    Promise.all([getArchitecture(), getBaseComponents()])
      .then(() => {
        setOpen(false);
      });
  }, []);

  const saveExistingArchitecture = (newArchitecture) => {
    setOpen(true);
    saveExistingArchitectureRequest(newArchitecture)
      .then((data) => {
        if (data.success) {
          setArchitectureModalProps({
            ...architectureModalProps,
            open: false,
            actionType: '',
            architecture: newArchitecture
          });
          setArchitecture(newArchitecture);
          enqueueSnackbar('Architecture successfully modified.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => setOpen(false));
  };

  const deleteArchitecture = async (architectureId) => {
    setOpen(true);
    deleteArchitectureRequest(architectureId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Architecture successfully deleted.', { variant: 'success' });
          navigate('/app/papers');
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => setOpen(false));
  };

  const removeComponentFromState = (componentId) => {
    let i;
    const newComponents = [...architecture.components];
    for (i = 0; i < newComponents.length; i++) {
      if (newComponents[i].id === componentId) {
        newComponents.splice(i, 1);
        setArchitecture({
          ...architecture,
          components: newComponents
        });
        return true;
      }
    }

    return false;
  };

  const deleteComponentInstance = async (componentId) => {
    setOpen(true);
    deleteComponentInstanceRequest(componentId)
      .then((data) => {
        if (data.success) {
          removeComponentFromState(componentId);
          enqueueSnackbar('Component successfully deleted.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => {
        setOpen(false);
        setComponentModalProps({
          ...componentModalProps,
          component: { architecture_id: id },
          initialComponent: '',
          open: false,
        });
      });
  };

  const architectureActionModalHandler = (actionType, newArchitecture) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?',
          actionModalHandler: () => deleteArchitecture(architectureModalProps.architecture.id)
        });
        break;

      case 'edit':
        saveExistingArchitecture(newArchitecture);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const architectureEditHandler = () => {
    setArchitectureModalProps({
      ...architectureModalProps,
      open: true,
      actionType: 'edit'
    });
  };

  const ArchitectureHeader = () => {
    return (
      <div>
        <Box display="flex" width="100%" mb={3}>
          <Button
            color="primary"
            variant="contained"
            onClick={architectureEditHandler}
            className={classes.buttonMargin}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            className={classes.buttonMargin}
            style={{ backgroundColor: '#f50057', color: 'white' }}
            startIcon={<DeleteIcon />}
            onClick={() => {
              setConfirmModalProps({
                ...confirmModalProps,
                open: true,
                message: 'Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?',
                actionModalHandler: () => deleteArchitecture(architecture.id)
              });
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => setQuestionModalProps({
              ...questionModalProps,
              context: {
                name: architecture.name,
                type: 'architecture',
                id: architecture.id
              },
              open: true
            })}
          >
            Ask question about architecture
          </Button>
        </Box>
        <Card>
          <CardContent>
            <Box display="flex">
              <Box width="100%">
                <AppBreadcrumb
                  paperId={architecture.paper_id}
                  architectureId={architecture.id}
                />
                <Typography variant="h1">
                  {architecture.name}
                </Typography>
                <Typography variant="subtitle1" className={classes.architectureSubtitle}>
                  Architecture #
                  {architecture.id}
                </Typography>
                <Typography variant="body1">
                  Reader description -&nbsp;
                  {architecture.reader_description}
                </Typography>
                <Typography variant="body1">
                  Author description -&nbsp;
                  {architecture.author_description}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  };

  const componentActionHandler = (actionType, component) => {
    switch (actionType) {
      case 'new':
        setComponentModalProps({
          ...componentModalProps,
          open: true,
          actionType
        });
        break;
      case 'edit':
      case 'view':
        setComponentModalProps({
          component,
          initialComponent: component.component_base_id,
          open: true,
          actionType
        });
        break;

      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Component deletion is irreversible. Associated connections and properties will also be deleted. Proceed?',
          actionModalHandler: () => deleteComponentInstance(component.id)
        });
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

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
  };

  const saveNewComponent = async (component, doAddBaseProps) => {
    setOpen(true);
    try {
      if (!component.component_base_id || component.component_base_id === '') {
        const baseRes = await saveNewBaseComponentRequest({
          name: component.component_base_name,
          base_description: 'No description yet.'
        });
        if (baseRes.success) {
          component = { ...component, component_base_id: baseRes.componentId };
          setBaseComponents([
            ...baseComponents,
            {
              name: component.component_base_name,
              id: baseRes.componentId,
            }
          ]);
        }
      }

      const data = await saveNewComponentInstanceRequest(component);
      if (data.success) {
        enqueueSnackbar('Component instance successfully added.', { variant: 'success' });
        const newComponent = {
          ...component,
          id: data.componentId
        };

        if (doAddBaseProps) {
          await transferBasePropsToInstance(newComponent);
        }

        setArchitecture({
          ...architecture,
          components: [...architecture.components, newComponent]
        });
        setComponentModalProps({
          ...componentModalProps,
          component: { architecture_id: id },
          initialComponent: component.component_base_id,
          open: false,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const postQuestion = (question) => {
    saveQuestionRequest(question)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Question successfully post. You can find it in the Questions section.', { variant: 'success' });
          setQuestionModalProps({
            ...questionModalProps,
            open: false,
            context: {}
          });
        } else {
          enqueueSnackbar('Failed to post a question. Verify that you are still connected by refreshing the page.', { variant: 'error' });
        }
      })
      .catch(() => {
        enqueueSnackbar('Failed to post a question. Verify that you are still connected by refreshing the page.', { variant: 'error' });
      });
  };

  const modifyComponentInState = (component) => {
    const newComponents = [...architecture.components];
    for (let i = 0; i < newComponents.length; i++) {
      if (newComponents[i].id === component.id) {
        newComponents[i] = component;
      }
    }
    setArchitecture({
      ...architecture,
      components: newComponents
    });
  };

  const saveExistingComponent = async (component, doAddBaseProps) => {
    setOpen(true);
    try {
      if (!component.component_base_id || component.component_base_id === '') {
        const baseRes = await saveNewBaseComponentRequest({
          name: component.component_base_name,
          base_description: 'No description yet.'
        });
        if (baseRes.success) {
          component = { ...component, component_base_id: baseRes.componentId };
          setBaseComponents([
            ...baseComponents,
            {
              name: component.component_base_name,
              id: baseRes.componentId
            }
          ]);
        }
      }

      const data = await saveExistingComponentInstanceRequest(component);
      if (data.success) {
        enqueueSnackbar('Component instance successfully modified.', { variant: 'success' });
        if (doAddBaseProps) {
          await transferBasePropsToInstance(component);
        }

        modifyComponentInState(component);
        setComponentModalProps({
          ...componentModalProps,
          initialComponent: component.component_base_id,
          component: { architecture_id: id },
          open: false,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const getArchitectureGraph = () => {
    setOpen(true);
    getArchitectureGraphRequest(architecture.id)
      .then((data) => {
        if (data.success) {
          setDotProps({
            open: true,
            graph: data.result
          });
        }
      })
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  const componentActionModalHandler = (actionType, component, doAddBaseProps) => {
    switch (actionType) {
      case 'new':
        saveNewComponent(component, doAddBaseProps);
        break;

      case 'edit':
        saveExistingComponent(component, doAddBaseProps);
        break;

      case 'delete':
        deleteComponentInstance(component.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const componentClickHandler = (componentId) => {
    navigate(`/app/component/${componentId}`);
  };

  return (
    <Page
      className={classes.root}
      title="Architecture"
    >
      <Container maxWidth={false}>
        <ArchitectureHeader />
        {
          architecture.components.length
            ? (
              <Box mt={3}>
                <Box>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => componentActionHandler('new')}
                  >
                    New&nbsp;component
                  </Button>
                  <Button
                    color="primary"
                    style={{ marginLeft: '10px' }}
                    variant="contained"
                    onClick={() => getArchitectureGraph()}
                  >
                    Display&nbsp;component&nbsp;graph
                  </Button>
                </Box>
                <Box mt={3}>
                  <ComponentsTable
                    components={architecture.components}
                    componentActionHandler={componentActionHandler}
                    componentClickHandler={componentClickHandler}
                    baseComponents={baseComponents}
                  />
                </Box>
              </Box>
            )
            : (
              <Box mt={3}>
                <Card>
                  <CardContent align="center">
                    <Typography variant="h1" component="div" gutterBottom>
                      No component yet.
                    </Typography>
                    <Typography variant="body1">
                      <p>
                        You can add a new component by clicking the button below.
                      </p>
                    </Typography>
                    <Box mt={3}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => componentActionHandler('new')}
                      >
                        New&nbsp;component
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )
        }
      </Container>
      <ArchitectureModal
        modalProps={architectureModalProps}
        setModalProps={setArchitectureModalProps}
        actionModalHandler={architectureActionModalHandler}
        doNotShowSwitch
      />
      <ComponentModal
        modalProps={componentModalProps}
        setModalProps={setComponentModalProps}
        actionModalHandler={componentActionModalHandler}
        baseComponents={baseComponents}
      />
      <ConfirmModal
        modalProps={confirmModalProps}
        setModalProps={setConfirmModalProps}
      />
      <QuestionModal
        modalProps={questionModalProps}
        setModalProps={setQuestionModalProps}
        actionModalHandler={postQuestion}
      />
      <DotOverlay
        open={dotProps.open}
        graph={dotProps.graph}
        setOpen={(newOpen) => setDotProps({ ...dotProps, open: newOpen })}
      />
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default ArchitectureView;
