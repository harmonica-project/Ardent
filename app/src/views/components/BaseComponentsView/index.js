import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Container, Box, Card, CardContent, makeStyles, Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import LoadingOverlay from 'src/components/LoadingOverlay';
import {
  getFullComponents as getFullComponentsRequest,
  deleteBaseComponent as deleteBaseComponentRequest,
  saveExistingBaseComponent as saveExistingBaseComponentRequest,
  saveNewBaseComponent as saveNewBaseComponentRequest,
} from 'src/requests/components';
import {
  getInstancePropertiesFromComponent as getInstancePropertiesFromComponentRequest,
  saveProperty as savePropertyRequest,
  saveNewBaseProperty as saveNewBasePropertyRequest,
  saveExistingBaseProperty as saveExistingBasePropertyRequest,
  deleteBaseProperty as deleteBasePropertyRequest,
  modifyProperty as modifyPropertyRequest,
} from 'src/requests/properties';
import { saveQuestion as saveQuestionRequest } from 'src/requests/questions';
import ConfirmModal from 'src/modals/ConfirmModal';
import BaseComponentModal from 'src/modals/BaseComponentModal';
import BasePropertyModal from 'src/modals/BasePropertyModal';
import QuestionModal from 'src/modals/QuestionModal';
import BaseComponentInput from './BaseComponentsInput';
import BaseComponentTable from './BaseComponentsTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3)
  },
  buttonMargin: {
    marginRight: theme.spacing(1),
  }
}));

