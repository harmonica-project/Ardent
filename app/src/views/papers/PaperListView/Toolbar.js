import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  makeStyles
} from '@material-ui/core';
import PaperAutocomplete from './PaperAutocomplete';

const useStyles = makeStyles((theme) => ({
  root: {},
  marginButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({
  setTitleFilter, actionHandler, papers, className, ...rest
}) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
      >
        <Button
          className={classes.marginButton}
          color="primary"
          variant="contained"
          onClick={() => actionHandler('paper')}
        >
          Add paper
        </Button>
        <Button
          className={classes.marginButton}
          color="primary"
          variant="contained"
          onClick={() => actionHandler('bibtex')}
        >
          Add BibTeX
        </Button>
        <Button
          onClick={() => actionHandler('parsifal')}
        >
          Import papers from Parsif.al
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box>
              <PaperAutocomplete
                papers={papers}
                changeHandler={setTitleFilter}
                label="Search paper"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  papers: PropTypes.array.isRequired,
  setTitleFilter: PropTypes.func.isRequired,
  actionHandler: PropTypes.func.isRequired
};

export default Toolbar;
