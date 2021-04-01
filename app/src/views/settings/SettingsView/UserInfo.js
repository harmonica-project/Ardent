import React from 'react';
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
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const UserInfo = ({ className, ...rest }) => {
  const classes = useStyles();

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
                label="First name"
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Last name"
                margin="normal"
                variant="outlined"
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
          >
            Save
          </Button>
        </Box>
      </Card>
    </form>
  );
};

UserInfo.propTypes = {
  className: PropTypes.string
};

export default UserInfo;
