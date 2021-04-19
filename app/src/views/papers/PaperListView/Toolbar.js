import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  makeStyles
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {},
  marginButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({
  setTitleFilter, actionHandler, papers, className, ...rest
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const classes = useStyles();
  const options = papers.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option
    };
  });

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
              <Autocomplete
                id="papers"
                options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.name}
                style={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Search paper" variant="outlined" />}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  setTitleFilter(newInputValue);
                }}
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
