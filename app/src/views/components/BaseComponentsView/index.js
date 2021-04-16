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
  saveNewBaseComponent as saveNewBaseComponentRequest
} from 'src/requests/components';
import BaseComponentInput from './BaseComponentsInput';
import BaseComponentTable from './BaseComponentsTable';
import BaseComponentModal from './BaseComponentModal';

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
  const [open, setOpen] = useState(false);
  const [messageSnackbarProps, setMessageSnackbarProps] = useState({
    open: false,
    message: '',
    duration: 0,
    severity: 'information'
  });

  const [baseComponentModalProps, setBaseComponentModalProps] = useState({
    open: false,
    baseComponent: {},
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
    console.log(value);
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

  const formatToBaseComponent = (components) => {
    const newBaseComponents = [];
    const componentToEntry = {};
    const nbInstances = components.length;

    components.forEach((c) => {
      if (!componentToEntry[c.base_component_name]) {
        componentToEntry[c.base_component_name] = newBaseComponents.length;
        newBaseComponents.push({
          id: c.base_component_id,
          name: c.base_component_name,
          base_description: c.base_description,
          occurences: 0,
          proportion: ((0 / nbInstances) * 100).toFixed(2),
          instances: []
        });
      }
      if (c.instance_component_id) {
        const instance = {
          architecture_id: c.architecture_id,
          architecture_name: c.architecture_name,
          paper_id: c.paper_id,
          paper_name: c.paper_name,
          instance_component_id: c.instance_component_id
        };
        const entry = newBaseComponents[componentToEntry[c.base_component_name]];
        entry.instances.push(instance);
        entry.occurences++;
        entry.proportion = ((entry.occurences / nbInstances) * 100).toFixed(2);
      }
    });

    return newBaseComponents;
  };

  const fetchComponentData = async () => {
    try {
      const compRes = await getFullComponentsRequest();

      if (compRes.success) {
        const newBaseComponents = formatToBaseComponent(compRes.result);
        setBaseComponents(newBaseComponents);
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

  const componentActionHandler = (actionType, baseComponent) => {
    switch (actionType) {
      case 'delete':
        if (window.confirm('Warning: deleting this base component will also delete existing component instances and associated properties. Proceed?')) {
          deleteBaseComponent(baseComponent.id);
        }
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

  const baseComponentActionModalHandler = (actionType, newBaseComponent) => {
    switch (actionType) {
      case 'delete':
        if (window.confirm('Warning: deleting this base component will also delete existing component instances and associated properties. Proceed?')) {
          deleteBaseComponent(baseComponentModalProps.baseComponent.id);
        }
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

  useEffect(() => {
    fetchComponentData();
  }, []);

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
                  rows={baseComponents}
                  componentActionHandler={componentActionHandler}
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
        <LoadingOverlay open={open} />
      </Container>
    </Page>
  );
}
