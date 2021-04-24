import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { NavLink } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import reduceLongText from 'src/utils/reduceLongText';
import TableActionCell from 'src/components/TableActionCell';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name', center: true, label: 'Name'
  },
  {
    id: 'base_description', center: false, label: 'Base description'
  },
  {
    id: 'occurences', center: true, label: 'Occurences'
  },
  {
    id: 'proportion', center: true, label: 'Proportion (%)'
  },
  {
    id: 'actions', center: true, label: 'Actions'
  },
];

function BaseComponentsTableHead(props) {
  const {
    classes, order, orderBy, onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.center ? 'center' : 'right'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={orderBy !== headCell.id}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

BaseComponentsTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function Row({
  isItemSelected,
  row,
  handleClick,
  componentActionHandler,
  propertyActionHandler
}) {
  const [open, setOpen] = React.useState(false);
  const disableDelete = (() => {
    if (!localStorage.getItem('danger') || localStorage.getItem('danger') === 'false') return true;
    return false;
  })();

  const displayNoInstances = () => {
    return (
      <Typography variant="h6" color="textSecondary" gutterBottom component="div">
        No instances yet.
      </Typography>
    );
  };

  const displayNoProperties = () => {
    return (
      <Typography variant="h6" color="textSecondary" gutterBottom component="div">
        No properties yet.
      </Typography>
    );
  };

  const displayInstancesTable = () => {
    return (
      <Table size="small" aria-label="architectures">
        <TableHead>
          <TableRow>
            <TableCell>Paper</TableCell>
            <TableCell>Architecture</TableCell>
            <TableCell>Component</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.instances.map((instance) => (
            <TableRow key={instance.architecture_id}>
              <TableCell
                style={{ cursor: 'pointer' }}
              >
                <NavLink to="/app/papers">
                  { reduceLongText(instance.paper_name, 30) }
                </NavLink>
              </TableCell>
              <TableCell
                style={{ cursor: 'pointer' }}
              >
                <NavLink to={`/app/architecture/${instance.architecture_id}`}>
                  { instance.architecture_name }
                </NavLink>
              </TableCell>
              <TableCell
                style={{ cursor: 'pointer' }}
              >
                <NavLink to={`/app/component/${instance.id}`}>
                  View
                </NavLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const displayPropertiesTable = () => {
    return (
      <Table size="small" aria-label="architectures">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.properties.map((instance) => (
            <TableRow key={instance.architecture_id}>
              <TableCell>
                {instance.key}
              </TableCell>
              <TableCell>
                {instance.category}
              </TableCell>
              <TableCell align="center">
                <TableActionCell
                  actionHandler={propertyActionHandler}
                  item={instance}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.name)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" id={row.id} scope="row" align="center">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.base_description}</TableCell>
        <TableCell align="center">{row.occurences}</TableCell>
        <TableCell align="center">
          {row.proportion}
          %
        </TableCell>
        <TableCell align="center">
          <TableActionCell
            actionHandler={componentActionHandler}
            item={row}
            disableDelete={disableDelete}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container>
              <Grid item>
                <Box style={{ padding: 20 }}>
                  <Paper style={{ padding: 20 }}>
                    <Box display="flex">
                      <Box width="100%" style={{ marginBottom: '10px' }}>
                        <Typography variant="h6" color="textSecondary" component="div">
                          BASE PROPERTIES
                        </Typography>
                      </Box>
                      <Box flexShrink={0}>
                        <IconButton
                          style={{ color: '#263238', padding: 0 }}
                          aria-label="add property"
                          component="div"
                          onClick={() => propertyActionHandler('new')}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    { row.properties.length ? displayPropertiesTable() : displayNoProperties() }
                  </Paper>
                </Box>
              </Grid>
              <Grid item>
                <Box style={{ padding: 20 }}>
                  <Paper style={{ padding: 20 }}>
                    <Box width="100%" style={{ marginBottom: '10px' }}>
                      <Typography variant="h6" color="textSecondary" component="div">
                        INSTANCES FOR THIS BASE COMPONENT
                      </Typography>
                    </Box>
                    { row.instances.length ? displayInstancesTable() : displayNoInstances() }
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  isItemSelected: PropTypes.bool,
  row: PropTypes.array,
  handleClick: PropTypes.func,
  componentActionHandler: PropTypes.func,
  propertyActionHandler: PropTypes.func
};

export default function BaseComponentsTable({
  rows, componentActionHandler, propertyActionHandler
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('occurences');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="Base components table"
          >
            <BaseComponentsTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.name);

                  return (
                    <Row
                      isItemSelected={isItemSelected}
                      row={row}
                      handleClick={handleClick}
                      componentActionHandler={componentActionHandler}
                      propertyActionHandler={propertyActionHandler}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

BaseComponentsTable.propTypes = {
  rows: PropTypes.array,
  componentActionHandler: PropTypes.func,
  propertyActionHandler: PropTypes.func
};
