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
  saveProperty as savePropertyRequest,
  saveNewBaseProperty as saveNewBasePropertyRequest,
  saveExistingBaseProperty as saveExistingBasePropertyRequest,
  deleteBaseProperty as deleteBasePropertyRequest
} from 'src/requests/properties';
import ConfirmModal from 'src/modals/ConfirmModal';
import BaseComponentModal from 'src/modals/BaseComponentModal';
import BasePropertyModal from 'src/modals/BasePropertyModal';
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
    actionType: ''
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
        enqueueSnackbar(err, { variant: 'error' });
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
      enqueueSnackbar(err, { variant: 'error' });
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
        enqueueSnackbar(err, { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
  };

  const saveNewBaseProperty = (newProperty) => {
    return saveNewBasePropertyRequest(newProperty)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Base property successfully added.', { variant: 'success' });
          const newBaseComponents = [...baseComponents];
          newBaseComponents.forEach((b) => {
            if (b.id === newProperty.component_base_id) {
              b.properties.push({
                ...newProperty,
                id: data.propertyId
              });
            }
          });
          if (basePropertyModalProps.open) {
            setBasePropertyModalProps({
              ...basePropertyModalProps,
              open: false,
              baseProperty: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: 'error' });
      });
  };

  const modifyPropertyFromState = (property) => {
    console.log(property);
    const newBaseComponents = [...baseComponents];
    newBaseComponents.forEach((c) => {
      console.log(c);
      if (property.component_base_id === c.id) {
        c.properties.forEach((p) => {
          console.log(p);
          if (p.id === property.id) {
            p.key = property.key;
            p.category = property.category;
          }
        });
      }
    });
    setBaseComponents(newBaseComponents);
  };

  const saveExistingBaseProperty = (newProperty) => {
    setOpen(true);
    saveExistingBasePropertyRequest(newProperty)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Base property successfully modified.', { variant: 'success' });
          modifyPropertyFromState(newProperty);
          if (basePropertyModalProps.open) {
            setBasePropertyModalProps({
              ...basePropertyModalProps,
              open: false,
              baseProperty: {},
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: 'error' });
      })
      .finally(() => { setOpen(false); });
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
        enqueueSnackbar(err, { variant: 'error' });
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
              actionType: ''
            });
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: 'error' });
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
          baseProperty
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

  const basePropertyActionModalHandler = (actionType, newBaseProperty, isAddPropToInstCheck) => {
    const queries = [];
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
        setOpen(true);
        queries.push(saveNewBaseProperty(newBaseProperty));
        if (isAddPropToInstCheck) {
          queries.push(createPropInstances(newBaseProperty));
        }
        Promise.all(queries).then(() => setOpen(false));
        break;
      case 'edit':
        saveExistingBaseProperty(newBaseProperty);
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
      <Button onClick={() => enqueueSnackbar('test')}>Test</Button>
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
        <LoadingOverlay open={open} />
      </Container>
    </Page>
  );
}
