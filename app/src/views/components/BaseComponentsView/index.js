import React, { useState, useEffect } from 'react';
import {
  Container, Box, Card, CardContent, makeStyles, Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import LoadingOverlay from 'src/components/LoadingOverlay';
import {
  getFullComponents as getFullComponentsRequest,
  deleteBaseComponent as deleteBaseComponentRequest,
  saveExistingBaseComponent as saveExistingBaseComponentRequest,
  saveNewBaseComponent as saveNewBaseComponentRequest,
} from 'src/requests/components';
import {
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
  const [baseComponents, setBaseComponents] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [open, setOpen] = useState(false);
  const [displayedComponents, setDisplayedComponents] = useState([]);
  const [messageSnackbarProps, setMessageSnackbarProps] = useState({
    open: false,
    message: '',
    duration: 0,
    severity: 'information'
  });

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

  const displayMsg = (message, severity = 'success', duration = 6000) => {
    setMessageSnackbarProps({
      open: true,
      severity,
      duration,
      message
    });
  };

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
          displayMsg('Base component successfully modified.');
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
        handleErrorRequest(err, displayMsg);
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
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    } finally {
      setOpen(false);
    }
  };

  const saveNewBaseComponent = (newComponent) => {
    setOpen(true);
    saveNewBaseComponentRequest(newComponent)
      .then((data) => {
        if (data.success) {
          displayMsg('Base component successfully added.');
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
        handleErrorRequest(err, displayMsg);
      })
      .finally(() => { setOpen(false); });
  };

  const saveNewBaseProperty = (newProperty) => {
    setOpen(true);
    saveNewBasePropertyRequest(newProperty)
      .then((data) => {
        if (data.success) {
          displayMsg('Base property successfully added.');
          fetchComponentData();
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
        handleErrorRequest(err, displayMsg);
      })
      .finally(() => { setOpen(false); });
  };

  const saveExistingBaseProperty = (newProperty) => {
    setOpen(true);
    saveExistingBasePropertyRequest(newProperty)
      .then((data) => {
        if (data.success) {
          displayMsg('Base property successfully modified.');
          fetchComponentData();
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
        handleErrorRequest(err, displayMsg);
      })
      .finally(() => { setOpen(false); });
  };

  const deleteBaseComponent = (componentId) => {
    setOpen(true);
    deleteBaseComponentRequest(componentId)
      .then((data) => {
        if (data.success) {
          displayMsg('Base component successfully deleted.');
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
        handleErrorRequest(err, displayMsg);
      })
      .finally(() => { setOpen(false); });
  };

  const deleteBaseProperty = (propertyId) => {
    setOpen(true);
    deleteBasePropertyRequest(propertyId)
      .then((data) => {
        if (data.success) {
          displayMsg('Base property successfully deleted.');
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
        handleErrorRequest(err, displayMsg);
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
          actionModalHandler: () => deleteBaseProperty(baseProperty.id)
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

  const basePropertyActionModalHandler = (actionType, newBaseProperty) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Warning: deleting this base component will also delete existing component instances and associated properties. Proceed?',
          actionModalHandler: () => deleteBaseProperty(newBaseProperty.id)
        });
        break;
      case 'new':
        saveNewBaseProperty(newBaseProperty);
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
        <MessageSnackbar
          messageSnackbarProps={messageSnackbarProps}
          setMessageSnackbarProps={setMessageSnackbarProps}
        />
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
