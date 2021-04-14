import React from 'react';
import PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Box } from '@material-ui/core';

const TableActionCell = ({
  actionHandler, item, disableDelete
}) => {
  return (
    <Box style={{ cursor: 'pointer' }}>
      <VisibilityIcon onClick={() => actionHandler('view', item)} />
      <CreateIcon onClick={() => actionHandler('edit', item)} />
      <span hidden={disableDelete}>
        <HighlightOffIcon onClick={() => actionHandler('delete', item)} />
      </span>
    </Box>
  );
};

TableActionCell.propTypes = {
  item: PropTypes.objectOf(PropTypes.any),
  actionHandler: PropTypes.func.isRequired,
  disableDelete: PropTypes.bool
};

export default TableActionCell;
