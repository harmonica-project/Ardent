import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box,
  TextField,
  Button
} from '@material-ui/core';
import getInviteTokenRequest from '../../../requests/admin';

const Admin = () => {
  const [inviteToken, setInviteToken] = useState('');

  const getTokenClick = async () => {
    try {
      const data = await getInviteTokenRequest();
      if (data.success) {
        setInviteToken(data.result);
      }
    } catch (error) {
      setInviteToken('Error while retrieving token.');
    }
  };

  const getGenerateButton = () => {
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={getTokenClick}
      >
        &nbsp;Get&nbsp;new&nbsp;invite&nbsp;token&nbsp;
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader
        subheader="User and application administration"
        title="Administration"
      />
      <Divider />
      <CardContent>
        <Box>
          <TextField
            fullWidth
            label="Invite token"
            margin="normal"
            name="inviteToken"
            type="text"
            value={inviteToken}
            variant="outlined"
            InputProps={{ endAdornment: getGenerateButton() }}
            disabled
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Admin;
