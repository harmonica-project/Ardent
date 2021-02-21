import React from 'react';
import PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateIcon from '@material-ui/icons/Create';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Box } from '@material-ui/core';

const TableActionCell = ({
  viewAction, editAction, deleteAction, id
}) => {
  const handleViewAction = () => {
    viewAction(id);
  };
  const handleEditAction = () => {
    editAction(id);
  };
  const handleDeleteAction = () => {
    deleteAction(id);
  };
  return (
    <Box style={{ cursor: 'select' }}>
      <VisibilityIcon onClick={handleViewAction} />
      <CreateIcon onClick={handleEditAction} />
      <HighlightOffIcon onClick={handleDeleteAction} />
    </Box>
  );
};

TableActionCell.propTypes = {
  id: PropTypes.string.isRequired,
  viewAction: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired
};

export default TableActionCell;
