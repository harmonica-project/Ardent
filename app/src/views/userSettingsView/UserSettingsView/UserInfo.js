import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  Divider,
  makeStyles,
  FormControlLabel,
  Switch
} from '@material-ui/core';

const useStyles = makeStyles(({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const UserInfo = ({
  user, setUser, actionUserHandler, className, ...rest
}) => {
  const classes = useStyles();
  const [danger, setDanger] = useState(() => {
    if (!localStorage.getItem('danger') || localStorage.getItem('danger') === 'false') return false;
    return true;
  });

  const handleInputChange = (key, value) => {
    setUser({
      ...user,
      [key]: value
    });
  };

  const handleDangerousSwitch = () => {
    if (danger) {
      localStorage.setItem('danger', false);
    } else {
      localStorage.setItem('danger', true);
    }
    setDanger(!danger);
  };
  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Manage your personal information"
          title="User profile"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                defaultValue={user.username ? user.username : ''}
                disabled
              />
              <TextField
                fullWidth
                label="First name"
                margin="normal"
                defaultValue={user.first_name ? user.first_name : ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Last name"
                margin="normal"
                defaultValue={user.last_name ? user.last_name : ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Role"
                margin="normal"
                defaultValue={user.role ? user.role : ''}
                onChange={(e) => handleInputChange('role', e.target.value)}
                variant="outlined"
              />
              <FormControlLabel
                style={{ marginTop: '5px' }}
                control={<Switch checked={danger} onChange={handleDangerousSwitch} />}
                label="Activate dangerous features"
              />
            </Grid>
            <Grid item xs={3}>
              Avatar input to come
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={actionUserHandler}
          >
            Save
          </Button>
        </Box>
      </Card>
    </form>
  );
};

UserInfo.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    username: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    role: PropTypes.string
  }),
  actionUserHandler: PropTypes.func,
  setUser: PropTypes.func
};

export default UserInfo;
