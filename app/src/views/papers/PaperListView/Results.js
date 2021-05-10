import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { FileCopy as CopyIcon } from '@material-ui/icons';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import reduceLongText from '../../../utils/reduceLongText';
import SubToolbar from './SubToolbar';
import DisplayStatusPaper from '../../../components/DisplayStatusPaper';
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
  row, paperActionHandler, architectureActionHandler, architectureClickHandler, usersMapping
}) {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const displayArchitecturesTable = () => {
    return (
      <Table size="small" aria-label="architectures">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell>Reader description</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.architectures.map((architectureRow) => (
            <TableRow key={architectureRow.id}>
              <TableCell
                style={{ cursor: 'pointer' }}
                onClick={() => architectureClickHandler(architectureRow.id)}
                align="center"
              >
                {architectureRow.name}
              </TableCell>
              <TableCell
                style={{ cursor: 'pointer' }}
                onClick={() => architectureClickHandler(architectureRow.id)}
              >
                {reduceLongText(architectureRow.reader_description, 100)}
              </TableCell>
              <TableCell>
                <Grid container style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Grid item>
                    <TableActionCell
                      item={{ ...architectureRow, paper_id: row.id }}
                      actionHandler={architectureActionHandler}
                    />
                  </Grid>
                  <Grid item style={{ marginLeft: '3px' }}>
                    <CopyIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => architectureActionHandler('clone', { ...architectureRow, paper_id: row.id })}
                    />
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const displayNoArchitecture = () => {
    return (
      <Typography variant="h6" color="textSecondary" gutterBottom component="div">
        No architecture yet.
      </Typography>
    );
  };

  return (
    <>
      <TableRow className={classes.root} key={row.id}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          align="center"
          style={{ wordBreak: 'break-all' }}
        >
          <a href={`https://doi.org/${row.doi}`}>
            {row.doi}
          </a>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="center">{row.authors}</TableCell>
        <TableCell align="center">{usersMapping[row.updated_by]}</TableCell>
        <TableCell align="center"><DisplayStatusPaper status={row.status} /></TableCell>
        <TableCell align="center"><TableActionCell item={row} actionHandler={paperActionHandler} /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box style={{ padding: 20 }}>
              <Paper style={{ padding: 20 }}>
                <SubToolbar
                  architectureActionHandler={architectureActionHandler}
                  paperId={row.id}
                />
                { row.architectures.length ? displayArchitecturesTable() : displayNoArchitecture() }
              </Paper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    doi: PropTypes.string,
    name: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    abstract: PropTypes.string,
    journal: PropTypes.string,
    paper_type: PropTypes.string,
    added_by: PropTypes.string.isRequired,
    updated_by: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    architectures: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        reader_description: PropTypes.string.isRequired,
        author_description: PropTypes.string.isRequired
      }),
    ).isRequired
  }).isRequired,
  paperActionHandler: PropTypes.func.isRequired,
  architectureClickHandler: PropTypes.func.isRequired,
  architectureActionHandler: PropTypes.func.isRequired,
  usersMapping: PropTypes.object.isRequired
};

export default function Results({
  papers, paperActionHandler, architectureActionHandler, architectureClickHandler, users
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generateUserMapping = () => {
    const userMapping = {};
    users.forEach((user) => {
      userMapping[user.username] = `${user.first_name} ${user.last_name}`;
    });
    return userMapping;
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">DOI</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Authors</TableCell>
            <TableCell align="center">Updated by</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? papers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : papers
          ).map((row) => (
            <Row
              key={row.id}
              row={row}
              paperActionHandler={paperActionHandler}
              architectureActionHandler={architectureActionHandler}
              architectureClickHandler={architectureClickHandler}
              usersMapping={generateUserMapping()}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={papers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

Results.propTypes = {
  papers: PropTypes.array.isRequired,
  architectureActionHandler: PropTypes.func.isRequired,
  paperActionHandler: PropTypes.func.isRequired,
  architectureClickHandler: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};
