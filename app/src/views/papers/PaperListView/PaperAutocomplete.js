import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export default function PaperAutocomplete({
  papers, changeHandler, label, variant, error, helperText
}) {
  const [inputValue, setInputValue] = useState('');
  const options = papers.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option
    };
  });

  return (
    <Autocomplete
      id="papers"
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.name}
      style={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant={variant}
          error={error}
          helperText={helperText}
        />
      )}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        changeHandler(newInputValue);
      }}
    />
  );
}

PaperAutocomplete.propTypes = {
  papers: PropTypes.array,
  changeHandler: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string
};
