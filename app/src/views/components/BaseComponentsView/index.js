import React, { useState, useEffect } from 'react';
import {
  Container, Box, Card, CardContent
} from '@material-ui/core';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import { getBaseComponents as getBaseComponentsRequest } from '../../../requests/component';
import BaseComponentInput from './BaseComponentsInput';

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

  useEffect(() => {
    getBaseComponentsRequest()
      .then(({ data }) => {
        if (data.success) {
          setBaseComponents(data.result);
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
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
