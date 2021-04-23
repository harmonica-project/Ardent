import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { NavLink } from 'react-router-dom';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TableActionCell from '../../../components/TableActionCell';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    count, page, rowsPerPage, onChangePage
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    }
  },
});

function Row({
  row, connectionActionHandler, architectureComponents
}) {
  const classes = useRowStyles();

  const formatComponentId = (componentId) => {
    for (let i = 0; i < architectureComponents.length; i++) {
      if (componentId === architectureComponents[i].id) {
        return (
          <NavLink to={`/app/component/${componentId}`}>
            { architectureComponents[i].name }
          </NavLink>
        );
      }
    }

    return componentId;
  };

  return (
    <>
      <TableRow className={classes.root} key={row.id}>
        <TableCell align="center">{formatComponentId(row.first_component)}</TableCell>
        <TableCell align="center">{formatComponentId(row.second_component)}</TableCell>
        <TableCell align="center"><TableActionCell item={row} actionHandler={connectionActionHandler} /></TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    first_component: PropTypes.string,
    second_component: PropTypes.string,
  }),
  connectionActionHandler: PropTypes.func,
  architectureComponents: PropTypes.array
};

export default function ConnectionsTable({
  connections, connectionActionHandler, architectureComponents
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">First component</TableCell>
            <TableCell align="center">Second component</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {connections.map((con) => (
            <Row
              key={con.id}
              row={con}
              connectionActionHandler={connectionActionHandler}
              architectureComponents={architectureComponents}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ConnectionsTable.propTypes = {
  connections: PropTypes.array.isRequired,
  connectionActionHandler: PropTypes.func,
  architectureComponents: PropTypes.array
};
