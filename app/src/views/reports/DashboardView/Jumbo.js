import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  makeStyles,
  Typography
} from '@material-ui/core';
import { useProject } from '../../../project-context';

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px'
  }
}));

const Jumbo = ({ className }) => {
  const classes = useStyles();
  const {
    state: { project },
  } = useProject();

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Typography variant="h1" component="div" gutterBottom>
          { project.name }
        </Typography>
        <Typography variant="body1">
          {
            project.description.length
              ? project.description
              : 'There is no description for this project.'
          }
        </Typography>
      </CardContent>
    </Card>
  );
};

Jumbo.propTypes = {
  className: PropTypes.string
};

export default Jumbo;
