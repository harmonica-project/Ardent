import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import {
  TextField
} from '@material-ui/core';

export default function BaseComponentInput({
  baseComponents, handleAutocompleteChange, disabled, defaultValue, helperText, inputVariant, error
}) {
  const options = baseComponents.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option
    };
  });

  return (
    <Autocomplete
      id="name-field-autocomplete"
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => { return (option.name ? option.name : ''); }}
      defaultValue={defaultValue}
      label="Component name"
      renderInput={(params) => <TextField {...params} variant={inputVariant} error={error} helperText={helperText} onSelect={(e) => handleAutocompleteChange(e.target.value)} id="name-field" label="Component name" />}
      style={{ width: '100%' }}
      disabled={disabled}
      freeSolo
    />
  );
}

BaseComponentInput.propTypes = {
  baseComponents: PropTypes.array,
  handleAutocompleteChange: PropTypes.func,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  helperText: PropTypes.string,
  inputVariant: PropTypes.string,
  error: PropTypes.bool
};
