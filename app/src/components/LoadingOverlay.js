import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import loading from 'src/images/loading.gif';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: '2000'
  },
  image: {
    width: '5%',
    height: 'auto'
  }
});

export default function LoadingOverlay({ open }) {
  const classes = useStyles(open);

  return (
    open ? (
      <Grid
        className={classes.overlay}
        container
        spacing={0}
        align="center"
        justify="center"
        direction="column"
      >
        <Grid item>
          <img className={classes.image} src={loading} alt="loading..." />
        </Grid>
      </Grid>
    ) : (<div />)
  );
}

LoadingOverlay.propTypes = {
  open: PropTypes.bool
};
