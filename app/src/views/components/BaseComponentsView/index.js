import React, { useState, useEffect } from 'react';
import {
  Container, Box, Card, CardContent
} from '@material-ui/core';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import {
  getBaseComponents as getBaseComponentsRequest,
  getComponentsInstances as getComponentsInstancesRequest
} from '../../../requests/component';
import BaseComponentInput from './BaseComponentsInput';
import BaseComponentTable from './BaseComponentsTable';

export default function BaseComponentsView() {
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

  const enhanceBaseComponents = (bc, ic) => {
    bc.forEach((b, index) => {
      bc[index] = { ...b, occurences: 0, proportion: 0.0 };
      ic.forEach((i) => {
        if (i.name === b.name) {
          bc[index].occurences++;
        }
      });
    });

    bc.forEach((b, index) => {
      bc[index].proportion = ((bc[index].occurences / ic.length) * 100).toFixed(2);
    });
    return bc;
  };

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const baseCompRes = (await getBaseComponentsRequest()).data;
        const instCompRes = (await getComponentsInstancesRequest()).data;

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
    <Container maxWidth={false}>
      <Box mt={3}>
        <Card>
          <CardContent>
            <BaseComponentInput
              baseComponents={baseComponents}
              handleAutocompleteChange={handleAutocompleteChange}
              inputVariant="outlined"
            />
            <Box mt={3}>
              <BaseComponentTable rows={baseComponents} />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <MessageSnackbar
        messageSnackbarProps={messageSnackbarProps}
        setMessageSnackbarProps={setMessageSnackbarProps}
      />
    </Container>
  );
}
