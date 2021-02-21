import React from 'react';
import {
  Box,
  Button,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  boxMargin: {
    marginBottom: theme.spacing(2)
  }
}));

const SubToolbar = () => {
  const classes = useStyles();

  return (
    <Box display="flex" className={classes.boxMargin}>
      <Box width="100%">
        <Typography variant="h6" color="textSecondary" gutterBottom component="div">
          PAPER ARCHITECTURES
        </Typography>
      </Box>
      <Box flexShrink={0}>
        <Button
          color="primary"
          variant="contained"
        >
          Add architecture
        </Button>
      </Box>
    </Box>
  );
};

export default SubToolbar;
