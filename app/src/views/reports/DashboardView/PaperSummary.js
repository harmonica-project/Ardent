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
import DescriptionIcon from '@material-ui/icons/Description';
import { useProject } from '../../../project-context';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
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

const PaperSummary = ({ className, nbPapers }) => {
  const classes = useStyles();
  const {
    state: { project },
  } = useProject();

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
              PAPERS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {nbPapers}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <DescriptionIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Typography className={classes.link}>
          <NavLink to={`/project/${project.url}/papers`}>
            Go to papers
          </NavLink>
        </Typography>
      </CardContent>
    </Card>
  );
};

PaperSummary.propTypes = {
  className: PropTypes.string,
  nbPapers: PropTypes.number
};

export default PaperSummary;
