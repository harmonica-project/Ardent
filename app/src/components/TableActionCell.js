import React from 'react';
import PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Box } from '@material-ui/core';

const TableActionCell = ({
  actionHandler, id
}) => {
  return (
    <Box style={{ cursor: 'select' }}>
      <VisibilityIcon onClick={() => actionHandler('view', id)} />
      <CreateIcon onClick={() => actionHandler('edit', id)} />
      <HighlightOffIcon onClick={() => actionHandler('delete', id)} />
    </Box>
  );
};

TableActionCell.propTypes = {
  id: PropTypes.string.isRequired,
  actionHandler: PropTypes.func.isRequired
};

export default TableActionCell;
