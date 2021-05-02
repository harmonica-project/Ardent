import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  makeStyles,
  Grid,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import PaperAutocomplete from './PaperAutocomplete';

const useStyles = makeStyles((theme) => ({
  root: {},
  marginButton: {
    marginRight: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

const Toolbar = ({
  setTitleFilter, stateSelect, setStateSelect, actionHandler, papers, className, ...rest
}) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid
        container
      >
        <Grid item xs={12}>
          <Box mb={3}>
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
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={9}>
                  <PaperAutocomplete
                    papers={papers}
                    changeHandler={setTitleFilter}
                    label="Search paper"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" style={{ width: '100%' }}>
                    <Select
                      labelId="state-select"
                      id="state-select"
                      value={stateSelect}
                      onChange={(e) => setStateSelect(e.target.value)}
                      displayEmpty
                      className={classes.selectEmpty}
                      style={{ marginTop: 0, marginLeft: 15 }}
                    >
                      <MenuItem disabled value={-1}>
                        Filter by state ...
                      </MenuItem>
                      <MenuItem value={-1}>All</MenuItem>
                      <MenuItem value={0}>Just added</MenuItem>
                      <MenuItem value={1}>In progress</MenuItem>
                      <MenuItem value={2}>Done</MenuItem>
                      <MenuItem value={3}>Need help</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  papers: PropTypes.array.isRequired,
  stateSelect: PropTypes.number.isRequired,
  setStateSelect: PropTypes.func.isRequired,
  setTitleFilter: PropTypes.func.isRequired,
  actionHandler: PropTypes.func.isRequired
};

export default Toolbar;
