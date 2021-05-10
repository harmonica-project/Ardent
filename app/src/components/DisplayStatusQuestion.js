import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';

const DisplayStatusQuestion = ({ status }) => {
  switch (parseInt(status, 10)) {
    case 0:
      return <Chip color="primary" label="Just posted" />;

    case 1:
      return <Chip style={{ backgroundColor: 'lightblue', color: 'black' }} label="Answered" />;

    case 2:
      return <Chip style={{ backgroundColor: 'green', color: 'white' }} label="Closed" />;

    default:
      return <Chip label="Unknown" />;
  }
};

DisplayStatusQuestion.propTypes = {
  status: PropTypes.number.isRequired
};

export default DisplayStatusQuestion;