export default function BaseComponentsView() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [baseComponents, setBaseComponents] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [open, setOpen] = useState(false);
  const [displayedComponents, setDisplayedComponents] = useState([]);

  const [confirmModalProps, setConfirmModalProps] = useState({
    open: false,
    actionModalHandler: null,
    message: ''
  });

  const [baseComponentModalProps, setBaseComponentModalProps] = useState({
    open: false,
    baseComponent: {},
    actionType: ''
  });

  const [basePropertyModalProps, setBasePropertyModalProps] = useState({
    open: false,
    baseProperty: {},
    initialProperty: {},
    actionType: ''
  });

  const [questionModalProps, setQuestionModalProps] = useState({
    open: false,
    context: {}
  });

  const handleAutocompleteChange = (value) => {
    setAutocompleteValue(value);
  };

  const filterAutocomplete = () => {
    if (autocompleteValue.length) {
      setDisplayedComponents(
        baseComponents.filter((component) => component.name.includes(autocompleteValue))
      );
    } else {
      setDisplayedComponents(baseComponents);
    }
  };

  const removeBaseComponentFromState = (componentId) => {
    let i;
    const newBaseComponents = [...baseComponents];
    for (i = 0; i < newBaseComponents.length; i++) {
      if (newBaseComponents[i].id === componentId) {
        newBaseComponents.splice(i, 1);
        setBaseComponents(newBaseComponents);
        return true;
      }
    }

    return false;
  };

  const modifyBaseComponentState = (newComponent) => {
    const newBaseComponents = [...baseComponents];
    for (let i = 0; i < newBaseComponents.length; i++) {
      if (newBaseComponents[i].id === newComponent.id) {
        newBaseComponents[i] = newComponent;
      }
    }
    setBaseComponents(newBaseComponents);
  };

  const addStatsToBase = (newBaseComponents) => {
    const nbInstances = newBaseComponents.reduce((acc, comp) => acc + comp.instances.length, 0);
    newBaseComponents.forEach((bc) => {
      bc.occurences = bc.instances.length;
      bc.proportion = ((bc.instances.length / nbInstances) * 100).toFixed(2);
    });
    return newBaseComponents;
  };

  const saveExistingBaseComponent = (newComponent) => {
    setOpen(true);
    saveExistingBaseComponentRequest(newComponent)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Base component successfully modified.', { variant: 'success' });
          modifyBaseComponentState(newComponent);
          if (baseComponentModalProps.open) {
            setBaseComponentModalProps({
              ...baseComponentModalProps,
              open: false,
              baseComponent: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
  };

  const fetchComponentData = async () => {
    try {
      const compRes = await getFullComponentsRequest();

      if (compRes.success) {
        const newBaseComponents = addStatsToBase(compRes.result);
        setBaseComponents(newBaseComponents);
        setDisplayedComponents(newBaseComponents);
      }
    } catch (err) {
      enqueueSnackbar(err.toString(), { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const saveNewBaseComponent = (newComponent) => {
    setOpen(true);
    saveNewBaseComponentRequest(newComponent)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Base component successfully added.', { variant: 'success' });
          fetchComponentData();
          if (baseComponentModalProps.open) {
            setBaseComponentModalProps({
              ...baseComponentModalProps,
              open: false,
              baseComponent: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
  };

  const modifyPropertyFromState = (property) => {
    const newBaseComponents = [...baseComponents];
    newBaseComponents.forEach((c) => {
      if (property.component_base_id === c.id) {
        c.properties.forEach((p) => {
          if (p.id === property.id) {
            p.key = property.key;
            p.category = property.category;
          }
        });
      }
    });
    setBaseComponents(newBaseComponents);
  };

  const deleteBaseComponent = (componentId) => {
    setOpen(true);
    deleteBaseComponentRequest(componentId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Base component successfully deleted.', { variant: 'success' });
          removeBaseComponentFromState(componentId);
          if (baseComponentModalProps.open) {
            setBaseComponentModalProps({
              ...baseComponentModalProps,
              open: false,
              baseComponent: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
  };

  const removePropertyFromState = (propertyId, componentId) => {
    const newBaseComponents = [...baseComponents];
    newBaseComponents.forEach((c) => {
      if (componentId === c.id) {
        c.properties.forEach((p, i) => {
          if (p.id === propertyId) {
            c.properties.splice(i, 1);
          }
        });
      }
    });
    setBaseComponents(newBaseComponents);
  };

  const deleteBaseProperty = (propertyId, componentId) => {
    setOpen(true);
    deleteBasePropertyRequest(propertyId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Base property successfully deleted.', { variant: 'success' });
          removePropertyFromState(propertyId, componentId);
          if (basePropertyModalProps.open) {
            setBasePropertyModalProps({
              ...basePropertyModalProps,
              open: false,
              baseProperty: {},
              initialProperty: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
  };

  const componentActionHandler = (actionType, baseComponent) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Warning: deleting this base component will also delete existing component instances and associated properties. Proceed?',
          actionModalHandler: () => deleteBaseComponent(baseComponent.id)
        });
        break;
      case 'new':
        setBaseComponentModalProps({
          open: true,
          actionType,
          baseComponent: {}
        });
        break;
      case 'edit':
      case 'view':
        setBaseComponentModalProps({
          open: true,
          actionType,
          baseComponent
        });
        break;
      default:
        console.error('No action defined for this handler.');
    }
  };

  const propertyActionHandler = (actionType, baseProperty) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Warning: deleting this base property is definitive. Proceed?',
          actionModalHandler: () => deleteBaseProperty(
            baseProperty.id,
            baseProperty.component_base_id
          )
        });
        break;
      case 'new':
      case 'edit':
      case 'view':
        setBasePropertyModalProps({
          open: true,
          actionType,
          baseProperty,
          initialProperty: baseProperty
        });
        break;
      default:
        console.error('No action defined for this handler.');
    }
  };

  const baseComponentActionModalHandler = (actionType, newBaseComponent) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Warning: deleting this base component will also delete existing component instances and associated properties. Proceed?',
          actionModalHandler: () => deleteBaseComponent(baseComponentModalProps.baseComponent.id)
        });
        break;
      case 'new':
        saveNewBaseComponent(newBaseComponent);
        break;
      case 'edit':
        saveExistingBaseComponent(newBaseComponent);
        break;
      default:
        console.error('No action defined for this handler.');
    }
  };

  const saveProperty = (newProperty) => {
    return savePropertyRequest(newProperty)
      .then((data) => {
        return data.success;
      })
      .catch(() => { return false; });
  };

  const createPropInstances = async (newBaseProperty) => {
    const baseComponent = (
      baseComponents.filter((b) => b.id === newBaseProperty.component_base_id)
    )[0];

    if (baseComponent) {
      const queries = [];
      baseComponent.instances.forEach((inst) => {
        queries.push(saveProperty({
          component_id: inst.id,
          key: newBaseProperty.key,
          value: 'Unknown',
          category: newBaseProperty.category
        }));
      });

      const results = await Promise.all(queries);
      const countSuccess = results.reduce((acc, comp) => acc + comp, 0);
      if (countSuccess === baseComponent.instances.length) {
        enqueueSnackbar('Base property successfully instanciated to related components.', { variant: 'success' });
      } else {
        enqueueSnackbar('Warning: base property was not added to all component instances: the property might already exist for them.', { variant: 'warning' });
      }
    }
  };

  const saveNewBaseProperty = async (newBaseProperty, isAddPropToInstCheck) => {
    setOpen(true);
    return saveNewBasePropertyRequest(newBaseProperty)
      .then(async (data) => {
        if (data.success) {
          enqueueSnackbar('Base property successfully added.', { variant: 'success' });

          if (isAddPropToInstCheck) {
            await createPropInstances(newBaseProperty);
          }

          const newBaseComponents = [...baseComponents];
          newBaseComponents.forEach((b) => {
            if (b.id === newBaseProperty.component_base_id) {
              b.properties.push({
                ...newBaseProperty,
                id: data.propertyId
              });
            }
          });
          if (basePropertyModalProps.open) {
            setBasePropertyModalProps({
              ...basePropertyModalProps,
              open: false,
              baseProperty: {},
              initialProperty: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      })
      .finally(() => setOpen(false));
  };

  const modifyPropInstances = async (initialProperty, newBaseProperty) => {
    const baseComponent = (
      baseComponents.filter((b) => b.id === newBaseProperty.component_base_id)
    )[0];
    baseComponent.instances.forEach((inst) => {
      getInstancePropertiesFromComponentRequest(inst.id).then((res) => {
        res.result.forEach((prop) => {
          if (prop.key === initialProperty.key && prop.category === initialProperty.category) {
            modifyPropertyRequest({
              ...prop,
              key: newBaseProperty.key,
              category: newBaseProperty.category
            });
          }
        });
      });
    });
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

  const saveExistingBaseProperty = async (
    newBaseProperty, initialProperty, isAddPropToInstCheck
  ) => {
    setOpen(true);
    saveExistingBasePropertyRequest(newBaseProperty)
      .then(async (data) => {
        if (data.success) {
          enqueueSnackbar('Base property successfully modified.', { variant: 'success' });

          if (isAddPropToInstCheck) {
            await modifyPropInstances(initialProperty, newBaseProperty);
          }

          modifyPropertyFromState(newBaseProperty);
          if (basePropertyModalProps.open) {
            setBasePropertyModalProps({
              ...basePropertyModalProps,
              open: false,
              baseProperty: {},
              initialProperty: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.toString(), { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
  };

  const basePropertyActionModalHandler = (
    actionType, newBaseProperty, initialProperty, isAddPropToInstCheck
  ) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Warning: deleting this base component will also delete existing component instances and associated properties. Proceed?',
          actionModalHandler: () => deleteBaseProperty(
            newBaseProperty.id,
            newBaseProperty.component_base_id
          )
        });
        break;
      case 'new':
        saveNewBaseProperty(newBaseProperty, isAddPropToInstCheck);
        break;
      case 'edit':
        saveExistingBaseProperty(newBaseProperty, initialProperty, isAddPropToInstCheck);
        break;
      default:
        console.error('No action defined for this handler.');
    }
  };

  useEffect(() => {
    fetchComponentData();
  }, []);

  useEffect(() => {
    filterAutocomplete();
  }, [baseComponents]);

  return (
    <Page title="Base components" className={classes.root}>
      <Container maxWidth={false}>
        <Box
          mt={3}
        >
          <Button
            className={classes.buttonMargin}
            color="primary"
            variant="contained"
            onClick={() => componentActionHandler('new')}
          >
            Add base component
          </Button>
          <Button
            variant="outlined"
            onClick={() => setQuestionModalProps({
              ...questionModalProps,
              open: true,
              context: {}
            })}
          >
            Ask question about base components
          </Button>
        </Box>
        <Box mt={3}>
          <Card>
            <CardContent>
              <BaseComponentInput
                baseComponents={baseComponents}
                handleAutocompleteChange={handleAutocompleteChange}
                inputVariant="outlined"
              />
              <Box mt={3}>
                <BaseComponentTable
                  rows={displayedComponents}
                  componentActionHandler={componentActionHandler}
                  propertyActionHandler={propertyActionHandler}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <BaseComponentModal
          modalProps={baseComponentModalProps}
          setModalProps={setBaseComponentModalProps}
          actionModalHandler={baseComponentActionModalHandler}
        />
        <BasePropertyModal
          modalProps={basePropertyModalProps}
          setModalProps={setBasePropertyModalProps}
          actionModalHandler={basePropertyActionModalHandler}
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
        <LoadingOverlay open={open} />
      </Container>
    </Page>
  );
}
