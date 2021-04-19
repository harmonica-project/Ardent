import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  avatar: {
    backgroundColor: '#6573c3',
    height: 56,
    width: 56
  },
  link: {
    paddingTop: theme.spacing(1)
  }
}));

const ComponentSummary = ({ className, nbComponents }) => {
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
              BASE COMPONENTS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {nbComponents}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <DeveloperBoardIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Typography className={classes.link}>
          <NavLink to="/app/components">
            Go to components
          </NavLink>
        </Typography>
      </CardContent>
    </Card>
  );
};

ComponentSummary.propTypes = {
  className: PropTypes.string,
  nbComponents: PropTypes.number
};

export default ComponentSummary;
