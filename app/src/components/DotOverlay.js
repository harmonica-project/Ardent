import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Graphviz } from 'graphviz-react';
import { useSnackbar } from 'notistack';

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

export default function LoadingOverlay({ open, graph, setOpen }) {
  const classes = useStyles(open);
  const { enqueueSnackbar } = useSnackbar();

  const isEmptyGraph = (newGraph) => {
    const emptyGraph = 'strict digraph {\n}\n';
    if (!newGraph || !newGraph.length || emptyGraph === newGraph) return true;
    return false;
  };

  useEffect(() => {
    if (isEmptyGraph(graph) && open) {
      setOpen(false);
      enqueueSnackbar('This architecture does not contain any component to display yet. Add some components and try again later.', { variant: 'info' });
    }
  }, [open, graph]);

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
        <Grid item onClick={() => setOpen(false)}>
          <Graphviz dot={graph} />
        </Grid>
      </Grid>
    ) : (<div />)
  );
}

LoadingOverlay.propTypes = {
  open: PropTypes.bool,
  graph: PropTypes.string,
  setOpen: PropTypes.func
};
