import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: '#6573c3',
    height: 56,
    width: 56
  }
}));

const StudyProgress = ({ className, papers }) => {
  const classes = useStyles();

  const getSumFinishedPapers = () => {
    let counter = 0;

    for (let i = 0; i < papers.length; i++) {
      if (papers[i].status === 2) counter++;
    }

    return counter;
  };

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
              STUDY PROGRESS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {((getSumFinishedPapers() / papers.length) * 100).toFixed(1)}
              %
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress
            value={(getSumFinishedPapers() / papers.length) * 100}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

StudyProgress.propTypes = {
  className: PropTypes.string,
  papers: PropTypes.array
};

export default StudyProgress;
