import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  makeStyles,
  Breadcrumbs
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    marginBottom: theme.spacing(3),
  }
}));

const AppBreadcrumb = ({ paperId, architectureId, componentId }) => {
  const classes = useStyles();

  const reduceUUID = (uuid) => { return uuid.substring(0, 8); };

  const displayPaperLink = () => {
    return (
      <Link color="inherit" to="/app/papers">
        Paper #
        {reduceUUID(paperId)}
      </Link>
    );
  };

  const displayArchitectureLink = () => {
    return (
      <Link
        color="textPrimary"
        to={`/app/architecture/${architectureId}`}
        aria-current="page"
      >
        Architecture #
        {reduceUUID(architectureId)}
      </Link>
    );
  };

  const displayComponentLink = () => {
    return (
      <Link
        color="textPrimary"
        to={`/app/architecture/${componentId}`}
        aria-current="page"
      >
        Component #
        {reduceUUID(componentId)}
      </Link>
    );
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
      <Link color="inherit" to="/app/dashboard">
        Home
      </Link>
      {paperId ? displayPaperLink() : ''}
      {architectureId ? displayArchitectureLink() : ''}
      {componentId ? displayComponentLink() : ''}
    </Breadcrumbs>
  );
};

AppBreadcrumb.propTypes = {
  paperId: PropTypes.string,
  architectureId: PropTypes.string,
  componentId: PropTypes.string
};

export default AppBreadcrumb;
