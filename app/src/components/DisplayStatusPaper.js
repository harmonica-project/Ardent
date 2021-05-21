import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';

const DisplayStatusPaper = ({ status }) => {
  switch (parseInt(status, 10)) {
    case 0:
      return <Chip color="primary" label="Just added" />;

    case 1:
      return <Chip style={{ backgroundColor: 'orange' }} label="In progress" />;

    case 2:
      return <Chip style={{ backgroundColor: 'green', color: 'white' }} label="Done" />;

    case 3:
      return <Chip style={{ backgroundColor: '#6d27b3', color: 'white' }} label="Need help" />;

    case 4:
      return <Chip style={{ backgroundColor: 'red', color: 'white' }} label="Rejected" />;

    default:
      return <Chip label="Unknown" />;
  }
};

DisplayStatusPaper.propTypes = {
  status: PropTypes.number.isRequired
};

export default DisplayStatusPaper;
