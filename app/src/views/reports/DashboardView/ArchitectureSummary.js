import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  avatar: {
    backgroundColor: '#6573c3',
    height: 56,
    width: 56
  }
}));

const ArchitectureSummary = ({ className, nbArchitectures }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              ARCHITECTURES
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {nbArchitectures}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AccountTreeIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ArchitectureSummary.propTypes = {
  className: PropTypes.string,
  nbArchitectures: PropTypes.number
};

export default ArchitectureSummary;
