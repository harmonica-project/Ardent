import React, { useState, useEffect } from 'react';
import {
  Container, Box, Card, CardContent, makeStyles, Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import {
  getBaseComponents as getBaseComponentsRequest,
  getComponentsInstances as getComponentsInstancesRequest
} from '../../../requests/component';
import BaseComponentInput from './BaseComponentsInput';
import BaseComponentTable from './BaseComponentsTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  buttonMargin: {
    marginRight: theme.spacing(1),
  }
}));

export default function BaseComponentsView() {
  const classes = useStyles();
  const [baseComponents, setBaseComponents] = useState([]);
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

  const handleAutocompleteChange = (value) => {
    console.log(value);
  };

  const componentActionHandler = (actionType, baseComponent) => {
    console.log(actionType, baseComponent);
  };

  const enhanceBaseComponents = (bc, ic) => {
    bc.forEach((b, index) => {
      bc[index] = {
        ...b, occurences: 0, proportion: 0.0, instances: []
      };
      ic.forEach((i) => {
        if (i.name === b.name) {
          bc[index].occurences++;
          bc[index].instances.push(i);
        }
      });
    });

    bc.forEach((b, index) => {
      bc[index].proportion = ((bc[index].occurences / ic.length) * 100).toFixed(2);
    });

    console.log(bc);
    return bc;
  };

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const baseCompRes = await getBaseComponentsRequest();
        const instCompRes = await getComponentsInstancesRequest();

        if (baseCompRes.success && instCompRes.success) {
          const newBaseComponents = enhanceBaseComponents(baseCompRes.result, instCompRes.result);
          setBaseComponents(newBaseComponents);
        }
      } catch (error) {
        handleErrorRequest(error, displayMsg);
      }
    };

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
      </Container>
    </Page>
  );
}
